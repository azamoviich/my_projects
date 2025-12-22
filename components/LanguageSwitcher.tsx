import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'ENGLISH',
  uz: "O'ZBEK",
  ru: 'РУССКИЙ',
};

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = ['en', 'uz', 'ru'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Clickable Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-mono text-xs hover:text-accent transition-colors cursor-pointer flex items-center gap-2 group"
        aria-label="Change language"
      >
        <span className="hidden md:inline">EST. 2025 // </span>
        <span className="font-medium">{language.toUpperCase()}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <ChevronDown size={12} />
        </motion.div>
      </button>

      {/* Dropdown/Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 md:hidden"
            />
            
            {/* Mobile Drawer */}
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Globe size={18} className="text-accent" />
                <h3 className="font-mono text-sm uppercase tracking-wider">Select Language</h3>
              </div>
              <div className="flex flex-col gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`px-4 py-3 rounded-lg border transition-all text-left ${
                      language === lang
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-white/10 bg-white/5 hover:border-accent/50 hover:bg-accent/5'
                    }`}
                  >
                    <span className="font-mono text-sm">{LANGUAGE_NAMES[lang]}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Desktop Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl z-50"
            >
              <div className="p-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`w-full px-4 py-3 rounded-md transition-all text-left flex items-center justify-between group ${
                      language === lang
                        ? 'bg-accent/20 text-accent border border-accent/30'
                        : 'hover:bg-white/5 text-white/80 hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-sm">{LANGUAGE_NAMES[lang]}</span>
                    {language === lang && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-accent"
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;

