import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface NavigationProps {
  activeSection: string;
  onNavigate: (id: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onNavigate }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'hero', label: t.nav.hero },
    { id: 'about', label: t.nav.about },
    { id: 'work', label: t.nav.work },
    { id: 'contact', label: t.nav.contact },
  ];

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
    </nav>
  );
};

export default Navigation;