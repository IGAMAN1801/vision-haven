
import React, { useState } from 'react';
// Fix: Use namespace import for framer-motion and react-router-dom to bypass type errors
import * as FramerMotion from 'framer-motion';
import * as ReactRouterDom from 'react-router-dom';
import { authService } from '../services/authService';

const { motion: motionBase, AnimatePresence } = FramerMotion as any;
const motion = motionBase as any;
const { useNavigate } = ReactRouterDom as any;
type Variants = any;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'selection' | 'auth'>('selection');
  const [role, setRole] = useState<'user' | 'vendor'>('user');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: ''
  });

  const handleRoleSelection = (selectedRole: 'user' | 'vendor') => {
    setRole(selectedRole);
    setStep('auth');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let user;
      if (authMethod === 'phone') {
        user = await authService.phoneAuth(formData.phone);
      } else if (mode === 'signup') {
        user = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role,
          company: formData.company
        });
      } else {
        user = await authService.login(formData.email, formData.password);
      }

      const sessionData = {
        isLoggedIn: true,
        role: user.role,
        name: user.name,
        email: user.email,
        id: user.id,
        isPremium: user.isPremium,
        avatarUrl: user.avatarUrl
      };

      try {
        localStorage.setItem('visionhaven_session', JSON.stringify(sessionData));
      } catch (e) {
        console.error("Failed to save session:", e);
        setError("Local storage quota exceeded. Could not save session.");
        return;
      }
      
      if (user.role === 'vendor') {
        navigate('/vendor');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.socialAuth(provider);
      try {
        localStorage.setItem('visionhaven_session', JSON.stringify({
          isLoggedIn: true,
          role: user.role,
          name: user.name,
          email: user.email,
          id: user.id,
          isPremium: user.isPremium,
          avatarUrl: user.avatarUrl
        }));
      } catch (e) {
        console.error("Failed to save social session:", e);
        setError("Local storage quota exceeded. Could not save session.");
        return;
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError("Social authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
    exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-6 relative overflow-hidden py-32">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-luxury-gold/5 blur-3xl rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 60, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-luxury-charcoal/[0.03] blur-3xl rounded-full"
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 'selection' ? (
          <motion.div 
            key="selection"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-5xl z-10"
          >
            <div className="text-center mb-16">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3 mb-6"
              >
                <div className="w-10 h-[1px] bg-luxury-gold"></div>
                <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.5em]">Gate of Entry</span>
                <div className="w-10 h-[1px] bg-luxury-gold"></div>
              </motion.div>
              <h1 className="text-7xl font-serif text-luxury-charcoal">How will you <span className="italic text-luxury-gold">Envision?</span></h1>
              <p className="mt-4 text-zinc-400 font-light tracking-widest uppercase text-[10px]">Select your identity to initialize the Haven Protocol</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* User Selection Card */}
              <motion.button
                whileHover={{ scale: 1.02, y: -10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelection('user')}
                className="group relative h-[450px] bg-white rounded-[60px] shadow-2xl overflow-hidden border border-zinc-100 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-cream to-white opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 space-y-8">
                  <div className="w-32 h-32 bg-white rounded-[40px] shadow-xl border border-zinc-50 flex items-center justify-center mx-auto group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-14 h-14 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-4xl font-serif text-luxury-charcoal mb-4">Design Enthusiast</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-widest">Architect your dream living space.<br/>For individual homeowners & visionaries.</p>
                  </div>
                  <div className="px-10 py-4 bg-luxury-charcoal text-white rounded-full text-[10px] uppercase tracking-[0.4em] font-bold group-hover:bg-luxury-gold transition-colors">
                    User Login
                  </div>
                </div>
              </motion.button>

              {/* Vendor Selection Card */}
              <motion.button
                whileHover={{ scale: 1.02, y: -10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelection('vendor')}
                className="group relative h-[450px] bg-luxury-charcoal rounded-[60px] shadow-2xl overflow-hidden border border-zinc-800 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-luxury-charcoal opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 space-y-8">
                  <div className="w-32 h-32 bg-[#222] rounded-[40px] shadow-2xl border border-zinc-800 flex items-center justify-center mx-auto group-hover:-rotate-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-14 h-14 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-4xl font-serif text-white mb-4">Material Partner</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-widest">Manage leads & technical specs.<br/>For suppliers & industrial vendors.</p>
                  </div>
                  <div className="px-10 py-4 bg-white text-luxury-charcoal rounded-full text-[10px] uppercase tracking-[0.4em] font-bold group-hover:bg-luxury-gold group-hover:text-white transition-colors">
                    Vendor Login
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="auth"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[70px] shadow-[0_50px_120px_-20px_rgba(0,0,0,0.2)] border border-white overflow-hidden relative z-10"
          >
            {/* Left Narrative Column */}
            <div className={`hidden lg:block relative overflow-hidden p-16 flex flex-col justify-between ${role === 'vendor' ? 'bg-luxury-charcoal text-white' : 'bg-luxury-cream text-luxury-charcoal'}`}>
               <AnimatePresence mode="wait">
                 <motion.img 
                   key={mode}
                   initial={{ opacity: 0, scale: 1.1 }}
                   animate={{ opacity: role === 'vendor' ? 0.3 : 0.8, scale: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 1 }}
                   src={role === 'user' 
                    ? "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200" 
                    : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200"
                   } 
                   className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
                   referrerPolicy="no-referrer"
                 />
               </AnimatePresence>
               
               <div className="relative z-10">
                  <button 
                    onClick={() => setStep('selection')}
                    className={`flex items-center gap-3 group text-[10px] uppercase tracking-[0.3em] font-bold ${role === 'vendor' ? 'text-white/60 hover:text-white' : 'text-luxury-charcoal/60 hover:text-luxury-charcoal'}`}
                  >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Switch Identity
                  </button>
               </div>

               <div className="relative z-10 space-y-6">
                 <motion.div layoutId="role-indicator" className="inline-block px-5 py-2 bg-luxury-gold rounded-full text-white text-[8px] uppercase tracking-[0.4em] font-bold shadow-xl">
                   {role} access
                 </motion.div>
                 <h2 className="text-6xl font-serif leading-tight">
                    {mode === 'login' ? 'Continue Your' : 'Architect Your'}<br/>
                    <span className="italic text-luxury-gold">{role === 'user' ? 'Vision.' : 'Enterprise.'}</span>
                 </h2>
                 <p className={`text-sm font-light leading-relaxed max-w-sm ${role === 'vendor' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Welcome to the specialized {role} terminal. Log in to access your custom workspace.
                 </p>
               </div>

               <div className="relative z-10 text-[9px] uppercase tracking-[0.5em] font-bold opacity-30">
                 Neural Secure v3.0 // System Active
               </div>
            </div>

            {/* Right Auth Form Column */}
            <div className="p-12 md:p-24 bg-white flex flex-col justify-center">
               <header className="mb-12">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-5xl font-serif text-luxury-charcoal capitalize">{mode}</h2>
                    <div className="flex bg-zinc-50 p-1.5 rounded-full border border-zinc-100">
                      {['login', 'signup'].map((m) => (
                        <button 
                          key={m}
                          onClick={() => setMode(m as any)}
                          className={`px-8 py-2.5 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all ${mode === m ? 'bg-white shadow-xl text-luxury-gold scale-105' : 'text-zinc-400'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-bold uppercase tracking-widest mb-6 overflow-hidden"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
               </header>

               <form onSubmit={handleAuth} className="space-y-8">
                  <div className="flex gap-4 mb-4">
                     {['email', 'phone'].map((meth) => (
                       <button 
                        key={meth}
                        type="button"
                        onClick={() => setAuthMethod(meth as any)}
                        className={`flex-1 py-4 border rounded-3xl text-[9px] uppercase tracking-widest font-bold transition-all ${authMethod === meth ? 'border-luxury-gold bg-luxury-cream/50 text-luxury-gold' : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'}`}
                       >
                         {meth} Entry
                       </button>
                     ))}
                  </div>

                  <div className="space-y-6">
                    {mode === 'signup' && authMethod === 'email' && (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400 block ml-2">Display Name</label>
                        <input 
                          required 
                          type="text" 
                          className="w-full bg-zinc-50/50 border-b-2 border-zinc-100 px-8 py-5 text-xl font-serif outline-none focus:border-luxury-gold focus:bg-white transition-all rounded-t-3xl" 
                          placeholder="Alexandria Vane"
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    )}

                    {authMethod === 'email' ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400 block ml-2">Protocol ID (Email)</label>
                          <input 
                            required 
                            type="email" 
                            className="w-full bg-zinc-50/50 border-b-2 border-zinc-100 px-8 py-5 text-xl font-serif outline-none focus:border-luxury-gold focus:bg-white transition-all rounded-t-3xl" 
                            placeholder="curator@haven.com"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400 block ml-2">Access Key (Password)</label>
                          <input 
                            required 
                            type="password" 
                            className="w-full bg-zinc-50/50 border-b-2 border-zinc-100 px-8 py-5 text-xl font-serif outline-none focus:border-luxury-gold focus:bg-white transition-all rounded-t-3xl" 
                            placeholder="••••••••"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400 block ml-2">Mobile Link</label>
                        <input 
                          required 
                          type="tel" 
                          className="w-full bg-zinc-50/50 border-b-2 border-zinc-100 px-8 py-5 text-xl font-serif outline-none focus:border-luxury-gold focus:bg-white transition-all rounded-t-3xl" 
                          placeholder="+1 (555) 000-0000"
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    )}

                    <button 
                      disabled={isLoading}
                      className="w-full py-6 rounded-full bg-luxury-charcoal text-white text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-luxury-gold transition-all duration-500 shadow-2xl relative overflow-hidden group"
                    >
                      <span className="relative z-10">{isLoading ? 'Validating Protocol...' : `Authorize ${mode}`}</span>
                      <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </button>
                  </div>
               </form>

               <div className="mt-12 text-center">
                  <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mb-6">Or Authenticate via</p>
                  <div className="flex justify-center gap-6">
                     <button onClick={() => handleSocialAuth('google')} className="w-14 h-14 rounded-full border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 hover:border-luxury-gold transition-all shadow-sm">
                        <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.81l3.51-3.51C18.1 1.34 15.34 0 12 0 7.33 0 3.41 2.67 1.48 6.58l4.08 3.16C6.54 7.21 9.06 5.04 12 5.04z"/><path fill="#4285F4" d="M23.49 12.27c0-.85-.08-1.68-.22-2.48H12v4.69h6.44c-.28 1.51-1.13 2.79-2.41 3.65l3.86 2.99c2.26-2.09 3.6-5.17 3.6-8.85z"/></svg>
                     </button>
                     <button className="w-14 h-14 rounded-full border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 hover:border-luxury-gold transition-all shadow-sm">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.152 6.896c-.548 0-1.711.516-1.711 1.564 0 .935.79 1.435 1.711 1.435 1.058 0 1.729-.638 1.729-1.531 0-.968-.691-1.468-1.729-1.468zm.052 8.718c-.691 0-1.841.485-1.841 1.516 0 .935.91 1.485 1.841 1.485 1.05 0 1.841-.63 1.841-1.5 0-.918-.79-1.501-1.841-1.501zM12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm0 18.91c2.721 0 4.93-2.181 4.93-4.86 0-1.841-1.121-3.326-2.731-4.041 1.272-.751 2.05-1.95 2.05-3.23 0-2.341-1.89-4.24-4.249-4.24-2.35 0-4.25 1.899-4.25 4.24 0 1.28.778 2.479 2.04 3.23-1.611.715-2.72 2.2-2.72 4.041 0 2.679 2.209 4.86 4.93 4.86z"/></svg>
                     </button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
