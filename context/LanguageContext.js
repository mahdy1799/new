'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    en: {
        // Navigation
        products: 'Products',
        collections: 'Collections',
        deals: 'Deals',
        admin: 'Admin',
        cart: 'Cart',
        login: 'Login',
        logout: 'Logout',
        register: 'Register',

        // Common
        home: 'Home',
        search: 'Search',
        searchProducts: 'Search products...',
        addToCart: 'Add to Cart',
        buyNow: 'Buy Now',
        viewDetails: 'View Details',
        price: 'Price',
        quantity: 'Quantity',
        total: 'Total',
        subtotal: 'Subtotal',
        tax: 'Tax',

        // Product
        inStock: 'In Stock',
        lowStock: 'Low Stock',
        outOfStock: 'Out of Stock',
        reviews: 'Reviews',
        noReviews: 'No reviews yet',
        writeReview: 'Write a Review',
        relatedProducts: 'Related Products',
        description: 'Description',

        // Categories
        all: 'All',
        electronics: 'Electronics',
        fashion: 'Fashion',
        home: 'Home',

        // Cart
        yourCart: 'Your Cart',
        emptyCart: 'Your cart is empty',
        continueShopping: 'Continue Shopping',
        proceedToCheckout: 'Proceed to Checkout',
        removeItem: 'Remove',

        // Checkout
        checkout: 'Checkout',
        shippingInfo: 'Shipping Information',
        paymentInfo: 'Payment Information',
        orderSummary: 'Order Summary',
        placeOrder: 'Place Order',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        city: 'City',
        postalCode: 'Postal Code',
        country: 'Country',
        cardNumber: 'Card Number',
        expiryDate: 'Expiry Date',
        cvv: 'CVV',

        // Auth
        signIn: 'Sign In',
        signUp: 'Sign Up',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        forgotPassword: 'Forgot Password?',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        name: 'Name',

        // Admin
        dashboard: 'Dashboard',
        productsTab: 'Products',
        cmsTab: 'CMS',
        addProduct: 'Add Product',
        deleteProduct: 'Delete',
        editHero: 'Edit Hero Section',
        editAbout: 'Edit About Page',

        // Hero
        heroTitle: 'THE FUTURE OF SHOPPING',
        heroSubtitle: 'Discover cutting-edge products that define tomorrow',
        exploreNow: 'Explore Now',
        viewDeals: 'View Deals',

        // Sections
        categories: 'Categories',
        newProducts: 'New Products',
        featuredDeals: 'Featured Deals',
        hotDeals: 'Hot Deals',

        // 404
        pageNotFound: 'Page Not Found',
        backToHome: 'Back to Home',

        // Footer
        aboutUs: 'About Us',
        quickLinks: 'Quick Links',
        support: 'Support',
        newsletter: 'Newsletter',
        newsletterText: 'Subscribe to get updates on new arrivals and special offers.',
        subscribe: 'Subscribe',
        enterEmail: 'Enter your email',
        allRightsReserved: 'All rights reserved',

        // Misc
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        save: 'Save',
        cancel: 'Cancel',
        update: 'Update',
        delete: 'Delete',
        hot: 'HOT',
        deal: 'DEAL',
        new: 'NEW',
    },
    ar: {
        // Navigation
        products: 'المنتجات',
        collections: 'المجموعات',
        deals: 'العروض',
        admin: 'الإدارة',
        cart: 'السلة',
        login: 'تسجيل الدخول',
        logout: 'تسجيل الخروج',
        register: 'التسجيل',

        // Common
        home: 'الرئيسية',
        search: 'بحث',
        searchProducts: 'ابحث عن منتجات...',
        addToCart: 'أضف للسلة',
        buyNow: 'اشتر الآن',
        viewDetails: 'عرض التفاصيل',
        price: 'السعر',
        quantity: 'الكمية',
        total: 'الإجمالي',
        subtotal: 'المجموع الفرعي',
        tax: 'الضريبة',

        // Product
        inStock: 'متوفر',
        lowStock: 'كمية محدودة',
        outOfStock: 'غير متوفر',
        reviews: 'التقييمات',
        noReviews: 'لا توجد تقييمات بعد',
        writeReview: 'اكتب تقييم',
        relatedProducts: 'منتجات ذات صلة',
        description: 'الوصف',

        // Categories
        all: 'الكل',
        electronics: 'إلكترونيات',
        fashion: 'أزياء',
        home: 'المنزل',

        // Cart
        yourCart: 'سلة التسوق',
        emptyCart: 'سلة التسوق فارغة',
        continueShopping: 'متابعة التسوق',
        proceedToCheckout: 'إتمام الشراء',
        removeItem: 'إزالة',

        // Checkout
        checkout: 'الدفع',
        shippingInfo: 'معلومات الشحن',
        paymentInfo: 'معلومات الدفع',
        orderSummary: 'ملخص الطلب',
        placeOrder: 'تأكيد الطلب',
        firstName: 'الاسم الأول',
        lastName: 'اسم العائلة',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        address: 'العنوان',
        city: 'المدينة',
        postalCode: 'الرمز البريدي',
        country: 'البلد',
        cardNumber: 'رقم البطاقة',
        expiryDate: 'تاريخ الانتهاء',
        cvv: 'رمز الأمان',

        // Auth
        signIn: 'تسجيل الدخول',
        signUp: 'إنشاء حساب',
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        forgotPassword: 'نسيت كلمة المرور؟',
        noAccount: 'ليس لديك حساب؟',
        haveAccount: 'لديك حساب بالفعل؟',
        name: 'الاسم',

        // Admin
        dashboard: 'لوحة التحكم',
        productsTab: 'المنتجات',
        cmsTab: 'المحتوى',
        addProduct: 'إضافة منتج',
        deleteProduct: 'حذف',
        editHero: 'تعديل القسم الرئيسي',
        editAbout: 'تعديل صفحة من نحن',

        // Hero
        heroTitle: 'مستقبل التسوق',
        heroSubtitle: 'اكتشف منتجات متطورة تحدد الغد',
        exploreNow: 'استكشف الآن',
        viewDeals: 'عرض العروض',

        // Sections
        categories: 'الفئات',
        newProducts: 'منتجات جديدة',
        featuredDeals: 'عروض مميزة',
        hotDeals: 'عروض ساخنة',

        // 404
        pageNotFound: 'الصفحة غير موجودة',
        backToHome: 'العودة للرئيسية',

        // Footer
        aboutUs: 'من نحن',
        quickLinks: 'روابط سريعة',
        support: 'الدعم',
        newsletter: 'النشرة البريدية',
        newsletterText: 'اشترك للحصول على آخر العروض والمنتجات الجديدة.',
        subscribe: 'اشترك',
        enterEmail: 'أدخل بريدك الإلكتروني',
        allRightsReserved: 'جميع الحقوق محفوظة',

        // Misc
        loading: 'جاري التحميل...',
        error: 'خطأ',
        success: 'نجاح',
        save: 'حفظ',
        cancel: 'إلغاء',
        update: 'تحديث',
        delete: 'حذف',
        hot: 'رائج',
        deal: 'عرض',
        new: 'جديد',
    },
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedLang = localStorage.getItem('neonmarket_lang');
        if (storedLang && (storedLang === 'en' || storedLang === 'ar')) {
            setLanguage(storedLang);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            localStorage.setItem('neonmarket_lang', language);
            document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = language;
        }
    }, [language, loading]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    };

    const isRTL = language === 'ar';

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage,
            toggleLanguage,
            t,
            isRTL,
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
