'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/hooks/CartContext';
import SearchBar from './SearchBar';

export default function Header() {
  const pathname = usePathname();
  const { cart } = useCart();

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">E-Shop</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${
                pathname === '/'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${
                pathname === '/products'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Products
            </Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <SearchBar />
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-lg group"
              aria-label={`Shopping cart with ${cart.totalItems} items`}
            >
              <svg
                className="w-6 h-6 transform transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-linear-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
                  {cart.totalItems > 99 ? '99+' : cart.totalItems}
                </span>
              )}
            </Link>
            
            {/* Mobile menu button - placeholder for future implementation */}
            <div className="md:hidden">
              <button
                type="button"
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}