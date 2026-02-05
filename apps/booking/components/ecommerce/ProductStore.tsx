'use client';

import { ShoppingCart, Plus, Minus, Heart, Star, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    stock: number;
    rating?: number;
    reviews_count?: number;
}

interface CartItem extends Product {
    quantity: number;
}

export default function EcommerceStore() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCart, setShowCart] = useState(false);

    // InStyle Branding Colors
    // InStyle Branding Colors
    const primaryColor = '#C0392B';   // Crimson
    const secondaryColor = '#1B1B1B'; // Near-Black
    const accentColor = '#F9F9F9';    // Warm Gray

    // Mock products - replace with API call
    useEffect(() => {
        const mockProducts: Product[] = [
            {
                id: '1',
                name: 'Premium Hair Oil',
                description: 'Nourishing hair oil for all hair types',
                price: 15000, // R150
                image_url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80',
                category: 'Hair Care',
                stock: 25,
                rating: 4.5,
                reviews_count: 42
            },
            {
                id: '2',
                name: 'Styling Gel',
                description: 'Strong hold gel for perfect styling',
                price: 8500, // R85
                image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80',
                category: 'Styling',
                stock: 30,
                rating: 4.8,
                reviews_count: 67
            },
            {
                id: '3',
                name: 'Hair Extensions - Premium',
                description: '100% human hair extensions, 20 inches',
                price: 125000, // R1250
                image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=500&q=80',
                category: 'Extensions',
                stock: 10,
                rating: 4.9,
                reviews_count: 28
            },
            {
                id: '4',
                name: 'Moisturizing Shampoo',
                description: 'Gentle cleansing shampoo for dry hair',
                price: 9500, // R95
                image_url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=500&q=80',
                category: 'Hair Care',
                stock: 40,
                rating: 4.6,
                reviews_count: 53
            },
            {
                id: '5',
                name: 'Deep Conditioner',
                description: 'Intensive treatment for damaged hair',
                price: 11000, // R110
                image_url: 'https://images.unsplash.com/photo-1571781565036-d3f7595ca814?auto=format&fit=crop&w=500&q=80',
                category: 'Hair Care',
                stock: 35,
                rating: 4.7,
                reviews_count: 45
            },
            {
                id: '6',
                name: 'Edge Control',
                description: 'Maximum hold edge control for sleek styles',
                price: 7500, // R75
                image_url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=500&q=80',
                category: 'Styling',
                stock: 50,
                rating: 4.4,
                reviews_count: 89
            }
        ];
        setProducts(mockProducts);
    }, []);

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prevCart =>
            prevCart.map(item => {
                if (item.id === productId) {
                    const newQuantity = Math.max(0, Math.min(item.quantity + delta, item.stock));
                    return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(Boolean) as CartItem[]
        );
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-[#F9F9F9]">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>InStyle Shop</h1>
                        <button
                            onClick={() => setShowCart(!showCart)}
                            className="relative p-2 hover:bg-gray-50 rounded-full transition-colors"
                        >
                            <ShoppingCart className="w-6 h-6" style={{ color: primaryColor }} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: secondaryColor }}>
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Search and Filter */}
                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                            style={{ '--tw-ring-color': primaryColor } as any}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${selectedCategory === category
                                    ? 'text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                style={selectedCategory === category ? { backgroundColor: primaryColor } : {}}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="relative h-48 bg-gray-100">
                                {/* Placeholder for product image */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-orange-50 transition-colors">
                                    <Heart className="w-5 h-5 text-gray-600" />
                                </button>
                                {product.stock < 10 && (
                                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        Only {product.stock} left!
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="mb-2">
                                    <span className="text-xs font-semibold" style={{ color: secondaryColor }}>{product.category}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                                {product.rating && (
                                    <div className="flex items-center gap-1 mb-3">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(product.rating!)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-600">({product.reviews_count})</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                                            R{(product.price / 100).toFixed(2)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock === 0}
                                        className="text-white px-4 py-2 rounded-xl font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                        style={{ backgroundColor: product.stock === 0 ? undefined : primaryColor }}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No products found</p>
                    </div>
                )}
            </div>

            {/* Shopping Cart Sidebar */}
            {showCart && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowCart(false)}>
                    <div
                        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                                <button
                                    onClick={() => setShowCart(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            {cart.length === 0 ? (
                                <div className="text-center py-16">
                                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600">Your cart is empty</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-6">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Image
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                                    <p className="text-sm text-gray-600">R{(item.price / 100).toFixed(2)}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="p-1 hover:bg-white rounded"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="p-1 hover:bg-white rounded"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="ml-auto text-red-500 hover:text-red-700 text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4 space-y-2 mb-6">
                                        <div className="flex justify-between text-lg">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-semibold">R{(cartTotal / 100).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Delivery:</span>
                                            <span>Calculated at checkout</span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold pt-2 border-t" style={{ color: primaryColor }}>
                                            <span>Total:</span>
                                            <span>R{(cartTotal / 100).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button className="w-full text-white py-4 rounded-xl font-semibold transition-colors" style={{ backgroundColor: primaryColor }}>
                                        Proceed to Checkout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
