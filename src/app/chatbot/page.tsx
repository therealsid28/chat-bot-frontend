"use client";
import React, { useState, useRef } from "react";
import { AppSidebar } from "../../components/AppSidebar"
import { SidebarProvider } from "../../components/ui/sidebar"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getAuthFromLocalStorage } from "@/api/auth";

const USER_ID = "686d46d6938bf2cfabc0c797";
const SAMPLE_QUERIES = [
  "Tell me about the skills of Vinayak Jat",
  "What projects has Vinayak Jat worked on?",
  "List the achievements of Vinayak Jat",
  "Describe Vinayak Jat's experience in AI",
];

function getTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatbotPage() {
  const router = useRouter();
  // React.useEffect(() => {
  //   const auth = getAuthFromLocalStorage();
  //   if (auth && auth.user && auth.token) {
  //     router.replace("/dashboard/home");
  //   } else {
  //     router.replace("/login");
  //   }
  // }, [router]);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! Ask me anything. Try one of the sample queries above!",
      time: getTime(),
      confidence: 100,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSamples, setShowSamples] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input, time: getTime(), confidence: 100 };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setLoading(true);
    setShowSamples(false);
    try {
      const res = await fetch("http://localhost:3001/api/v1/chat/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: userMessage.text, userId: USER_ID }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: data.answer || "Sorry, I couldn't get an answer.",
          time: getTime(),
          confidence: typeof data.confidence === 'number' ? data.confidence : 33,
        },
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "Sorry, there was an error connecting to the server.",
          time: getTime(),
          confidence: 33,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  const handleSampleClick = (query: string) => {
    setInput(query);
    setShowSamples(false);
  };

  const handleClear = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hi! Ask me anything about Vinayak Jat. Try one of the sample queries above!",
        time: getTime(),
        confidence: 100,
      },
    ]);
    setInput("");
    setShowSamples(true);
  };

  const handleRefresh = () => {
    if (messages.length > 1) {
      setInput(messages[messages.length - 2]?.text || "");
      setShowSamples(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center py-8 px-4">
          
          <div className="w-full max-w-4xl h-[80vh] min-h-[500px] bg-white flex flex-col rounded-b-3xl rounded-t-3xl shadow-2xl pb-8 px-0">
          <div className="bg-gradient-to-r from-[#60a5fa] to-[#6366f1] w-full p-4 rounded-t-3xl">
            <div className="text-white font-bold text-2xl leading-tight">Admin Assistant<span className="text-green-400 ml-2 text-xl">●</span></div>
            <div className="text-blue-100 text-base">Powered by Gemini API</div>
          </div>
            {/* Sample Queries */}
            {showSamples && (
              <div className="flex flex-wrap gap-4 justify-center mt-8 animate-fade-in">
                {SAMPLE_QUERIES.map((q, i) => (
                  <button
                    key={i}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-5 py-2 rounded-full shadow transition-all border border-blue-200 text-lg"
                    onClick={() => handleSampleClick(q)}
                    type="button"
                    style={{ fontSize: '1.1rem' }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-6 px-16 py-8 mt-2" style={{ scrollbarWidth: 'thin', fontSize: '1.15rem', background: '#f8fafc' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`relative max-w-[70%] px-7 py-5 rounded-2xl shadow-2xl text-base whitespace-pre-line ${msg.sender === "user"
                      ? "bg-blue-100 text-blue-900 rounded-br-none text-lg"
                      : "bg-white text-blue-800 rounded-bl-none border border-blue-100 text-lg"
                    }`} style={{ fontSize: '1.15rem' }}>
                    <div>{msg.text}</div>
                    {/* Confidence bar for bot messages (except greeting) */}
                    {msg.sender === "bot" && idx !== 0 && (
                      <div className="mt-4">
                        <div className="text-sm text-blue-400 mb-1">Confidence</div>
                        <div className="w-full h-2 bg-blue-100 rounded">
                          <div
                            className="h-2 bg-blue-400 rounded"
                            style={{ width: `${msg.confidence || 33}%` }}
                          />
                        </div>
                        <div className="flex flex-row justify-between items-center text-sm mt-1 mb-2">
                          <span className="text-blue-300 opacity-70 select-none">{msg.time}</span>
                          <span className="text-blue-400">{msg.confidence || 33}%</span>
                        </div>
                      </div>
                    )}
                    {/* For user messages, show time at bottom right as before */}
                    {msg.sender === "user" && (
                      <div className="absolute bottom-0 right-5 text-sm text-blue-300 opacity-70 select-none mt-4">
                        {msg.time}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            {/* Input Area */}
            <form onSubmit={handleSend} className="flex items-center gap-4 px-16 mt-4">
              <Input
                className="flex-1 bg-white border border-blue-200 text-blue-900 placeholder:text-blue-400 focus-visible:ring-[#60a5fa] rounded-full px-6 py-6 text-lg"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                autoFocus
                style={{ fontSize: '1.15rem' }}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-[#60a5fa] to-[#6366f1] hover:from-[#6366f1] hover:to-[#60a5fa] text-white px-6 py-4 rounded-full shadow-2xl"
                style={{ fontSize: '1.2rem' }}
              >
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M22 2L11 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" /><path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /></svg>
              </Button>
            </form>
          </div>
        </div>
        <style>{`
        .animate-fade-in { animation: fadeIn 0.7s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }
        ::-webkit-scrollbar { width: 8px; background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #e0e7ef; border-radius: 4px; }
      `}</style>
      </div>
    </SidebarProvider>
  );
}
