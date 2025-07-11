"use client"
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
const SAMPLE_QUERIES = [
  "Tell me about Sharda Global School.",
  "What is the Directors Message?",
  "What is the chairman's Message?",
  "What is the curiculum structure of Sharda Global School?",
];

function getTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const FloatingChatbot: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! Ask me anything. Try one of the sample queries below!",
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: userMessage.text, userId: user?._id || "" }),
      });
      const data = await res.json();
      console.log(data);
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: data.answer || "Sorry, I couldn't get an answer.",
          time: getTime(),
          confidence: typeof data.confidence === 'number' ? Math.floor(data.confidence*100) : 33,
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
        text: "Hi! Ask me anything. Try one of the sample queries below!",
        time: getTime(),
        confidence: 100,
      },
    ]);
    setInput("");
    setShowSamples(true);
  };

  return (
    <>
      {/* Floating Chatbot Ball */}
      <button
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200 focus:outline-none animate-bounce"
        onClick={() => setOpen(true)}
        aria-label="Open Chatbot"
      >
        <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
      </button>
      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative w-full max-w-2xl h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-400 to-blue-600 px-6 py-4 rounded-t-3xl">
              <div className="text-white font-bold text-xl flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-7 h-7 text-white" />
                Chatbot
              </div>
              <button onClick={() => setOpen(false)} className="text-white hover:text-red-400 transition-colors">
                <XMarkIcon className="w-7 h-7" />
              </button>
            </div>
            {/* Sample Queries */}
            {showSamples && (
              <div className="flex flex-wrap gap-3 justify-center mt-6 animate-fade-in">
                {SAMPLE_QUERIES.map((q, i) => (
                  <button
                    key={i}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-full shadow transition-all border border-blue-200 text-base"
                    onClick={() => handleSampleClick(q)}
                    type="button"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-5 px-8 py-6 mt-2" style={{ scrollbarWidth: 'thin', fontSize: '1.1rem', background: '#f8fafc' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`relative max-w-[70%] px-6 py-4 rounded-2xl shadow-xl text-base whitespace-pre-line ${msg.sender === "user"
                      ? "bg-blue-100 text-blue-900 rounded-br-none"
                      : "bg-white text-blue-800 rounded-bl-none border border-blue-100"
                    }`}>
                    <div>{msg.text}</div>
                    {/* Confidence bar for bot messages (except greeting) */}
                    {msg.sender === "bot" && idx !== 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-blue-400 mb-1">Confidence</div>
                        <div className="w-full h-2 bg-blue-100 rounded">
                          <div
                            className="h-2 bg-blue-400 rounded"
                            style={{ width: `${msg.confidence || 33}%` }}
                          />
                        </div>
                        <div className="flex flex-row justify-between items-center text-xs mt-1 mb-1">
                          <span className="text-blue-300 opacity-70 select-none">{msg.time}</span>
                          <span className="text-blue-400">{msg.confidence || 33}%</span>
                        </div>
                      </div>
                    )}
                    {/* For user messages, show time at bottom right as before */}
                    {msg.sender === "user" && (
                      <div className="absolute bottom-0 right-4 text-xs text-blue-300 opacity-70 select-none mt-3">
                        {msg.time}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            {/* Input Area */}
            <form onSubmit={handleSend} className="flex items-center gap-3 px-8 py-4 border-t border-blue-200 bg-blue-50">
              <Input
                className="flex-1 bg-white border border-blue-200 text-blue-900 placeholder:text-blue-400 focus-visible:ring-blue-400 rounded-full px-5 py-4 text-base"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
              >
                {loading ? '...' : 'Send'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleClear}
                className="text-blue-400 hover:text-red-400 px-3"
              >
                Clear
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot; 