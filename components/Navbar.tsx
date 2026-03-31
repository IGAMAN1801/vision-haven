
import React, { useEffect, useState, useRef } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const motion = motionBase as any;
const { Link, useLocation, useNavigate } = ReactRouterDom as any;

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const checkSession = () => {
      const stored = localStorage.getItem('visionhaven_session');
      if (stored) {
        setUserSession(JSON.parse(stored));
      } else {
        setUserSession(null);
      }
    };

    checkSession();
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('visionhaven_session');
    setUserSession(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl py-4 shadow-xl shadow-black/5' : 'bg-transparent py-8'}`}>
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16 flex justify-between items-center">
        <Link to="/" className="flex flex-col group">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center border ${!scrolled && isHome ? 'border-white/40' : 'border-luxury-charcoal/20'} rounded-lg group-hover:border-luxury-gold transition-colors`}>
               <svg className="w-5 h-5 text-luxury-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9.5L12 3L21 9.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9.5Z" />
                  <path d="M9 21V12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12V21" />
               </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className={`text-2xl font-serif font-bold tracking-[0.3em] transition-colors leading-none ${!scrolled && isHome ? 'text-white' : 'text-luxury-charcoal'}`}>
                VISION<span className="opacity-70">HAVEN</span>
              </span>
              <span className="text-[7px] uppercase tracking-[0.4em] text-luxury-gold font-bold mt-1">Envisioning Your Dream Space</span>
            </div>
          </div>
        </Link>
        
        <div className="hidden md:flex space-x-12 items-center">
          {[
            { name: t('Home'), path: '/' },
            { name: t('inspiration_gallery'), path: '/gallery' },
            { name: t('the_vault'), path: '/dashboard?tab=wishlist' },
            { name: t('Contact'), path: '/contact' }
          ].map((item) => {
            const isActive = location.pathname === item.path || (item.path.includes('tab=wishlist') && location.search.includes('tab=wishlist'));
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`relative text-[10px] uppercase tracking-[0.35em] font-bold transition-all hover:text-luxury-gold ${!scrolled && isHome ? 'text-white/70' : 'text-zinc-500'} ${isActive ? 'text-luxury-gold' : ''}`}
              >
                {item.name}
                {isActive && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-2 left-0 right-0 h-[2px] bg-luxury-gold shadow-[0_0_8px_rgba(197,160,89,0.5)]" 
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-6 relative" ref={menuRef}>
          {userSession ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`w-10 h-10 rounded-full border overflow-hidden flex items-center justify-center transition-all ${!scrolled && isHome ? 'border-white/20 hover:border-white/50' : 'border-zinc-200 hover:border-luxury-gold'}`}
              >
                <img 
                  src={userSession.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userSession.name}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-zinc-100 overflow-hidden py-4 z-50"
                  >
                    <div className="px-6 py-4 border-b border-zinc-50 mb-2">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Authenticated As</p>
                      <p className="text-sm font-serif font-bold text-luxury-charcoal truncate">{userSession.name}</p>
                      <p className="text-[9px] text-luxury-gold font-bold uppercase tracking-widest mt-1">{userSession.role} Protocol</p>
                    </div>
                    
                    <Link 
                      to={userSession.role === 'vendor' ? "/vendor" : "/dashboard"} 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:text-luxury-gold hover:bg-zinc-50 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      {userSession.role === 'vendor' ? 'Command Centre' : 'Studio Dashboard'}
                    </Link>
                    
                    <Link 
                      to="/dashboard?tab=wishlist" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:text-luxury-gold hover:bg-zinc-50 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      The Vault
                    </Link>

                    <Link 
                      to="/report" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:text-luxury-gold hover:bg-zinc-50 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      Report Issue
                    </Link>

                    <div className="h-[1px] bg-zinc-50 my-2 mx-6"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-red-400 hover:bg-red-50 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Revoke Access
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              to="/login"
              className={`text-[10px] uppercase tracking-[0.3em] font-bold ${!scrolled && isHome ? 'text-white' : 'text-luxury-charcoal'} hover:text-luxury-gold transition-colors`}
            >
              Sign In
            </Link>
          )}

          <Link 
             to="/design" 
             className={`hidden sm:block px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-500 shadow-2xl ${!scrolled && isHome ? 'bg-white text-luxury-charcoal hover:bg-luxury-gold hover:text-white' : 'bg-luxury-charcoal text-white hover:bg-luxury-gold shadow-luxury-gold/20'}`}
           >
             {t('start_visioning')}
           </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
