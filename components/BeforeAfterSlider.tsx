
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after }) => {
  const [sliderPos, setSliderPos] = useState(50);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const container = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = ((clientX - container.left) / container.width) * 100;
    setSliderPos(Math.min(100, Math.max(0, x)));
  };

  return (
    <div 
      className="relative w-full aspect-video rounded-[40px] overflow-hidden cursor-ew-resize select-none border border-white/20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] bg-luxury-charcoal"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* Before Image */}
      <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]" referrerPolicy="no-referrer" />
      
      {/* After Image (Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>

      {/* Centered Logo Overlay (Fades out when moving) */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${sliderPos !== 50 ? 'opacity-20' : 'opacity-100'}`}>
         <div className="w-48 h-48 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4">
               <span className="text-white font-serif text-3xl font-bold">W</span>
            </div>
            <span className="text-white text-[10px] uppercase tracking-[0.4em] font-bold">Vision Haven AI</span>
         </div>
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-white/80 z-20"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/40 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
           <div className="flex gap-1">
             <div className="w-1 h-3 bg-white rounded-full"></div>
             <div className="w-1 h-3 bg-white rounded-full"></div>
           </div>
        </div>
      </div>

      {/* Specific Labels from Image 1 */}
      <div className="absolute top-12 left-12 text-white font-bold text-2xl uppercase tracking-[0.2em] opacity-80 drop-shadow-lg">BEFORE</div>
      <div className="absolute top-12 right-12 text-white font-bold text-2xl uppercase tracking-[0.2em] opacity-80 drop-shadow-lg">AFTER</div>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-full text-white text-[10px] uppercase tracking-[0.3em] font-bold shadow-2xl">
         Envisioning Your Dream Space
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
