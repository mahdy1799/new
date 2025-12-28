import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ProductProvider } from '@/context/ProductContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Header, Footer, Chatbot } from '@/components';
import { ChatProvider } from '@/context/ChatContext';

export const metadata = {
    title: 'NeonMarket - The Future of Shopping',
    description: 'Discover cutting-edge products that define tomorrow. Premium electronics, fashion, and home products.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <ThemeProvider>
                    <LanguageProvider>
                        <AuthProvider>
                            <ProductProvider>
                                <CartProvider>
                                    <WishlistProvider>
                                        <ChatProvider>
                                            <Header />
                                            <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
                                                {children}
                                            </main>
                                            <Chatbot />
                                            <Footer />
                                        </ChatProvider>
                                    </WishlistProvider>
                                </CartProvider>
                            </ProductProvider>
                        </AuthProvider>
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
