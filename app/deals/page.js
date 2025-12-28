'use client';

import { Zap, Percent, Clock } from 'lucide-react';
import { ProductCard } from '@/components';
import { useProducts } from '@/context/ProductContext';
import { useLanguage } from '@/context/LanguageContext';

export default function DealsPage() {
    const { getDealProducts, loading } = useProducts();
    const { t } = useLanguage();

    const dealProducts = getDealProducts();

    return (
        <div className="container py-xl">
            {/* Deals Banner */}
            <div className="deals-banner mb-2xl">
                <div className="relative z-10">
                    <div className="flex items-center justify-center gap-md mb-md">
                        <Zap size={32} />
                        <h1 className="m-0">{t('hotDeals')}</h1>
                        <Zap size={32} />
                    </div>
                    <p className="text-lg mb-lg" style={{ opacity: 0.9 }}>
                        Limited time offers on our best products. Don't miss out!
                    </p>
                    <div className="flex justify-center gap-xl">
                        <div className="text-center">
                            <div className="text-3xl font-bold">50%</div>
                            <div className="text-sm">Max Discount</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{dealProducts.length}</div>
                            <div className="text-sm">Products</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">24h</div>
                            <div className="text-sm">Flash Sales</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-lg mb-2xl">
                <div className="glass-card p-lg flex items-center gap-md">
                    <div className="btn btn-primary btn-icon">
                        <Percent size={24} />
                    </div>
                    <div>
                        <h4 className="text-base font-semibold m-0">Best Prices</h4>
                        <p className="text-secondary text-sm m-0">Guaranteed lowest prices</p>
                    </div>
                </div>
                <div className="glass-card p-lg flex items-center gap-md">
                    <div className="btn btn-primary btn-icon">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h4 className="text-base font-semibold m-0">Limited Time</h4>
                        <p className="text-secondary text-sm m-0">Deals expire soon</p>
                    </div>
                </div>
                <div className="glass-card p-lg flex items-center gap-md">
                    <div className="btn btn-primary btn-icon">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h4 className="text-base font-semibold m-0">Flash Sales</h4>
                        <p className="text-secondary text-sm m-0">New deals every day</p>
                    </div>
                </div>
            </div>

            {/* Deals Products */}
            <h2 className="section-title mb-xl">{t('featuredDeals')}</h2>

            {loading ? (
                <div className="flex justify-center py-3xl">
                    <div className="spinner"></div>
                </div>
            ) : dealProducts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🏷️</div>
                    <h3 className="mb-md">No Deals Available</h3>
                    <p className="text-secondary">
                        Check back soon for new deals and discounts
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-lg">
                    {dealProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
