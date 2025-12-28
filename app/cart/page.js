'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export default function CartPage() {
    const {
        items,
        removeFromCart,
        updateQuantity,
        getSubtotal,
        getTax,
        getTotal,
        clearCart
    } = useCart();
    const { t } = useLanguage();

    if (items.length === 0) {
        return (
            <div className="container py-3xl">
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <ShoppingBag size={64} />
                    </div>
                    <h2 className="mb-md">{t('emptyCart')}</h2>
                    <p className="text-secondary mb-xl">
                        Looks like you haven't added any items yet
                    </p>
                    <Link href="/products" className="btn btn-primary btn-lg">
                        {t('continueShopping')}
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-xl">
            <h1 className="gradient-text mb-xl">{t('yourCart')}</h1>

            <div className="grid gap-xl" style={{ gridTemplateColumns: '1fr 400px' }}>
                {/* Cart Items */}
                <div className="glass-card">
                    {items.map((item, index) => (
                        <div key={item.id}>
                            <div className="cart-item">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-info">
                                    <Link href={`/products/${item.id}`}>
                                        <h3 className="font-semibold mb-xs hover:text-cyan">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    <p className="text-muted text-sm mb-sm">{item.category}</p>
                                    <p className="price">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="quantity-control">
                                    <button
                                        className="quantity-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="px-md font-semibold">{item.quantity}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="price text-lg mb-sm">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                        className="btn btn-ghost text-muted hover:text-orange"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 size={16} />
                                        {t('removeItem')}
                                    </button>
                                </div>
                            </div>
                            {index < items.length - 1 && <div className="divider m-0" />}
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="glass-card order-summary" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
                    <h2 className="mb-xl">{t('orderSummary')}</h2>

                    <div className="summary-row">
                        <span className="text-secondary">{t('subtotal')}</span>
                        <span>${getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span className="text-secondary">{t('tax')} (10%)</span>
                        <span>${getTax().toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span className="text-secondary">Shipping</span>
                        <span className="text-cyan">Free</span>
                    </div>
                    <div className="summary-row summary-total">
                        <span className="font-bold">{t('total')}</span>
                        <span className="price">${getTotal().toFixed(2)}</span>
                    </div>

                    <Link
                        href="/checkout"
                        className="btn btn-primary btn-lg w-full mt-xl"
                    >
                        {t('proceedToCheckout')}
                        <ArrowRight size={18} />
                    </Link>

                    <button
                        className="btn btn-secondary w-full mt-md"
                        onClick={clearCart}
                    >
                        Clear Cart
                    </button>

                    <Link
                        href="/products"
                        className="btn btn-ghost w-full mt-md"
                    >
                        {t('continueShopping')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
