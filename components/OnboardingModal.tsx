import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { User, MapPin, Globe } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onSave: (details: Partial<UserProfile>) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onSave, lang, setLang }) => {
  const t = TRANSLATIONS[lang];
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(19);
  const [city, setCity] = useState('');
  const [status, setStatus] = useState<'Single' | 'Married'>('Single');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && city) {
        onSave({ name, age, city, status });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Language Selector */}
        <div className="flex justify-end mb-2">
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                {['EN', 'UZ', 'RU'].map((l) => (
                    <button
                        key={l}
                        type="button"
                        onClick={() => setLang(l as Language)}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            lang === l 
                            ? 'bg-slate-600 text-white shadow' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        {l}
                    </button>
                ))}
            </div>
        </div>

        <div className="text-center mb-6">
            <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-900/50">
                <User className="text-white w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">{t.welcome}</h2>
            <p className="text-slate-400 text-sm mt-1">{t.setupProfile}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Name</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Azizbek"
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Age</label>
                    <input 
                        type="number" 
                        value={age} 
                        onChange={e => setAge(Number(e.target.value))} 
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                    <select 
                        value={status} 
                        onChange={e => setStatus(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">City</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <input 
                        type="text" 
                        value={city} 
                        onChange={e => setCity(e.target.value)} 
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pl-9 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Tashkent"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 mt-4"
            >
                {t.saveProfile}
            </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingModal;