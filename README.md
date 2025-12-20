<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## Telegram Bot WebApp – AI Financial Advisor

This project is a React/Vite single-page app designed to run as a **Telegram Web App** inside a Telegram bot, as well as in a regular browser.

### Run Locally

- **Prerequisite**: Node.js

1. Install dependencies:  
   `npm install`
2. Create `.env.local` and set your Gemini key (used by `@google/genai`):  
   `GEMINI_API_KEY=your_key_here`
3. Start the dev server:  
   `npm run dev`

Open `http://localhost:3000` in your browser to test.

### Build for Deployment

1. Build the production bundle:  
   `npm run build`
2. Deploy the `dist` folder to any HTTPS host (Vercel, Netlify, Render static site, etc.).

### Use as a Telegram Bot Web App

1. Deploy the built app to an HTTPS URL (for example, `https://your-domain.com`).
2. In your Telegram bot, create a keyboard or inline button with a **Web App** configuration pointing to that URL (via Bot API `web_app` parameter or BotFather’s Web App settings).
3. When users tap the button in Telegram, this app will open inside Telegram using the Telegram WebApp JS SDK (already included in `index.html`) and is ready to be used as your bot’s financial dashboard UI.
