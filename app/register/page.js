'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
    const router = useRouter();
    const { signup, isAuthenticated } = useAuth();
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const validateForm = () => {
        if (formData.name.length < 2) {
            setError('Name must be at least 2 characters');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);
        const result = await signup(formData.name, formData.email, formData.password);

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
                    <h1 className="mt-lg mb-sm">{t('signUp')}</h1>
                    <p className="text-secondary">Create an account to get started.</p>
                </div>

                {error && (
                    <div className="alert alert-error mb-lg animate-fade-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">{t('name')}</label>
                        <div className="relative">
                            <User
                                size={18}
                                className="absolute text-muted"
                                style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                            />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                style={{ paddingLeft: '44px' }}
                                required
                            />
                        </div>
                    </div>

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
                                placeholder="Create a password"
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

                    <div className="form-group">
                        <label className="form-label">{t('confirmPassword')}</label>
                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute text-muted"
                                style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                            />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={(e) => updateField('confirmPassword', e.target.value)}
                                style={{ paddingLeft: '44px' }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: '20px', height: '20px' }} />
                                Creating account...
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                {t('signUp')}
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-xl">
                    <p className="text-secondary">
                        {t('haveAccount')}{' '}
                        <Link href="/login" className="text-cyan font-medium">
                            {t('signIn')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
