require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

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
      'Assalomu alaykum!\n\nI am your AI Financial Advisor.\nUse the WebApp to track your halal finances.',
    openApp: '📱 Open Financial WebApp',
    aboutMeBtn: 'ℹ️ About me',
    aboutMe:
      "I'm Muhammadamin, 19 y.o. from Tashkent.\nI built this halal-focused AI finance assistant to help you manage money the smart way.",
  },
  UZ: {
    chooseLang: "Iltimos, tilni tanlang:",
    welcome:
      "Assalomu alaykum!\n\nMen sizning AI moliyaviy maslahatchingizman.\nHalol tarzda moliyangizni nazorat qilish uchun WebApp'dan foydalaning.",
    openApp: '📱 Moliyaviy WebAppni ochish',
    aboutMeBtn: 'ℹ️ Men haqimda',
    aboutMe:
      "Men Muhammadaminman, 19 yoshdaman, Toshkentdanman.\nBu halol moliya yordamchisini sizga pulni to‘g‘ri boshqarishga yordam berish uchun qurdim.",
  },
  RU: {
    chooseLang: 'Пожалуйста, выберите язык:',
    welcome:
      'Ассалому алейкум!\n\nЯ ваш ИИ финансовый советник.\nИспользуйте WebApp, чтобы вести халяльные финансы.',
    openApp: '📱 Открыть финансовый WebApp',
    aboutMeBtn: 'ℹ️ Обо мне',
    aboutMe:
      'Я Мухаммадамин, 19 лет, из Ташкента.\nЯ создал этого халяльного финансового ассистента, чтобы помочь вам умно управлять деньгами.',
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

    // Send localized welcome + 2 buttons
    return ctx.reply(
      t.welcome,
      Markup.keyboard([
        [Markup.button.webApp(t.openApp, WEBAPP_URL)],
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


