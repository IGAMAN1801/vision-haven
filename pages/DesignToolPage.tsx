
import React, { useState, useRef, useEffect } from 'react';
// Fix: Use any for motion to bypass property existence errors (initial, animate, etc)
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { analyzeRoomImage, generateDesignVisual, restyleRoomImage } from '../services/geminiService';
import { RoomAnalysis } from '../types';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import ColorHarmonyPanel from '../components/ColorHarmonyPanel';
// Fix: Use namespace import for react-router-dom to bypass type errors
import * as ReactRouterDom from 'react-router-dom';

const motion = motionBase as any;
const { useNavigate } = ReactRouterDom as any;

const COLOR_COLLECTIONS = {
  Spectral: [
    { id: 'red-deep', name: 'Ruby Deep', color: '#7B001C', prompt: 'deep ruby red velvet, mahogany wood, dark luxury' },
    { id: 'red-bright', name: 'Scarlet Glow', color: '#FF2400', prompt: 'vibrant scarlet red, white minimalist accents' },
    { id: 'orange-warm', name: 'Burnt Amber', color: '#FF7E00', prompt: 'warm burnt amber, terracotta textures, autumn glow' },
    { id: 'orange-soft', name: 'Apricot Silk', color: '#FBCEB1', prompt: 'soft apricot silk, light linen, warm morning glow' },
    { id: 'yellow-gold', name: 'Saffron Gold', color: '#F4C430', prompt: 'rich saffron yellow, gold leaf accents, sun-drenched' },
    { id: 'yellow-pale', name: 'Lemon Chiffon', color: '#FFFACD', prompt: 'pale lemon chiffon, airy white curtains, soft light' },
    { id: 'green-emerald', name: 'Emerald Isle', color: '#008577', prompt: 'deep emerald green, brass accents, dark marble' },
    { id: 'green-lime', name: 'Citrus Moss', color: '#85BB65', prompt: 'bright lime citrus green, light oak, biophilic' },
    { id: 'teal-deep', name: 'Aegean Teal', color: '#008080', prompt: 'rich aegean teal, dark wood, sophisticated' },
    { id: 'blue-navy', name: 'Midnight Navy', color: '#000080', prompt: 'midnight navy, silver trim, moody luxury' },
    { id: 'blue-sky', name: 'Cerulean Sky', color: '#007BA7', prompt: 'cerulean sky blue, white linen, coastal airy' },
    { id: 'purple-royal', name: 'Imperial Plum', color: '#66023C', prompt: 'imperial plum purple, gold accents, velvet' },
    { id: 'purple-soft', name: 'Lavender Mist', color: '#E6E6FA', prompt: 'soft lavender mist, white marble, ethereal' },
    { id: 'pink-blush', name: 'Blush Rose', color: '#FFB7C5', prompt: 'soft blush rose, gold metal, elegant soft' },
    { id: 'pink-hot', name: 'Magenta Pop', color: '#FF00FF', prompt: 'vibrant magenta, modern pop-art interior' },
  ],
  Pastel: [
    { id: 'p-mint', name: 'Mint Cream', color: '#F5FFFA', prompt: 'ultra-soft mint cream, white ash wood, peaceful' },
    { id: 'p-lavender', name: 'Periwinkle', color: '#CCCCFF', prompt: 'soft periwinkle pastel, silver accents, calm' },
    { id: 'p-peach', name: 'Peach Fuzz', color: '#FFBE98', prompt: 'warm peach fuzz, light textures, soft morning' },
    { id: 'p-blue', name: 'Powder Blue', color: '#B0E0E6', prompt: 'powder blue pastel, white trim, coastal' },
    { id: 'p-pink', name: 'Sakura Pink', color: '#FFD1DC', prompt: 'soft sakura pink, light oak, zen' },
    { id: 'p-yellow', name: 'Straw Silk', color: '#E4D96F', prompt: 'straw yellow pastel, natural linen, farmhouse' },
  ],
  Earthy: [
    { id: 'e-terracotta', name: 'Clay Earth', color: '#A45A52', prompt: 'rustic clay terracotta, woven textures, natural' },
    { id: 'e-moss', name: 'Forest Moss', color: '#4F5D2F', prompt: 'deep forest moss green, rough stone, organic' },
    { id: 'e-sand', name: 'Dune Sand', color: '#D2B48C', prompt: 'soft dune sand beige, limestone, desert luxury' },
    { id: 'e-slate', name: 'Storm Slate', color: '#2F4F4F', prompt: 'dark storm slate gray, industrial steel, moody' },
    { id: 'e-bark', name: 'Deep Bark', color: '#3D2B1F', prompt: 'dark bark wood, leather accents, library feel' },
  ],
  Metallic: [
    { id: 'm-gold', name: '24K Gold', color: '#D4AF37', prompt: 'shimmering 24k gold leaf, black velvet, palatial' },
    { id: 'm-silver', name: 'Liquid Silver', color: '#C0C0C0', prompt: 'brushed liquid silver, smoked glass, futuristic' },
    { id: 'm-copper', name: 'Raw Copper', color: '#B87333', prompt: 'warm raw copper, turquoise accents, industrial luxe' },
    { id: 'm-bronze', name: 'Aged Bronze', color: '#CD7F32', prompt: 'aged bronze patina, dark wood, classic heritage' },
    { id: 'm-platinum', name: 'Platinum Lustre', color: '#E5E4E2', prompt: 'platinum lustre metal, white marble, ultra-modern' },
  ],
  Luxury: [
    { id: '1', name: 'Alabaster Silk', color: '#F4F1EA', prompt: 'minimalist white silk walls, light oak flooring, airy atmosphere' },
    { id: '2', name: 'Midnight Velvet', color: '#1A1D23', prompt: 'deep navy velvet textures, dark walnut accents, moody high-end lighting' },
    { id: '3', name: 'Emerald Noir', color: '#1B3022', prompt: 'forest green textured walls, brass metal accents, dark marble surfaces' },
    { id: '5', name: 'Concrete Chic', color: '#8E8E8E', prompt: 'brutalist polished concrete, raw steel details, minimalist gray tones' },
    { id: '7', name: 'Obsidian Glass', color: '#0A0A0A', prompt: 'high-gloss black panels, smoked glass, chrome highlights, sharp modern lines' },
  ]
};

const ATMOSPHERIC_PRESETS = [
  { id: 'golden', name: 'Golden Hour', desc: 'Warm, low-angle sunlight', intensity: 80 },
  { id: 'studio', name: 'Studio Cool', desc: 'Even, neutral high-key light', intensity: 100 },
  { id: 'noir', name: 'Nordic Noir', desc: 'Moody, high-contrast shadows', intensity: 40 },
  { id: 'mist', name: 'Ethereal Mist', desc: 'Soft, diffused morning glow', intensity: 60 },
];

const TEXTURE_PROFILES = [
  { id: 'matte', name: 'Soft Matte', desc: 'Zero reflection, velvet finish' },
  { id: 'gloss', name: 'High Gloss', desc: 'Mirror-like reflections' },
  { id: 'rough', name: 'Raw Organic', desc: 'Heavy tactile grain and stone' },
  { id: 'silk', name: 'Liquid Silk', desc: 'Subtle sheen, luxury fabric' },
];

const DesignToolPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRestyling, setIsRestyling] = useState(false);
  const [isSavedInVault, setIsSavedInVault] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<RoomAnalysis | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'vision' | 'color' | 'materials'>('vision');
  const [activeSwatch, setActiveSwatch] = useState<string | null>(null);
  const [activeCollection, setActiveCollection] = useState<keyof typeof COLOR_COLLECTIONS>('Spectral');
  const [activeTexture, setActiveTexture] = useState('matte');
  const [error, setError] = useState<string | null>(null);
  const [activeAtmosphere, setActiveAtmosphere] = useState('studio');
  
  const [climate, setClimate] = useState('Coastal');
  const [style, setStyle] = useState('Japandi');
  const [preferences, setPreferences] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
        setAfterImage(null);
        setActiveSwatch(null);
        setError(null);
        setIsSavedInVault(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const resizeImage = (base64Str: string, maxWidth = 768, maxHeight = 768): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64Str;
      img.onerror = () => reject(new Error("Failed to load image for resizing."));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Could not create canvas context."));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } catch (e) {
          reject(e);
        }
      };
    });
  };

  const processRoom = async () => {
    if (!image) return;
    setIsProcessing(true);
    setError(null);
    setProgress(10);
    setIsSavedInVault(false);
    try {
      const progressInterval = setInterval(() => setProgress(prev => (prev >= 95 ? prev : prev + 5)), 150);
      
      // Resize image before sending to API to avoid Vercel payload limits (4.5MB) and improve stability
      const resizedImage = await resizeImage(image, 512, 512);
      const base64 = resizedImage.split(',')[1];
      
      const result = await analyzeRoomImage(base64, { climate, style, preferences });

      if (!result.isRoomOnly) {
        clearInterval(progressInterval);
        setError("IMAGE INVALID: Neural sensors detected a human or animal presence. Haven Protocol only processes uninhabited architectural environments.");
        setIsProcessing(false);
        setImage(null);
        return;
      }

      setAnalysis(result);
      const atmos = ATMOSPHERIC_PRESETS.find(a => a.id === activeAtmosphere)?.name || 'Studio';
      const tex = TEXTURE_PROFILES.find(t => t.id === activeTexture)?.name || 'Matte';
      const visionPrompt = `${style} style, ${atmos} lighting, ${tex} finishes.`;
      const after = await restyleRoomImage(base64, visionPrompt);
      setAfterImage(after);
      
      clearInterval(progressInterval);
      setProgress(100);
      saveProjectToDashboard(result, after);
      setTimeout(() => setIsProcessing(false), 1000);
    } catch (err: any) {
      setError(err.message || "Neural analysis failed. Verify image clarity.");
      setIsProcessing(false);
    }
  };

  const handleRestyle = async (swatch: any) => {
    if (!image || isRestyling) return;
    setActiveSwatch(swatch.id);
    setIsRestyling(true);
    setIsSavedInVault(false);
    try {
      // Resize image before sending to API to avoid Vercel payload limits and improve stability
      const resizedImage = await resizeImage(image, 512, 512);
      const base64 = resizedImage.split(',')[1];
      
      const atmos = ATMOSPHERIC_PRESETS.find(a => a.id === activeAtmosphere)?.name || 'Studio';
      const tex = TEXTURE_PROFILES.find(t => t.id === activeTexture)?.name || 'Matte';
      const restyled = await restyleRoomImage(base64, `${swatch.prompt}, ${tex} finish, under ${atmos} lighting conditions.`);
      setAfterImage(restyled);
    } catch (err) {
      console.error(err);
      setError("Style synthesis failed. Please try another swatch.");
    } finally {
      setIsRestyling(false);
    }
  };

  const saveProjectToDashboard = (result: RoomAnalysis, afterImg: string | null) => {
    try {
      const sessionStr = localStorage.getItem('visionhaven_session');
      if (!sessionStr) return;
      const session = JSON.parse(sessionStr);
      const projectsKey = `vh_projects_${session.id}`;
      const existing = JSON.parse(localStorage.getItem(projectsKey) || '[]');
      const newProject = {
        id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
        title: `${style} ${result.roomType}`,
        date: new Date().toLocaleDateString(),
        img: afterImg || image,
        analysis: result
      };
      localStorage.setItem(projectsKey, JSON.stringify([newProject, ...existing]));
    } catch (e) {
      console.error("Failed to save project to dashboard:", e);
    }
  };

  const toggleVaultSave = () => {
    console.log("Attempting to save to vault...");
    try {
      const sessionStr = localStorage.getItem('visionhaven_session');
      if (!sessionStr) {
        console.warn("No active session found, redirecting to login.");
        navigate('/login');
        return;
      }
      
      if (!afterImage) {
        console.warn("No generated image to save.");
        return;
      }

      if (isSavedInVault) {
        console.log("Already saved in vault.");
        return;
      }

      const session = JSON.parse(sessionStr);
      const vaultKey = `vh_vault_${session.id}`;
      const existingVault = JSON.parse(localStorage.getItem(vaultKey) || '[]');
      
      const newFavorite = {
        id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
        title: `${style} Synthesis`,
        category: analysis?.roomType || 'Unknown Room',
        img: afterImage,
        timestamp: new Date().toISOString(),
        style: style,
        analysis: analysis
      };

      console.log("Saving to vault:", newFavorite);
      localStorage.setItem(vaultKey, JSON.stringify([newFavorite, ...existingVault]));
      setIsSavedInVault(true);
      console.log("Successfully saved to vault.");
    } catch (e) {
      console.error("Failed to save to vault:", e);
    }
  };

  const activeSwatchColor = [...COLOR_COLLECTIONS.Spectral, ...COLOR_COLLECTIONS.Pastel, ...COLOR_COLLECTIONS.Earthy, ...COLOR_COLLECTIONS.Metallic, ...COLOR_COLLECTIONS.Luxury].find(s => s.id === activeSwatch)?.color || '#C5A059';

  return (
    <div className="pt-32 min-h-screen bg-[#FDFBF7] transition-colors duration-1000" style={{ backgroundColor: isRestyling ? `${activeSwatchColor}05` : '#FDFBF7' }}>
      <div className="max-w-[1700px] mx-auto px-10 py-12">
        {/* Upper HUD / Navigation */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[1px] bg-luxury-gold"></div>
              <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.5em]">Vision Core v3.5</span>
            </motion.div>
            <h1 className="text-6xl font-serif text-luxury-charcoal leading-tight">
              Design <span className="italic text-luxury-gold">Workbench</span>.
            </h1>
          </div>
          
          <AnimatePresence>
            {image && !analysis && !isProcessing && !error && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={processRoom}
                className="group relative px-14 py-6 bg-luxury-charcoal text-white rounded-full text-[11px] uppercase tracking-[0.4em] font-bold shadow-2xl overflow-hidden"
              >
                <span className="relative z-10">Generate Neural Preview</span>
                <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </motion.button>
            )}
          </AnimatePresence>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-8 bg-red-50 border-l-8 border-red-600 rounded-3xl flex items-center justify-between shadow-2xl"
          >
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-500/30">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               </div>
               <div>
                 <h4 className="text-red-700 text-lg font-serif font-bold mb-1">Environmental Violation Detected</h4>
                 <p className="text-[11px] uppercase tracking-widest font-bold text-red-600/80 max-w-2xl">{error}</p>
               </div>
            </div>
            <button onClick={() => { setError(null); setImage(null); }} className="px-8 py-3 bg-red-600 text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-red-700 transition-all shadow-lg">Retry Studio Entry</button>
          </motion.div>
        )}

        {/* The Spectral & Design Library - Expanded Color Options */}
        <div className="mb-16 bg-white p-12 rounded-[50px] shadow-xl border border-zinc-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b border-zinc-50 pb-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-3xl bg-luxury-charcoal flex items-center justify-center text-white shadow-xl rotate-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              </div>
              <div>
                <h3 className="text-3xl font-serif text-luxury-charcoal">Spectral Matrix</h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold">Curated Texture & Color Mapping</p>
              </div>
            </div>
            <div className="flex bg-zinc-50 p-2 rounded-full border border-zinc-100 flex-wrap gap-2">
              {Object.keys(COLOR_COLLECTIONS).map((collection) => (
                <button
                  key={collection}
                  onClick={() => setActiveCollection(collection as any)}
                  className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${activeCollection === collection ? 'bg-white shadow-xl text-luxury-gold scale-105' : 'text-zinc-400 hover:text-luxury-charcoal'}`}
                >
                  {collection}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCollection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="contents"
              >
                {COLOR_COLLECTIONS[activeCollection].map((swatch) => (
                  <motion.button
                    key={swatch.id}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRestyle(swatch)}
                    disabled={isRestyling || !analysis}
                    className={`group relative flex flex-col items-center gap-4 p-6 rounded-[40px] border transition-all ${activeSwatch === swatch.id ? 'border-luxury-gold bg-luxury-gold/5 shadow-2xl' : 'border-zinc-100 bg-white hover:shadow-xl hover:border-luxury-gold/30'} ${!analysis ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div 
                      className="w-full aspect-square rounded-[30px] shadow-lg border-2 border-white transition-all group-hover:rotate-2 group-hover:scale-105"
                      style={{ 
                        backgroundColor: swatch.color, 
                        boxShadow: activeSwatch === swatch.id ? `0 20px 40px -10px ${swatch.color}90` : `0 10px 20px ${swatch.color}20` 
                      }}
                    />
                    <div className="text-center overflow-hidden w-full">
                      <p className="text-[9px] uppercase tracking-widest font-bold text-luxury-charcoal truncate px-1">{swatch.name}</p>
                      <AnimatePresence>
                        {activeSwatch === swatch.id && isRestyling && (
                          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="mt-2 flex justify-center">
                            <div className="w-4 h-4 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Main Visualizer Area */}
          <div className="lg:col-span-8">
            <div className="relative aspect-video rounded-[60px] overflow-hidden bg-white shadow-[0_60px_120px_-20px_rgba(0,0,0,0.2)] border border-white group">
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 bg-luxury-charcoal/95 backdrop-blur-2xl flex flex-col items-center justify-center p-12">
                    <div className="w-40 h-40 relative mb-12">
                      <div className="absolute inset-0 border-8 border-luxury-gold/10 rounded-full"></div>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-8 border-luxury-gold border-t-transparent rounded-full shadow-[0_0_30px_rgba(197,160,89,0.5)]"
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-serif">{progress}%</div>
                    </div>
                    <h3 className="text-white text-5xl font-serif mb-4 tracking-wide">Synthesizing Vision</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse"></div>
                      <p className="text-luxury-gold text-[11px] uppercase tracking-[0.5em] font-bold">Spatial Analysis Active</p>
                    </div>
                  </motion.div>
                ) : analysis && afterImage ? (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full relative">
                    <BeforeAfterSlider before={image!} after={afterImage} />
                    
                    {/* Add to Favorites/Vault Button */}
                    <div className="absolute bottom-12 right-12 z-50 flex items-center gap-6">
                       <motion.button 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVaultSave();
                        }}
                        className={`p-6 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl border transition-all flex items-center gap-4 pointer-events-auto ${isSavedInVault ? 'bg-luxury-gold border-luxury-gold text-white' : 'bg-white/20 border-white/40 text-white hover:bg-white hover:text-luxury-charcoal'}`}
                       >
                         {isSavedInVault ? (
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                         ) : (
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                         )}
                         <span className="text-[11px] uppercase tracking-[0.2em] font-bold">{isSavedInVault ? 'Added to Vault' : 'Add to Vault'}</span>
                       </motion.button>
                    </div>

                    {isRestyling && (
                       <div className="absolute inset-0 z-40 bg-black/30 backdrop-blur-[6px] flex flex-col items-center justify-center">
                          <div className="bg-white/95 px-12 py-8 rounded-[40px] shadow-[0_40px_100px_-10px_rgba(0,0,0,0.4)] flex flex-col items-center gap-6 border border-white/50">
                             <div className="w-12 h-12 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
                             <div className="text-center">
                                <span className="text-[12px] uppercase tracking-[0.4em] font-bold text-luxury-charcoal block">Neural Texture Mapping</span>
                                <span className="text-[9px] uppercase tracking-widest text-zinc-400 mt-2 block italic">Recalculating atmospheric bounce...</span>
                             </div>
                          </div>
                       </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center p-16">
                    {image ? (
                      <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-2xl">
                        <img src={image} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}></div>
                      </div>
                    ) : (
                      <div className="text-center w-full max-w-lg">
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="flex flex-col items-center gap-14"
                        >
                          <button 
                            onClick={() => fileInputRef.current?.click()} 
                            className="relative w-72 h-72 bg-luxury-cream/30 border-2 border-dashed border-luxury-gold/30 rounded-[80px] flex flex-col items-center justify-center gap-8 group hover:border-luxury-gold hover:bg-white transition-all duration-700 shadow-inner"
                          >
                            <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-luxury-gold transform group-hover:scale-110 group-hover:rotate-12 transition-all">
                              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            </div>
                            <div className="text-center space-y-2">
                              <span className="block text-[12px] uppercase font-bold tracking-[0.4em] text-luxury-charcoal">Initialize Capture</span>
                              <span className="block text-[9px] uppercase tracking-widest text-zinc-400">Drag & Drop or Click to Upload</span>
                            </div>
                          </button>
                        </motion.div>
                        <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*" />
                      </div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-white rounded-[60px] border border-zinc-100 shadow-[0_50px_100px_-15px_rgba(0,0,0,0.15)] overflow-hidden min-h-[700px] flex flex-col">
              {!analysis ? (
                <div className="p-16 space-y-12 flex-grow">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-[1px] bg-luxury-gold"></div>
                      <span className="text-luxury-gold text-[10px] uppercase tracking-[0.6em] font-bold">Project Brief</span>
                    </div>
                    <h3 className="text-4xl font-serif text-luxury-charcoal">Spatial Logic</h3>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="space-y-6">
                      <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-zinc-400 block">Atmospheric Preset</label>
                      <div className="grid grid-cols-2 gap-4">
                        {ATMOSPHERIC_PRESETS.map(atmos => (
                          <button 
                            key={atmos.id} 
                            onClick={() => setActiveAtmosphere(atmos.id)} 
                            className={`group p-6 rounded-[30px] border text-left transition-all ${activeAtmosphere === atmos.id ? 'border-luxury-gold bg-luxury-cream shadow-inner' : 'border-zinc-50 bg-zinc-50/30 hover:border-zinc-200'}`}
                          >
                            <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${activeAtmosphere === atmos.id ? 'text-luxury-gold' : 'text-zinc-500'}`}>{atmos.name}</p>
                            <p className="text-[8px] text-zinc-400 uppercase tracking-widest font-medium opacity-60 group-hover:opacity-100">{atmos.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-zinc-400 block">Texture Profile</label>
                      <div className="grid grid-cols-1 gap-3">
                        {TEXTURE_PROFILES.map(profile => (
                          <button 
                            key={profile.id} 
                            onClick={() => setActiveTexture(profile.id)} 
                            className={`group flex items-center justify-between p-5 rounded-[25px] border transition-all ${activeTexture === profile.id ? 'border-luxury-gold bg-white shadow-lg' : 'border-zinc-50 bg-zinc-50/50 hover:border-zinc-200'}`}
                          >
                            <div>
                               <p className={`text-[10px] uppercase font-bold tracking-widest ${activeTexture === profile.id ? 'text-luxury-gold' : 'text-luxury-charcoal'}`}>{profile.name}</p>
                               <p className="text-[8px] text-zinc-400 uppercase tracking-widest mt-1">{profile.desc}</p>
                            </div>
                            {activeTexture === profile.id && <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-zinc-400 block">Design Language</label>
                      <div className="relative group">
                        <select 
                          value={style} 
                          onChange={(e) => setStyle(e.target.value)} 
                          className="w-full appearance-none py-6 px-10 bg-zinc-50 rounded-[30px] border border-zinc-100 text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-2 ring-luxury-gold/20 transition-all cursor-pointer"
                        >
                          <option>Japandi</option>
                          <option>Brutalist</option>
                          <option>Neo-Classic</option>
                          <option>Mid-Century Modern</option>
                          <option>Minimalist Zen</option>
                          <option>Biophilic Oasis</option>
                          <option>Industrial Loft</option>
                          <option>Garden Oasis</option>
                        </select>
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-luxury-gold group-hover:scale-110 transition-transform">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex p-4 gap-3 bg-zinc-50/50">
                    {['vision', 'color', 'materials'].map(t => (
                      <button 
                        key={t} 
                        onClick={() => setActiveTab(t as any)} 
                        className={`flex-1 py-5 rounded-[25px] text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === t ? 'bg-white shadow-xl text-luxury-gold scale-105' : 'text-zinc-400 hover:text-zinc-600'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="p-14 flex-grow overflow-y-auto scrollbar-hide">
                    <AnimatePresence mode="wait">
                      {activeTab === 'vision' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                          <div className="border-b border-zinc-50 pb-10">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></div>
                              <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Spatial Result</span>
                            </div>
                            <h3 className="text-6xl font-serif text-luxury-charcoal leading-none">{analysis.roomType}</h3>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-300 mt-4 font-bold">Est: {analysis.dimensionsEstimate}</p>
                          </div>
                          <div className="space-y-8">
                            <span className="text-[11px] uppercase text-zinc-400 font-bold tracking-widest block">Neural Observations</span>
                            {analysis.detectedFeatures.map((f, i) => (
                              <motion.div 
                                key={i} 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-6 group"
                              >
                                <div className="w-3 h-3 border border-luxury-gold/30 rounded-full flex items-center justify-center group-hover:bg-luxury-gold transition-colors">
                                  <div className="w-1 h-1 bg-luxury-gold rounded-full group-hover:bg-white"></div>
                                </div>
                                <span className="text-[12px] text-zinc-600 font-medium tracking-wide uppercase group-hover:text-luxury-charcoal transition-colors">{f}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {activeTab === 'color' && <ColorHarmonyPanel dominantColors={analysis.dominantColors} />}
                      {activeTab === 'materials' && (
                        <div className="space-y-8">
                          {analysis.recommendations.map((rec, i) => (
                            <motion.div 
                              key={rec.id} 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              whileHover={{ scale: 1.02 }}
                              className="p-10 bg-zinc-50 rounded-[45px] border border-zinc-100 group transition-all hover:bg-white hover:shadow-2xl"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] text-luxury-gold font-bold uppercase tracking-[0.4em]">{rec.type}</span>
                                <div className="w-4 h-4 rounded-full border border-luxury-gold"></div>
                              </div>
                              <h4 className="font-serif text-3xl mb-4 text-luxury-charcoal">{rec.name}</h4>
                              <p className="text-[12px] text-zinc-500 italic leading-relaxed font-light mb-6">"{rec.reason}"</p>
                              <div className="flex items-center justify-between border-t border-zinc-100 pt-6">
                                <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-300">Tactile Finish</span>
                                <span className="text-[9px] uppercase tracking-widest font-bold text-luxury-charcoal bg-white px-4 py-1.5 rounded-full shadow-sm">{rec.finish}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignToolPage;
