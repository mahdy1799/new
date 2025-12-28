'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'أهلاً وسهلاً! أنا مساعدك الذكي في متجر الأغذية. كيف يمكنني مساعدتك اليوم؟\n\nWelcome! I am your Food Market assistant. How can I help you find fresh products today?',
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Load chat history from localStorage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem('neonmarket_chat_history');
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error('Failed to parse chat history', e);
            }
        }
    }, []);

    // Save chat history to localStorage whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('neonmarket_chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    const toggleChat = () => setIsOpen((prev) => !prev);

    const clearChat = () => {
        const initialMessage = [
            {
                role: 'assistant',
                content: 'تم مسح المحادثة. كيف يمكنني مساعدتك الآن؟\n\nChat cleared. How can I help you now?',
            },
        ];
        setMessages(initialMessage);
        localStorage.removeItem('neonmarket_chat_history');
    };

    const sendMessage = async (userMessage) => {
        if (!userMessage.trim()) return;

        // Add user message immediately
        const newMessages = [
            ...messages,
            { role: 'user', content: userMessage },
        ];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: newMessages.slice(-10), // Send last 10 messages for context
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');

            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: data.reply },
            ]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                isLoading,
                isOpen,
                toggleChat,
                sendMessage,
                clearChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    return useContext(ChatContext);
}
