"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/i18n/context";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Minimize2,
  GraduationCap,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChat() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please make sure your API key is configured and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-brand-600 to-brand-800 text-white rounded-full shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-105 transition-all flex items-center justify-center group"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-400 rounded-full flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-white rounded-2xl shadow-2xl border border-surface-200 flex flex-col transition-all duration-300 ${
        isMinimized
          ? "w-72 h-14"
          : "w-[min(92vw,380px)] h-[min(85vh,560px)] max-h-[80vh]"
      }`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-700 to-brand-900 text-white rounded-t-2xl cursor-pointer flex-shrink-0"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">{t("ai.title")}</div>
            {!isMinimized && (
              <div className="text-[10px] text-brand-200">
                {t("ai.subtitle")}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-50 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-brand-500" />
                </div>
                <p className="text-sm text-surface-500 leading-relaxed px-4">
                  {t("ai.welcome")}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {[
                    "Why are coral reefs dying?",
                    "Explain climate change",
                    "Help me prepare for O/L exam",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        inputRef.current?.focus();
                      }}
                      className="px-3 py-1.5 text-xs bg-brand-50 text-brand-700 rounded-full hover:bg-brand-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-brand-600 text-white rounded-br-md"
                      : "bg-surface-100 text-surface-800 rounded-bl-md"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-2 text-sm text-surface-500">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce animation-delay-200" />
                      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce animation-delay-400" />
                    </div>
                    {t("ai.thinking")}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-surface-100 flex-shrink-0">
            <div className="flex items-end gap-2 bg-surface-50 rounded-xl p-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("ai.placeholder")}
                rows={1}
                className="flex-1 bg-transparent text-sm text-surface-800 placeholder:text-surface-400 resize-none outline-none px-2 py-1.5 max-h-24"
                style={{ minHeight: "36px" }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600 transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
