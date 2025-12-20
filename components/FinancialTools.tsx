import React, { useState } from 'react';
import { UserProfile, Goal, Language } from '../types';
import { TRANSLATIONS, formatCurrency, COLORS, BUDGET_MAPPING } from '../constants';
import { Target, Shield, Wallet, TrendingUp, Plus, Trash2 } from 'lucide-react';

interface FinancialToolsProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  lang: Language;
  netWorth: number;
  onAction: (type: 'GOAL', data: any) => void;
}

const FinancialTools: React.FC<FinancialToolsProps> = ({ profile, onUpdateProfile, lang, netWorth, onAction }) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'Budget' | 'Goals'>('Budget');

  // Goals Form
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDate, setGoalDate] = useState('');

  // 1. Budget Calculation (50/30/20)
  const calculateBudget = () => {
      const expenses = profile.expenses;
      let needs = 0, wants = 0, savings = 0;
      
      Object.entries(expenses).forEach(([cat, amount]) => {
          const type = BUDGET_MAPPING[cat as keyof typeof BUDGET_MAPPING] || 'Wants';
          if (type === 'Needs') needs += amount;
          else if (type === 'Wants') wants += amount;
          else savings += amount; // Capture explicit categories mapped to savings
      });
      // Add actual savings balance flow if we had income stream detailed, 
      // but here we approximate based on expenses + current savings allocation
      
      const totalSpends = needs + wants;
      // Note: "Savings" in 50/30/20 is usually money PUT ASIDE.
      // We display Needs vs Wants breakdown here.
      return { needs, wants, total: totalSpends };
  };

  const budget = calculateBudget();
  const totalTracked = budget.total || 1; // avoid div 0

  // 2. Add Goal
  const handleAddGoal = (e: React.FormEvent) => {
      e.preventDefault();
      if (!goalName || !goalTarget) return;

      const newGoal: Goal = {
          id: crypto.randomUUID(),
          name: goalName,
          targetAmount: parseFloat(goalTarget),
          savedAmount: 0,
          deadline: goalDate
      };

      const updated = { ...profile, goals: [...profile.goals, newGoal] };
      onUpdateProfile(updated);
      onAction('GOAL', newGoal);
      setGoalName(''); setGoalTarget(''); setGoalDate('');
  };

  const deleteGoal = (id: string) => {
      onUpdateProfile({ ...profile, goals: profile.goals.filter(g => g.id !== id) });
  };

  const updateGoalProgress = (id: string, amount: number) => {
      const updatedGoals = profile.goals.map(g => {
          if (g.id === id) return { ...g, savedAmount: g.savedAmount + amount };
          return g;
      });
      onUpdateProfile({ ...profile, goals: updatedGoals });
  };

  // 3. Emergency Fund (Approx 3 months of NEEDS)
  const monthlyNeeds = budget.needs; 
  const emergencyTarget = monthlyNeeds * 3;
  const emergencyProgress = Math.min((profile.currentSavings / (emergencyTarget || 1)) * 100, 100);


  return (
    <div className="space-y-6">
        {/* Net Worth Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5"><Wallet className="w-24 h-24 text-white"/></div>
             <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">{t.netWorth}</p>
             <h2 className={`text-4xl font-bold ${netWorth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                 {formatCurrency(netWorth)}
             </h2>
             <div className="mt-4 flex gap-4 text-xs text-slate-400">
                 <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-500"/> Assets: {formatCurrency(profile.currentSavings)}</div>
             </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button onClick={() => setActiveTab('Budget')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'Budget' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                {t.budgetPlanner}
            </button>
            <button onClick={() => setActiveTab('Goals')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'Goals' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                {t.goals}
            </button>
        </div>

        {/* Budget View */}
        {activeTab === 'Budget' && (
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6 animate-in fade-in">
                
                {/* 50/30/20 Visual */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-emerald-400 font-bold">{t.needs} (Target 50%)</span>
                        <span className="text-slate-400">{Math.round((budget.needs / totalTracked) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(budget.needs / totalTracked) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{formatCurrency(budget.needs)} spent</p>
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-purple-400 font-bold">{t.wants} (Target 30%)</span>
                        <span className="text-slate-400">{Math.round((budget.wants / totalTracked) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${(budget.wants / totalTracked) * 100}%` }}></div>
                    </div>
                     <p className="text-xs text-slate-500 mt-1">{formatCurrency(budget.wants)} spent</p>
                </div>

                {/* Emergency Fund */}
                <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <h3 className="font-bold text-slate-200">{t.emergencyFund}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">Target: 3 Months of Needs ({formatCurrency(emergencyTarget)})</p>
                    <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700">
                         <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${emergencyProgress}%` }}></div>
                         <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                             {formatCurrency(profile.currentSavings)} Saved
                         </span>
                    </div>
                </div>
            </div>
        )}

        {/* Goals View */}
        {activeTab === 'Goals' && (
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6 animate-in fade-in">
                 {/* Add Form */}
                 <form onSubmit={handleAddGoal} className="grid grid-cols-1 gap-3 mb-6">
                     <input type="text" placeholder="Goal Name (e.g. Hajj Fund)" value={goalName} onChange={e => setGoalName(e.target.value)} className="input-field" required />
                     <div className="grid grid-cols-2 gap-3">
                        <input type="number" placeholder="Target Amount" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} className="input-field" required />
                        <input type="date" value={goalDate} onChange={e => setGoalDate(e.target.value)} className="input-field" />
                     </div>
                     <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                         <Plus className="w-4 h-4" /> Add Goal
                     </button>
                 </form>

                 <div className="space-y-4">
                     {profile.goals.length === 0 && <p className="text-slate-600 text-center text-sm">No goals set yet.</p>}
                     {profile.goals.map(goal => {
                         const percent = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
                         const inflationAdjusted = goal.targetAmount * 1.10; // Simple 10% assumption
                         
                         return (
                             <div key={goal.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                 <div className="flex justify-between items-start mb-2">
                                     <div>
                                         <h4 className="font-bold text-slate-200">{goal.name}</h4>
                                         <p className="text-xs text-slate-500">Target: {formatCurrency(goal.targetAmount)} • {goal.deadline}</p>
                                     </div>
                                     <button onClick={() => deleteGoal(goal.id)} className="text-slate-600 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                                 </div>
                                 
                                 {/* Progress */}
                                 <div className="w-full h-3 bg-slate-900 rounded-full mb-2 relative">
                                     <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }}></div>
                                 </div>
                                 <div className="flex justify-between text-xs text-slate-400 mb-3">
                                     <span>{Math.round(percent)}% ({formatCurrency(goal.savedAmount)})</span>
                                     <span className="text-orange-400" title="Includes 10% inflation buffer">Inflation Adj: {formatCurrency(inflationAdjusted)}</span>
                                 </div>

                                 {/* Quick Add */}
                                 <div className="flex gap-2">
                                     <button onClick={() => updateGoalProgress(goal.id, 100000)} className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-white">+100k</button>
                                     <button onClick={() => updateGoalProgress(goal.id, 500000)} className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-white">+500k</button>
                                 </div>
                             </div>
                         )
                     })}
                 </div>
            </div>
        )}
        
        <style>{`
        .input-field {
            width: 100%;
            padding: 0.5rem;
            font-size: 0.875rem;
            background-color: #1e293b;
            border: 1px solid #334155;
            color: #f8fafc;
            border-radius: 0.5rem;
            outline: none;
        }
        .input-field:focus {
            border-color: #10b981;
        }
      `}</style>
    </div>
  );
};

export default FinancialTools;