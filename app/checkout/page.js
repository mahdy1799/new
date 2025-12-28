'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Truck, Check, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getSubtotal, getTax, getTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { t } = useLanguage();

    const [step, setStep] = useState(1);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: '',
    });

    if (items.length === 0 && !orderPlaced) {
        return (
            <div className="container py-3xl">
                <div className="empty-state">
                    <h2 className="mb-md">Your cart is empty</h2>
                    <p className="text-secondary mb-lg">
                        Add some items to your cart before checkout
                    </p>
                    <Link href="/products" className="btn btn-primary">
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="container py-3xl">
                <div className="glass-card p-3xl text-center max-w-lg m-auto">
                    <div
                        className="btn btn-primary btn-icon mb-xl m-auto animate-glow"
                        style={{ width: '80px', height: '80px' }}
                    >
                        <Check size={40} />
                    </div>
                    <h1 className="gradient-text mb-md">Order Placed!</h1>
                    <p className="text-secondary mb-xl">
                        Thank you for your purchase. Your order has been received and will be processed shortly.
                    </p>
                    <p className="text-muted text-sm mb-xl">
                        Order confirmation has been sent to {shippingInfo.email}
                    </p>
                    <Link href="/" className="btn btn-primary btn-lg">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // Prepare order details for Formspree
        const orderDetails = {
            // Customer Info
            customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            email: shippingInfo.email,
            phone: shippingInfo.phone,

            // Shipping Address
            address: shippingInfo.address,
            city: shippingInfo.city,
            postalCode: shippingInfo.postalCode,
            country: shippingInfo.country,

            // Order Items
            items: items.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n'),

            // Order Totals
            subtotal: `$${getSubtotal().toFixed(2)}`,
            tax: `$${getTax().toFixed(2)}`,
            total: `$${getTotal().toFixed(2)}`,

            // Order Time
            orderDate: new Date().toLocaleString('en-US'),
        };

        // Create form data for Formspree
        const formData = new FormData();
        formData.append('email', orderDetails.email);
        formData.append('message', `
🛒 NEW ORDER RECEIVED!

📦 Customer Information:
- Name: ${orderDetails.customerName}
- Email: ${orderDetails.email}
- Phone: ${orderDetails.phone}

📍 Shipping Address:
- Address: ${orderDetails.address}
- City: ${orderDetails.city}
- Postal Code: ${orderDetails.postalCode}
- Country: ${orderDetails.country}

🛍️ Order Items:
${orderDetails.items}

💰 Order Summary:
- Subtotal: ${orderDetails.subtotal}
- Tax: ${orderDetails.tax}
- Total: ${orderDetails.total}

📅 Order Date: ${orderDetails.orderDate}
        `);

        try {
            // Send to Formspree
            await fetch('https://formspree.io/f/xvzoakbg', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
        } catch (error) {
            console.error('Failed to send order notification:', error);
        }

        clearCart();
        setOrderPlaced(true);
        setProcessing(false);
    };

    const updateShipping = (field, value) => {
        setShippingInfo(prev => ({ ...prev, [field]: value }));
    };

    const updatePayment = (field, value) => {
        setPaymentInfo(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="container py-xl">
            <h1 className="gradient-text mb-xl">{t('checkout')}</h1>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-xl mb-2xl">
                <div className={`flex items-center gap-sm ${step >= 1 ? 'text-cyan' : 'text-muted'}`}>
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-gradient' : 'bg-tertiary'
                            }`}
                    >
                        <Truck size={16} />
                    </div>
                    <span className="font-medium">{t('shippingInfo')}</span>
                </div>
                <div className="w-20 h-px bg-tertiary" />
                <div className={`flex items-center gap-sm ${step >= 2 ? 'text-cyan' : 'text-muted'}`}>
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-gradient' : 'bg-tertiary'
                            }`}
                    >
                        <CreditCard size={16} />
                    </div>
                    <span className="font-medium">{t('paymentInfo')}</span>
                </div>
            </div>

            <div className="grid gap-xl" style={{ gridTemplateColumns: '1fr 400px' }}>
                {/* Form Section */}
                <div className="glass-card p-xl">
                    {step === 1 && (
                        <form onSubmit={handleShippingSubmit}>
                            <h2 className="mb-xl">{t('shippingInfo')}</h2>

                            <div className="grid grid-cols-2 gap-md">
                                <div className="form-group">
                                    <label className="form-label">{t('firstName')}</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={shippingInfo.firstName}
                                        onChange={(e) => updateShipping('firstName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('lastName')}</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={shippingInfo.lastName}
                                        onChange={(e) => updateShipping('lastName', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-md">
                                <div className="form-group">
                                    <label className="form-label">{t('email')}</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={shippingInfo.email}
                                        onChange={(e) => updateShipping('email', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('phone')}</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={shippingInfo.phone}
                                        onChange={(e) => updateShipping('phone', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('address')}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={shippingInfo.address}
                                    onChange={(e) => updateShipping('address', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-md">
                                <div className="form-group">
                                    <label className="form-label">{t('city')}</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={shippingInfo.city}
                                        onChange={(e) => updateShipping('city', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('postalCode')}</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={shippingInfo.postalCode}
                                        onChange={(e) => updateShipping('postalCode', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('country')}</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={shippingInfo.country}
                                        onChange={(e) => updateShipping('country', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg w-full">
                                Continue to Payment
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handlePaymentSubmit}>
                            <div className="flex items-center gap-md mb-xl">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setStep(1)}
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <h2 className="m-0">{t('paymentInfo')}</h2>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Cardholder Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="John Doe"
                                    value={paymentInfo.cardName}
                                    onChange={(e) => updatePayment('cardName', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('cardNumber')}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="1234 5678 9012 3456"
                                    value={paymentInfo.cardNumber}
                                    onChange={(e) => updatePayment('cardNumber', e.target.value)}
                                    maxLength={19}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-md">
                                <div className="form-group">
                                    <label className="form-label">{t('expiryDate')}</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="MM/YY"
                                        value={paymentInfo.expiryDate}
                                        onChange={(e) => updatePayment('expiryDate', e.target.value)}
                                        maxLength={5}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('cvv')}</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="123"
                                        value={paymentInfo.cvv}
                                        onChange={(e) => updatePayment('cvv', e.target.value)}
                                        maxLength={4}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="alert alert-info mb-lg">
                                This is a test checkout. No real payment will be processed.
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-full"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <div className="spinner" style={{ width: '20px', height: '20px' }} />
                                        Processing...
                                    </>
                                ) : (
                                    <>{t('placeOrder')}</>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Order Summary */}
                <div className="glass-card order-summary" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
                    <h2 className="mb-xl">{t('orderSummary')}</h2>

                    <div className="flex flex-col gap-md mb-xl">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-md">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="rounded"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-muted">Qty: {item.quantity}</p>
                                </div>
                                <span className="text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="divider" />

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
                </div>
            </div>
        </div>
    );
}
