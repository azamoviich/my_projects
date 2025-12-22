import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Database, Layers, FileText, Music, ExternalLink } from 'lucide-react';
import { SKILLS, CORE_STACK } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const About: React.FC = () => {
  const [terminalMode, setTerminalMode] = useState(false);
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-20 px-4 md:px-10 bg-black/30 backdrop-blur-sm relative">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start md:items-center">
        
        {/* Left Column: Photo & Core Tech & Music (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start order-1 lg:order-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-64 h-64 md:w-80 md:h-80 mb-10 group"
          >
            {/* Glitch Borders */}
            <div className="absolute inset-0 border-2 border-accent/30 rounded-lg translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300" />
            <div className="absolute inset-0 border-2 border-white/20 rounded-lg -translate-x-2 -translate-y-2 group-hover:-translate-x-3 group-hover:-translate-y-3 transition-transform duration-300" />
            
            {/* Image Container */}
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-900">
               {/* Placeholder for personal photo - using a stylish abstract person or replace with actual URL */}
               <img 
                 src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80" 
                 alt="Portrait" 
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
               />
               
               {/* Overlay Effect */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
            </div>
          </motion.div>

          {/* Tech Stack Pills */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full mb-10"
          >
            <h3 className="font-mono text-xs text-accent tracking-widest uppercase mb-4 text-center lg:text-left">{t.about.coreTech}</h3>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {CORE_STACK.map((tech, idx) => (
                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:border-accent/50 hover:bg-accent/5 transition-colors cursor-default">
                  {idx === 0 && <Code size={14} className="text-accent" />}
                  {idx === 1 && <Layers size={14} className="text-accent" />}
                  {idx === 2 && <Terminal size={14} className="text-accent" />}
                  {idx === 3 && <Database size={14} className="text-accent" />}
                  <span className="text-sm font-display">{tech}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Music Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="w-full flex flex-col items-center lg:items-start gap-4 p-6 border border-white/5 bg-white/5 rounded-xl backdrop-blur-sm hover:border-accent/30 transition-all group"
          >
             <div className="flex items-center gap-3 w-full">
                <div className="p-2 bg-green-500/20 rounded-full text-green-400 group-hover:animate-pulse">
                  <Music size={20} />
                </div>
                <div>
                   <h4 className="font-mono text-xs text-gray-400 uppercase tracking-wider">{t.about.musicTitle}</h4>
                   <p className="text-sm font-medium text-white">{t.about.musicDesc}</p>
                </div>
             </div>
             <a href="https://open.spotify.com" target="_blank" rel="noreferrer" className="text-xs font-mono text-gray-500 hover:text-green-400 flex items-center gap-2 transition-colors">
                <span>{t.about.spotifyPlaylist}</span>
                <ExternalLink size={10} />
             </a>
          </motion.div>
        </div>

        {/* Right Column: Bio & Interactive Terminal (7 Cols) */}
        <div className="lg:col-span-7 space-y-8 order-2 lg:order-2">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
               <span className="h-px w-10 bg-accent"></span>
               <span className="font-mono text-accent text-sm tracking-widest">{t.about.label}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
              {t.about.title} <br/>
              <span className="text-gray-500">{t.about.subtitle}</span>
            </h2>

            <p className="text-gray-300 leading-relaxed text-lg mb-6">
              {t.about.description1}
            </p>
            
            <p className="text-gray-300 leading-relaxed text-lg mb-8">
               {t.about.description2}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => setTerminalMode(!terminalMode)}
                className="flex items-center gap-2 text-xs font-mono border border-gray-700 px-4 py-3 rounded hover:bg-white hover:text-black transition-all group"
              >
                <Terminal size={14} />
                {terminalMode ? t.about.terminalClose : t.about.terminalBtn}
              </button>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono bg-accent/10 border border-accent/20 text-accent px-4 py-3 rounded hover:bg-accent hover:text-black transition-all group"
              >
                <FileText size={14} />
                {t.about.cvBtn}
              </a>
            </div>
          </motion.div>

           {/* Terminal / Skills Area */}
           <motion.div
             layout
             className="relative w-full"
           >
             {terminalMode ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="w-full bg-[#0c0c0c] rounded-lg border border-gray-800 p-6 font-mono text-xs md:text-sm overflow-hidden shadow-2xl"
                >
                  <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-green-500 space-y-2">
                    <p>{'>'}<span className="text-blue-400"> const</span> <span className="text-yellow-300">developer</span> = <span className="text-pink-400">new</span> Human();</p>
                    <p>{'>'}<span className="text-blue-400"> developer</span>.location = <span className="text-orange-300">"Uzbekistan"</span>;</p>
                    <p>{'>'}<span className="text-blue-400"> developer</span>.caffeineLevel = <span className="text-purple-400">Infinity</span>;</p>
                    <p>{'>'}<span className="text-blue-400"> developer</span>.skills = [</p>
                    {SKILLS.map((skill, i) => (
                      <p key={i} className="pl-4">
                        <span className="text-orange-300">"{skill.name}"</span>, 
                        <span className="text-gray-500"> // {skill.humor || `${skill.level}% proficiency`}</span>
                      </p>
                    ))}
                    <p>];</p>
                    <p className="animate-pulse">_</p>
                  </div>
                </motion.div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {SKILLS.slice(0, 4).map((skill, index) => (
                      <div key={index} className="group cursor-default">
                         <div className="flex justify-between mb-2">
                            <span className="font-display font-medium group-hover:text-accent transition-colors">{skill.name}</span>
                            <span className="font-mono text-xs text-gray-500">{skill.level}%</span>
                         </div>
                         <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${skill.level}%` }}
                               transition={{ duration: 1, delay: 0.1 * index }}
                               className="h-full bg-white group-hover:bg-accent transition-colors duration-300"
                            />
                         </div>
                      </div>
                   ))}
                </div>
             )}
           </motion.div>
        </div>

      </div>
    </div>
  );
};

export default About;
