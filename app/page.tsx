'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import FilterSidebar from './components/FilterSidebar';
import ProductList from './components/ProductList';
import TopProducts from './components/TopProducts';

function HomeContent() {
	const searchParams = useSearchParams();
	const initialSearch = searchParams.get('search') || '';

	const [filters, setFilters] = useState({
		category: '',
		minPrice: 0,
		maxPrice: 1000,
		search: initialSearch,
	});
	const [sortBy, setSortBy] = useState<
		'default' | 'price-asc' | 'price-desc' | 'rating'
	>('default');
	const [showFilters, setShowFilters] = useState(false);

	const handleFilterChange = (newFilters: typeof filters) => {
		setFilters(newFilters);
	};

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSortBy(e.target.value as typeof sortBy);
	};

	return (
		<div className='min-h-screen bg-linear-to-br from-gray-50 to-gray-100'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='text-center mb-12'>
					<h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
						{initialSearch
							? `Search Results for "${initialSearch}"`
							: 'Welcome to E-Shop'}
					</h1>
					<p className='text-lg text-gray-600 max-w-2xl mx-auto'>
						{initialSearch
							? `Showing products matching "${initialSearch}"`
							: 'Discover our amazing collection of products at great prices.'}
					</p>
				</div>

				<div className='mb-8 mt-12'>
					<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
						<h2 className='text-2xl font-semibold text-gray-800'>
							{initialSearch ? 'Search Results' : 'Featured Products'}
						</h2>
						<div className='flex items-center space-x-4'>
							<div className='flex items-center'>
								<label
									htmlFor='sort'
									className='mr-2 text-sm font-medium text-gray-700'>
									Sort by:
								</label>
								<select
									id='sort'
									value={sortBy}
									onChange={handleSortChange}
									className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
									<option value='default'>Featured</option>
									<option value='price-asc'>Price: Low to High</option>
									<option value='price-desc'>
										Price: High to Low
									</option>
									<option value='rating'>Highest Rated</option>
								</select>
							</div>
							<button
								onClick={() => setShowFilters(!showFilters)}
								className='flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors'>
								<svg
									className='w-4 h-4'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
									/>
								</svg>
								<span>Filters</span>
							</button>
						</div>
					</div>

					{showFilters && (
						<div className='mb-8'>
							<FilterSidebar
								onFilterChange={handleFilterChange}
								currentFilters={filters}
							/>
						</div>
					)}
				</div>

				<ProductList
					searchQuery={filters.search}
					category={filters.category}
					minPrice={filters.minPrice}
					maxPrice={filters.maxPrice}
					sortBy={sortBy}
				/>

				{/* Top Products Section - only show if not searching */}
				{!initialSearch && (
					<TopProducts
						title='Top 10 Products'
						subtitle='Our best products based on customer ratings and value for money'
						ratingWeight={0.7}
						priceWeight={0.3}
						preferHigherPrice={false}
						limit={10}
					/>
				)}
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<Suspense
			fallback={
				<div className='flex justify-center items-center h-64'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
				</div>
			}>
			<HomeContentWrapper />
		</Suspense>
	);
}

function HomeContentWrapper() {
	const searchParams = useSearchParams();
	const searchKey = searchParams.get('search') || 'no-search';

	return <HomeContent key={searchKey} />;
}
