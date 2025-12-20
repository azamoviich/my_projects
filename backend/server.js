import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Pool } = pkg;

// --- ENV CONFIG ---
const {
  DATABASE_URL,
  JWT_SECRET = 'change_me_in_prod',
  PORT = 4000,
} = process.env;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing in .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// --- EXPRESS SETUP ---
const app = express();

// Security: Rate limiting (simple in-memory)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 100; // max requests per window

const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  
  userLimit.count++;
  rateLimitMap.set(ip, userLimit);
  next();
};

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Prevent huge payloads
app.use(rateLimit);

// --- HELPERS ---
const signToken = (user) =>
  jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '30d',
  });

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token' });
  }
  const token = authHeader.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// --- DB INIT (simple SQL schema) ---
const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      preferred_lang TEXT DEFAULT 'EN',
      telegram_user_id BIGINT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // store full app state as JSON for now
  await pool.query(`
    CREATE TABLE IF NOT EXISTS financial_states (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      state JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id)
    );
  `);
};

// --- ROUTES ---

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Sign up
app.post('/auth/signup', async (req, res) => {
  try {
    const { username, password, preferredLang = 'EN', telegramUserId } = req.body;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    // Sanitize username (alphanumeric + underscore, 3-20 chars)
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({ error: 'Username must be 3-20 characters, alphanumeric and underscores only' });
    }
    
    // Password strength (min 6 chars)
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Validate preferredLang
    const validLangs = ['EN', 'UZ', 'RU'];
    const lang = validLangs.includes(preferredLang) ? preferredLang : 'EN';
    
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, password_hash, preferred_lang, telegram_user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, preferred_lang`,
      [username.toLowerCase().trim(), hash, lang, telegramUserId || null],
    );
    const user = result.rows[0];
    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username already taken' });
    }
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    // Sanitize input
    const sanitizedUsername = username.toLowerCase().trim();
    
    const result = await pool.query(
      'SELECT id, username, password_hash, preferred_lang FROM users WHERE username = $1',
      [sanitizedUsername],
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ token, user: { id: user.id, username: user.username, preferred_lang: user.preferred_lang } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Minimal forgot/reset (placeholder - actual Telegram-based logic to be added)
app.post('/auth/forgot', (_req, res) => {
  res.status(501).json({ error: 'Forgot password via Telegram not implemented yet' });
});

app.post('/auth/reset', (_req, res) => {
  res.status(501).json({ error: 'Reset password via Telegram not implemented yet' });
});

// Get current state
app.get('/me', authMiddleware, async (req, res) => {
  try {
    const { id } = req.user;
    const userRes = await pool.query(
      'SELECT id, username, preferred_lang FROM users WHERE id = $1',
      [id],
    );
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const stateRes = await pool.query(
      'SELECT state FROM financial_states WHERE user_id = $1',
      [id],
    );
    const state = stateRes.rows[0]?.state || null;
    res.json({ user, state });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

// Save full app state (profile + expenses + loans + lendings + chatHistory + lang)
app.put('/me', authMiddleware, async (req, res) => {
  try {
    const { id } = req.user;
    const state = req.body;
    if (!state) return res.status(400).json({ error: 'Missing state body' });
    
    // Basic validation: ensure state is an object
    if (typeof state !== 'object' || Array.isArray(state)) {
      return res.status(400).json({ error: 'Invalid state format' });
    }
    
    await pool.query(
      `
      INSERT INTO financial_states (user_id, state)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET state = EXCLUDED.state, updated_at = NOW();
      `,
      [id, state],
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// --- START SERVER ---
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB init failed', err);
    process.exit(1);
  });


