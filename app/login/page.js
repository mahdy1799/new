'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            router.push('/');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-xl">
            <div className="glass-card p-2xl" style={{ width: '100%', maxWidth: '440px' }}>
                <div className="text-center mb-2xl">
                    <Link href="/" className="logo text-2xl">NEONMARKET</Link>
                    <h1 className="mt-lg mb-sm">{t('signIn')}</h1>
                    <p className="text-secondary">Welcome back! Please enter your details.</p>
                </div>

                {error && (
                    <div className="alert alert-error mb-lg animate-fade-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">{t('email')}</label>
                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute text-muted"
                                style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                            />
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                style={{ paddingLeft: '44px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('password')}</label>
                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute text-muted"
                                style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                            />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => updateField('password', e.target.value)}
                                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-ghost absolute"
                                style={{ right: '4px', top: '50%', transform: 'translateY(-50%)' }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end mb-lg">
                        <Link href="#" className="text-sm text-cyan">
                            {t('forgotPassword')}
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: '20px', height: '20px' }} />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn size={18} />
                                {t('signIn')}
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-xl">
                    <p className="text-secondary">
                        {t('noAccount')}{' '}
                        <Link href="/register" className="text-cyan font-medium">
                            {t('signUp')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
