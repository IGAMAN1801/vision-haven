
import React, { useState } from 'react';
// Fix: Use any for motion to bypass property existence errors (initial, animate, etc)
import { motion as motionBase, AnimatePresence } from 'framer-motion';
// Fix: Use namespace import for react-router-dom to bypass type errors
import * as ReactRouterDom from 'react-router-dom';

const motion = motionBase as any;
const { useNavigate } = ReactRouterDom as any;

const PaymentPage: React.FC = () => {
  const [method, setMethod] = useState<'card' | 'apple' | 'crypto'>('card');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      alert("Payment Successful! Your Luxury Design Pack is now available in your studio.");
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-luxury-cream px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
        {/* Left Side: Order Summary */}
        <div className="lg:w-1/2 space-y-8">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Secure Checkout</span>
              <h1 className="text-5xl font-serif text-luxury-charcoal mb-6">Review Your <br />Investment.</h1>
              <p className="text-zinc-500 font-light leading-loose text-lg mb-10">
                You are purchasing the <strong>VisionHaven Elite Package</strong>. Unlock ultra-high-resolution AI renders, detailed architectural sourcing, and direct vendor access.
              </p>
           </motion.div>

           <div className="p-10 glass-card rounded-[40px] border border-luxury-gold/20 shadow-xl">
              <div className="space-y-6">
                 <div className="flex justify-between items-center py-4 border-b border-zinc-100">
                    <div className="text-sm">
                       <p className="font-bold text-luxury-charcoal uppercase tracking-widest">Elite Design Report</p>
                       <p className="text-xs text-zinc-400">Personalized AI Visioning</p>
                    </div>
                    <span className="font-serif text-xl">$149.00</span>
                 </div>
                 <div className="flex justify-between items-center py-4 border-b border-zinc-100">
                    <div className="text-sm">
                       <p className="font-bold text-luxury-charcoal uppercase tracking-widest">Vendor Direct Access</p>
                       <p className="text-xs text-zinc-400">Exclusive Material Discounts</p>
                    </div>
                    <span className="font-serif text-xl">$49.00</span>
                 </div>
                 <div className="flex justify-between items-center py-6">
                    <span className="text-lg font-bold uppercase tracking-[0.3em]">Total</span>
                    <span className="font-serif text-4xl text-luxury-gold">$198.00</span>
                 </div>
              </div>
              <div className="mt-8 p-4 bg-zinc-50 rounded-2xl flex items-center gap-4">
                 <svg className="w-8 h-8 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium leading-relaxed">
                   Encryption enabled. Your transaction is protected by industry-standard 256-bit SSL protocols.
                 </p>
              </div>
           </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="lg:w-1/2 w-full">
           <motion.div 
             initial={{ opacity: 0, y: 20 }} 
             animate={{ opacity: 1, y: 0 }}
             className="bg-white rounded-[40px] shadow-2xl p-12 border border-zinc-100"
           >
              <div className="flex gap-4 mb-10">
                 {['card', 'apple', 'crypto'].map((m) => (
                   <button 
                     key={m}
                     onClick={() => setMethod(m as any)}
                     className={`flex-1 py-4 border rounded-2xl transition-all flex items-center justify-center gap-2 ${method === m ? 'border-luxury-gold bg-luxury-cream/50 ring-1 ring-luxury-gold' : 'border-zinc-200 hover:bg-zinc-50'}`}
                   >
                     <span className="text-[9px] uppercase tracking-widest font-bold">{m === 'card' ? 'Credit Card' : m === 'apple' ? 'Apple Pay' : 'Crypto'}</span>
                   </button>
                 ))}
              </div>

              <AnimatePresence mode="wait">
                 {method === 'card' && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-2 block">Cardholder Name</label>
                        <input type="text" className="w-full border-b border-zinc-200 py-3 text-lg font-serif outline-none focus:border-luxury-gold transition-colors" placeholder="ALEXANDRIA VANE" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-2 block">Card Details</label>
                        <div className="relative">
                          <input type="text" className="w-full border-b border-zinc-200 py-3 text-lg font-serif outline-none focus:border-luxury-gold transition-colors tracking-widest" placeholder="4532 •••• •••• 8892" />
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2">
                             <div className="w-8 h-5 bg-blue-600 rounded"></div>
                             <div className="w-8 h-5 bg-orange-500 rounded"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-12">
                         <div className="flex-1">
                           <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-2 block">Expiration</label>
                           <input type="text" className="w-full border-b border-zinc-200 py-3 text-lg font-serif outline-none focus:border-luxury-gold transition-colors" placeholder="MM / YY" />
                         </div>
                         <div className="flex-1">
                           <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-2 block">CVC</label>
                           <input type="text" className="w-full border-b border-zinc-200 py-3 text-lg font-serif outline-none focus:border-luxury-gold transition-colors" placeholder="•••" />
                         </div>
                      </div>
                   </motion.div>
                 )}
                 {method === 'apple' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center justify-center space-y-6">
                       <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white">
                         <span className="text-4xl"></span>
                       </div>
                       <p className="text-xs uppercase tracking-widest font-bold">Ready to Scan FaceID</p>
                    </motion.div>
                 )}
              </AnimatePresence>

              <button 
                onClick={handlePay}
                disabled={processing}
                className={`w-full mt-12 py-6 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold text-white transition-all shadow-xl shadow-luxury-gold/20 flex items-center justify-center gap-3 ${processing ? 'bg-zinc-400' : 'bg-luxury-gold hover:bg-luxury-charcoal'}`}
              >
                {processing ? (
                   <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Processing...
                   </>
                ) : (
                   <>Complete Purchase</>
                )}
              </button>
              
              <p className="mt-8 text-center text-[9px] uppercase tracking-[0.2em] text-zinc-400 leading-relaxed">
                 By clicking complete purchase, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
