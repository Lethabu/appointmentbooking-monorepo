import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart, ShoppingCart } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number; // in cents
    image_url?: string;
}

interface ProductsSectionProps {
    products: Product[];
}

/**
 * Products section component displaying available hair products
 * Features product grid with wishlist and cart functionality
 */
export const ProductsSection: React.FC<ProductsSectionProps> = ({ products }) => {
    /**
     * Format product price from cents to Rands
     * @param priceInCents - Price in cents
     * @returns Formatted price string
     */
    const formatPrice = (priceInCents: number): string => {
        return `R${(priceInCents / 100).toFixed(0)}`;
    };

    /**
     * Get default product image if none provided
     * @param productName - Product name for context
     * @returns Default image URL
     */
    const getDefaultImage = (productName: string): string => {
        return "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80";
    };

    /**
     * Handle add to cart action
     * @param productId - Product ID to add to cart
     */
    const handleAddToCart = (productId: string): void => {
        // TODO: Implement cart functionality
        console.log('Add to cart:', productId);
    };

    /**
     * Handle wishlist toggle
     * @param productId - Product ID to toggle in wishlist
     */
    const handleWishlistToggle = (productId: string): void => {
        // TODO: Implement wishlist functionality
        console.log('Toggle wishlist:', productId);
    };

    return (
        <section id="products" className="py-20 bg-[#F9F9F9]" role="region" aria-labelledby="products-heading">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 id="products-heading" className="text-3xl md:text-4xl font-bold font-serif mb-4 text-gray-900">
                            Premium Hair Products
                        </h2>
                        <p className="text-gray-600">
                            Shop our curated selection of professional hair care.
                        </p>
                    </div>

                    {/* View all products link */}
                    <Link
                        href="/book/instylehairboutique/shop"
                        className="text-crimson-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all focus:outline-none focus:ring-2 focus:ring-crimson-primary focus:ring-opacity-50 rounded-lg px-2 py-1"
                        aria-label="View all hair products"
                    >
                        View All Products
                        <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </Link>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <article
                            key={product.id || index}
                            className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all group"
                        >
                            {/* Product image */}
                            <div className="relative h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                                <Image
                                    src={product.image_url || getDefaultImage(product.name)}
                                    alt={product.name}
                                    width={200}
                                    height={192}
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />

                                {/* Wishlist button */}
                                <button
                                    onClick={() => handleWishlistToggle(product.id)}
                                    className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all translate-y-10 group-hover:translate-y-0 z-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                    aria-label={`Add ${product.name} to wishlist`}
                                    aria-pressed="false"
                                >
                                    <Heart className="w-5 h-5" aria-hidden="true" />
                                </button>
                            </div>

                            {/* Product details */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                    {product.name}
                                </h3>

                                {/* Product description */}
                                {product.description && (
                                    <p className="text-xs text-gray-500 line-clamp-2">
                                        {product.description}
                                    </p>
                                )}

                                {/* Price and add to cart */}
                                <div className="flex items-center justify-between pt-2">
                                    <span className="font-bold text-crimson-primary text-lg">
                                        {formatPrice(product.price)}
                                    </span>

                                    <button
                                        onClick={() => handleAddToCart(product.id)}
                                        className="p-2 rounded-full bg-gray-50 hover:bg-[#C0392B] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:ring-opacity-50"
                                        aria-label={`Add ${product.name} to cart`}
                                    >
                                        <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Empty state */}
                {products.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-8 h-8 text-gray-400" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products available</h3>
                        <p className="text-gray-600">
                            Check back soon for our premium hair care products.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductsSection;