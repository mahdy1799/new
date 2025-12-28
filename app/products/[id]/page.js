'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Heart,
    ShoppingCart,
    Star,
    Minus,
    Plus,
    Package,
    ArrowLeft
} from 'lucide-react';
import { ProductCard } from '@/components';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ProductDetailPage() {
    const params = useParams();
    const { getProductById, getRelatedProducts, loading } = useProducts();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { user } = useAuth();
    const { t } = useLanguage();

    const [quantity, setQuantity] = useState(1);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);

    const product = getProductById(params.id);
    const relatedProducts = product ? getRelatedProducts(params.id) : [];
    const inWishlist = product ? isInWishlist(product.id) : false;

    if (loading) {
        return (
            <div className="container py-3xl flex justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container py-3xl">
                <div className="empty-state">
                    <div className="empty-state-icon">😔</div>
                    <h2 className="mb-md">Product Not Found</h2>
                    <p className="text-secondary mb-lg">
                        The product you're looking for doesn't exist.
                    </p>
                    <Link href="/products" className="btn btn-primary">
                        <ArrowLeft size={18} />
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user || !reviewForm.comment.trim()) return;

        setSubmitting(true);
        try {
            await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    user: user.name,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment,
                }),
            });
            setReviewForm({ rating: 5, comment: '' });
            // Refresh products
            window.location.reload();
        } catch (error) {
            console.error('Failed to submit review:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = product.reviews?.length
        ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
        : 0;

    const stockStatus = product.stock > 10
        ? { text: t('inStock'), class: '' }
        : product.stock > 0
            ? { text: `${t('lowStock')} (${product.stock} left)`, class: 'low' }
            : { text: t('outOfStock'), class: 'out' };

    return (
        <div className="container py-xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-sm mb-xl text-sm">
                <Link href="/" className="text-secondary hover:text-cyan">Home</Link>
                <span className="text-muted">/</span>
                <Link href="/products" className="text-secondary hover:text-cyan">Products</Link>
                <span className="text-muted">/</span>
                <span className="text-cyan">{product.name}</span>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-2xl mb-3xl">
                {/* Product Image */}
                <div className="glass-card p-lg">
                    <div className="relative">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full rounded-lg"
                            style={{ aspectRatio: '1', objectFit: 'cover' }}
                        />
                        <div className="absolute top-md left-md flex flex-col gap-xs">
                            {product.isHot && <span className="badge badge-hot">{t('hot')}</span>}
                            {product.isDeal && <span className="badge badge-deal">{t('deal')}</span>}
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <p className="text-muted text-sm uppercase tracking-wide mb-sm">
                        {product.category}
                    </p>
                    <h1 className="mb-lg">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-md mb-lg">
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={18}
                                    className={`star ${star <= Math.round(averageRating) ? 'filled' : ''}`}
                                    fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
                                />
                            ))}
                        </div>
                        <span className="text-secondary text-sm">
                            {averageRating} ({product.reviews?.length || 0} {t('reviews')})
                        </span>
                    </div>

                    <p className="price text-3xl mb-lg">
                        ${product.price.toFixed(2)}
                    </p>

                    <p className="text-secondary mb-xl">
                        {product.description}
                    </p>

                    {/* Stock Status */}
                    <div className="flex items-center gap-sm mb-xl">
                        <Package size={18} className="text-cyan" />
                        <span className={`stock-badge ${stockStatus.class}`}>
                            {stockStatus.text}
                        </span>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-lg mb-xl">
                        <span className="text-secondary">{t('quantity')}:</span>
                        <div className="quantity-control">
                            <button
                                className="quantity-btn"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                <Minus size={16} />
                            </button>
                            <span className="px-md font-semibold">{quantity}</span>
                            <button
                                className="quantity-btn"
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                disabled={quantity >= product.stock}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-md">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            style={{ flex: 1 }}
                        >
                            <ShoppingCart size={20} />
                            {t('addToCart')}
                        </button>
                        <button
                            className={`btn btn-secondary btn-icon ${inWishlist ? 'text-orange' : ''}`}
                            onClick={() => toggleWishlist(product)}
                            style={{ width: '52px', height: '52px' }}
                        >
                            <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="glass-card p-xl mb-3xl">
                <h2 className="mb-xl">{t('reviews')}</h2>

                {/* Review Form */}
                {user ? (
                    <form onSubmit={handleSubmitReview} className="mb-xl">
                        <div className="form-group">
                            <label className="form-label">Your Rating</label>
                            <div className="stars" style={{ cursor: 'pointer' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={24}
                                        className={`star ${star <= reviewForm.rating ? 'filled' : ''}`}
                                        fill={star <= reviewForm.rating ? 'currentColor' : 'none'}
                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Your Review</label>
                            <textarea
                                className="form-input form-textarea"
                                placeholder="Write your review here..."
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                ) : (
                    <div className="alert alert-info mb-xl">
                        <Link href="/login" className="text-cyan">Sign in</Link> to write a review
                    </div>
                )}

                {/* Reviews List */}
                {product.reviews?.length > 0 ? (
                    <div className="flex flex-col gap-md">
                        {product.reviews.map((review) => (
                            <div key={review.id} className="review-card glass-card">
                                <div className="review-header">
                                    <div>
                                        <span className="review-author">{review.user}</span>
                                        <div className="stars mt-xs">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={14}
                                                    className={`star ${star <= review.rating ? 'filled' : ''}`}
                                                    fill={star <= review.rating ? 'currentColor' : 'none'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="review-date">{review.date}</span>
                                </div>
                                <p className="text-secondary mt-sm">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-secondary text-center py-lg">{t('noReviews')}</p>
                )}
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div>
                    <h2 className="section-title mb-xl">{t('relatedProducts')}</h2>
                    <div className="grid grid-cols-4 gap-lg">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
