import React from 'react';
import { formatCurrency, TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface DebtPayoffProps {
  totalDebt: number;
  monthlySurplus: number;
  lang: Language;
}

const DebtPayoff: React.FC<DebtPayoffProps> = ({ totalDebt, monthlySurplus, lang }) => {
  const t = TRANSLATIONS[lang];
  const monthsToPayoff = monthlySurplus > 0 ? Math.ceil(totalDebt / monthlySurplus) : Infinity;
  
  // Calculate progress for a visual bar
  // If we pay 0 off, progress is 0. If we pay it all off, it's 100%.
  // This needs to be a timeline visualization.
  
  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6">
      <h3 className="text-lg font-bold text-slate-100 mb-2">{t.debtPayoff}</h3>
      
      {totalDebt === 0 ? (
          <div className="text-emerald-400 py-8 text-center font-bold">
              🎉 No Debt! You are free!
          </div>
      ) : (
          <div>
            <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Total Debt: {formatCurrency(totalDebt)}</span>
                <span>Monthly Free Cash: {formatCurrency(monthlySurplus)}</span>
            </div>
            
            {monthlySurplus <= 0 ? (
                <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
                    ⚠️ You have no surplus income to pay off debt. Cut expenses immediately!
                </div>
            ) : (
                <div className="space-y-4">
                     <div className="relative pt-6">
                        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-slate-800">
                             <div className="w-full shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-600 animate-pulse"></div>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-slate-400">
                            <span>Now</span>
                            <span>{monthsToPayoff} Months</span>
                        </div>
                     </div>
                     
                     <p className="text-sm text-slate-300">
                         If you commit all remaining budget ({formatCurrency(monthlySurplus)}) to debt, you will be debt-free in <span className="text-emerald-400 font-bold text-lg">{monthsToPayoff} months</span>.
                     </p>
                </div>
            )}
          </div>
      )}
    </div>
  );
};

export default DebtPayoff;