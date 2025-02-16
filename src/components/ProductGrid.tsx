'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/20/solid';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { getProducts, getProductsByCategory, addToCart, addToWishlist, isInWishlist } from '@/utils/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
}

interface ProductGridProps {
  selectedCategory?: string;
}

export default function ProductGrid({ selectedCategory = 'all' }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = selectedCategory === 'all'
          ? await getProducts()
          : await getProductsByCategory(selectedCategory);
        setProducts(data);

        // Check wishlist status for each product
        const wishlistPromises = data.map(product => isInWishlist(product.id));
        const wishlistStatuses = await Promise.all(wishlistPromises);
        const wishlistSet = new Set(
          data.filter((_, index) => wishlistStatuses[index]).map(product => product.id)
        );
        setWishlistItems(wishlistSet);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    try {
      await addToCart(product.id);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    try {
      await addToWishlist(product.id);
      setWishlistItems(prev => new Set([...prev, product.id]));
      toast.success(`${product.name} added to wishlist`);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Product already in wishlist');
      } else {
        console.error('Failed to add to wishlist:', error);
        toast.error('Failed to add to wishlist');
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4">
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">
        {selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Products`}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
          >
            <Link href={`/products/${product.id}`}>
              <div className="relative">
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">{product.name}</span>
                </div>
                <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleAddToWishlist(e, product)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    {wishlistItems.has(product.id) ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  {product.inStock && (
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    >
                      <ShoppingCartIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  )}
                </div>
                {product.isOnSale && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                    SALE
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm text-gray-500 mb-1">{product.category}</h3>
                <h2 className="font-semibold text-gray-900 mb-2">{product.name}</h2>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < product.rating ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    ({product.reviewCount})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${Number(product.oldPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 