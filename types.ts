export type ExpenseCategory = 'Food' | 'Transport' | 'Entertainment' | 'Housing' | 'Shopping' | 'Health' | 'Education' | 'Charity' | 'Other';
export type LoanType = 'Bank Loan' | 'Credit Card' | 'Personal Loan' | 'Other';
export type Language = 'EN' | 'UZ' | 'RU';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string; // ISO Date string
}

export interface SalaryEntry {
  id: string;
  amount: number;
  date: string;
  source: string;
}

export interface Loan {
  id: string;
  lender: string;
  originalAmount: number;
  interestRate: number; // %
  monthlyPayment: number;
  paidAmount: number;
  startDate: string;
  dueDate?: string;
  type: LoanType;
  description: string;
}

export interface Lending {
  id: string;
  borrower: string;
  originalAmount: number;
  repaidAmount: number;
  expectedInterest: number; // Should be 0 for Halal
  expectedReturnDate: string;
  dateLent: string;
  description: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  icon?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  city: string;
  status: 'Single' | 'Married' | 'Other';
  taxRate: number;
  salaryHistory: SalaryEntry[];
  expenses: Record<string, number>; 
  currentSavings: number; 
  goals: Goal[];
  emergencyFundMonth: number; // Calculated average monthly expense
}

export interface TaxResult {
  totalIncomeThisMonth: number;
  estimatedTax: number;
  netIncomeThisMonth: number;
}

export interface AiMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface BudgetConfig {
  needs: number; // 50
  wants: number; // 30
  savings: number; // 20
}