'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Menu,
    X,
    ShoppingCart,
    User,
    LogOut,
    Sun,
    Moon,
    Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const { user, logout, isAdmin } = useAuth();
    const { getItemCount } = useCart();
    const { t, toggleLanguage, language } = useLanguage();
    const { toggleTheme, isDark } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/products', label: t('products') },
        { href: '/deals', label: t('deals') },
    ];

    if (isAdmin()) {
        navLinks.push({ href: '/admin', label: t('admin') });
    }

    const isActive = (href) => pathname === href;

    return (
        <>
            <header className={`header ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="header-content">
                        <Link href="/" className="logo">
                            NEONMARKET
                        </Link>

                        <nav className="nav-links">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-sm">
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={toggleLanguage}
                                title={language === 'en' ? 'العربية' : 'English'}
                            >
                                <Globe size={20} />
                            </button>

                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={toggleTheme}
                                title={isDark ? 'Light Mode' : 'Dark Mode'}
                            >
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <Link href="/cart" className="btn btn-ghost btn-icon relative">
                                <ShoppingCart size={20} />
                                {getItemCount() > 0 && (
                                    <span className="cart-counter">{getItemCount()}</span>
                                )}
                            </Link>

                            {user ? (
                                <div className="flex items-center gap-sm">
                                    <div className="user-badge">
                                        <User size={16} />
                                        <span className="text-sm">{user.name}</span>
                                    </div>
                                    <button
                                        className="btn btn-ghost btn-icon"
                                        onClick={logout}
                                        title={t('logout')}
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="btn btn-primary btn-sm">
                                    {t('login')}
                                </Link>
                            )}

                            <button
                                className="btn btn-ghost btn-icon mobile-menu-btn"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <Link href="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
                        NEONMARKET
                    </Link>
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>
                <nav className="mobile-nav-links">
                    <Link
                        href="/"
                        className="mobile-nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {t('home')}
                    </Link>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="mobile-nav-link"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/cart"
                        className="mobile-nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {t('cart')} ({getItemCount()})
                    </Link>
                    {user ? (
                        <button
                            className="mobile-nav-link"
                            onClick={() => {
                                logout();
                                setMobileMenuOpen(false);
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                        >
                            {t('logout')}
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="mobile-nav-link"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t('login')}
                        </Link>
                    )}
                </nav>
            </div>
        </>
    );
}
