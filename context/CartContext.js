'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedCart = localStorage.getItem('neonmarket_cart');
        if (storedCart) {
            try {
                setItems(JSON.parse(storedCart));
            } catch (e) {
                localStorage.removeItem('neonmarket_cart');
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            localStorage.setItem('neonmarket_cart', JSON.stringify(items));
        }
    }, [items, loading]);

    const addToCart = (product, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems(prev =>
            prev.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getItemCount = () => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getSubtotal = () => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const getTax = () => {
        return getSubtotal() * 0.1; // 10% tax
    };

    const getTotal = () => {
        return getSubtotal() + getTax();
    };

    return (
        <CartContext.Provider value={{
            items,
            loading,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getItemCount,
            getSubtotal,
            getTax,
            getTotal,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
