import { Product } from '@/types/product';
import { getTopProducts } from './productUtils';

const API_BASE_URL = 'https://fakestoreapi.com';

export async function getProducts(): Promise<Product[]> {
	try {
		const response = await fetch(`${API_BASE_URL}/products`);

		if (!response.ok) {
			throw new Error(`Failed to fetch products: ${response.statusText}`);
		}

		const products = await response.json();
		return products;
	} catch (error) {
		console.error('Error fetching products:', error);
		throw error;
	}
}

export async function getProductById(id: number): Promise<Product> {
	try {
		const response = await fetch(`${API_BASE_URL}/products/${id}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch product: ${response.statusText}`);
		}

		const product = await response.json();
		return product;
	} catch (error) {
		console.error('Error fetching product:', error);
		throw error;
	}
}

export async function getCategories(): Promise<string[]> {
	try {
		const response = await fetch(`${API_BASE_URL}/products/categories`);

		if (!response.ok) {
			throw new Error(`Failed to fetch categories: ${response.statusText}`);
		}

		const categories = await response.json();
		return categories;
	} catch (error) {
		console.error('Error fetching categories:', error);
		throw error;
	}
}

export async function getProductsByCategory(
	category: string
): Promise<Product[]> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/products/category/${category}`
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch products by category: ${response.statusText}`
			);
		}

		const products = await response.json();
		return products;
	} catch (error) {
		console.error('Error fetching products by category:', error);
		throw error;
	}
}

export async function searchProducts(query: string): Promise<Product[]> {
	try {
		// First get all products
		const allProducts = await getProducts();

		// Filter products based on the search query
		if (!query.trim()) {
			return allProducts;
		}

		const lowerCaseQuery = query.toLowerCase();
		const filteredProducts = allProducts.filter(
			(product) =>
				product.title.toLowerCase().includes(lowerCaseQuery) ||
				product.description.toLowerCase().includes(lowerCaseQuery) ||
				product.category.toLowerCase().includes(lowerCaseQuery)
		);

		return filteredProducts;
	} catch (error) {
		console.error('Error searching products:', error);
		throw error;
	}
}

export async function getFilteredProducts(filters: {
	category?: string;
	minPrice?: number;
	maxPrice?: number;
	search?: string;
}): Promise<Product[]> {
	try {
		let products: Product[];

		// Start with either all products or category-specific products
		if (filters.category) {
			products = await getProductsByCategory(filters.category);
		} else {
			products = await getProducts();
		}

		// Apply search filter if provided
		if (filters.search) {
			const lowerCaseQuery = filters.search.toLowerCase();
			products = products.filter(
				(product) =>
					product.title.toLowerCase().includes(lowerCaseQuery) ||
					product.description.toLowerCase().includes(lowerCaseQuery)
			);
		}

		// Apply price filters if provided
		if (filters.minPrice !== undefined) {
			products = products.filter(
				(product) => product.price >= filters.minPrice!
			);
		}

		if (filters.maxPrice !== undefined) {
			products = products.filter(
				(product) => product.price <= filters.maxPrice!
			);
		}

		return products;
	} catch (error) {
		console.error('Error filtering products:', error);
		throw error;
	}
}

/**
 * Fetches the top products from the API based on rating and price.
 *
 * @param options - Configuration options for scoring
 * @returns Promise resolving to top products
 */
export async function getTopProductsFromAPI(
	options: {
		ratingWeight?: number;
		priceWeight?: number;
		preferHigherPrice?: boolean;
		limit?: number;
	} = {}
): Promise<Product[]> {
	try {
		const allProducts = await getProducts();
		return getTopProducts(allProducts, options);
	} catch (error) {
		console.error('Error fetching top products:', error);
		throw error;
	}
}
