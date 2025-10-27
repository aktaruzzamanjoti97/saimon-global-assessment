'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  searchParams: URLSearchParams;
}

export default function SearchBar({ searchParams }: SearchBarProps) {
  const router = useRouter();
  
  // Get initial search from URL
  const initialSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isExpanded, setIsExpanded] = useState(!!initialSearch);
  
  // Debounce the search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update URL when debounced search query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('search', debouncedSearchQuery.trim());
      router.push(`/?${params.toString()}`);
    } else if (searchParams.has('search')) {
      // If search query is empty but URL has search param, clear it
      router.push('/');
    }
  }, [debouncedSearchQuery, router, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('search', searchQuery.trim());
      router.push(`/?${params.toString()}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isExpanded && !searchQuery) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isExpanded, searchQuery]);

  return (
    <div className="relative">
      {isExpanded ? (
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search products..."
            className="w-48 sm:w-64 px-4 py-2 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      ) : (
        <button
          onClick={toggleSearch}
          className="p-2 text-gray-700 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-lg"
          aria-label="Search"
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}