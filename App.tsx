import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import StarField from './components/StarField';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import MobileMenu from './components/MobileMenu';
import SocialSidebar from './components/SocialSidebar';
import LanguageSplash from './components/LanguageSplash';
import LanguageSwitcher from './components/LanguageSwitcher';
import Hero from './views/Hero';
import About from './views/About';
import Work from './views/Work';
import Contact from './views/Contact';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

const AppContent = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { language, setLanguage } = useLanguage();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Check if language is already set in localStorage
    const savedLang = localStorage.getItem('app_language');
    if (savedLang) {
      setIsSplashVisible(false);
    }
  }, []);

  const handleLanguageSelect = (lang: any) => {
    setLanguage(lang);
    setIsSplashVisible(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'work', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -window.innerHeight / 3 && rect.top < window.innerHeight / 3;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-void text-white selection:bg-accent selection:text-black min-h-screen relative">
      <AnimatePresence>
        {isSplashVisible && (
          <LanguageSplash onSelect={handleLanguageSelect} />
        )}
      </AnimatePresence>

      <CustomCursor />
      <StarField />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50 mix-blend-difference"
        style={{ scaleX }}
      />

      <Navigation activeSection={activeSection} onNavigate={scrollToSection} />
      <MobileMenu onNavigate={scrollToSection} />
      <SocialSidebar />

      <main className="relative z-10 flex flex-col w-full">
        <section id="hero" className="min-h-screen w-full">
          <Hero />
        </section>
        
        <section id="about" className="min-h-screen w-full">
          <About />
        </section>
        
        <section id="work" className="min-h-screen w-full">
          <Work />
        </section>
        
        <section id="contact" className="min-h-screen w-full">
          <Contact />
        </section>
      </main>

      {/* Language Switcher */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-40 mix-blend-difference">
        <LanguageSwitcher />
      </div>
      <div className="fixed bottom-6 right-6 z-40 mix-blend-difference hidden md:block">
        <span className="font-mono text-xs animate-pulse">SYSTEM: ONLINE</span>
      </div>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;