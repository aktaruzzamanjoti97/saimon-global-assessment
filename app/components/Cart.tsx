'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  if (cart.items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h2>
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
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
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Your cart is empty</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Looks like you haven&apos;t added any products to your cart yet. Start shopping to fill it up!
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Shopping Cart ({cart.totalItems} items)</h2>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-800 transition-colors font-medium hover:bg-red-50 px-3 py-1 rounded-md"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-6 mb-8">
        {cart.items.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="relative h-20 w-20 shrink-0 mx-auto sm:mx-0 bg-white rounded-lg p-2">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
            
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 font-medium">${item.price.toFixed(2)} each</p>
            </div>
            
            <div className="flex items-center justify-center sm:justify-start space-x-3 bg-white rounded-lg px-3 py-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors font-medium"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors font-medium"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            
            <div className="text-base font-bold w-24 text-center sm:text-right text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors self-center sm:self-auto p-2 rounded-lg"
              aria-label="Remove item"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-700">Subtotal:</span>
          <span className="text-2xl font-bold text-gray-900">${cart.totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => window.history.back()}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium order-2 sm:order-1"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push('/checkout')}
            className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 order-1 sm:order-2"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}