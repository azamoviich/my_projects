import React, { useState } from 'react';
import { Expense, ExpenseCategory, Language } from '../types';
import { EXPENSE_CATEGORIES, formatCurrency, COLORS, TRANSLATIONS } from '../constants';
import { PlusCircle, History, Trash2 } from 'lucide-react';

interface ExpenseTrackerProps {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  lang: Language;
  onAction: (type: 'EXPENSE', data: any) => void;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ expenses, onAddExpense, onDeleteExpense, lang, onAction }) => {
  const t = TRANSLATIONS[lang];
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const parseNumber = (val: string) => Number(val.replace(/\s/g, ''));
  const formatWithSpaces = (val: string) =>
    val.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const amtNum = parseNumber(amount);
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount: amtNum,
      category: category,
      description: description || category,
      date: date
    };

    onAddExpense(newExpense);
    
    // AI Reaction in Chat instead of Alert
    onAction('EXPENSE', newExpense);

    setAmount('');
    setDescription('');
  };

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTotal = expenses.filter(e => e.date === todayStr).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Daily Summary */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-4 text-slate-100 shadow-lg flex justify-between items-center border border-indigo-800">
         <div>
            <p className="text-xs text-indigo-200 font-medium uppercase tracking-wider">{t.today}</p>
            <p className="text-2xl font-bold">{formatCurrency(todayTotal)}</p>
         </div>
         <div className="bg-white/10 p-2 rounded-lg">
            <History className="w-5 h-5 text-indigo-200" />
         </div>
      </div>

      {/* Add Expense Form */}
      <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-emerald-500" />
          {t.addExpense}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">{t.amount} (UZS)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(formatWithSpaces(e.target.value))}
              placeholder="e.g., 50000"
              className="w-full p-3 text-lg bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              inputMode="numeric"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">{t.category}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">{t.date}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">{t.description}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Korzinka Groceries"
              className="w-full p-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {t.add}
          </button>
        </form>
      </div>

      {/* Expense History List */}
      <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-slate-500" />
          History
        </h3>
        <div className="max-h-80 overflow-y-auto pr-2 scrollbar-hide space-y-3">
          {sortedExpenses.length === 0 ? (
            <p className="text-slate-600 text-center py-4">{t.noData}</p>
          ) : (
            sortedExpenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-10 rounded-full" style={{ backgroundColor: COLORS[exp.category] }}></div>
                  <div>
                    <p className="font-semibold text-slate-200 text-sm">{exp.description}</p>
                    <p className="text-xs text-slate-500">{exp.date} • {exp.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-300 text-sm">{formatCurrency(exp.amount)}</span>
                  <button onClick={() => onDeleteExpense(exp.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;