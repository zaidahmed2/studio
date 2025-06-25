"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, Send, User, Loader2, Heart } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { chat } from "@/ai/flows/chat";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  role: "user" | "model";
  content: string | React.ReactNode;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        requestAnimationFrame(() => {
          viewport.scrollTop = viewport.scrollHeight;
        });
      }
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
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessagePlaceholder: Message = {
        id: aiMessageId,
        role: "model",
        content: <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />,
    };
    setMessages((prev) => [...prev, aiMessagePlaceholder]);

    try {
      const historyForApi = newMessages.map(m => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : '',
      })).filter(m => m.content);

      const result = await chat({ history: historyForApi });
      const aiResponse: Message = {
        id: aiMessageId,
        role: "model",
        content: result.response,
      };
      setMessages((prev) => prev.map(m => m.id === aiMessageId ? aiResponse : m));
    } catch (error) {
        console.error("Failed to get AI response:", error);
        toast({
            variant: "destructive",
            title: "Chat Error",
            description: "Failed to get a response from the AI. Please try again.",
        });
        const errorResponse: Message = {
            id: aiMessageId,
            role: "model",
            content: "Sorry, I encountered an error.",
        };
        setMessages((prev) => prev.map(m => m.id === aiMessageId ? errorResponse : m));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)]">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="p-4 sm:p-6 space-y-6 h-full">
              {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                      <Heart className="w-16 h-16 text-primary animate-pulse" />
                      <h2 className="mt-4 text-2xl font-semibold tracking-wide">Sirf Aapke Liye</h2>
                      <p className="mt-2 text-muted-foreground">
                          Zaid se guftugu shuru karein. Pehla message bhejein.
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
                      {message.role === "model" && (
                      <Avatar className="w-8 h-8 border">
                          <AvatarFallback className="bg-secondary"><Bot className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                      )}
                      <div
                      className={cn(
                          "max-w-xl rounded-2xl p-4 text-sm shadow-lg",
                          message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border"
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
        <div className="p-4 bg-background/80 backdrop-blur-sm border-t">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send a message..."
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
