import React from 'react';
import { motion } from 'framer-motion';
import { Github, Instagram, Twitter, Music2 } from 'lucide-react';
import { SOCIALS } from '../constants';

// Custom Telegram Icon Component
const TelegramIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const SocialSidebar: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'GitHub': return <Github size={20} />;
      case 'Telegram': return <TelegramIcon size={20} />;
      case 'Instagram': return <Instagram size={20} />;
      case 'Twitter': return <Twitter size={20} />;
      case 'Spotify': return <Music2 size={20} />;
      default: return <Github size={20} />;
    }
  };

  return (
    <>
      {/* Desktop Sidebar (Left) */}
      <div className="fixed left-6 bottom-0 z-50 hidden md:flex flex-col items-center gap-6 mix-blend-difference">
        <div className="flex flex-col gap-6">
          {SOCIALS.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + (index * 0.1) }}
              whileHover={{ y: -3, color: '#00f0ff' }}
              className="text-white hover:text-accent transition-colors p-2"
              aria-label={social.name}
            >
              {getIcon(social.name)}
            </motion.a>
          ))}
        </div>
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: 100 }}
          transition={{ delay: 2, duration: 1 }}
          className="w-px bg-white/50" 
        />
      </div>

      {/* Mobile Bottom Bar (Centered) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex md:hidden gap-6 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
        {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-accent transition-colors"
            >
              {getIcon(social.name)}
            </a>
          ))}
      </div>
    </>
  );
};

export default SocialSidebar;