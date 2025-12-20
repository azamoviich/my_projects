import React, { useState } from 'react';
import { UserProfile, SalaryEntry, Language } from '../types';
import { TRANSLATIONS, formatCurrency } from '../constants';
import { DollarSign, Calendar, Plus, Trash2, Percent } from 'lucide-react';

interface InputSectionProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  lang: Language;
  onAction: (type: 'INCOME', data: any) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ profile, setProfile, lang, onAction }) => {
  const t = TRANSLATIONS[lang];
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const parseNumber = (val: string) => Number(val.replace(/\s/g, ''));

  const formatWithSpaces = (val: string) =>
    val.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const newEntry: SalaryEntry = {
      id: crypto.randomUUID(),
      amount: parseNumber(amount),
      source: source || 'Income',
      date: date
    };

    setProfile(prev => ({
      ...prev,
      salaryHistory: [newEntry, ...prev.salaryHistory]
    }));
    
    // Trigger AI Reaction
    onAction('INCOME', newEntry);

    setAmount('');
    setSource('');
  };

  const removeIncome = (id: string) => {
    setProfile(prev => ({
      ...prev,
      salaryHistory: prev.salaryHistory.filter(i => i.id !== id)
    }));
  };

  const updateTaxRate = (rate: number) => {
      setProfile(prev => ({ ...prev, taxRate: rate }));
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            {t.incomeSettings}
          </h2>
          
          <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
             <Percent className="w-3 h-3 text-slate-400" />
             <input 
               type="number" 
               value={profile.taxRate ?? 12}
               onChange={(e) => updateTaxRate(Number(e.target.value))}
               className="w-12 bg-transparent text-xs text-right text-slate-200 outline-none font-bold"
             />
             <span className="text-xs text-slate-400">%</span>
          </div>
      </div>
      
      <form onSubmit={handleAddIncome} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">{t.amount} (UZS)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(formatWithSpaces(e.target.value))}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="0"
            inputMode="numeric"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">{t.description}</label>
               <input
                 type="text"
                 value={source}
                 onChange={(e) => setSource(e.target.value)}
                 className="w-full p-2 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg text-sm"
                 placeholder={t.sourcePlaceholder}
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">{t.date}</label>
               <input
                 type="date"
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 className="w-full p-2 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg text-sm"
               />
             </div>
        </div>
        
        <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
            <Plus className="w-4 h-4" />
            {t.addIncome}
        </button>
      </form>

      <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
        {profile.salaryHistory.length === 0 && <p className="text-slate-600 text-xs text-center">{t.noData}</p>}
        {profile.salaryHistory.map(entry => (
            <div key={entry.id} className="flex justify-between items-center p-2 bg-slate-800 rounded border border-slate-700">
                <div>
                    <p className="text-sm font-bold text-slate-200">{formatCurrency(entry.amount)}</p>
                    <p className="text-xs text-slate-500">{entry.date} • {entry.source}</p>
                </div>
                <button onClick={() => removeIncome(entry.id)} className="text-slate-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default InputSection;