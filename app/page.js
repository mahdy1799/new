'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import { HeroSection, ProductCard } from '@/components';
import { useProducts } from '@/context/ProductContext';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

export default function HomePage() {
    const { products, loading, getHotProducts, getDealProducts } = useProducts();
    const { t } = useLanguage();
    const [cms, setCms] = useState(null);

    useEffect(() => {
        const fetchCMS = async () => {
            try {
                const res = await fetch('/api/cms');
                const data = await res.json();
                setCms(data);
            } catch (error) {
                console.error('Failed to fetch CMS:', error);
            }
        };
        fetchCMS();
    }, []);

    const hotProducts = getHotProducts();
    const dealProducts = getDealProducts();

    return (
        <>
            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <section className="section bg-secondary">
                <div className="container">
                    <div className="grid grid-cols-3 gap-lg">
                        <div className="glass-card p-xl text-center">
                            <div className="flex justify-center mb-md">
                                <div className="btn btn-primary btn-icon" style={{ width: '60px', height: '60px' }}>
                                    <Zap size={28} />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-sm">Fast Delivery</h3>
                            <p className="text-secondary text-sm">Get your orders delivered within 24 hours</p>
                        </div>
                        <div className="glass-card p-xl text-center">
                            <div className="flex justify-center mb-md">
                                <div className="btn btn-primary btn-icon" style={{ width: '60px', height: '60px' }}>
                                    <Shield size={28} />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-sm">Secure Payment</h3>
                            <p className="text-secondary text-sm">100% secure payment processing</p>
                        </div>
                        <div className="glass-card p-xl text-center">
                            <div className="flex justify-center mb-md">
                                <div className="btn btn-primary btn-icon" style={{ width: '60px', height: '60px' }}>
                                    <Truck size={28} />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-sm">Free Returns</h3>
                            <p className="text-secondary text-sm">30-day money back guarantee</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title gradient-text">{t('categories')}</h2>
                        <Link href="/products" className="btn btn-secondary">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-lg">
                        {cms?.collections?.map((collection) => (
                            <Link
                                key={collection.id}
                                href={`/products?category=${collection.name.toLowerCase().replace(' ', '-')}`}
                                className="category-card glass-card"
                            >
                                <img src={collection.image} alt={collection.name} />
                                <div className="category-overlay">
                                    <h3 className="font-semibold text-lg">{collection.name}</h3>
                                    <p className="text-secondary text-sm">{collection.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hot Products Section */}
            <section className="section bg-secondary">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">
                            🔥 {t('newProducts')}
                        </h2>
                        <Link href="/products" className="btn btn-secondary">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-xl">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-lg">
                            {hotProducts.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Deals Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title gradient-text">
                            ⚡ {t('featuredDeals')}
                        </h2>
                        <Link href="/deals" className="btn btn-secondary">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-xl">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-lg">
                            {dealProducts.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="section">
                <div className="container">
                    <div className="deals-banner">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-md">
                                Ready to Experience the Future?
                            </h2>
                            <p className="text-lg mb-xl" style={{ opacity: 0.9 }}>
                                Join thousands of satisfied customers shopping the best tech
                            </p>
                            <Link href="/products" className="btn btn-lg" style={{
                                background: 'white',
                                color: '#0a0e27'
                            }}>
                                Start Shopping <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
