import { Project, Skill, SocialLink } from './types';

export const SOCIALS: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com', icon: 'github' },
  { name: 'Telegram', url: 'https://t.me', icon: 'telegram' },
  { name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
  { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
];

// Specific Tech Stack as requested
export const CORE_STACK = [
  "JavaScript / TypeScript",
  "React / Next.js",
  "Python",
  "SQL / PostgreSQL"
];

export const SKILLS: Skill[] = [
  { name: 'Frontend Architecture', level: 95 },
  { name: 'Interactive WebGL', level: 85 },
  { name: 'Backend Systems', level: 90 },
  { name: 'Database Design', level: 88 },
  { name: 'UI/UX Design', level: 80 },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "NEBULA OS",
    category: "Web Experiment",
    description: "A browser-based operating system exploring the future of spatial computing interfaces using purely web technologies.",
    tech: ["React", "Three.js", "WebRTC"],
    link: "#",
    image: "https://picsum.photos/1200/800?random=1",
    year: "2024"
  },
  {
    id: 2,
    title: "SYNTHETIC SOUL",
    category: "AI Experience",
    description: "Generative art platform that creates unique audio-visual identities for users based on their Spotify listening history.",
    tech: ["Python", "TensorFlow", "Next.js"],
    link: "#",
    image: "https://picsum.photos/1200/800?random=2",
    year: "2024"
  },
  {
    id: 3,
    title: "AETHER PORTFOLIO",
    category: "Immersive Personal Site",
    description: "The site you're currently exploring — built to be anything but ordinary. Featuring reactive particles, kinetic typography, and seamless transitions.",
    tech: ["React", "R3F", "Tailwind", "Framer Motion"],
    link: "#",
    image: "https://picsum.photos/1200/800?random=3",
    year: "2025"
  }
];

export const NAV_ITEMS = [
  { id: 'hero', label: '01. START' },
  { id: 'about', label: '02. IDENTITY' },
  { id: 'work', label: '03. CREATIONS' },
  { id: 'contact', label: '04. SIGNAL' },
];