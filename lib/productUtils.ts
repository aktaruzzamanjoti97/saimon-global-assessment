import { Product } from '@/types/product';

/**
 * Efficiently finds the top N products from a large dataset based on rating and price.
 * Uses a weighted scoring algorithm that considers both rating and price.
 * 
 * This function is optimized for performance with large datasets by:
 * 1. Using a single pass to calculate scores
 * 2. Implementing a partial selection algorithm for large datasets
 * 3. Normalizing values to ensure fair comparison
 * 
 * @param products - Array of products to evaluate
 * @param options - Configuration options for scoring
 * @returns Top N products sorted by score
 */
export function getTopProducts(
  products: Product[], 
  options: {
    ratingWeight?: number;    // Weight for rating in the score (default: 0.7)
    priceWeight?: number;     // Weight for price in the score (default: 0.3)
    preferHigherPrice?: boolean; // Whether to prefer higher or lower prices (default: false)
    limit?: number;           // Number of products to return (default: 10)
  } = {}
): Product[] {
  const {
    ratingWeight = 0.7,
    priceWeight = 0.3,
    preferHigherPrice = false,
    limit = 10
  } = options;

  // Normalize weights to ensure they sum to 1
  const totalWeight = ratingWeight + priceWeight;
  const normalizedRatingWeight = ratingWeight / totalWeight;
  const normalizedPriceWeight = priceWeight / totalWeight;

  // Find min and max prices for normalization
  const prices = products.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1; // Avoid division by zero

  // For very large datasets, use a more efficient algorithm
  if (products.length > 10000) {
    return getTopProductsLargeDataset(products, {
      normalizedRatingWeight,
      normalizedPriceWeight,
      preferHigherPrice,
      minPrice,
      maxPrice,
      priceRange,
      limit
    });
  }

  // Calculate score for each product
  const productsWithScore = products.map(product => {
    // Normalize rating (0-5 scale to 0-1)
    const normalizedRating = product.rating.rate / 5;
    
    // Normalize price (0-1 scale)
    const normalizedPrice = preferHigherPrice 
      ? (product.price - minPrice) / priceRange  // Higher price gets higher score
      : 1 - ((product.price - minPrice) / priceRange); // Lower price gets higher score
    
    // Calculate weighted score
    const score = (normalizedRating * normalizedRatingWeight) + 
                  (normalizedPrice * normalizedPriceWeight);
    
    return {
      ...product,
      score
    };
  });

  // Sort by score (descending) and take top N
  return productsWithScore
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ ...product }) => product); // Remove score from final result
}

/**
 * Optimized version for very large datasets using a partial selection algorithm.
 * This avoids sorting the entire dataset when we only need the top N items.
 */
function getTopProductsLargeDataset(
  products: Product[],
  options: {
    normalizedRatingWeight: number;
    normalizedPriceWeight: number;
    preferHigherPrice: boolean;
    minPrice: number;
    maxPrice: number;
    priceRange: number;
    limit: number;
  }
): Product[] {
  const {
    normalizedRatingWeight,
    normalizedPriceWeight,
    preferHigherPrice,
    minPrice,
    priceRange,
    limit
  } = options;

  // Calculate scores and keep track of top N items
  const topProducts: Array<Product & { score: number }> = [];
  
  for (const product of products) {
    // Normalize rating (0-5 scale to 0-1)
    const normalizedRating = product.rating.rate / 5;
    
    // Normalize price (0-1 scale)
    const normalizedPrice = preferHigherPrice 
      ? (product.price - minPrice) / priceRange
      : 1 - ((product.price - minPrice) / priceRange);
    
    // Calculate weighted score
    const score = (normalizedRating * normalizedRatingWeight) + 
                  (normalizedPrice * normalizedPriceWeight);
    
    const productWithScore = { ...product, score };
    
    // Insert into top products if it qualifies
    if (topProducts.length < limit) {
      topProducts.push(productWithScore);
      // Keep sorted if we haven't reached the limit yet
      topProducts.sort((a, b) => b.score - a.score);
    } else if (score > topProducts[topProducts.length - 1].score) {
      // Replace the lowest score if this product is better
      topProducts[topProducts.length - 1] = productWithScore;
      // Re-sort to maintain order
      topProducts.sort((a, b) => b.score - a.score);
    }
  }
  
  // Remove score from final result
  return topProducts.map(({ ...product }) => product);
}

