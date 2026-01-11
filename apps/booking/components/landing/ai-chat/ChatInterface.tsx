import React, { useState } from 'react';
import { X, Send, Bot } from 'lucide-react';

interface Message {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

interface ChatInterfaceProps {
    isOpen: boolean;
    onClose: () => void;
    conversations: Message[];
    isTyping: boolean;
    onSendMessage: (message: string) => void;
}

/**
 * AI chat interface component
 * Provides a conversational interface for AI assistant
 */
export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    isOpen,
    onClose,
    conversations,
    isTyping,
    onSendMessage,
}) => {
    const [message, setMessage] = useState('');

    /**
     * Handle message submission
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isTyping) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    /**
     * Handle Enter key press
     */
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            id="ai-chat-interface"
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            role="dialog"
            aria-labelledby="chat-title"
            aria-describedby="chat-description"
        >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-crimson-primary to-crimson-light text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Bot className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                        <h3 id="chat-title" className="font-bold text-lg">Nia</h3>
                        <p id="chat-description" className="text-sm opacity-90">AI Hair Stylist Assistant</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded p-1"
                    aria-label="Close chat"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Chat messages */}
            <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4" role="log" aria-live="polite" aria-label="Chat conversation">
                    {/* Welcome message */}
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-crimson-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" aria-hidden="true" />
                        </div>
                        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm max-w-[80%]">
                            <p className="text-gray-800 text-sm">
                                👋 Hi! I&apos;m Nia, your AI hair stylist assistant. I can help you learn about our services, find the perfect style, or answer any questions about InStyle Hair Boutique. How can I assist you today?
                            </p>
                        </div>
                    </div>

                    {/* Conversation history */}
                    {conversations.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-start gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}
                        >
                            {msg.type === 'bot' && (
                                <div className="w-8 h-8 bg-crimson-primary rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" aria-hidden="true" />
                                </div>
                            )}

                            <div className={`rounded-2xl px-4 py-3 shadow-sm max-w-[80%] ${msg.type === 'user'
                                ? 'bg-crimson-primary text-white'
                                : 'bg-white text-gray-800'
                                }`}>
                                <p className="text-sm">{msg.content}</p>
                                <span className="text-xs opacity-70 block mt-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {msg.type === 'user' && (
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-gray-600" aria-hidden="true">You</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-crimson-primary rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" aria-hidden="true" />
                            </div>
                            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-1" aria-label="AI is typing">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat input */}
            <div className="border-t border-gray-200 p-4 bg-white">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me about our services..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-crimson-primary focus:border-transparent outline-none text-sm"
                        disabled={isTyping}
                        aria-label="Type your message"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim() || isTyping}
                        className="px-4 py-3 bg-crimson-primary text-white rounded-xl hover:bg-crimson-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-crimson-primary focus:ring-opacity-50"
                        aria-label="Send message"
                    >
                        <Send className="w-5 h-5" aria-hidden="true" />
                    </button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Powered by AI • Ask about services, pricing, or booking
                </p>
            </div>
        </div>
    );
};

export default ChatInterface;