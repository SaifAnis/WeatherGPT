"use client";

import { useState } from "react";
import { Mic, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Will it rain today?",
  "Is there a cyclone nearby?",
  "What should I carry today?",
];

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

let nextId = 0;

export function ChatInterface({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    nextId++;
    const userMsg: Message = { id: `msg-${nextId}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Mock assistant response
    setTimeout(() => {
      nextId++;
      const assistantMsg: Message = {
        id: `msg-${nextId}`,
        role: "assistant",
        content: `[DEMO RESPONSE] I can't process "${text}" yet. Real AI integration will be added in a future milestone.`,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 600);
  };

  const handleMicClick = () => {
    alert("Voice coming soon in a future milestone!");
  };

  return (
    <div
      className={cn(
        "bg-[var(--panel-bg)] border border-[var(--panel-border)] backdrop-blur-xl rounded-3xl p-6 text-[var(--foreground)] shadow-2xl flex flex-col gap-4 h-[400px] transition-all duration-300",
        className
      )}
    >
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm opacity-60 italic">
            Start a conversation or click a suggestion below.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === "user" ? "bg-[var(--accent-blue)] text-white" : "bg-[var(--foreground)]/10 text-[var(--foreground)]"
              )}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm",
                msg.role === "user" 
                  ? "bg-[var(--accent-blue)] text-white rounded-tr-sm" 
                  : "bg-[var(--foreground)]/10 text-[var(--foreground)] rounded-tl-sm border border-[var(--panel-border)]"
              )}>
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="shrink-0 mt-auto pt-2 border-t border-[var(--panel-border)]">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTIONS.map((text, i) => (
              <button
                key={i}
                onClick={() => handleSend(text)}
                className="bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 border border-[var(--panel-border)] transition-colors rounded-full px-4 py-2 text-sm text-[var(--foreground)]/80"
              >
                {text}
              </button>
            ))}
          </div>
        )}

        <div className="relative group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
            placeholder="Ask WeatherGPT anything about the weather..."
            className="w-full bg-[var(--background)] border border-[var(--panel-border)] rounded-full py-4 pl-6 pr-24 text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/50 transition-all shadow-inner"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button 
              onClick={handleMicClick}
              className="p-2.5 rounded-full hover:bg-[var(--foreground)]/10 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-full bg-[var(--accent-blue)] hover:opacity-80 text-white transition-opacity disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
