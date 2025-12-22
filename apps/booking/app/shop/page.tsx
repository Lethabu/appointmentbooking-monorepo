'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Product {
    id: string
    name: string
    price: number
    description: string
    images: string
    category_id: string
    category_slug?: string
    length_value: string | null
    texture: string | null
    closure_type: string | null
}

interface Category {
    name: string
    slug: string
    icon: string
    color: string
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [minPrice, setMinPrice] = useState<number | null>(null)
    const [maxPrice, setMaxPrice] = useState<number | null>(null)
    const [wishlist, setWishlist] = useState<string[]>([])
    const [installChecked, setInstallChecked] = useState<Record<string, boolean>>({})

    const categories: Category[] = [
        { name: 'Bobs & Short', icon: '💇', slug: 'bobs', color: 'from-pink-500 to-rose-600' },
        { name: 'Curls', icon: '🌊', slug: 'curls', color: 'from-purple-500 to-indigo-600' },
        { name: 'Straight Wigs', icon: '✨', slug: 'straight-wigs', color: 'from-blue-500 to-cyan-600' },
        { name: 'Curly Wigs', icon: '🎀', slug: 'curly-wigs', color: 'from-green-500 to-emerald-600' },
        { name: 'Closures', icon: '🔗', slug: 'closures', color: 'from-yellow-500 to-orange-600' },
        { name: 'Premium', icon: '👑', slug: 'premium', color: 'from-red-500 to-pink-600' },
    ]

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            try {
                // Fetch from the new Worker Endpoint
                const url = `https://instylehairboutique.co.za/api/products${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`
                const res = await fetch(url)
                const data = await (res.json() as Promise<any>)

                if (data.products) {
                    setProducts(data.products)
                }
            } catch (error) {
                console.error('Error loading products:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
        // load wishlist from localStorage
        try {
            const raw = localStorage.getItem('instyle_wishlist')
            if (raw) setWishlist(JSON.parse(raw))
        } catch (e) {
            // ignore
        }
    }, [selectedCategory])

    const filteredProducts = products.filter(p => {
        const matchesText = p.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesMin = minPrice == null ? true : p.price >= Math.round(minPrice * 100)
        const matchesMax = maxPrice == null ? true : p.price <= Math.round(maxPrice * 100)
        return matchesText && matchesMin && matchesMax
    })

    const toggleWishlist = (id: string) => {
        setWishlist(prev => {
            const exists = prev.includes(id)
            const next = exists ? prev.filter(x => x !== id) : [...prev, id]
            try { localStorage.setItem('instyle_wishlist', JSON.stringify(next)) } catch (e) { }
            return next
        })
    }

    const toggleInstall = (id: string) => {
        setInstallChecked(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const formatPrice = (cents: number) => {
        return `R${(cents / 100).toFixed(0)}`
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
                        InStyle Hair Boutique
                    </h1>
                    <p className="text-xl opacity-90 mb-8">
                        Premium Wigs, Bundles & Closures
                    </p>
                    <div className="max-w-2xl mx-auto bg-white/10 p-2 rounded-2xl backdrop-blur-sm">
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Search our collection..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none"
                            />
                            <div className="flex items-center gap-2">
                                <input type="number" step="1" min={0} placeholder="Min R" value={minPrice ?? ''} onChange={e => setMinPrice(e.target.value === '' ? null : Number(e.target.value))} className="w-24 px-3 py-2 rounded-xl" />
                                <input type="number" step="1" min={0} placeholder="Max R" value={maxPrice ?? ''} onChange={e => setMaxPrice(e.target.value === '' ? null : Number(e.target.value))} className="w-24 px-3 py-2 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Categories */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`p-4 rounded-xl transition-all ${selectedCategory === cat.slug
                                ? 'bg-primary text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <div className="text-2xl mb-1">{cat.icon}</div>
                            <div className="font-semibold text-sm">{cat.name}</div>
                        </button>
                    ))}
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`p-4 rounded-xl transition-all ${selectedCategory === 'all'
                            ? 'bg-gray-900 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <div className="text-2xl mb-1">🛍️</div>
                        <div className="font-semibold text-sm">All</div>
                    </button>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                        <p className="mt-4 text-gray-500">Loading premium styles...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all group overflow-hidden border border-gray-100">
                                <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                                    {/* Placeholder for image - using generated gradient based on ID if no image */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-500">
                                        {product.images !== '[]' ? '📷 Image' : 'InStyle'}
                                    </div>
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                        {product.length_value || 'Std'}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">
                                        {product.closure_type || 'Premium'}
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                                            <button onClick={() => toggleWishlist(product.id)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${wishlist.includes(product.id) ? 'bg-primary text-white' : 'bg-gray-900 text-white hover:bg-primary'}`}>
                                                {wishlist.includes(product.id) ? '♥' : '+'}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="flex items-center gap-2 text-sm">
                                                <input type="checkbox" checked={!!installChecked[product.id]} onChange={() => toggleInstall(product.id)} />
                                                <span>Book Installation</span>
                                            </label>
                                            <button onClick={() => { window.location.href = `/book/instylehairboutique?install=${installChecked[product.id] ? 'true' : 'false'}&productId=${product.id}` }} className="px-3 py-1 bg-white border rounded-md text-sm">Book</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No products found in this category.</p>
                        <button onClick={() => setSelectedCategory('all')} className="mt-4 text-primary font-semibold hover:underline">
                            View all products
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
