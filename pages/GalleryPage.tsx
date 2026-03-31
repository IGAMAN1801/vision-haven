
import React from 'react';
// Fix: Use any for motion to bypass property existence errors (initial, whileInView, etc)
import { motion as motionBase } from 'framer-motion';

const motion = motionBase as any;

const inspirations = [
  { id: 7, title: 'Ethereal Minimalism', category: 'Living Room', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000' },
  { id: 9, title: 'Azure Coast Spa', category: 'Bathroom', img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1000' },
  { id: 10, title: 'Sage Modernism', category: 'Guest Suite', img: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1000' },
  { id: 11, title: 'Onyx Terrace', category: 'Outdoor', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1000' },
  { id: 12, title: 'Bohemian Sanctuary', category: 'Living Room', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000' },
];

const GalleryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = React.useState('All');

  const filteredInspirations = inspirations.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Living') return item.category === 'Living Room';
    if (activeFilter === 'Bedroom') return item.category.includes('Bedroom') || item.category === 'Guest Suite';
    if (activeFilter === 'Kitchen') return item.category === 'Kitchen';
    if (activeFilter === 'Bath') return item.category === 'Bathroom';
    return true;
  });

  return (
    <div className="pt-32 pb-24 bg-luxury-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block">The Collection</span>
            <h1 className="text-5xl font-serif text-luxury-charcoal mb-6">Inspiration For The <span className="italic text-luxury-gold">Discerning</span>.</h1>
            <p className="text-zinc-500 font-light leading-relaxed">
              Explore our curated library of AI-enhanced interiors. Every space is a dialogue between form, light, and luxury material science.
            </p>
          </motion.div>
          
          <div className="flex flex-wrap gap-3">
            {['All', 'Living', 'Bedroom', 'Kitchen', 'Bath'].map((filter, i) => (
              <motion.button 
                key={filter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${activeFilter === filter ? 'bg-luxury-charcoal text-white border-luxury-charcoal' : 'bg-white text-zinc-400 border-zinc-200 hover:border-luxury-gold'}`}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredInspirations.map((item, i) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
              className="group relative rounded-[40px] overflow-hidden bg-white shadow-xl border border-zinc-100/50"
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <button className="w-full py-4 bg-white text-luxury-charcoal rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-luxury-gold hover:text-white transition-colors shadow-2xl">
                    Envision This Style
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.3em]">{item.category}</span>
                </div>
                <h3 className="text-2xl font-serif text-luxury-charcoal">{item.title}</h3>
                <div className="mt-6 flex items-center justify-between border-t border-zinc-50 pt-6">
                   <button className="text-luxury-charcoal hover:text-luxury-gold transition-colors ml-auto">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
