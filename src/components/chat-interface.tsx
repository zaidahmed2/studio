"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, Send, User, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string | React.ReactNode;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessagePlaceholder: Message = {
        id: aiMessageId,
        role: "ai",
        content: <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />,
    };
    setMessages((prev) => [...prev, aiMessagePlaceholder]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: aiMessageId,
        role: "ai",
        content: "This is a simulated response based on your input. The real app would use a fine-tuned Gemini model.",
      };
      setMessages((prev) => prev.map(m => m.id === aiMessageId ? aiResponse : m));
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-h-full">
        <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="p-4 space-y-6">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-14rem)] text-center">
                        <Bot className="w-16 h-16 text-muted-foreground" />
                        <h2 className="mt-4 text-2xl font-semibold">Welcome to Zania</h2>
                        <p className="mt-2 text-muted-foreground">
                            Start a conversation by typing a message below.
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                        "flex items-start gap-3",
                        message.role === "user" && "justify-end"
                        )}
                    >
                        {message.role === "ai" && (
                        <Avatar className="w-8 h-8 border">
                            <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                        )}
                        <div
                        className={cn(
                            "max-w-md rounded-lg p-3 text-sm shadow-sm",
                            message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-card"
                        )}
                        >
                        {message.content}
                        </div>
                        {message.role === "user" && (
                        <Avatar className="w-8 h-8 border">
                            <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                        )}
                    </div>
                    ))
                )}
                </div>
            </ScrollArea>
        </div>
        <div className="p-4 bg-background border-t">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="sr-only">Send</span>
            </Button>
            </form>
        </div>
    </div>
  );
}
