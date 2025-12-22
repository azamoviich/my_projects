import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Terminal } from 'lucide-react';
import { Language } from '../types';

interface LanguageSplashProps {
  onSelect: (lang: Language) => void;
}

const LanguageSplash: React.FC<LanguageSplashProps> = ({ onSelect }) => {
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleSecret = () => {
    setShowEasterEgg(true);
    setTimeout(() => {
      onSelect('en'); // Default to English after the joke
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-void/90 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-lg p-8 text-center">
        
        {/* Animated Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />

        <AnimatePresence mode="wait">
          {showEasterEgg ? (
            <motion.div
              key="easter-egg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="font-mono text-accent"
            >
              <Terminal size={48} className="mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl">Nice try, developer 😏</h3>
              <p className="text-sm mt-2 text-gray-400">Loading standard interface...</p>
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-display font-bold tracking-widest mb-12 text-white/80">
                SELECT INTERFACE LANGUAGE
              </h2>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => onSelect('uz')}
                  className="group relative px-8 py-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-all overflow-hidden"
                >
                  <span className="relative z-10 font-mono text-lg group-hover:tracking-widest transition-all duration-300">
                    O‘ZBEK
                  </span>
                  <div className="absolute inset-0 bg-accent/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                </button>

                <button
                  onClick={() => onSelect('en')}
                  className="group relative px-8 py-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-all overflow-hidden"
                >
                  <span className="relative z-10 font-mono text-lg group-hover:tracking-widest transition-all duration-300">
                    ENGLISH
                  </span>
                  <div className="absolute inset-0 bg-accent/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                </button>

                <button
                  onClick={() => onSelect('ru')}
                  className="group relative px-8 py-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-all overflow-hidden"
                >
                  <span className="relative z-10 font-mono text-lg group-hover:tracking-widest transition-all duration-300">
                    РУССКИЙ
                  </span>
                  <div className="absolute inset-0 bg-accent/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                </button>

                {/* Secret Option */}
                <button
                  onClick={handleSecret}
                  className="mt-8 text-xs font-mono text-gray-600 hover:text-accent transition-colors flex items-center justify-center gap-2 opacity-50 hover:opacity-100"
                >
                  <Code2 size={12} />
                  <span>JavaScript</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LanguageSplash;