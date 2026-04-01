
import React, { useState } from 'react';
import { motion as motionBase } from 'framer-motion';
import * as ReactRouterDom from 'react-router-dom';

const motion = motionBase as any;
const { useNavigate } = ReactRouterDom as any;

const ReportPage: React.FC = () => {
  const [reportType, setReportType] = useState('bug');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sessionStr = localStorage.getItem('visionhaven_session');
    let userEmail = null;
    if (sessionStr) {
      try {
        userEmail = JSON.parse(sessionStr).email;
      } catch (e) {
        console.error("Failed to parse session:", e);
      }
    }

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: reportType, description, userEmail })
      });

      if (!res.ok) throw new Error("Failed to submit report");

      setSubmitted(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Neural link failed. Please try again later.");
    }
  };

  return (
    <div className="pt-32 pb-24 bg-luxury-cream min-h-screen flex items-center justify-center px-8">
      <div className="max-w-4xl w-full bg-white rounded-[60px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.1)] border border-white overflow-hidden">
        <div className="grid md:grid-cols-12 h-full">
          <div className="md:col-span-4 bg-luxury-charcoal p-16 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 rounded-full -mr-16 -mt-16"></div>
             <div className="relative z-10">
                <span className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">Internal Protocol</span>
                <h2 className="text-5xl font-serif leading-tight">System <br /><span className="italic text-luxury-gold">Feedback.</span></h2>
             </div>
             <div className="relative z-10 text-[9px] uppercase tracking-[0.4em] font-bold opacity-30">
                Studio Diagnostics v1.2
             </div>
          </div>
          
          <div className="md:col-span-8 p-16">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-8"
              >
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                   <h3 className="text-3xl font-serif text-luxury-charcoal">Report Archived</h3>
                   <p className="text-zinc-400 text-sm mt-4 leading-relaxed max-w-xs mx-auto uppercase tracking-widest font-bold">
                     Your diagnostics have been sent to our neural engineering team. Returning to dashboard...
                   </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-6">
                   <p className="text-zinc-500 text-sm font-light leading-relaxed">
                     Please describe the issue or feedback you've encountered within the VisionHaven Studio. Your input helps us refine the neural rendering process.
                   </p>
                   
                   <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block ml-2">Classification</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'bug', label: 'Technical Bug' },
                          { id: 'design', label: 'Design Synthesis' },
                          { id: 'feature', label: 'Feature Request' },
                          { id: 'safety', label: 'Safety Violation' }
                        ].map(type => (
                          <button 
                            key={type.id}
                            type="button"
                            onClick={() => setReportType(type.id)}
                            className={`py-4 px-6 rounded-2xl border text-[9px] uppercase tracking-widest font-bold transition-all ${reportType === type.id ? 'bg-luxury-charcoal text-white border-luxury-charcoal' : 'bg-zinc-50 text-zinc-400 border-zinc-100 hover:border-zinc-200'}`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block ml-2">Description of Events</label>
                      <textarea 
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-zinc-50 border-b border-zinc-100 p-6 text-lg font-serif outline-none focus:border-luxury-gold transition-all resize-none rounded-t-3xl" 
                        rows={6}
                        placeholder="Detailed log of behavior..."
                      />
                   </div>
                </div>

                <div className="pt-6 border-t border-zinc-50">
                  <button 
                    type="submit"
                    className="w-full py-6 rounded-full bg-luxury-charcoal text-white text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-luxury-gold transition-all duration-500 shadow-xl"
                  >
                    Submit Diagnostics
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
