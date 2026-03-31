
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <footer className="bg-luxury-charcoal text-white pt-24 pb-12 px-8 lg:px-16 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex flex-col mb-8">
              <span className="text-2xl font-serif font-bold tracking-[0.3em] leading-none mb-2">
                VISION<span className="opacity-50">HAVEN</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.4em] text-luxury-gold font-bold">The Pinnacle of AI Interior Design</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed font-light max-w-xs">
              Redefining the interior design experience through artificial intelligence and luxury visioning. Crafting spaces that resonate with your soul.
            </p>
            <div className="flex gap-4 mt-8">
              {['instagram', 'twitter', 'linkedin'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300">
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-current opacity-70" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-gold mb-8">Navigation</h4>
            <ul className="space-y-4">
              {[
                { name: t('vision_studio'), path: '/design' },
                { name: t('inspiration_gallery'), path: '/gallery' },
                { name: t('the_vault'), path: '/dashboard?tab=wishlist' },
                { name: t('vendor_portal'), path: '/login' },
                { name: t('system_docs'), path: '/docs' }
              ].map(link => (
                <li key={link.name}>
                  <a href={link.path} className="text-zinc-400 hover:text-white text-sm font-light transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-4 h-[1px] bg-luxury-gold transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-gold mb-8">The Newsletter</h4>
            <p className="text-zinc-500 text-sm font-light mb-6 leading-relaxed">
              Subscribe to receive curated design trends and AI restyling insights.
            </p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-luxury-gold transition-colors"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-luxury-gold text-white rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-luxury-charcoal transition-all">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
              &copy; {new Date().getFullYear()} VISIONHAVEN AI. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-4">
              {['en', 'pt', 'es'].map(lng => (
                <button 
                  key={lng}
                  onClick={() => changeLanguage(lng)}
                  className={`text-[8px] uppercase tracking-widest font-bold transition-colors ${i18n.language === lng ? 'text-luxury-gold' : 'text-zinc-700 hover:text-zinc-500'}`}
                >
                  {lng}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-12">
            <a href="#/version-history" className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold hover:text-luxury-gold transition-colors">{t('version_history')}</a>
            <a href="#/privacy" className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold hover:text-luxury-gold transition-colors">{t('privacy_protocol')}</a>
            <a href="#" className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold hover:text-luxury-gold transition-colors">{t('terms_of_vision')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
