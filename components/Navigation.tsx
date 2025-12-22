import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

interface NavigationProps {
  activeSection: string;
  onNavigate: (id: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const navItems = [
    { id: 'hero', label: t.nav.hero },
    { id: 'about', label: t.nav.about },
    { id: 'work', label: t.nav.work },
    { id: 'contact', label: t.nav.contact },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'uz', label: 'UZ' },
    { code: 'ru', label: 'RU' },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-6 mix-blend-difference">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className="group relative flex items-center justify-end"
          aria-label={`Scroll to ${item.label}`}
        >
          <span 
            className={`mr-4 text-xs font-mono tracking-widest transition-all duration-300 ${
              activeSection === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 group-hover:opacity-50 group-hover:translate-x-0'
            }`}
          >
            {item.label}
          </span>
          <div 
            className={`w-2 h-2 rotate-45 border border-current transition-all duration-300 ${
              activeSection === item.id ? 'bg-white scale-125' : 'bg-transparent scale-100'
            }`} 
          />
        </button>
      ))}
      
      {/* Language Switcher */}
      <div className="relative mt-4">
        <button
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          className="group relative flex items-center justify-end w-full"
          aria-label="Change language"
        >
          <span className="mr-4 text-xs font-mono tracking-widest opacity-0 group-hover:opacity-50 transition-all duration-300">
            {language.toUpperCase()}
          </span>
          <div className="w-2 h-2 rotate-45 border border-current bg-transparent group-hover:bg-white/50 transition-all duration-300" />
        </button>
        
        <AnimatePresence>
          {showLanguageMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 bottom-full mb-2 bg-black/90 backdrop-blur-sm border border-white/10 p-2 rounded"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`block w-full text-left px-4 py-2 text-xs font-mono tracking-widest hover:bg-white/10 transition-colors ${
                    language === lang.code ? 'text-accent' : 'text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;