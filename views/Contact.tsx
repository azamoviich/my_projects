import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-24 px-4 md:px-10 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Language Switcher with Logo */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-40 mix-blend-difference flex items-center gap-4">
        <motion.img 
          src="/logo.png" 
          alt="Company Logo" 
          className="h-8 w-8 md:h-10 md:w-10 opacity-80 hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        />
        <LanguageSwitcher />
      </div>

      <div className="max-w-4xl w-full mx-auto text-center z-10">
         <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
         >
            <span className="font-mono text-accent text-sm tracking-widest mb-6 block">{t.contact.label}</span>
            <h2 className="text-5xl md:text-8xl font-display font-bold mb-8 leading-tight">
               {t.contact.titleLine1} <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{t.contact.titleLine2}</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
               {t.contact.description}
            </p>

            <motion.a 
               href="muhammadamin.nazirov@mail.ru"
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-accent transition-colors group"
            >
               <span>{t.contact.btn}</span>
               <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
         </motion.div>

         <div className="mt-24 flex flex-col md:flex-row justify-center items-center gap-12 text-center md:text-left">
            <div className="space-y-4">
               <h4 className="font-mono text-gray-500 text-xs uppercase tracking-widest">{t.contact.coordinates}</h4>
               <div className="flex items-center justify-center md:justify-start gap-3 text-lg">
                  <MapPin className="text-accent" size={20} />
                  <span>{t.contact.location}</span>
               </div>
               <div className="flex items-center justify-center md:justify-start gap-3 text-lg">
                  <Mail className="text-accent" size={20} />
                  <span>muhammadamin.nazirov@mail.ru</span>
               </div>
            </div>
         </div>
         
         <div className="mt-24 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-gray-600 gap-4">
            <div className="flex items-center gap-3">
               <motion.img 
                 src="/logo.png" 
                 alt="Company Logo" 
                 className="h-6 w-6 opacity-60 hover:opacity-100 transition-opacity"
                 whileHover={{ scale: 1.15 }}
               />
               <p>{t.contact.copyright}</p>
            </div>
            <p>{t.contact.design}</p>
         </div>
      </div>
    </div>
  );
};

export default Contact;
