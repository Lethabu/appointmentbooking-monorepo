import { useState, useCallback } from 'react';

interface AIConversation {
    id: string;
    query?: string;
    response?: string;
    timestamp: number;
    resolved: boolean;
}

interface UseAIChatReturn {
    conversations: AIConversation[];
    isAiTyping: boolean;
    addAiConversation: (conversation: Omit<AIConversation, 'id'>) => void;
    setAiTyping: (typing: boolean) => void;
    sendMessage: (message: string) => Promise<void>;
}

/**
 * Custom hook for managing AI chat functionality
 * Handles conversation state, typing indicators, and API communication
 */
export const useAIChat = (): UseAIChatReturn => {
    const [conversations, setConversations] = useState<AIConversation[]>([]);
    const [isAiTyping, setIsAiTyping] = useState(false);

    /**
     * Add a new conversation to the state
     */
    const addAiConversation = useCallback((conversation: Omit<AIConversation, 'id'>) => {
        const newConversation: AIConversation = {
            ...conversation,
            id: crypto.randomUUID(),
        };

        setConversations(prev => [...prev, newConversation]);
    }, []);

    /**
     * Set AI typing state
     */
    const setAiTyping = useCallback((typing: boolean) => {
        setIsAiTyping(typing);
    }, []);

    /**
     * Send a message to the AI and handle the response
     */
    const sendMessage = useCallback(async (message: string) => {
        if (!message.trim()) return;

        const userMessage = message.trim();

        // Add user message to conversation
        addAiConversation({
            query: userMessage,
            response: '',
            timestamp: Date.now(),
            resolved: false
        });

        setAiTyping(true);

        try {
            // Call AI endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: conversations.map(c => ({
                        role: c.query ? 'user' : 'model',
                        content: c.query || c.response
                    }))
                })
            });

            const data = await response.json() as { response: string; error?: string };

            if (data.response) {
                addAiConversation({
                    query: '',
                    response: data.response,
                    timestamp: Date.now(),
                    resolved: true
                });
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('AI Chat Error:', error);

            addAiConversation({
                query: '',
                response: 'I apologize, but I\'m having trouble connecting right now. Please call us at +27 69 917 1527 to speak with our team directly.',
                timestamp: Date.now(),
                resolved: false
            });
        } finally {
            setAiTyping(false);
        }
    }, [conversations, addAiConversation, setAiTyping]);

    return {
        conversations,
        isAiTyping,
        addAiConversation,
        setAiTyping,
        sendMessage,
    };
};

export default useAIChat;