'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useCart } from '@/hooks/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const itemQuantity = getItemQuantity(product.id);
  const inCart = isInCart(product.id);

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full cursor-pointer border border-gray-100 overflow-hidden">
        <div className="relative h-56 w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-6 transform transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full">
              {product.category}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 flex-grow group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating.rate)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {product.rating.rate} ({product.rating.count})
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base transform hover:scale-105 ${
                inCart
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
              } shadow-md hover:shadow-lg`}
            >
              {inCart ? `In Cart (${itemQuantity})` : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}