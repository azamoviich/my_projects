import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center px-4 md:px-10 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col"
        >
          <h2 className="font-mono text-accent text-sm md:text-base tracking-[0.2em] mb-4 ml-1">
            {t.hero.role}
          </h2>
          
          <h1 className="text-6xl md:text-9xl font-display font-bold leading-none tracking-tighter mix-blend-difference">
            {t.hero.titleLine1}
            <br />
            <span className="outline-text text-transparent stroke-white" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>
              {t.hero.titleLine2}
            </span>
            <br />
            {t.hero.titleLine3}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-8 max-w-lg md:ml-auto"
        >
          <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed">
            {t.hero.description}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">{t.hero.cta}</span>
        <ArrowDown className="animate-bounce w-4 h-4" />
      </motion.div>
    </div>
  );
};

export default Hero;