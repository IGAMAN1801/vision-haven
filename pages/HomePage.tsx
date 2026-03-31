
import React, { useEffect, useRef } from 'react';
// Fix: Use any for motion to bypass property existence errors (y, initial, etc)
import { motion as motionBase, useScroll, useTransform } from 'framer-motion';
// Fix: Use namespace import for react-router-dom to bypass type errors
import * as ReactRouterDom from 'react-router-dom';
import gsap from 'gsap';

const motion = motionBase as any;
const { Link } = ReactRouterDom as any;

const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -300]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      
      tl.from(".hero-title span", {
        y: 150,
        opacity: 0,
        rotate: 5,
        duration: 2,
        stagger: 0.15
      })
      .from(".hero-tag", {
        opacity: 0,
        letterSpacing: "0.2em",
        duration: 1.5,
      }, "-=1.5")
      .from(".hero-btn", {
        opacity: 0,
        y: 30,
        duration: 1.2,
      }, "-=1");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden bg-[#FDFBF7]">
      {/* Cinematic Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yImage }} className="absolute inset-0 z-0 scale-110">
          <img 
            src="https://picsum.photos/seed/hero-interior/2000/1200" 
            alt="Interior" 
            className="w-full h-full object-cover brightness-[0.55] contrast-[1.1]" 
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-10 text-center text-white">
          <motion.div className="hero-tag mb-10 flex items-center justify-center gap-4">
            <div className="w-12 h-[1px] bg-luxury-gold"></div>
            <span className="text-[11px] font-bold uppercase tracking-[0.6em] text-luxury-goldLight">Vision Haven AI</span>
            <div className="w-12 h-[1px] bg-luxury-gold"></div>
          </motion.div>
          
          <h1 className="hero-title text-[9vw] font-serif leading-[0.95] mb-12 flex flex-col items-center">
            <div className="overflow-hidden"><span className="inline-block">Envisioning</span></div>
            <div className="overflow-hidden"><span className="inline-block italic text-luxury-goldLight opacity-90">Your Dream</span></div>
            <div className="overflow-hidden"><span className="inline-block">Spaces</span></div>
          </h1>

          <div className="hero-btn flex flex-col sm:flex-row items-center justify-center gap-10">
            <Link to="/design" className="group relative px-16 py-7 bg-white text-luxury-charcoal text-[11px] uppercase tracking-[0.4em] font-bold rounded-full overflow-hidden transition-all duration-700 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)] active:scale-95">
              <span className="relative z-10 flex items-center gap-4">
                Initialize Studio
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            <div className="flex gap-8 items-center">
               <Link to="/gallery" className="text-white/60 text-[11px] uppercase tracking-[0.5em] font-bold hover:text-white transition-colors border-b border-white/20 pb-1 hover:border-white">
                 The Collection
               </Link>
               <span className="text-white/20">|</span>
               <Link to="/login" className="text-luxury-goldLight/80 text-[11px] uppercase tracking-[0.5em] font-bold hover:text-white transition-colors group flex items-center gap-2">
                 Member Access
                 <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full group-hover:animate-ping"></div>
               </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
           <span className="text-[8px] uppercase tracking-[0.6em] text-white/30 vertical-text">Scroll to Explore</span>
           <div className="w-[1px] h-16 bg-gradient-to-b from-white/40 to-transparent"></div>
        </div>
      </section>

      {/* Signature Section */}
      <section className="py-48 px-10 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-32 items-center">
          <div className="lg:w-1/2">
            <span className="text-[11px] font-bold text-luxury-gold uppercase tracking-[0.5em] mb-10 block">Signature Philosophy</span>
            <h2 className="text-6xl md:text-7xl font-serif mb-12 leading-[1.1] text-luxury-charcoal">Design with the <br /><span className="italic">Speed of Thought.</span></h2>
            <p className="text-zinc-500 leading-loose text-xl font-light mb-16 max-w-xl">
              By merging neural geometry with the psychology of spatial light, VisionHaven provides a curated path to your home's ultimate architectural form. 
            </p>
            <div className="flex gap-16">
              <div>
                <span className="block text-5xl font-serif text-luxury-gold mb-4">0.8s</span>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Processing Latency</span>
              </div>
              <div className="w-[1px] h-20 bg-zinc-100"></div>
              <div>
                <span className="block text-5xl font-serif text-luxury-gold mb-4">4K</span>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Vision Precision</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="absolute -inset-10 border border-luxury-gold/10 rounded-[60px] pointer-events-none"></div>
             <img 
               src="https://picsum.photos/seed/philosophy-interior/1200/800" 
               alt="Process" 
               className="rounded-[40px] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)]"
               referrerPolicy="no-referrer"
             />
             <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl flex flex-col justify-center border border-white">
                <span className="text-4xl font-serif text-luxury-gold mb-2">99%</span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-400">Match Accuracy</span>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
