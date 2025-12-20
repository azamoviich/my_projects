import { UserProfile, TaxResult } from '../types';

export const calculateTaxes = (profile: UserProfile): TaxResult => {
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  
  // Sum income for current month
  const totalIncomeThisMonth = profile.salaryHistory
    .filter(entry => entry.date.startsWith(currentMonthStr))
    .reduce((sum, entry) => sum + entry.amount, 0);
  
  // Dynamic Tax Rate
  const rate = profile.taxRate || 0;
  const estimatedTax = totalIncomeThisMonth * (rate / 100);
  const netIncomeThisMonth = totalIncomeThisMonth - estimatedTax;
  
  return {
    totalIncomeThisMonth,
    estimatedTax,
    netIncomeThisMonth
  };
};