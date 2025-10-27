'use client';

import { getCategories } from '@/lib/api';
import { useEffect, useState } from 'react';

interface FilterSidebarProps {
	onFilterChange: (filters: {
		category: string;
		minPrice: number;
		maxPrice: number;
		search: string;
	}) => void;
	currentFilters: {
		category: string;
		minPrice: number;
		maxPrice: number;
		search: string;
	};
}

export default function FilterSidebar({
	onFilterChange,
	currentFilters,
}: FilterSidebarProps) {
	const [categories, setCategories] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [priceRange, setPriceRange] = useState({
		min: 0,
		max: 1000,
	});

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const data = await getCategories();
				setCategories(data);
			} catch (error) {
				console.error('Error fetching categories:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	useEffect(() => {
		// Update price range when current filters change
		setPriceRange({
			min: currentFilters.minPrice,
			max: currentFilters.maxPrice,
		});
	}, [currentFilters]);

	const handleCategoryChange = (category: string) => {
		onFilterChange({
			...currentFilters,
			category,
		});
	};

	const handlePriceChange = (type: 'min' | 'max', value: string) => {
		const numValue = parseInt(value) || 0;
		const newPriceRange = {
			...priceRange,
			[type]: numValue,
		};

		setPriceRange(newPriceRange);

		onFilterChange({
			...currentFilters,
			minPrice: newPriceRange.min,
			maxPrice: newPriceRange.max,
		});
	};

	const clearFilters = () => {
		setPriceRange({ min: 0, max: 1000 });
		onFilterChange({
			category: '',
			minPrice: 0,
			maxPrice: 1000,
			search: currentFilters.search || '',
		});
	};

	return (
		<div className='bg-white rounded-lg shadow-md p-6 h-fit sticky top-24'>
			<div className='flex justify-between items-center mb-6'>
				<h3 className='text-lg font-semibold text-gray-800'>Filters</h3>
				<button
					onClick={clearFilters}
					className='text-sm text-blue-600 hover:text-blue-800 font-medium'>
					Clear All
				</button>
			</div>

			{/* Category Filter */}
			<div className='mb-8'>
				<h4 className='text-md font-medium text-gray-700 mb-4'>Category</h4>
				{loading ? (
					<div className='animate-pulse'>
						<div className='h-4 bg-gray-200 rounded mb-2'></div>
						<div className='h-4 bg-gray-200 rounded mb-2'></div>
						<div className='h-4 bg-gray-200 rounded'></div>
					</div>
				) : (
					<div className='space-y-2'>
						<label className='flex items-center cursor-pointer'>
							<input
								type='radio'
								name='category'
								value=''
								checked={currentFilters.category === ''}
								onChange={() => handleCategoryChange('')}
								className='mr-2 text-blue-600 focus:ring-blue-500'
							/>
							<span className='text-sm text-gray-700'>
								All Categories
							</span>
						</label>
						{categories.map((category) => (
							<label
								key={category}
								className='flex items-center cursor-pointer'>
								<input
									type='radio'
									name='category'
									value={category}
									checked={currentFilters.category === category}
									onChange={() => handleCategoryChange(category)}
									className='mr-2 text-blue-600 focus:ring-blue-500'
								/>
								<span className='text-sm text-gray-700 capitalize'>
									{category}
								</span>
							</label>
						))}
					</div>
				)}
			</div>

			{/* Price Range Filter */}
			<div className='mb-6'>
				<h4 className='text-md font-medium text-gray-700 mb-4'>
					Price Range
				</h4>
				<div className='space-y-4'>
					<div>
						<label
							htmlFor='minPrice'
							className='block text-sm text-gray-600 mb-1'>
							Min Price: ${priceRange.min}
						</label>
						<input
							type='range'
							id='minPrice'
							min='0'
							max='1000'
							step='10'
							value={priceRange.min}
							onChange={(e) => handlePriceChange('min', e.target.value)}
							className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
						/>
					</div>
					<div>
						<label
							htmlFor='maxPrice'
							className='block text-sm text-gray-600 mb-1'>
							Max Price: ${priceRange.max}
						</label>
						<input
							type='range'
							id='maxPrice'
							min='0'
							max='1000'
							step='10'
							value={priceRange.max}
							onChange={(e) => handlePriceChange('max', e.target.value)}
							className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
