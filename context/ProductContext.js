'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const getProductById = (id) => {
        return products.find(p => p.id === id);
    };

    const getProductsByCategory = (category) => {
        if (!category || category === 'all') return products;
        return products.filter(p => p.category === category);
    };

    const getHotProducts = () => {
        return products.filter(p => p.isHot);
    };

    const getDealProducts = () => {
        return products.filter(p => p.isDeal);
    };

    const searchProducts = (query) => {
        if (!query) return products;
        const lowerQuery = query.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );
    };

    const getCategories = () => {
        const categories = [...new Set(products.map(p => p.category))];
        return categories;
    };

    const getRelatedProducts = (productId, limit = 4) => {
        const product = getProductById(productId);
        if (!product) return [];
        return products
            .filter(p => p.category === product.category && p.id !== productId)
            .slice(0, limit);
    };

    const addProduct = async (productData) => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            if (!res.ok) throw new Error('Failed to add product');
            const newProduct = await res.json();
            setProducts(prev => [...prev, newProduct]);
            return { success: true, product: newProduct };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const res = await fetch(`/api/products?id=${productId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete product');
            setProducts(prev => prev.filter(p => p.id !== productId));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return (
        <ProductContext.Provider value={{
            products,
            loading,
            error,
            fetchProducts,
            getProductById,
            getProductsByCategory,
            getHotProducts,
            getDealProducts,
            searchProducts,
            getCategories,
            getRelatedProducts,
            addProduct,
            deleteProduct,
        }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
}
