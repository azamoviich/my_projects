import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { login, signup, AuthUser } from '../services/authService';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  lang: Language;
  onAuthSuccess: (user: AuthUser, token: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  lang,
  onAuthSuccess,
}) => {
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!username.trim()) {
      setError(lang === 'UZ' ? 'Foydalanuvchi nomi kiritilishi shart.' : lang === 'RU' ? 'Имя пользователя обязательно.' : 'Username is required.');
      return;
    }
    
    if (!password) {
      setError(lang === 'UZ' ? 'Parol kiritilishi shart.' : lang === 'RU' ? 'Пароль обязателен.' : 'Password is required.');
      return;
    }
    
    if (mode === 'signup') {
      if (password.length < 6) {
        setError(lang === 'UZ' ? 'Parol kamida 6 belgidan iborat bo\'lishi kerak.' : lang === 'RU' ? 'Пароль должен содержать не менее 6 символов.' : 'Password must be at least 6 characters.');
        return;
      }
      if (password !== confirm) {
        setError(lang === 'UZ' ? 'Parollar mos kelmaydi.' : lang === 'RU' ? 'Пароли не совпадают.' : 'Passwords do not match.');
        return;
      }
    }
    
    try {
      setLoading(true);
      if (mode === 'signup') {
        const res = await signup(username.trim(), password, lang);
        onAuthSuccess(res.user, res.token);
      } else {
        const res = await login(username.trim(), password);
        onAuthSuccess(res.user, res.token);
      }
    } catch (err: any) {
      setError(err.message || (lang === 'UZ' ? 'Autentifikatsiya xatosi.' : lang === 'RU' ? 'Ошибка аутентификации.' : 'Authentication failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {mode === 'signup' 
              ? (lang === 'UZ' ? 'Hisob yaratish' : lang === 'RU' ? 'Создать аккаунт' : 'Create Account')
              : (lang === 'UZ' ? 'Kirish' : lang === 'RU' ? 'Войти' : 'Log In')
            }
          </h2>
        </div>

        <div className="flex mb-4 gap-2">
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              mode === 'signup'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {lang === 'UZ' ? 'Ro\'yxatdan o\'tish' : lang === 'RU' ? 'Регистрация' : 'Sign Up'}
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              mode === 'login'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {lang === 'UZ' ? 'Kirish' : lang === 'RU' ? 'Войти' : 'Log In'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {lang === 'UZ' ? 'Foydalanuvchi nomi' : lang === 'RU' ? 'Имя пользователя' : 'Username'}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={lang === 'UZ' ? 'masalan: muhammadamin19' : lang === 'RU' ? 'например: muhammadamin19' : 'e.g. muhammadamin19'}
              required
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {lang === 'UZ' ? 'Parol' : lang === 'RU' ? 'Пароль' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              disabled={loading}
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {lang === 'UZ' ? 'Parolni tasdiqlash' : lang === 'RU' ? 'Подтвердите пароль' : 'Confirm Password'}
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <div className="text-xs text-red-400 bg-red-900/30 border border-red-700 rounded-md p-2 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading
              ? (lang === 'UZ' ? 'Kuting...' : lang === 'RU' ? 'Пожалуйста, подождите...' : 'Please wait...')
              : mode === 'signup'
              ? (lang === 'UZ' ? 'Hisob yaratish' : lang === 'RU' ? 'Создать аккаунт' : 'Create Account')
              : (lang === 'UZ' ? 'Kirish' : lang === 'RU' ? 'Войти' : 'Log In')}
          </button>
        </form>

        {mode === 'login' && (
          <button
            type="button"
            className="mt-3 text-xs text-slate-400 hover:text-slate-200 underline"
            onClick={() =>
              alert(
                lang === 'UZ' 
                  ? 'Parolni tiklash funksiyasi hali amalga oshirilmagan. Hozircha yangi foydalanuvchi nomi bilan ro\'yxatdan o\'ting.'
                  : lang === 'RU'
                  ? 'Функция восстановления пароля еще не реализована. Пока зарегистрируйтесь с новым именем пользователя.'
                  : 'Forgot password via Telegram is not implemented yet. Use a new username for now.'
              )
            }
          >
            {lang === 'UZ' ? 'Parolni unutdingizmi?' : lang === 'RU' ? 'Забыли пароль?' : 'Forgot password?'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
