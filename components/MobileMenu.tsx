import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileMenuProps {
  onNavigate: (id: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;