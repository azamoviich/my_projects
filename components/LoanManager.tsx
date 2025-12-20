import React, { useState } from 'react';
import { Loan, LoanType, Language } from '../types';
import { LOAN_TYPES, formatCurrency, TRANSLATIONS, COLORS } from '../constants';
import { CreditCard, Plus, Trash2, Calendar, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react';

interface LoanManagerProps {
  loans: Loan[];
  onAddLoan: (loan: Loan) => void;
  onDeleteLoan: (id: string) => void;
  onUpdateLoan: (loan: Loan) => void; // New prop for payments
  lang: Language;
  onAction: (type: 'LOAN', data: any) => void;
}

const LoanManager: React.FC<LoanManagerProps> = ({ loans, onAddLoan, onDeleteLoan, onUpdateLoan, lang, onAction }) => {
  const t = TRANSLATIONS[lang];
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Form State
  const [lender, setLender] = useState('');
  const [amount, setAmount] = useState('');
  const [interest, setInterest] = useState('0');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [paid, setPaid] = useState('0');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<LoanType>('Bank Loan');
  const [description, setDescription] = useState('');

  // Payment Modal State
  const [paymentLoanId, setPaymentLoanId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  const parseNumber = (val: string) => Number(val.replace(/\s/g, ''));
  const formatWithSpaces = (val: string) =>
    val.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !lender) return;

    const newLoan: Loan = {
      id: crypto.randomUUID(),
      lender,
      originalAmount: parseFloat(amount.replace(/\s/g, '')),
      interestRate: parseFloat(interest),
      monthlyPayment: parseFloat(monthlyPayment.replace(/\s/g, '')) || 0,
      paidAmount: parseFloat(paid.replace(/\s/g, '')),
      startDate,
      type,
      description
    };

    onAddLoan(newLoan);
    onAction('LOAN', newLoan);

    // Reset
    setLender(''); setAmount(''); setInterest('0'); setMonthlyPayment(''); setPaid('0'); setDescription('');
    setIsExpanded(false);
  };

  const handleRecordPayment = (id: string) => {
      const loan = loans.find(l => l.id === id);
      if (!loan || !paymentAmount) return;
      
      const updated = { ...loan, paidAmount: loan.paidAmount + parseFloat(paymentAmount.replace(/\s/g, '')) };
      onUpdateLoan(updated);
      setPaymentLoanId(null);
      setPaymentAmount('');
  };

  const totalDebt = loans.reduce((acc, curr) => acc + (curr.originalAmount - curr.paidAmount), 0);
  const totalOriginal = loans.reduce((acc, curr) => acc + curr.originalAmount, 0);

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-rose-500" />
            {t.loansTitle}
        </h2>
        {totalDebt > 0 && (
            <span className="bg-rose-900/30 text-rose-400 px-3 py-1 rounded-full text-xs font-bold border border-rose-800">
                -{formatCurrency(totalDebt)}
            </span>
        )}
      </div>

      {/* Add Button */}
      {!isExpanded && (
          <button onClick={() => setIsExpanded(true)} className="w-full py-3 border border-slate-700 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm mb-4">
              <Plus className="w-4 h-4" /> Add New Loan / Credit
          </button>
      )}

      {/* Form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700 animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">New Liability</span>
                <button type="button" onClick={() => setIsExpanded(false)} className="text-slate-500 hover:text-white"><ChevronUp className="w-4 h-4"/></button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder={t.lender} value={lender} onChange={e => setLender(e.target.value)} className="input-field" required />
                <input
                  type="text"
                  placeholder="Original Amount"
                  value={amount}
                  onChange={e => setAmount(formatWithSpaces(e.target.value))}
                  className="input-field"
                  required
                  inputMode="numeric"
                />
            </div>
            <div className="grid grid-cols-3 gap-3">
                 <div>
                    <label className="text-[10px] text-slate-500 uppercase">Interest %</label>
                    <input type="number" value={interest} onChange={e => setInterest(e.target.value)} className={`input-field ${parseFloat(interest) > 0 ? 'text-red-500 border-red-900' : ''}`} />
                 </div>
                 <div>
                    <label className="text-[10px] text-slate-500 uppercase">Monthly Pay</label>
                    <input
                      type="text"
                      value={monthlyPayment}
                      onChange={e => setMonthlyPayment(formatWithSpaces(e.target.value))}
                      className="input-field"
                      inputMode="numeric"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] text-slate-500 uppercase">Paid So Far</label>
                    <input
                      type="text"
                      value={paid}
                      onChange={e => setPaid(formatWithSpaces(e.target.value))}
                      className="input-field"
                      inputMode="numeric"
                    />
                 </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <select value={type} onChange={e => setType(e.target.value as LoanType)} className="input-field">
                    {LOAN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" />
            </div>
            <input type="text" placeholder="Description (e.g. Phone Installment)" value={description} onChange={e => setDescription(e.target.value)} className="input-field" />
            
            <button type="submit" className="w-full bg-rose-700 hover:bg-rose-800 text-white py-2 rounded text-sm font-semibold flex justify-center items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" /> Save Loan
            </button>
        </form>
      )}

      {/* List */}
      <div className="space-y-4">
        {loans.map(loan => {
            const remaining = loan.originalAmount - loan.paidAmount;
            const progress = (loan.paidAmount / loan.originalAmount) * 100;
            const monthsLeft = loan.monthlyPayment > 0 ? Math.ceil(remaining / loan.monthlyPayment) : Infinity;
            const isRiba = loan.interestRate > 0;

            return (
                <div key={loan.id} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden relative">
                    {/* Header */}
                    <div className="p-4 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-200">{loan.lender}</h3>
                                {isRiba && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded font-bold">HARAM</span>}
                            </div>
                            <p className="text-xs text-slate-500">{loan.type} • {loan.description}</p>
                            
                            <div className="mt-3 flex items-center gap-4 text-xs">
                                <div className="text-slate-400">
                                    Total: <span className="text-slate-200">{formatCurrency(loan.originalAmount)}</span>
                                </div>
                                <div className="text-slate-400">
                                    Left: <span className="text-rose-400 font-bold">{formatCurrency(remaining)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                             <button onClick={() => onDeleteLoan(loan.id)} className="text-slate-600 hover:text-red-500 mb-2 block ml-auto"><Trash2 className="w-4 h-4"/></button>
                             {monthsLeft !== Infinity && <div className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded">~{monthsLeft} mo. left</div>}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-900 mt-2 relative">
                        <div className={`h-full ${isRiba ? 'bg-red-600' : 'bg-emerald-500'}`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-2 bg-slate-800/50 border-t border-slate-700 flex justify-between items-center">
                         <div className="text-xs text-slate-400 pl-2">{Math.round(progress)}% Paid</div>
                         <button 
                            onClick={() => setPaymentLoanId(paymentLoanId === loan.id ? null : loan.id)}
                            className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded transition-colors"
                         >
                            Record Payment
                         </button>
                    </div>

                    {/* Payment Input */}
                    {paymentLoanId === loan.id && (
                        <div className="p-3 bg-slate-900 border-t border-slate-700 animate-in slide-in-from-top-1 flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Amount" 
                              value={paymentAmount} 
                              onChange={e => setPaymentAmount(formatWithSpaces(e.target.value))}
                              className="input-field flex-1"
                              inputMode="numeric"
                            />
                            <button onClick={() => handleRecordPayment(loan.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 rounded text-xs font-bold">
                                Save
                            </button>
                        </div>
                    )}
                </div>
            );
        })}
      </div>
      
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
            ring: 2px solid #3b82f6;
            border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default LoanManager;