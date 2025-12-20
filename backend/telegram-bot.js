import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';

// ENV:
// BOT_TOKEN=your_telegram_bot_token
// WEBAPP_URL=https://your-app.vercel.app

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is missing in .env');
  process.exit(1);
}
if (!WEBAPP_URL) {
  console.error('WEBAPP_URL is missing in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Simple in-memory language store per user
const userLang = {};

const LANGS = ['EN', 'UZ', 'RU'];

const TEXT = {
  EN: {
    chooseLang: 'Please choose your language:',
    welcome:
      'Assalomu alaykum!\n\nI am your AI Financial Advisor.\nOpen the app to track your halal finances.',
    openApp: '📱 Open Financial Assistant App',
    aboutMeBtn: 'ℹ️ About me',
    aboutMe:
      "👋 Yo, I'm Muhammadamin — Full-Stack Genius, Philanthropist, and the guy who built FAIAS all by himself. I turn dreams into apps, and financial chaos into peace 💸✨. My app is 100% free forever because real geniuses don't charge for helping people. Developer/Promo : @plagueson or muhammadamin.nazirov@mail.ru",
  },
  UZ: {
    chooseLang: "Iltimos, tilni tanlang:",
    welcome:
      "Assalomu alaykum!\n\nMen sizning Suniy Intelekt moliyaviy maslahatchingizman.\nMoliyangizni nazorat qilish uchun ilovadadan foydalaning.",
    openApp: '📱 Moliyaviy Ilovani ochish',
    aboutMeBtn: 'ℹ️ Men haqimda',
    aboutMe:
      "Muhammadamin Nazirov, Reklama/Support: @plagueson or muhammadamin.nazirov@mail.ru",
  },
  RU: {
    chooseLang: 'Пожалуйста, выберите язык:',
    welcome:
      'Ассалому алейкум!\n\nЯ ваш ИИ финансовый советник.\nИспользуйте приложение, чтобы ввести финансы.',
    openApp: '📱 Открыть приложение',
    aboutMeBtn: 'ℹ️ Обо мне',
    aboutMe:
      'Мухаммадамин, Full stack программист, создатель FAIAS, Реклама/Поддержка: @plagueson or muhammadamin.nazirov@mail.ru',
  },
};

const getLang = (ctx) => {
  const id = ctx.from?.id;
  return (id && userLang[id]) || 'EN';
};

// /start → language choice
bot.start((ctx) => {
  const id = ctx.from.id;
  // Default EN until they pick
  userLang[id] = userLang[id] || 'EN';

  return ctx.reply(
    TEXT[userLang[id]].chooseLang,
    Markup.inlineKeyboard([
      [
        Markup.button.callback('🇺🇸 English', 'lang_EN'),
        Markup.button.callback("🇺🇿 O'zbek", 'lang_UZ'),
        Markup.button.callback('🇷🇺 Русский', 'lang_RU'),
      ],
    ])
  );
});

// Language selection handlers
LANGS.forEach((code) => {
  bot.action(`lang_${code}`, (ctx) => {
    const id = ctx.from.id;
    userLang[id] = code;

    const t = TEXT[code];

    // Remove inline keyboard to avoid re-click
    ctx.editMessageReplyMarkup(undefined).catch(() => {});

    // Send localized welcome + 2 buttons with language param
    const langParam = code.toLowerCase(); // 'EN' → 'en', 'UZ' → 'uz', 'RU' → 'ru'
    const webAppUrlWithLang = `${WEBAPP_URL}?lang=${langParam}`;
    
    return ctx.reply(
      t.welcome,
      Markup.keyboard([
        [Markup.button.webApp(t.openApp, webAppUrlWithLang)],
        [t.aboutMeBtn],
      ])
        .resize()
        .oneTime()
    );
  });
});

// About me (all langs)
bot.hears(
  [TEXT.EN.aboutMeBtn, TEXT.UZ.aboutMeBtn, TEXT.RU.aboutMeBtn],
  (ctx) => {
    const code = getLang(ctx);
    return ctx.reply(TEXT[code].aboutMe);
  }
);

console.log('🚀 Telegram bot with language selection is running...');
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


