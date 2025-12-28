'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Send
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div>
                        <Link href="/" className="logo mb-lg block">
                            NEONMARKET
                        </Link>
                        <p className="text-secondary text-sm mb-lg">
                            Your premier destination for futuristic and innovative products.
                            Experience the future of shopping today.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="social-link" aria-label="YouTube">
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="footer-title">{t('quickLinks')}</h4>
                        <ul className="footer-links">
                            <li><Link href="/" className="footer-link">{t('home')}</Link></li>
                            <li><Link href="/products" className="footer-link">{t('products')}</Link></li>
                            <li><Link href="/deals" className="footer-link">{t('deals')}</Link></li>
                            <li><Link href="/cart" className="footer-link">{t('cart')}</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="footer-title">{t('support')}</h4>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">FAQ</a></li>
                            <li><a href="#" className="footer-link">Shipping</a></li>
                            <li><a href="#" className="footer-link">Returns</a></li>
                            <li><a href="#" className="footer-link">Contact</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="footer-title">{t('newsletter')}</h4>
                        <p className="text-secondary text-sm mb-md">
                            {t('newsletterText')}
                        </p>
                        <form className="newsletter-form" onSubmit={handleSubscribe}>
                            <div className="relative" style={{ flex: 1 }}>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder={t('enterEmail')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Mail
                                    size={16}
                                    className="absolute text-muted"
                                    style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                <Send size={16} />
                            </button>
                        </form>
                        {subscribed && (
                            <p className="text-cyan text-sm mt-md animate-fade-in">
                                ✓ Successfully subscribed!
                            </p>
                        )}
                    </div>
                </div>

                <div className="divider" />

                <div className="flex items-center justify-between flex-wrap gap-md">
                    <p className="text-muted text-sm">
                        © {currentYear} NeonMarket. {t('allRightsReserved')}.
                    </p>
                    <div className="flex gap-lg">
                        <a href="#" className="footer-link text-sm">Privacy Policy</a>
                        <a href="#" className="footer-link text-sm">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
