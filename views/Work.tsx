import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Work: React.FC = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full flex flex-col justify-center py-24 px-4 md:px-10 relative">
      <div className="max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center gap-3 mb-16">
            <span className="h-px w-10 bg-accent"></span>
            <span className="font-mono text-accent text-sm tracking-widest">{t.work.label}</span>
        </div>

        <div className="flex flex-col">
          {t.projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              className="group border-t border-gray-800 py-12 flex flex-col md:flex-row justify-between items-start md:items-center relative transition-colors hover:bg-white/5 px-4"
            >
              {/* Project Title & Category */}
              <div className="z-20 relative">
                <h3 className="text-4xl md:text-6xl font-display font-bold text-gray-300 group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="font-mono text-xs text-accent">{project.category}</span>
                  <span className="font-mono text-xs text-gray-600">/ {project.year}</span>
                </div>
                <p className="mt-4 max-w-lg text-gray-400 text-sm">{project.description}</p>
              </div>

              {/* Tags & Action */}
              <div className="mt-6 md:mt-0 flex flex-col md:items-end gap-4 z-20">
                <div className="flex gap-2">
                   {project.tech.map(t => (
                      <span key={t} className="text-[10px] font-mono border border-gray-700 rounded-full px-2 py-1 text-gray-400">{t}</span>
                   ))}
                </div>
                <a href={project.link} className="flex items-center gap-2 text-white hover:text-accent transition-colors group/link">
                   <span className="text-sm font-medium">{t.work.viewCase}</span>
                   <ArrowUpRight size={16} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </a>
              </div>
              
              {/* Image Reveal Effect - Absolute Center */}
              <AnimatePresence>
                {hoveredProject === project.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 2 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 pointer-events-none z-0 hidden md:flex items-center justify-center overflow-hidden opacity-20"
                  >
                     {/* In a real scenario, this would be the project image. Using a blurred gradient abstract fallback for now to ensure visual safety */}
                     <div 
                        className="w-[600px] h-[300px] bg-cover bg-center rounded-lg grayscale opacity-30 mix-blend-screen"
                        style={{ backgroundImage: `url(${project.image})` }}
                     />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          <div className="border-t border-gray-800" />
        </div>
        
        {/* Github Call to Action */}
        <div className="mt-16 flex justify-center">
           <a href="github.com/azamoviich" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group border border-white/10 px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm">
              <Github className="group-hover:rotate-12 transition-transform" />
              <span className="font-mono text-sm">{t.work.exploreRepos}</span>
           </a>
        </div>
      </div>
    </div>
  );
};

export default Work;