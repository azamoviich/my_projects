import { Language, Project } from '../types';

interface TranslationData {
  nav: { [key: string]: string };
  hero: {
    role: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    description: string;
    cta: string;
  };
  about: {
    label: string;
    title: string;
    subtitle: string;
    description1: string;
    description2: string;
    terminalBtn: string;
    terminalClose: string;
    cvBtn: string;
    coreTech: string;
    musicTitle: string;
    musicDesc: string;
    spotifyPlaylist: string;
    stats: { exp: string; projects: string };
  };
  work: {
    label: string;
    viewCase: string;
    exploreRepos: string;
  };
  contact: {
    label: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    btn: string;
    coordinates: string;
    socials: string;
    copyright: string;
    design: string;
    location: string;
  };
  projects: Project[];
}

export const translations: Record<Language, TranslationData> = {
  en: {
    nav: { hero: '01. START', about: '02. IDENTITY', work: '03. CREATIONS', contact: '04. SIGNAL' },
    hero: {
      role: 'FULL STACK DEVELOPER',
      titleLine1: 'DIGITAL',
      titleLine2: 'REALITY',
      titleLine3: 'BUILDER',
      description: 'Crafting immersive web experiences that blur the line between utility and art. Currently engineering the future at TopTier Tech.',
      cta: 'EXPLORE',
    },
    about: {
      label: 'ABOUT THE DEVELOPER',
      title: 'More than just code.',
      subtitle: 'A digital artisan.',
      description1: "I view the browser as a canva. My work sits at the intersection of minimalism and complex interactivity. I don't build websites; I construct digital ecosystems that breathe.",
      description2: "Based in the cloud, grounded in logic. When I'm not pushing pixels, I'm likely deconstructing game engines or optimizing shader performance.",
      terminalBtn: 'VIEW SOURCE_DATA',
      terminalClose: 'CLOSE TERMINAL',
      cvBtn: 'DOWNLOAD RESUME',
      coreTech: 'CORE TECHNOLOGIES',
      musicTitle: 'AUDIO FREQUENCY',
      musicDesc: 'Music is the vital part of my life.',
      spotifyPlaylist: 'OPEN SPOTIFY PLAYLIST',
      stats: { exp: 'Years Exp', projects: 'Projects' },
    },
    work: {
      label: 'SELECTED WORKS (2025)',
      viewCase: 'View Case Study',
      exploreRepos: 'EXPLORE MORE REPOS',
    },
    contact: {
      label: 'INITIATE SEQUENCE',
      titleLine1: "Let's build the",
      titleLine2: "impossible.",
      description: "Have a project? I'm currently open for freelance opportunities and collaborations.",
      btn: 'Launch Project',
      coordinates: 'COORDINATES',
      socials: 'SOCIAL UPLINK',
      copyright: '© 2025 PLAGUE TECH SOLUTIONS. All rights reserved.',
      design: 'Designed in the Void.',
      location: 'Tashkent, Uzbekistan / Remote / Open to Relocate'
    },
    projects: [
      {
        id: 1,
        title: "FAIAS",
        category: "AI Financial Assistant",
        description: "AI Financial Assistant that helps you manage your finances.",
        tech: ["JavaScript", "TypeScript", "NodeJS"],
        link: "https://t.me/f_ai_as_bot",
        // Replace with: https://raw.githubusercontent.com/azamoviich/myportfolio/main/images/faias.jpg
        image: "https://raw.githubusercontent.com/nazirovv10/photos/main/images/photo_2025-12-22_11-38-31.jpg",
        year: "2025"
      },
      {
        id: 2,
        title: "BENEDICT LOYALTY",
        category: "Loyalty Program WebAPP",
        description: "Generative platform that helps restraunt to keep customers returning",
        tech: ["Python", "Next.js"],
        link: "https://t.me/benedict_loyalty_bot",
        // Replace with: https://raw.githubusercontent.com/azamoviich/myportfolio/main/images/benedict.jpg
        image: "https://raw.githubusercontent.com/nazirovv10/photos/main/images/111.jpg",
        year: "2025"
      },
      {
        id: 3,
        title: "PORTFOLIO",
        category: "Immersive Personal Site",
        description: "The site you're currently exploring built to be anything but ordinary. Featuring reactive particles, kinetic typography, and seamless transitions.",
        tech: ["React", "Next.js", "Tailwind"],
        link: "plagueson.dev",
        // Replace with: https://raw.githubusercontent.com/azamoviich/myportfolio/main/images/portfolio.jpg
        image: "https://raw.githubusercontent.com/nazirovv10/photos/main/images/image8.png",
        year: "2025"
      }
    ]
  },
  uz: {
    nav: { hero: '01. BOSHLASH', about: '02. SHAXSIYAT', work: '03. IJODLAR', contact: '04. ALOQA' },
    hero: {
      role: "FULL STACK DASTURCHI",
      titleLine1: 'RAQAMLI',
      titleLine2: 'VOKELIK',
      titleLine3: 'MUHANDISI',
      description: "Foydalilik va san'at o'rtasidagi chegarani yo'qotuvchi immersiv web-tajribalarni yaratish. Hozirda TopTier Tech-da kelajakni muhandislik qilmoqdaman.",
      cta: 'KASHF ETING',
    },
    about: {
      label: 'DASTURCHI HAQIDA',
      title: 'Shunchaki kod emas.',
      subtitle: 'Raqamli hunarmand.',
      description1: "Men brauzerga canva sifatida qarayman. Mening ishim minimalizm va murakkab interaktivlik biriktirmasida joylashgan. Men saytlar emas, nafas oladigan raqamli ekotizimlar quraman.",
      description2: "Mantiqqa asoslangan.",
      terminalBtn: 'MANBANI KO\'RISH',
      terminalClose: 'TERMINALNI YOPISH',
      cvBtn: 'REZYUMENI YUKLAB OLISH',
      coreTech: 'ASOSIY TEXNOLOGIYALAR',
      musicTitle: 'AUDIO CHASTOTA',
      musicDesc: 'Musiqa — mening kodim uchun yoqilg\'i.',
      spotifyPlaylist: 'SPOTIFY PLAYLISTNI OCHISH',
      stats: { exp: 'Yillik Tajriba', projects: 'Loyihalar' },
    },
    work: {
      label: 'TANLANGAN ISHLAR (2025)',
      viewCase: 'Keysni Ko\'rish',
      exploreRepos: 'KO\'PROQ REPOZITORIYALAR',
    },
    contact: {
      label: 'TASHABBUSNI BOSHLASH',
      titleLine1: "Keling, ilojsiz narsani",
      titleLine2: "yarataylik.",
      description: "Sizda loyiha bormi? Men hamkorlik va frilans loyihalar uchun ochiqman.",
      btn: 'Loyihani Boshlash',
      coordinates: 'KOORDINATALAR',
      socials: 'IJTIMOIY TARMOQLAR',
      copyright: '© 2025 PLAGUE TECH SOLUTIONS. Barcha huquqlar himoyalangan.',
      design: 'Voidda ishlab chiqilgan.',
      location: 'Toshkent, O‘zbekiston / Masofaviy / Relocation'
    },
    projects: [
      {
        id: 1,
        title: "FAIAS",
        category: "AI Finansist Yordamchi",
        description: "Pulingizni boshqarishga yordam beradigan AI Finansist Yordamchi Bot.",
        tech: ["JavaScript", "TypeScript", "NodeJS"],
        link: "https://t.me/f_ai_as_bot",
        image: "https://raw.githubusercontent.com/nazirovv10/photos/main/images/photo_2025-12-22_11-38-31.jpg",
        year: "2025"
      },
      {
        id: 2,
        title: "BENEDICT SODIQLIQ PROGRAMMASI",
        category: "WebAPP Sodiqliq Programmasi",
        description: "Mehmonlarni qayta qayta kelishini ta'minlovchi Web Programma.",
        tech: ["Python", "Next.js"],
        link: "https://t.me/benedict_loyalty_bot",
        image: "https://raw.githubusercontent.com/nazirovv10/photos/main/images/111.jpg",
        year: "2025"
      },
      {
        id: 3,
        title: "PORTFOLIO",
        category: "Immersiv Web Sayt",
        description: "Siz hozir ko'rib turgan sayt — oddiy bo'lmaslik uchun qurilgan. Reaktiv zarrachalar, kinetik tipografiya va silliq perexodlar.",
        tech: ["React", "Next.js", "Tailwind"],
        link: "plagueson.dev",
        image: "https://raw.githubusercontent.com/nazirovv10/photos/main/images/image8.png",
        year: "2025"
      }
    ]
  },
  ru: {
    nav: { hero: '01. СТАРТ', about: '02. ЛИЧНОСТЬ', work: '03. ПРОЕКТЫ', contact: '04. СИГНАЛ' },
    hero: {
      role: 'FULL STACK АРХИТЕКТОР',
      titleLine1: 'СТРОИТЕЛЬ',
      titleLine2: 'ЦИФРОВОЙ',
      titleLine3: 'РЕАЛЬНОСТИ',
      description: 'Создание иммерсивных веб-интерфейсов, стирающих грань между утилитарностью и искусством. В настоящее время проектирую будущее в TopTier Tech.',
      cta: 'ИССЛЕДОВАТЬ',
    },
    about: {
      label: 'О РАЗРАБОТЧИКЕ',
      title: 'Больше, чем просто код.',
      subtitle: 'Цифровой ремесленник.',
      description1: "Я рассматриваю браузер как холст. Моя работа находится на стыке строгого минимализма и сложной интерактивности. Я строю цифровые экосистемы, которые дышат.",
      description2: "Основан в облаке, заземлен в логике. Когда я не двигаю пиксели, я, вероятно, разбираю игровые движки или оптимизирую шейдеры.",
      terminalBtn: 'ИСХОДНЫЙ КОД',
      terminalClose: 'ЗАКРЫТЬ ТЕРМИНАЛ',
      cvBtn: 'СКАЧАТЬ РЕЗЮМЕ',
      coreTech: 'КЛЮЧЕВЫЕ ТЕХНОЛОГИИ',
      musicTitle: 'АУДИО ЧАСТОТА',
      musicDesc: 'Музыка — это топливо для моего кода.',
      spotifyPlaylist: 'ОТКРЫТЬ SPOTIFY ПЛЕЙЛИСТ',
      stats: { exp: 'Лет Опыта', projects: 'Проектов' },
    },
    work: {
      label: 'ИЗБРАННЫЕ РАБОТЫ (2025)',
      viewCase: 'Смотреть Кейс',
      exploreRepos: 'БОЛЬШЕ РЕПОЗИТОРИЕВ',
    },
    contact: {
      label: 'ЗАПУСТИТЬ ПОСЛЕДОВАТЕЛЬНОСТЬ',
      titleLine1: "Давайте создадим",
      titleLine2: "невозможное.",
      description: "У вас есть проект? В настоящее время я открыт для фриланс-проектов и коллабораций.",
      btn: 'Начать Проект',
      coordinates: 'КООРДИНАТЫ',
      socials: 'СОЦСЕТИ',
      copyright: '© PLAGUE TECH SOLUTIONS. Все права защищены.',
      design: 'Создано в Пустоте.',
      location: 'Ташкент, Узбекистан / Удаленно / Готов к переезду'
    },
    projects: [
      {
        id: 1,
        title: "FAIAS",
        category: "ИИ Финансовый Ассистент",
        description: "Финансовый помощник, который помогает навести порядок в деньгах. Он отслеживает доходы и расходы, анализирует траты и дает понятные рекомендации для принятия взвешенных финансовых решений.",
        tech: ["JavaScript", "TypeScript", "NodeJS"],
        link: "https://t.me/f_ai_as_bot",
        image: "https://raw.githubusercontent.com/nazirovv10/photos/main/images/photo_2025-12-22_11-38-31.jpg",
        year: "2025"
      },
      {
        id: 2,
        title: "BENEDICT LOYALTY",
        category: "Программа Лояльности",
        description: "Платформа которая помогает привлекать и удерживать клиентов.",
        tech: ["Python", "Next.js"],
        link: "t.me/benedict_loyalty_bot",
        image: "https://raw.githubusercontent.com/nazirovv10/photos/main/images/111.jpg",
        year: "2025"
      },
      {
        id: 3,
        title: "PORTFOLIO",
        category: "Иммерсивный Сайт",
        description: "Сайт, который вы сейчас изучаете — создан, чтобы быть каким угодно, но не обычным. Реактивные частицы, кинетическая типографика и плавные переходы.",
        tech: ["React", "R3F", "Tailwind"],
        link: "#",
        image: "https://raw.githubusercontent.com/nazirovv10/photos/main/images/image8.png",
        year: "2025"
      }
    ]
  }
};