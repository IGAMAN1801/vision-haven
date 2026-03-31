import React from 'react';
import { motion } from 'framer-motion';

const VersionHistoryPage: React.FC = () => {
  const versions = [
    {
      version: "1.0.14",
      date: "26 Jan 2026",
      changes: [
        "Improve performance",
        "Neural Engine optimization for faster processing",
        "Enhanced spatial analysis accuracy"
      ]
    },
    {
      version: "1.0.13",
      date: "11 Oct 2025",
      changes: [
        "Server infrastructure update",
        "Improved API response consistency"
      ]
    },
    {
      version: "1.0.10",
      date: "19 Sep 2025",
      changes: [
        "New AI model to improve design quality",
        "Garden Oasis design style added",
        "Bug fixes and stability improvements"
      ]
    }
  ];

  return (
    <div className="pt-32 min-h-screen bg-[#FDFBF7] px-8 lg:px-16 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-luxury-charcoal mb-12">Version <span className="italic text-luxury-gold">History</span></h1>
        <div className="space-y-12">
          {versions.map((v, i) => (
            <motion.div 
              key={v.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border-b border-zinc-200 pb-8"
            >
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-2xl font-bold text-luxury-charcoal">v{v.version}</h2>
                <span className="text-sm text-zinc-400 font-bold uppercase tracking-widest">{v.date}</span>
              </div>
              <ul className="space-y-2">
                {v.changes.map((change, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-zinc-600">
                    <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full mt-2 flex-shrink-0"></div>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VersionHistoryPage;
