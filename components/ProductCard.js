'use client';

import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ProductCard({ product }) {
    const router = useRouter();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { t } = useLanguage();

    const inWishlist = isInWishlist(product.id);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
    };

    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        toggleWishlist(product);
    };

    const navigateToProduct = () => {
        router.push(`/products/${product.id}`);
    };

    return (
        <div className="glass-card product-card p-md">
            <div
                className="relative overflow-hidden rounded-lg mb-md cursor-pointer"
                onClick={navigateToProduct}
            >
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                />

                {/* Badges */}
                <div className="badges">
                    {product.isHot && (
                        <span className="badge badge-hot">{t('hot')}</span>
                    )}
                    {product.isDeal && (
                        <span className="badge badge-deal">{t('deal')}</span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    className={`btn btn-ghost btn-icon wishlist-btn ${inWishlist ? 'text-orange' : ''}`}
                    onClick={handleWishlistToggle}
                    style={{
                        background: 'rgba(15, 21, 53, 0.8)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Heart
                        size={18}
                        fill={inWishlist ? 'currentColor' : 'none'}
                    />
                </button>

                {/* Quick View Overlay */}
                <div
                    className="absolute inset-0 flex items-center justify-center gap-sm"
                    style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                >
                    <button
                        className="btn btn-primary btn-icon"
                        onClick={navigateToProduct}
                    >
                        <Eye size={18} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-xs">
                <p className="text-muted text-xs uppercase tracking-wide">
                    {product.category}
                </p>
                <h3
                    className="text-base font-semibold cursor-pointer hover:text-cyan"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                    onClick={navigateToProduct}
                >
                    {product.name}
                </h3>
                <div className="flex items-center justify-between mt-sm">
                    <span className="price text-lg">
                        ${product.price.toFixed(2)}
                    </span>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={14} />
                        {t('addToCart')}
                    </button>
                </div>
            </div>
        </div>
    );
}
