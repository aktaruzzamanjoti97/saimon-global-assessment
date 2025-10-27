'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { getProducts, getFilteredProducts } from '@/lib/api';
import ProductCard from './ProductCard';

interface ProductListProps {
  searchQuery?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'default' | 'price-asc' | 'price-desc' | 'rating';
}

export default function ProductList({
  searchQuery = '',
  category = '',
  minPrice = 0,
  maxPrice = 1000,
  sortBy = 'default'
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // If we have filters, use the filtered products API
        if (searchQuery || category || minPrice > 0 || maxPrice < 1000) {
          const data = await getFilteredProducts({
            search: searchQuery,
            category,
            minPrice,
            maxPrice
          });
          
          // Apply sorting
          const sortedProducts = [...data];
          switch (sortBy) {
            case 'price-asc':
              sortedProducts.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              sortedProducts.sort((a, b) => b.price - a.price);
              break;
            case 'rating':
              sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
              break;
            default:
              // Keep original order
              break;
          }
          
          setProducts(sortedProducts);
        } else {
          // Otherwise, just get all products
          const data = await getProducts();
          
          // Apply sorting if needed
          const sortedProducts = [...data];
          switch (sortBy) {
            case 'price-asc':
              sortedProducts.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              sortedProducts.sort((a, b) => b.price - a.price);
              break;
            case 'rating':
              sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
              break;
            default:
              // Keep original order
              break;
          }
          
          setProducts(sortedProducts);
        }
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, category, minPrice, maxPrice, sortBy]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <div className="mt-4 text-gray-600 font-medium">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}