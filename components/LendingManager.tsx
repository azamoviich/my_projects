import React, { useState } from 'react';
import { Lending, Language } from '../types';
import { formatCurrency, TRANSLATIONS } from '../constants';
import { HandCoins, Plus, Trash2, Calendar, ChevronUp } from 'lucide-react';

interface LendingManagerProps {
  lendings: Lending[];
  onAddLending: (l: Lending) => void;
  onDeleteLending: (id: string) => void;
  onUpdateLending: (l: Lending) => void;
  lang: Language;
  onAction: (type: 'LENDING', data: any) => void;
}

const LendingManager: React.FC<LendingManagerProps> = ({ lendings, onAddLending, onDeleteLending, onUpdateLending, lang, onAction }) => {
  const t = TRANSLATIONS[lang];
  const [isExpanded, setIsExpanded] = useState(false);

  // Form
  const [borrower, setBorrower] = useState('');
  const [amount, setAmount] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [repaid, setRepaid] = useState('0');
  const [expectedInterest, setExpectedInterest] = useState('0');
  const [description, setDescription] = useState('');

  // Repayment State
  const [repaymentId, setRepaymentId] = useState<string | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState('');

  const formatWithSpaces = (val: string) =>
    val.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !borrower) return;

    const newItem: Lending = {
      id: crypto.randomUUID(),
      borrower,
      originalAmount: parseFloat(amount.replace(/\s/g, '')),
      repaidAmount: parseFloat(repaid.replace(/\s/g, '')),
      expectedInterest: parseFloat(expectedInterest),
      expectedReturnDate: returnDate,
      description,
      dateLent: new Date().toISOString()
    };

    onAddLending(newItem);
    onAction('LENDING', newItem);

    // Reset
    setBorrower(''); setAmount(''); setReturnDate(''); setRepaid('0'); setExpectedInterest('0'); setDescription('');
    setIsExpanded(false);
  };

  const handleRecordRepayment = (id: string) => {
      const item = lendings.find(l => l.id === id);
      if (!item || !repaymentAmount) return;
      
      const updated = { ...item, repaidAmount: item.repaidAmount + parseFloat(repaymentAmount.replace(/\s/g, '')) };
      onUpdateLending(updated);
      setRepaymentId(null);
      setRepaymentAmount('');
  };

  const totalLent = lendings.reduce((acc, curr) => acc + (curr.originalAmount - curr.repaidAmount), 0);

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <HandCoins className="w-5 h-5 text-yellow-500" />
            {t.lendingTitle}
        </h2>
        {totalLent > 0 && (
            <span className="bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold border border-yellow-800">
                +{formatCurrency(totalLent)}
            </span>
        )}
      </div>

       {/* Add Button */}
      {!isExpanded && (
          <button onClick={() => setIsExpanded(true)} className="w-full py-3 border border-slate-700 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm mb-4">
              <Plus className="w-4 h-4" /> Add Money I Lent
          </button>
      )}

      {isExpanded && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700 animate-in slide-in-from-top-2">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">New Asset (Loan Out)</span>
                <button type="button" onClick={() => setIsExpanded(false)} className="text-slate-500 hover:text-white"><ChevronUp className="w-4 h-4"/></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder={t.borrower} value={borrower} onChange={e => setBorrower(e.target.value)} className="input-field" required />
                <input
                  type="text"
                  placeholder="Amount Lent"
                  value={amount}
                  onChange={e => setAmount(formatWithSpaces(e.target.value))}
                  className="input-field"
                  required
                  inputMode="numeric"
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="input-field" placeholder={t.returnDate} required />
                <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="text-[10px] text-slate-500 uppercase">Interest (Should be 0)</label>
                    <input type="number" value={expectedInterest} onChange={e => setExpectedInterest(e.target.value)} className="input-field" />
                 </div>
                 <div>
                    <label className="text-[10px] text-slate-500 uppercase">Repaid Already</label>
                    <input
                      type="text"
                      value={repaid}
                      onChange={e => setRepaid(formatWithSpaces(e.target.value))}
                      className="input-field"
                      inputMode="numeric"
                    />
                 </div>
            </div>
            <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded text-sm font-semibold flex justify-center items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" /> Save
            </button>
        </form>
      )}

      <div className="space-y-4">
        {lendings.map(item => {
             const remaining = item.originalAmount - item.repaidAmount;
             const progress = (item.repaidAmount / item.originalAmount) * 100;
             const isOverdue = item.expectedReturnDate && new Date(item.expectedReturnDate) < new Date();

            return (
                <div key={item.id} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden relative">
                    <div className="p-4 flex justify-between items-start">
                        <div>
                            <div className="font-bold text-slate-200">{item.borrower}</div>
                            {item.expectedReturnDate && (
                                <div className={`text-xs mt-1 flex items-center gap-1 ${isOverdue ? 'text-red-400 font-bold' : 'text-yellow-300'}`}>
                                    <Calendar className="w-3 h-3"/> {isOverdue ? 'OVERDUE: ' : 'Exp: '} {item.expectedReturnDate}
                                </div>
                            )}
                            <div className="mt-3 text-xs text-slate-400">
                                Owed: <span className="text-yellow-400 font-bold">{formatCurrency(remaining)}</span>
                            </div>
                        </div>
                        <div className="text-right">
                             <button onClick={() => onDeleteLending(item.id)} className="text-slate-600 hover:text-red-500 mb-2 block ml-auto"><Trash2 className="w-4 h-4"/></button>
                        </div>
                    </div>
                     <div className="w-full h-2 bg-slate-900 mt-0 relative">
                        <div className="h-full bg-yellow-500" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                    <div className="p-2 bg-slate-800/50 border-t border-slate-700 flex justify-between items-center">
                         <div className="text-xs text-slate-400 pl-2">{Math.round(progress)}% Returned</div>
                         <button 
                            onClick={() => setRepaymentId(repaymentId === item.id ? null : item.id)}
                            className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded transition-colors"
                         >
                            Add Return
                         </button>
                    </div>
                     {repaymentId === item.id && (
                        <div className="p-3 bg-slate-900 border-t border-slate-700 animate-in slide-in-from-top-1 flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Amount Returned" 
                              value={repaymentAmount} 
                              onChange={e => setRepaymentAmount(formatWithSpaces(e.target.value))}
                              className="input-field flex-1"
                              inputMode="numeric"
                            />
                            <button onClick={() => handleRecordRepayment(item.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 rounded text-xs font-bold">
                                Save
                            </button>
                        </div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default LendingManager;