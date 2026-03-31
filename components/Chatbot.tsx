
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Welcome to VisionHaven. I am your AI Concierge. How may I assist with your spatial vision today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are the VisionHaven AI Concierge, a high-luxury, sophisticated, and helpful assistant for an AI-powered interior design studio. Your tone is elegant, professional, and reassuring. You help users with interior design advice, explain how the VisionHaven tool works (uploading images for AI restyling), and guide them to the contact page if they need bespoke human assistance. Keep responses concise and luxurious.",
        },
      });

      const response = await chat.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I apologize, my neural link is momentarily disrupted. How else can I assist?" }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "I am currently attending to another guest. Please try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-24 right-0 w-[400px] h-[600px] bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-zinc-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-luxury-charcoal p-8 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
                <div>
                  <h3 className="text-sm font-serif tracking-widest uppercase">AI Concierge</h3>
                  <p className="text-[8px] text-luxury-gold uppercase tracking-[0.3em] font-bold">Active Protocol</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-6 scrollbar-hide bg-[#FDFBF7]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-5 rounded-[25px] text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-luxury-gold text-white rounded-tr-none shadow-lg' 
                      : 'bg-white text-luxury-charcoal rounded-tl-none border border-zinc-100 shadow-sm font-light italic'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-5 rounded-[25px] rounded-tl-none border border-zinc-100 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-zinc-50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Inquire about your vision..."
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-full py-4 px-8 text-sm font-serif outline-none focus:border-luxury-gold transition-all pr-16"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-2 bottom-2 w-12 bg-luxury-charcoal text-white rounded-full flex items-center justify-center hover:bg-luxury-gold transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative group"
      >
        <div className="absolute inset-0 bg-luxury-gold rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
        <div className="relative bg-luxury-charcoal text-white px-6 py-4 rounded-full shadow-2xl border border-luxury-gold/30 flex items-center gap-3 hover:scale-105 transition-transform duration-500">
          <div className="w-2 h-2 bg-luxury-gold rounded-full animate-ping"></div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">AI Concierge</span>
          <svg className={`w-4 h-4 text-luxury-gold transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default Chatbot;
