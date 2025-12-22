import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Work: React.FC = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const { t } = useLanguage();

  return (
    <>
      {/* CSS Styles for Project Photos */}
      <style>{`
        .project-photo-wrapper {
          position: relative;
          width: 700px;
          max-width: 90vw;
          aspect-ratio: 16 / 9;
          border-radius: 24px;
          overflow: hidden;
          isolation: isolate;
          contain: layout style paint;
        }

        .project-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          border-radius: 24px;
        }

        .project-photo-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 24px;
          /* Vignette fade using exact background color #050505 - starts at 50% */
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 50%,
            rgba(5, 5, 5, 0.3) 65%,
            rgba(5, 5, 5, 0.7) 80%,
            rgba(5, 5, 5, 0.95) 100%
          );
          mix-blend-mode: normal;
        }

        /* Particle Container */
        .project-photo-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 24px;
          overflow: hidden;
        }

        /* Individual Particles using pseudo-elements */
        .project-photo-particles::before,
        .project-photo-particles::after {
          content: '';
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          box-shadow: 
            /* Top-left area */
            15% 10% 0 1px rgba(255, 255, 255, 0.3),
            25% 15% 0 0.5px rgba(255, 255, 255, 0.25),
            10% 25% 0 1px rgba(255, 255, 255, 0.2),
            /* Top-right area */
            85% 12% 0 0.8px rgba(255, 255, 255, 0.3),
            75% 20% 0 1px rgba(255, 255, 255, 0.25),
            90% 28% 0 0.6px rgba(255, 255, 255, 0.2),
            /* Bottom-left area */
            12% 85% 0 1px rgba(255, 255, 255, 0.3),
            20% 80% 0 0.7px rgba(255, 255, 255, 0.25),
            8% 75% 0 0.9px rgba(255, 255, 255, 0.2),
            /* Bottom-right area */
            88% 82% 0 1px rgba(255, 255, 255, 0.3),
            80% 88% 0 0.8px rgba(255, 255, 255, 0.25),
            92% 75% 0 0.6px rgba(255, 255, 255, 0.2),
            /* Edge particles */
            5% 50% 0 1px rgba(255, 255, 255, 0.35),
            95% 50% 0 1px rgba(255, 255, 255, 0.35),
            50% 5% 0 1px rgba(255, 255, 255, 0.35),
            50% 95% 0 1px rgba(255, 255, 255, 0.35);
          animation: float-particle 8s ease-in-out infinite;
          opacity: 0.6;
        }

        .project-photo-particles::before {
          left: 20%;
          top: 30%;
          animation-delay: 0s;
        }

        .project-photo-particles::after {
          left: 70%;
          top: 60%;
          animation-delay: 4s;
        }

        /* Additional particles using box-shadow on wrapper */
        .project-photo-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 24px;
          background: transparent;
          box-shadow: 
            /* More particles in faded edge areas */
            inset 8% 12% 0 1.5px rgba(255, 255, 255, 0.15),
            inset 92% 15% 0 1px rgba(255, 255, 255, 0.2),
            inset 10% 88% 0 1.2px rgba(255, 255, 255, 0.18),
            inset 88% 85% 0 1px rgba(255, 255, 255, 0.15),
            inset 3% 45% 0 0.8px rgba(255, 255, 255, 0.25),
            inset 97% 48% 0 1px rgba(255, 255, 255, 0.2),
            inset 48% 2% 0 1px rgba(255, 255, 255, 0.22),
            inset 52% 98% 0 1.2px rgba(255, 255, 255, 0.18),
            /* Accent color particles */
            inset 15% 8% 0 1px rgba(0, 240, 255, 0.1),
            inset 85% 92% 0 1px rgba(0, 240, 255, 0.1);
          animation: float-particle-secondary 12s ease-in-out infinite;
          z-index: 2;
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translate(10px, -15px) scale(1.2);
            opacity: 0.6;
          }
          50% {
            transform: translate(-8px, -25px) scale(0.9);
            opacity: 0.5;
          }
          75% {
            transform: translate(12px, -10px) scale(1.1);
            opacity: 0.55;
          }
        }

        @keyframes float-particle-secondary {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .project-photo-wrapper {
            width: 100%;
            max-width: 100%;
            border-radius: 16px;
          }
          
          .project-photo-vignette {
            border-radius: 16px;
          }
          
          .project-photo-particles {
            border-radius: 16px;
          }
        }

        /* Subtle glow on hover */
        .project-photo-wrapper:hover .project-photo-particles::before,
        .project-photo-wrapper:hover .project-photo-particles::after {
          opacity: 0.8;
          animation-duration: 6s;
        }
      `}</style>

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
                
                {/* Image Reveal Effect with Vignette and Particles */}
                <AnimatePresence>
                  {hoveredProject === project.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 pointer-events-none z-0 hidden md:flex items-center justify-center overflow-hidden"
                    >
                      <div className="project-photo-wrapper">
                        <img 
                          src={project.image}
                          alt={project.title}
                          className="project-photo"
                        />
                        <div className="project-photo-vignette"></div>
                        <div className="project-photo-particles"></div>
                      </div>
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
    </>
  );
};

export default Work;