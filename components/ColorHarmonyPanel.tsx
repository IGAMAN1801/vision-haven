
import React, { useState, useMemo } from 'react';
// Fix: Use any for motion to bypass property existence errors (initial, animate, exit, etc)
import { motion as motionBase, AnimatePresence } from 'framer-motion';

const motion = motionBase as any;

interface ColorHarmonyPanelProps {
  dominantColors: string[];
}

type PaletteType = 'Detected' | 'Complementary' | 'High-Contrast' | 'Warm-Luxury';

const ColorHarmonyPanel: React.FC<ColorHarmonyPanelProps> = ({ dominantColors }) => {
  const [activePalette, setActivePalette] = useState<PaletteType>('Detected');

  // Utility to generate color variations (simulated for front-end logic)
  const generatePalette = useMemo(() => {
    const base = dominantColors[0] || '#C5A059';
    const secondary = dominantColors[1] || '#121212';
    const accent = dominantColors[2] || '#F9F7F2';

    return {
      Detected: [base, secondary, accent],
      Complementary: [base, '#E5D5B7', '#8E6D45'], // Simulated complementary
      'High-Contrast': ['#121212', '#FFFFFF', '#C5A059'],
      'Warm-Luxury': ['#4A3728', '#D4AF37', '#F5F5DC']
    };
  }, [dominantColors]);

  const currentColors = generatePalette[activePalette];
  const foundation = currentColors[0];
  const depth = currentColors[1];
  const highlight = currentColors[2];

  const collaborationRules = [
    { 
      role: 'Foundation (60%)', 
      color: foundation, 
      desc: 'Dominant surface area, providing the architectural canvas.',
      styling: 'Flat Matte or Fine Suede Finish'
    },
    { 
      role: 'Depth (30%)', 
      color: depth, 
      desc: 'Secondary tone for cabinetry, trims, or shadow-facing walls.',
      styling: 'Satin or Soft Eggshell Finish'
    },
    { 
      role: 'Highlight (10%)', 
      color: highlight, 
      desc: 'Strategic accents to draw the eye to architectural features.',
      styling: 'High-Gloss Metallic or Polished Stone'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Palette Selector */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase text-zinc-400 tracking-[0.4em] font-bold block">Harmony Profiles</span>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(generatePalette) as PaletteType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActivePalette(type)}
              className={`py-3 px-4 rounded-2xl border text-[9px] uppercase font-bold tracking-widest transition-all ${
                activePalette === type 
                  ? 'border-luxury-gold bg-luxury-cream text-luxury-gold shadow-sm' 
                  : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Styling Interaction Visualization */}
      <div className="space-y-6">
        <span className="text-[10px] uppercase text-zinc-400 tracking-[0.4em] font-bold block">Live Interaction Matrix</span>
        
        <div className="relative h-72 w-full bg-zinc-50 rounded-[40px] overflow-hidden border border-zinc-100 flex items-center justify-center group">
          {/* Foundation Layer */}
          <motion.div 
            key={`${activePalette}-foundation`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-4 rounded-[32px] shadow-2xl transition-transform duration-700 group-hover:scale-95"
            style={{ backgroundColor: foundation }}
          />
          
          {/* Depth Layer */}
          <motion.div 
            key={`${activePalette}-depth`}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 0.9 }}
            transition={{ delay: 0.2 }}
            className="absolute right-12 w-1/2 h-3/4 rounded-3xl shadow-xl border border-white/20 backdrop-blur-sm transition-transform duration-700 group-hover:translate-x-4"
            style={{ backgroundColor: depth }}
          >
             <div className="absolute top-4 left-4 text-[7px] uppercase tracking-widest text-white/40 font-bold">Contrast Depth</div>
          </motion.div>

          {/* Highlight Accent */}
          <motion.div 
            key={`${activePalette}-highlight`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-8 left-16 w-24 h-24 rounded-full shadow-2xl border-4 border-white z-10 transition-transform duration-700 group-hover:-translate-y-4"
            style={{ backgroundColor: highlight }}
          >
             <div className="absolute inset-0 flex items-center justify-center text-[7px] uppercase tracking-widest text-white font-bold">Accent</div>
          </motion.div>

          {/* UI Annotation */}
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-ping"></div>
            <span className="text-[8px] uppercase tracking-widest font-bold text-zinc-400">Collaborative Preview</span>
          </div>
        </div>
      </div>

      {/* Collaboration Breakdown */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase text-zinc-400 tracking-[0.4em] font-bold block">Palette Logic</span>
        <div className="space-y-3">
          {collaborationRules.map((rule, i) => (
            <motion.div 
              key={`${activePalette}-${rule.role}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="p-5 rounded-3xl bg-white border border-zinc-100 flex items-center gap-5 group hover:border-luxury-gold transition-all"
            >
              <div 
                className="w-14 h-14 rounded-2xl shadow-lg border border-zinc-50 flex-shrink-0 transition-colors duration-500"
                style={{ backgroundColor: rule.color }}
              />
              <div className="flex-grow">
                <div className="flex justify-between items-baseline mb-1">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal">{rule.role}</h5>
                  <span className="text-[8px] uppercase font-bold text-luxury-gold">{rule.styling}</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed">{rule.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Narrative Synthesis */}
      <div className="p-8 rounded-[40px] bg-luxury-charcoal text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-bl-full pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-4 h-4 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/60">AI Design Commentary</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p 
            key={activePalette}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[11px] leading-relaxed font-light italic text-white/80 border-l-2 border-luxury-gold/20 pl-6"
          >
            "By selecting the <span className="text-luxury-gold font-bold">{activePalette}</span> profile, we shift the room's energy. The interaction of the foundation with chosen accents creates a {activePalette === 'Warm-Luxury' ? 'deep, inviting sanctuary' : activePalette === 'High-Contrast' ? 'bold, modern statement' : 'sophisticated spatial dialogue'} that respects your original architecture."
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ColorHarmonyPanel;
