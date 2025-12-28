'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { MessageCircle, X, Send, Bot, User, Trash2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Chatbot() {
    const { messages, isLoading, isOpen, toggleChat, sendMessage, clearChat } = useChat();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const { t } = useLanguage();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
        setInputValue('');
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={toggleChat}
                className={`fixed bottom-lg right-lg z-50 p-md rounded-full shadow-lg transition-all duration-300 animate-glow ${isOpen ? 'bg-secondary rotate-90' : 'bg-primary hover:scale-110'
                    }`}
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-[100px] right-lg z-40 w-[350px] sm:w-[400px] h-[500px] rounded-xl overflow-hidden glass-card transition-all duration-300 origin-bottom-right shadow-2xl flex flex-col ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
                    }`}
            >
                {/* Header */}
                <div className="p-md bg-gradient flex items-center justify-between">
                    <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Bot size={18} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">مساعد الأغذية</h3>
                            <span className="flex items-center gap-xs text-[10px] text-white/80">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                Online
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={clearChat}
                        className="p-xs rounded hover:bg-white/20 text-white/80 transition-colors"
                        title="Clear Chat"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-md space-y-md custom-scrollbar bg-primary-bg/50">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-sm ${msg.role === 'user' ? 'flex-row-reverse' : ''
                                }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-secondary' : 'bg-primary'
                                    }`}
                            >
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div
                                className={`max-w-[80%] p-sm rounded-lg text-sm ${msg.role === 'user'
                                    ? 'bg-secondary text-white rounded-tr-none'
                                    : 'glass-card text-text rounded-tl-none'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-start gap-sm">
                            <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
                                <Bot size={16} />
                            </div>
                            <div className="glass-card p-sm rounded-lg rounded-tl-none">
                                <Loader2 size={16} className="animate-spin text-cyan" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-sm bg-secondary-bg/80 backdrop-blur-md border-t border-white/10">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="اسأل عن المنتجات... Ask about products..."
                            className="w-full bg-primary-bg/50 border border-white/10 rounded-full py-2 pl-4 pr-12 focus:outline-none focus:border-cyan text-sm text-text placeholder-muted transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className="absolute right-1 p-1.5 bg-primary rounded-full text-white hover:bg-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
