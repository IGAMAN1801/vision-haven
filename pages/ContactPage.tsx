
import React, { useState } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

const motion = motionBase as any;

const ContactPage: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'General Inquiry'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Send the email via the backend API
      const contactRes = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });

      if (!contactRes.ok) {
        const errorData = await contactRes.json();
        throw new Error(errorData.error || 'Failed to send message via backend');
      }

      // 2. Generate AI confirmation message (optional but nice)
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A customer named ${formState.name} (email: ${formState.email}) sent a message: "${formState.message}". 
      As a VisionHaven AI assistant, generate a brief, ultra-luxurious, and reassuring confirmation message that they will receive an official response soon. Keep it under 50 words.`;
      
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      
      setResponse(res.text || "Your message has been received by our concierge team.");
      setFormState({ name: '', email: '', message: '', subject: 'General Inquiry' });
    } catch (err: any) {
      console.error("Submission error:", err);
      setResponse(err.message || "Our neural receptors are busy. Your inquiry has been queued for human review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.5em] mb-4 block">Concierge Desk</span>
              <h1 className="text-7xl font-serif text-luxury-charcoal leading-tight">Connect With <br /><span className="italic text-luxury-gold">The Haven.</span></h1>
              <p className="text-zinc-500 font-light leading-loose text-xl mt-8 max-w-lg">
                Whether you seek bespoke architectural guidance or technical support, our team is at your disposal.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-16 rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-zinc-100"
          >
            <AnimatePresence mode="wait">
              {response ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 space-y-8"
                >
                  <div className="w-24 h-24 bg-luxury-gold rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-luxury-gold/30">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-3xl font-serif text-luxury-charcoal">Synchronized</h3>
                  <p className="text-zinc-500 italic leading-relaxed">"{response}"</p>
                  <button 
                    onClick={() => setResponse(null)}
                    className="text-luxury-gold uppercase tracking-widest text-[10px] font-bold border-b border-luxury-gold pb-1"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold ml-2">Your Name</label>
                       <input 
                        required
                        type="text" 
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        className="w-full bg-zinc-50 border-b border-zinc-100 p-6 text-lg font-serif outline-none focus:border-luxury-gold transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold ml-2">Protocol ID (Email)</label>
                       <input 
                        required
                        type="email" 
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        className="w-full bg-zinc-50 border-b border-zinc-100 p-6 text-lg font-serif outline-none focus:border-luxury-gold transition-all"
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold ml-2">Inquiry Focus</label>
                     <select 
                      value={formState.subject}
                      onChange={(e) => setFormState({...formState, subject: e.target.value})}
                      className="w-full bg-zinc-50 border-b border-zinc-100 p-6 text-lg font-serif outline-none focus:border-luxury-gold transition-all"
                     >
                       <option>General Inquiry</option>
                       <option>Custom Architectural Sourcing</option>
                       <option>Technical Studio Support</option>
                       <option>Enterprise Collaboration</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold ml-2">Message</label>
                     <textarea 
                        required
                        rows={4}
                        value={formState.message}
                        onChange={(e) => setFormState({...formState, message: e.target.value})}
                        className="w-full bg-zinc-50 border-b border-zinc-100 p-6 text-lg font-serif outline-none focus:border-luxury-gold transition-all resize-none"
                     />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full py-6 rounded-full bg-luxury-charcoal text-white text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-luxury-gold transition-all duration-500 shadow-2xl flex items-center justify-center gap-4"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Connecting...
                      </>
                    ) : 'Dispatch Message'}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
