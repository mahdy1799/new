'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { ProductCard } from '@/components';
import { useProducts } from '@/context/ProductContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ProductsPage() {
    const { products, loading, searchProducts, getCategories } = useProducts();
    const { t } = useLanguage();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('default');

    const categories = getCategories();

    const filteredProducts = useMemo(() => {
        let result = searchQuery ? searchProducts(searchQuery) : products;

        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory);
        }

        switch (sortBy) {
            case 'price-low':
                result = [...result].sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result = [...result].sort((a, b) => b.price - a.price);
                break;
            case 'name':
                result = [...result].sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        return result;
    }, [products, searchQuery, selectedCategory, sortBy, searchProducts]);

    return (
        <div className="container py-xl">
            {/* Page Header */}
            <div className="mb-2xl">
                <h1 className="gradient-text mb-md">{t('products')}</h1>
                <p className="text-secondary">
                    Discover our collection of futuristic products
                </p>
            </div>

            {/* Filters Bar */}
            <div className="glass-card p-lg mb-xl">
                <div className="flex items-center gap-lg flex-wrap">
                    {/* Search */}
                    <div className="search-bar" style={{ flex: 1, minWidth: '250px' }}>
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            className="form-input"
                            placeholder={t('searchProducts')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: '44px' }}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <select
                            className="form-input form-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{ minWidth: '180px' }}
                        >
                            <option value="all">{t('all')} Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="relative">
                        <select
                            className="form-input form-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ minWidth: '180px' }}
                        >
                            <option value="default">Sort By: Default</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A to Z</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-lg">
                <p className="text-secondary text-sm">
                    Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex justify-center py-3xl">
                    <div className="spinner"></div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h3 className="mb-md">No products found</h3>
                    <p className="text-secondary mb-lg">
                        Try adjusting your search or filter criteria
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-lg">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
