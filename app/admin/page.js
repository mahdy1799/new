'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Package,
    FileText,
    Plus,
    Trash2,
    Upload,
    Save,
    Flame,
    Tag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminPage() {
    const router = useRouter();
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { products, addProduct, deleteProduct, fetchProducts } = useProducts();
    const { t } = useLanguage();

    const [activeTab, setActiveTab] = useState('products');
    const [cms, setCms] = useState(null);
    const [saving, setSaving] = useState(false);

    // New Product Form
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: 'electronics',
        stock: '',
        description: '',
        image: '',
        isHot: false,
        isDeal: false,
    });
    const [imagePreview, setImagePreview] = useState('');

    // CMS Form
    const [heroForm, setHeroForm] = useState({
        title: '',
        subtitle: '',
        ctaText: '',
    });
    const [aboutForm, setAboutForm] = useState({
        title: '',
        content: '',
    });

    useEffect(() => {
        if (!authLoading && !isAdmin()) {
            router.push('/login');
        }
    }, [authLoading, isAdmin, router]);

    useEffect(() => {
        const fetchCMS = async () => {
            try {
                const res = await fetch('/api/cms');
                const data = await res.json();
                setCms(data);
                setHeroForm({
                    title: data.hero?.title || '',
                    subtitle: data.hero?.subtitle || '',
                    ctaText: data.hero?.ctaText || '',
                });
                setAboutForm({
                    title: data.about?.title || '',
                    content: data.about?.content || '',
                });
            } catch (error) {
                console.error('Failed to fetch CMS:', error);
            }
        };
        fetchCMS();
    }, []);

    if (authLoading) {
        return (
            <div className="container py-3xl flex justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!isAdmin()) {
        return null;
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setNewProduct(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setSaving(true);

        const productData = {
            ...newProduct,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
        };

        const result = await addProduct(productData);

        if (result.success) {
            setNewProduct({
                name: '',
                price: '',
                category: 'electronics',
                stock: '',
                description: '',
                image: '',
                isHot: false,
                isDeal: false,
            });
            setImagePreview('');
        }

        setSaving(false);
    };

    const handleDeleteProduct = async (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(productId);
        }
    };

    const handleSaveHero = async () => {
        setSaving(true);
        try {
            await fetch('/api/cms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: 'hero', content: heroForm }),
            });
            alert('Hero section updated!');
        } catch (error) {
            console.error('Failed to update hero:', error);
        }
        setSaving(false);
    };

    const handleSaveAbout = async () => {
        setSaving(true);
        try {
            await fetch('/api/cms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: 'about', content: aboutForm }),
            });
            alert('About section updated!');
        } catch (error) {
            console.error('Failed to update about:', error);
        }
        setSaving(false);
    };

    return (
        <div className="container py-xl">
            <h1 className="gradient-text mb-xl">{t('dashboard')}</h1>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    <Package size={18} />
                    {t('productsTab')}
                </button>
                <button
                    className={`tab ${activeTab === 'cms' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cms')}
                >
                    <FileText size={18} />
                    {t('cmsTab')}
                </button>
            </div>

            {/* Products Tab */}
            {activeTab === 'products' && (
                <div className="grid gap-xl" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {/* Add Product Form */}
                    <div className="glass-card p-xl">
                        <h2 className="mb-xl flex items-center gap-sm">
                            <Plus size={24} />
                            {t('addProduct')}
                        </h2>

                        <form onSubmit={handleAddProduct}>
                            {/* Image Upload */}
                            <div className="form-group">
                                <label className="form-label">Product Image</label>
                                <div
                                    className="image-upload-preview"
                                    onClick={() => document.getElementById('image-upload').click()}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" />
                                    ) : (
                                        <div className="text-center text-muted">
                                            <Upload size={32} />
                                            <p className="text-sm mt-sm">Click to upload</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                                <p className="text-muted text-xs mt-sm">Or enter image URL below</p>
                                <input
                                    type="text"
                                    className="form-input mt-sm"
                                    placeholder="https://..."
                                    value={newProduct.image}
                                    onChange={(e) => {
                                        setNewProduct(prev => ({ ...prev, image: e.target.value }));
                                        setImagePreview(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-md">
                                <div className="form-group">
                                    <label className="form-label">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Stock</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-input form-select"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                                >
                                    <option value="electronics">Electronics</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="home">Home</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input form-textarea"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="flex gap-lg mb-lg">
                                <label
                                    className="checkbox-wrapper"
                                    onClick={() => setNewProduct(prev => ({ ...prev, isHot: !prev.isHot }))}
                                >
                                    <div className={`checkbox ${newProduct.isHot ? 'checked' : ''}`}>
                                        {newProduct.isHot && <Flame size={12} />}
                                    </div>
                                    <span>Mark as HOT</span>
                                </label>

                                <label
                                    className="checkbox-wrapper"
                                    onClick={() => setNewProduct(prev => ({ ...prev, isDeal: !prev.isDeal }))}
                                >
                                    <div className={`checkbox ${newProduct.isDeal ? 'checked' : ''}`}>
                                        {newProduct.isDeal && <Tag size={12} />}
                                    </div>
                                    <span>Mark as DEAL</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={saving}
                            >
                                {saving ? 'Adding...' : 'Add Product'}
                            </button>
                        </form>
                    </div>

                    {/* Products List */}
                    <div className="glass-card p-xl">
                        <h2 className="mb-xl">Products ({products.length})</h2>

                        <div className="table-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Tags</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="flex items-center gap-sm">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="rounded"
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                    />
                                                    <span className="text-sm">{product.name}</span>
                                                </div>
                                            </td>
                                            <td>${product.price}</td>
                                            <td>{product.stock}</td>
                                            <td>
                                                <div className="flex gap-xs">
                                                    {product.isHot && <span className="badge badge-hot">HOT</span>}
                                                    {product.isDeal && <span className="badge badge-deal">DEAL</span>}
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-ghost text-muted hover:text-orange"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* CMS Tab */}
            {activeTab === 'cms' && (
                <div className="grid gap-xl" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {/* Hero Section */}
                    <div className="glass-card p-xl">
                        <h2 className="mb-xl">{t('editHero')}</h2>

                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-input"
                                value={heroForm.title}
                                onChange={(e) => setHeroForm(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Subtitle</label>
                            <input
                                type="text"
                                className="form-input"
                                value={heroForm.subtitle}
                                onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">CTA Text</label>
                            <input
                                type="text"
                                className="form-input"
                                value={heroForm.ctaText}
                                onChange={(e) => setHeroForm(prev => ({ ...prev, ctaText: e.target.value }))}
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleSaveHero}
                            disabled={saving}
                        >
                            <Save size={16} />
                            {saving ? 'Saving...' : 'Save Hero'}
                        </button>
                    </div>

                    {/* About Section */}
                    <div className="glass-card p-xl">
                        <h2 className="mb-xl">{t('editAbout')}</h2>

                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-input"
                                value={aboutForm.title}
                                onChange={(e) => setAboutForm(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Content</label>
                            <textarea
                                className="form-input form-textarea"
                                value={aboutForm.content}
                                onChange={(e) => setAboutForm(prev => ({ ...prev, content: e.target.value }))}
                                style={{ minHeight: '200px' }}
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleSaveAbout}
                            disabled={saving}
                        >
                            <Save size={16} />
                            {saving ? 'Saving...' : 'Save About'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
