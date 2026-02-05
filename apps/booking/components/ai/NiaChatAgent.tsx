"use client";

import { Send, User, Bot } from "lucide-react"; // Make sure you have lucide-react or similar
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
    role: "user" | "agent";
    content: string;
}

export function NiaChatAgent() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "agent", content: "Hello! I'm Nia. How can I help you with your hair today?" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    history: messages.slice(-5), // Send last 5 messages for context
                }),
            });

            const data = await (res.json() as Promise<any>);

            if (data.error) {
                setMessages((prev) => [...prev, { role: "agent", content: "Sorry, I'm having trouble connecting right now." }]);
            } else {
                setMessages((prev) => [...prev, { role: "agent", content: data.response }]);
            }
        } catch (err) {
            console.error(err);
            setMessages((prev) => [...prev, { role: "agent", content: "Something went wrong. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col shadow-xl border-t-4 border-t-purple-500">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-4">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Bot className="w-6 h-6" />
                    Chat with Nia
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto space-y-4 pr-2"
                >
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === "user"
                                    ? "bg-purple-600 text-white rounded-br-none"
                                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none text-sm animate-pulse">
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 pt-2 border-t">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={isLoading} size="icon" className="bg-purple-600 hover:bg-purple-700">
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
