
import React, { useState } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

const motion = motionBase as any;

const leads = [
  { id: '1', userName: 'John Samuel', userEmail: 'john.s@example.com', roomType: 'Living Room', status: 'new', interest: 'Satin Marble Texture', timestamp: '2h ago' },
  { id: '2', userName: 'Emma Watson', userEmail: 'emma@watson.co', roomType: 'Master Bedroom', status: 'contacted', interest: 'Premium Silk Paint', timestamp: '5h ago' },
  { id: '3', userName: 'David Miller', userEmail: 'd.miller@gmail.com', roomType: 'Modern Loft', status: 'closed', interest: 'Oak Laminate Sourcing', timestamp: '1d ago' },
];

const VendorDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('leads');

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#111] text-zinc-400">
      <div className="max-w-[1700px] mx-auto px-8 lg:px-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-[1px] bg-luxury-gold"></div>
               <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.5em]">Enterprise Terminal v4.2</span>
            </div>
            <h1 className="text-6xl font-serif text-white leading-none">Vendor <span className="italic text-luxury-gold">Command</span>.</h1>
          </div>
          
          <div className="flex bg-[#222] p-2 rounded-full border border-zinc-800 shadow-2xl">
             <div className="px-10 py-4 flex items-center gap-4 border-r border-zinc-800">
                <span className="text-[10px] uppercase tracking-widest font-bold">Active Leads</span>
                <span className="text-2xl font-serif text-white">42</span>
             </div>
             <div className="px-10 py-4 flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-widest font-bold">Conversion</span>
                <span className="text-2xl font-serif text-luxury-gold">18.5%</span>
             </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
           {/* Navigation */}
           <aside className="lg:col-span-3 space-y-4">
              <nav className="bg-[#1a1a1a] rounded-[40px] border border-zinc-800 shadow-2xl overflow-hidden p-4">
                {[
                  { id: 'leads', label: 'Inbound Leads', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                  { id: 'inventory', label: 'Material Sourcing', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                  { id: 'analytics', label: 'Market Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v10' },
                  { id: 'showcase', label: 'Design Showcase', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                  { id: 'settings', label: 'Account Config', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
                ].map((tab) => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-8 py-5 rounded-3xl flex items-center gap-5 transition-all ${activeTab === tab.id ? 'bg-luxury-gold text-white shadow-2xl' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} /></svg>
                    <span className="text-[10px] uppercase tracking-widest font-bold">{tab.label}</span>
                  </button>
                ))}
              </nav>

              <div className="p-10 bg-[#222] rounded-[40px] border border-zinc-800 text-center">
                 <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-luxury-gold mb-4">Enterprise Support</p>
                 <p className="text-xs font-light text-zinc-500 leading-relaxed italic mb-8">"Your material library has 12% higher engagement than market average."</p>
                 <button className="w-full py-4 bg-zinc-800 text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-luxury-gold transition-colors">Download Report</button>
              </div>
           </aside>

           {/* Content */}
           <main className="lg:col-span-9">
             <AnimatePresence mode="wait">
               {activeTab === 'leads' && (
                 <motion.div key="leads" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                   <div className="bg-[#1a1a1a] rounded-[50px] border border-zinc-800 shadow-2xl overflow-hidden">
                      <div className="px-12 py-8 border-b border-zinc-800 flex justify-between items-center bg-[#222]/50">
                         <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold text-white">Live Lead Manifest</h3>
                         <div className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Real-time Feed</span>
                         </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-black/20 text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold border-b border-zinc-800">
                            <tr>
                              <th className="px-12 py-6">Identity</th>
                              <th className="px-12 py-6">Material Interest</th>
                              <th className="px-12 py-6">Context</th>
                              <th className="px-12 py-6">Status</th>
                              <th className="px-12 py-6 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/50">
                            {leads.map((lead) => (
                              <tr key={lead.id} className="hover:bg-zinc-800/30 transition-colors group">
                                <td className="px-12 py-8">
                                  <p className="text-white font-serif text-lg leading-none mb-1">{lead.userName}</p>
                                  <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">{lead.userEmail}</p>
                                </td>
                                <td className="px-12 py-8">
                                  <p className="text-luxury-gold text-sm font-bold">{lead.interest}</p>
                                  <p className="text-[9px] uppercase tracking-widest text-zinc-600 mt-1">{lead.timestamp}</p>
                                </td>
                                <td className="px-12 py-8 text-xs font-medium text-zinc-500 uppercase tracking-widest">{lead.roomType}</td>
                                <td className="px-12 py-8">
                                  <span className={`px-4 py-1.5 rounded-full text-[8px] uppercase font-bold tracking-widest ${
                                    lead.status === 'new' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                                    lead.status === 'contacted' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-zinc-700/50 text-zinc-400'
                                  }`}>
                                    {lead.status}
                                  </span>
                                </td>
                                <td className="px-12 py-8 text-right">
                                  <button className="px-8 py-3 bg-white text-black rounded-full text-[9px] uppercase tracking-widest font-bold group-hover:bg-luxury-gold group-hover:text-white transition-all">Engage</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                   </div>
                 </motion.div>
               )}

               {activeTab === 'inventory' && (
                  <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid md:grid-cols-2 gap-8">
                     {[
                       { name: 'Belgian Linen Textures', stock: '2,400m', price: '$85/m', img: 'https://picsum.photos/seed/linen-texture/800/600' },
                       { name: 'Brushed Titanium Paneling', stock: '450 units', price: '$420/u', img: 'https://picsum.photos/seed/titanium-panel/800/600' },
                     ].map((item, i) => (
                       <div key={i} className="bg-[#1a1a1a] rounded-[50px] border border-zinc-800 overflow-hidden shadow-2xl group">
                          <div className="aspect-video relative">
                             <img src={item.img} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000" alt={item.name} referrerPolicy="no-referrer" />
                          </div>
                          <div className="p-12 space-y-4">
                             <div className="flex justify-between items-start">
                                <h4 className="text-3xl font-serif text-white">{item.name}</h4>
                                <span className="text-luxury-gold font-bold">{item.price}</span>
                             </div>
                             <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Current Stock: {item.stock}</p>
                             <button className="w-full py-4 border border-zinc-700 rounded-full text-[9px] uppercase tracking-widest font-bold text-zinc-400 hover:border-luxury-gold hover:text-white transition-all mt-4">Edit Specification</button>
                          </div>
                       </div>
                     ))}
                  </motion.div>
               )}

               {activeTab === 'showcase' && (
                  <motion.div key="showcase" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                     <div className="bg-[#1a1a1a] p-12 rounded-[60px] border border-zinc-800 shadow-2xl">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                           <div>
                              <h3 className="text-4xl font-serif text-white mb-2">Visual Impact <span className="italic text-luxury-gold">Studio</span></h3>
                              <p className="text-zinc-500 text-sm">Demonstrate your materials in high-fidelity design scenarios.</p>
                           </div>
                           <button className="px-10 py-4 bg-luxury-gold text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all">Create New Showcase</button>
                        </div>

                        <div className="grid gap-12">
                           <div className="space-y-6">
                              <div className="flex justify-between items-end">
                                 <div>
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold">Featured Case Study</span>
                                    <h4 className="text-2xl font-serif text-white mt-1">Satin Marble Texture in Modern Penthouse</h4>
                                 </div>
                                 <div className="text-right">
                                    <span className="text-2xl font-serif text-white">8.4k</span>
                                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Total Interactions</p>
                                 </div>
                              </div>
                              <BeforeAfterSlider 
                                 before="https://picsum.photos/seed/before-penthouse/1200/800"
                                 after="https://picsum.photos/seed/after-penthouse/1200/800"
                              />
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'analytics' && (
                  <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                     <div className="bg-[#1a1a1a] p-16 rounded-[60px] border border-zinc-800 shadow-2xl">
                        <h3 className="text-4xl font-serif text-white mb-12">Performance Forecast</h3>
                        <div className="grid md:grid-cols-3 gap-12">
                           <div className="space-y-4">
                              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Impression Rate</p>
                              <p className="text-5xl font-serif text-white">+24%</p>
                              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                 <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} className="h-full bg-luxury-gold"></motion.div>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Design Mapping</p>
                              <p className="text-5xl font-serif text-white">2.8k</p>
                              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                 <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-luxury-gold"></motion.div>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Revenue Pipeline</p>
                              <p className="text-5xl font-serif text-luxury-gold">$1.4M</p>
                              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                 <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-luxury-gold"></motion.div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}
             </AnimatePresence>
           </main>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardPage;
