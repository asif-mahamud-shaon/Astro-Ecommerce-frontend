import { Toaster } from 'react-hot-toast';
import MainLayout from '@/components/MainLayout';
import './globals.css';

export const metadata = {
  title: 'TechStore - Your One-Stop Tech Shop',
  description: 'Find the latest tech products at competitive prices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MainLayout>
          {children}
        </MainLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
} 