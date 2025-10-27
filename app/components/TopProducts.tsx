'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { getTopProductsFromAPI } from '@/lib/api';
import ProductCard from './ProductCard';

interface TopProductsProps {
  title?: string;
  subtitle?: string;
  ratingWeight?: number;
  priceWeight?: number;
  preferHigherPrice?: boolean;
  limit?: number;
}

export default function TopProducts({
  title = "Top Rated Products",
  subtitle = "Discover our best products based on customer ratings and value",
  ratingWeight = 0.7,
  priceWeight = 0.3,
  preferHigherPrice = false,
  limit = 10
}: TopProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const topProducts = await getTopProductsFromAPI({
          ratingWeight,
          priceWeight,
          preferHigherPrice,
          limit
        });
        setProducts(topProducts);
      } catch (err) {
        setError('Failed to load top products. Please try again later.');
        console.error('Error fetching top products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [ratingWeight, priceWeight, preferHigherPrice, limit]);

  if (loading) {
    return (
      <div className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <div className="mt-4 text-gray-600 font-medium">Loading top products...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={product.id} className="relative">
              {/* Badge for top ranking */}
              {index < 3 && (
                <div className={`absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  'bg-orange-600'
                }`}>
                  {index + 1}
                </div>
              )}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-500 text-lg">No products found</div>
        </div>
      )}
    </div>
  );
}