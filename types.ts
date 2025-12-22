export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  link: string;
  image: string;
  year: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  humor?: string;
}

export type SectionType = 'hero' | 'about' | 'work' | 'contact';

export type Language = 'en' | 'uz' | 'ru';