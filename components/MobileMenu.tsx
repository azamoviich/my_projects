import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

interface MobileMenuProps {
  onNavigate: (id: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const toggle = () => setIsOpen(!isOpen);

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  const navItems = [
    { id: 'hero', label: t.nav.hero },
    { id: 'about', label: t.nav.about },
    { id: 'work', label: t.nav.work },
    { id: 'contact', label: t.nav.contact },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'ENGLISH' },
    { code: 'uz', label: "O'ZBEK" },
    { code: 'ru', label: 'РУССКИЙ' },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={toggle}
        className="fixed top-6 right-6 z-50 p-2 text-white mix-blend-difference"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-void flex flex-col items-center justify-center"
          >
            <div className="flex flex-col gap-8 text-center">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => handleNav(item.id)}
                  className="text-4xl font-display font-light text-white hover:text-accent transition-colors"
                >
                  {item.label.split('. ')[1]}
                </motion.button>
              ))}
              
              {/* Language Switcher */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 pt-8 border-t border-white/10 flex gap-4 justify-center"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-4 py-2 text-sm font-mono tracking-widest transition-all ${
                      language === lang.code
                        ? 'text-accent border-b-2 border-accent'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;