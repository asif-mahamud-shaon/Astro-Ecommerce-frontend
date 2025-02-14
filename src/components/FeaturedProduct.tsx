'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/20/solid';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

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

export default function FeaturedProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products/featured');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch featured product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProduct();
  }, []);

  if (loading || !product) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-96 object-cover"
          />
          {product.isOnSale && (
            <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-semibold rounded-full">
              SALE
            </span>
          )}
        </div>
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-4">
            <h3 className="text-sm text-gray-500 mb-2">{product.category}</h3>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h2>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < product.rating ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ({product.reviewCount} reviews)
              </span>
            </div>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
            <button
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 