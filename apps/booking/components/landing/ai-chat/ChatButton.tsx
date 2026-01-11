import React from 'react';
import { Bot } from 'lucide-react';

interface ChatButtonProps {
    onToggle: () => void;
    isOpen: boolean;
}

/**
 * Floating AI chat button component
 * Provides quick access to the AI assistant
 */
export const ChatButton: React.FC<ChatButtonProps> = ({ onToggle, isOpen }) => {
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <button
                onClick={onToggle}
                className="w-16 h-16 bg-gradient-to-r from-crimson-primary to-crimson-light rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary focus:ring-opacity-50"
                aria-label={isOpen ? 'Close AI chat' : 'Open AI chat assistant'}
                aria-expanded={isOpen}
                aria-controls="ai-chat-interface"
            >
                <Bot className="w-8 h-8" aria-hidden="true" />
            </button>
        </div>
    );
};

export default ChatButton;