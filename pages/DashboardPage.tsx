
import React, { useEffect, useState } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import * as ReactRouterDom from 'react-router-dom';
import { authService } from '../services/authService';

const motion = motionBase as any;
const { useNavigate, useLocation } = ReactRouterDom as any;

const DashboardPage: React.FC = () => {
  const [userSession, setUserSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('studio');
  const [projects, setProjects] = useState<any[]>([]);
  const [vault, setVault] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [procurement, setProcurement] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    preferences: 'Luxury Modern'
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [location]);

  useEffect(() => {
    const stored = localStorage.getItem('visionhaven_session');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        setUserSession(session);
        setProfileForm({ name: session.name, preferences: 'Luxury Modern' });
        
        const projectsKey = `vh_projects_${session.id}`;
        try {
          const savedProjects = JSON.parse(localStorage.getItem(projectsKey) || '[]');
          setProjects(savedProjects.length > 0 ? savedProjects : [{ id: '1', title: 'Welcome Visualization', date: 'Initial', img: 'https://picsum.photos/seed/welcome-viz/800/600' }]);
        } catch (e) {
          console.error("Failed to parse projects:", e);
          setProjects([{ id: '1', title: 'Welcome Visualization', date: 'Initial', img: 'https://picsum.photos/seed/welcome-viz/800/600' }]);
        }

        const vaultKey = `vh_vault_${session.id}`;
        try {
          const savedVault = JSON.parse(localStorage.getItem(vaultKey) || '[]');
          setVault(savedVault);
        } catch (e) {
          console.error("Failed to parse vault:", e);
          setVault([]);
        }

        // Mock History
        setHistory([
          { id: 'h1', event: 'Neural Scan Initiated', type: 'System', date: '2 hours ago' },
          { id: 'h2', event: 'Texture Set "Ruby Deep" Applied', type: 'Design', date: 'Yesterday' },
          { id: 'h3', event: 'Project "Penthouse" Archived', type: 'Archive', date: '3 days ago' },
        ]);

        // Mock Procurement
        setProcurement([
          { id: 'p1', name: 'Italian Arabescato Marble', price: '$240/sqm', vendor: 'Carrara Elite' },
          { id: 'p2', name: 'Brushed Brass Fixtures', price: '$1,200', vendor: 'Aureum Fittings' },
        ]);
      } catch (e) {
        console.error("Failed to parse session:", e);
        localStorage.removeItem('visionhaven_session');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updated = await authService.updateUser(userSession.id, { name: profileForm.name });
      const newSession = { ...userSession, name: updated.name };
      localStorage.setItem('visionhaven_session', JSON.stringify(newSession));
      setUserSession(newSession);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateAvatar = async () => {
    setIsUpdating(true);
    const newSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`;
    try {
      const updated = await authService.updateUser(userSession.id, { avatarUrl: newAvatar });
      const newSession = { ...userSession, avatarUrl: updated.avatarUrl };
      localStorage.setItem('visionhaven_session', JSON.stringify(newSession));
      setUserSession(newSession);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const removeFromVault = (id: string) => {
    const vaultKey = `vh_vault_${userSession.id}`;
    const newVault = vault.filter(item => item.id !== id);
    localStorage.setItem(vaultKey, JSON.stringify(newVault));
    setVault(newVault);
  };

  if (!userSession) return null;

  const tabs = [
    { id: 'studio', label: 'My Vision Studio', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'wishlist', label: 'The Vault', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { id: 'history', label: 'Neural History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'procurement', label: 'Procurement', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { id: 'settings', label: 'Studio Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-8 lg:px-16 pt-32 pb-24 min-h-screen bg-[#FDFBF7]">
      <div className="grid lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 bg-white rounded-[50px] border border-zinc-100 shadow-xl shadow-black/5 mb-8 text-center"
          >
            <div className="relative inline-block mb-6">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-luxury-cream shadow-inner mx-auto group">
                <img 
                  src={userSession.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userSession.name}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button 
                onClick={handleUpdateAvatar}
                className="absolute bottom-0 right-0 w-10 h-10 bg-luxury-gold text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:scale-110 transition-transform"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
            <h3 className="font-serif text-3xl text-luxury-charcoal mb-2">{userSession.name}</h3>
            <div className="inline-block px-5 py-2 bg-luxury-gold/10 rounded-full border border-luxury-gold/20">
              <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold">{userSession.role} curator</p>
            </div>
          </motion.div>

          <nav className="space-y-3">
            {tabs.map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-8 py-5 rounded-3xl flex items-center gap-5 transition-all ${activeTab === tab.id ? 'bg-luxury-charcoal text-white shadow-2xl scale-[1.02]' : 'bg-white/50 text-zinc-500 hover:bg-white hover:text-luxury-charcoal border border-transparent hover:border-zinc-100'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} /></svg>
                <span className="text-[10px] uppercase tracking-widest font-bold">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'studio' && (
              <motion.div key="studio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                <header className="flex justify-between items-end">
                   <div>
                      <h2 className="text-5xl font-serif text-luxury-charcoal">Curated Studio</h2>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold mt-2">Personal Architectural Archive</p>
                   </div>
                   <button onClick={() => navigate('/design')} className="px-10 py-4 bg-luxury-gold text-white rounded-full text-[10px] uppercase tracking-widest font-bold shadow-xl hover:bg-luxury-charcoal transition-colors">Generate New Vision</button>
                </header>
                
                <div className="grid md:grid-cols-2 gap-10">
                  {projects.map((p) => (
                    <motion.div key={p.id} whileHover={{ y: -10 }} className="bg-white rounded-[50px] border border-zinc-100 overflow-hidden shadow-xl group">
                       <div className="aspect-video relative overflow-hidden">
                          <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={p.title} referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button className="px-8 py-3 bg-white text-luxury-charcoal rounded-full text-[10px] uppercase tracking-widest font-bold">Launch Workbench</button>
                          </div>
                       </div>
                       <div className="p-10">
                          <h4 className="text-2xl font-serif text-luxury-charcoal mb-2">{p.title}</h4>
                          <span className="text-[9px] uppercase tracking-widest text-zinc-300 font-bold">{p.date}</span>
                       </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                <header>
                   <h2 className="text-5xl font-serif text-luxury-charcoal">The Vault</h2>
                   <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold mt-2">Personal Design Wishlist & Favorites</p>
                </header>
                
                {vault.length === 0 ? (
                  <div className="bg-white p-20 rounded-[50px] border border-dashed border-zinc-200 text-center">
                    <svg className="w-20 h-20 text-zinc-100 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <p className="text-zinc-400 uppercase tracking-widest text-xs">Your vault is currently empty.</p>
                    <button onClick={() => navigate('/design')} className="mt-8 text-luxury-gold uppercase tracking-widest text-[10px] font-bold hover:underline">Start designing to save visions</button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-10">
                    {vault.map((item) => (
                      <motion.div key={item.id} whileHover={{ scale: 1.02 }} className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-xl group relative">
                         <div className="aspect-square relative overflow-hidden">
                            <img src={item.img} className="w-full h-full object-cover" alt={item.title} referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                               <button 
                                  onClick={() => removeFromVault(item.id)}
                                  className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-xl"
                               >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                               </button>
                               <span className="text-white text-[9px] uppercase tracking-widest font-bold">Remove from Vault</span>
                            </div>
                         </div>
                         <div className="p-8">
                            <div className="flex justify-between items-start mb-2">
                               <span className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.3em]">{item.category}</span>
                            </div>
                            <h3 className="text-2xl font-serif text-luxury-charcoal">{item.title}</h3>
                            <p className="text-[9px] uppercase tracking-widest text-zinc-300 font-bold mt-2">{new Date(item.timestamp).toLocaleDateString()}</p>
                         </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                 <h2 className="text-5xl font-serif text-luxury-charcoal">Neural Logs</h2>
                 <div className="bg-white rounded-[50px] border border-zinc-100 shadow-xl overflow-hidden divide-y divide-zinc-50">
                    {history.map((h) => (
                      <div key={h.id} className="p-10 flex items-center justify-between group hover:bg-zinc-50 transition-colors">
                         <div className="flex gap-6 items-center">
                            <div className="w-12 h-12 bg-luxury-cream rounded-2xl flex items-center justify-center text-luxury-gold">
                               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                               <p className="text-lg font-serif text-luxury-charcoal">{h.event}</p>
                               <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-300">{h.type}</span>
                            </div>
                         </div>
                         <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">{h.date}</span>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}

            {activeTab === 'procurement' && (
              <motion.div key="procurement" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                 <h2 className="text-5xl font-serif text-luxury-charcoal">Material Requests</h2>
                 <div className="grid gap-6">
                    {procurement.map((item) => (
                      <div key={item.id} className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-lg flex items-center justify-between group">
                         <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold mb-2">{item.vendor}</p>
                            <h4 className="text-2xl font-serif text-luxury-charcoal">{item.name}</h4>
                         </div>
                         <div className="text-right flex items-center gap-10">
                            <div>
                               <p className="text-[9px] uppercase tracking-widest font-bold text-zinc-300">Est. Valuation</p>
                               <p className="text-2xl font-serif text-luxury-charcoal">{item.price}</p>
                            </div>
                            <button className="px-8 py-3 border border-luxury-charcoal rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-luxury-charcoal hover:text-white transition-all">Connect Vendor</button>
                         </div>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                 <h2 className="text-5xl font-serif text-luxury-charcoal">Studio Profile</h2>
                 
                 <form onSubmit={handleUpdateProfile} className="bg-white p-12 rounded-[50px] border border-zinc-100 shadow-2xl space-y-10">
                    <div className="grid md:grid-cols-2 gap-12">
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 block ml-4">Curator Name</label>
                          <input 
                            type="text" 
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                            className="w-full bg-zinc-50 border-b-2 border-zinc-100 px-8 py-5 text-xl font-serif outline-none focus:border-luxury-gold focus:bg-white transition-all rounded-t-3xl"
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 block ml-4">Design Preference</label>
                          <select className="w-full bg-zinc-50 border-b-2 border-zinc-100 px-8 py-5 text-xl font-serif outline-none focus:border-luxury-gold focus:bg-white transition-all rounded-t-3xl">
                             <option>Luxury Modern</option>
                             <option>Japandi Zen</option>
                             <option>Industrial Heritage</option>
                             <option>Nordic Minimalism</option>
                          </select>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                       <AnimatePresence>
                         {updateSuccess && (
                           <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-green-600 text-[10px] uppercase font-bold tracking-widest">Profile Synchronized Successfully</motion.p>
                         )}
                       </AnimatePresence>
                       <button 
                        type="submit" 
                        disabled={isUpdating}
                        className="px-14 py-5 bg-luxury-charcoal text-white rounded-full text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gold transition-all shadow-xl disabled:bg-zinc-300"
                       >
                         {isUpdating ? 'Synchronizing...' : 'Update Protocol'}
                       </button>
                    </div>
                 </form>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
