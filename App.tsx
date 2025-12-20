import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, TaxResult, Expense, Loan, Lending, AiMessage, Language } from './types';
import { INITIAL_PROFILE, formatCurrency, TRANSLATIONS } from './constants';
import { calculateTaxes } from './services/taxService';
import { generateReaction } from './services/geminiService';
import InputSection from './components/InputSection';
import ExpenseTracker from './components/ExpenseTracker';
import BreakdownChart from './components/BreakdownChart';
import FloatingChat from './components/FloatingChat';
import LoanManager from './components/LoanManager';
import LendingManager from './components/LendingManager';
import FinancialTools from './components/FinancialTools';
import OnboardingModal from './components/OnboardingModal';
import AuthModal from './components/AuthModal';
import { TrendingUp, Clock, Globe, Menu } from 'lucide-react';
import { AuthUser, getMe, saveStateRemote } from './services/authService';

const App: React.FC = () => {
  // --- State ---
  // CRITICAL: Language priority: URL param > preferred_lang > local > 'EN'
  const params = new URLSearchParams(window.location.search);
  const urlLangParam = params.get('lang');
  
  // Determine initial language with correct priority
  const getInitialLang = (): Language => {
    // Priority 1: URL param from bot
    if (urlLangParam === 'uz') return 'UZ';
    if (urlLangParam === 'ru') return 'RU';
    if (urlLangParam === 'en') return 'EN';
    
    // Priority 2: Check localStorage for saved user's preferred_lang
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as AuthUser;
        if (parsedUser.preferred_lang === 'UZ' || parsedUser.preferred_lang === 'RU' || parsedUser.preferred_lang === 'EN') {
          return parsedUser.preferred_lang as Language;
        }
      } catch {}
    }
    
    // Priority 3: Check localStorage for saved lang
    const savedData = localStorage.getItem('uz_finance_app_v5');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.lang === 'UZ' || parsed.lang === 'RU' || parsed.lang === 'EN') {
          return parsed.lang;
        }
      } catch {}
    }
    
    // Priority 4: Default to EN
    return 'EN';
  };

  const [lang, setLang] = useState<Language>(getInitialLang());
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [chatHistory, setChatHistory] = useState<AiMessage[]>([]);
  const [taxResult, setTaxResult] = useState<TaxResult>(() => calculateTaxes(INITIAL_PROFILE));
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mobile nav toggle
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Ref to prevent saving during initial load
  const isInitialLoad = useRef(true);

  const t = TRANSLATIONS[lang];

  // --- Effects ---

  // 1. Load auth + data on mount
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      const savedToken = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('authUser');
      
      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser) as AuthUser;
          setAuthToken(savedToken);
          setAuthUser(parsedUser);
          
          // Load remote state
          const data = await getMe(savedToken);
          
          if (data.state) {
            const parsed = data.state;
            
            // Migrate loans
            const migratedLoans = (parsed.loans || []).map((l: any) => ({
              ...l,
              originalAmount: l.originalAmount || l.amount || 0,
              paidAmount: l.paidAmount || 0,
              monthlyPayment: l.monthlyPayment || 0,
              interestRate: l.interestRate || 0,
              description: l.description || l.type || '',
            }));
            
            // Migrate lendings
            const migratedLendings = (parsed.lendings || []).map((l: any) => ({
              ...l,
              originalAmount: l.originalAmount || l.amount || 0,
              repaidAmount: l.repaidAmount || 0,
              expectedInterest: l.expectedInterest || 0,
              description: l.description || 'Lent money',
            }));
            
            // Restore state
            setProfile({ ...INITIAL_PROFILE, ...parsed.profile, goals: parsed.profile?.goals || [] });
            setExpenses(parsed.expenses || []);
            setLoans(migratedLoans);
            setLendings(migratedLendings);
            setChatHistory(parsed.chatHistory || []);
            
            // Language: URL param takes priority (already set in initial state)
            // Only use saved lang if no URL param
            if (!urlLangParam && parsed.lang) {
              setLang(parsed.lang);
            }
            
            // Check if onboarding needed
            if (!parsed.profile?.name) {
              setShowOnboarding(true);
            } else {
              setShowOnboarding(false);
            }
          } else {
            // No state exists, show onboarding
            setShowOnboarding(true);
          }
        } catch (err) {
          console.error('Failed to load user data:', err);
          // On error, clear auth and show login
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          setShowAuth(true);
        }
      } else {
        // No auth, show login
        setShowAuth(true);
      }
      
      setIsLoading(false);
      isInitialLoad.current = false;
    };
    
    loadUserData();
  }, []); // Only run on mount

  // 2. Save Data (local + remote if logged in) - but skip during initial load
  useEffect(() => {
    if (isInitialLoad.current) return;
    
    const result = calculateTaxes(profile);
    setTaxResult(result);

    const currentMonthStr = new Date().toISOString().slice(0, 7);
    const currentMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonthStr));
    const aggregated = currentMonthExpenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    const updatedProfileToSave = { ...profile, expenses: aggregated };
    
    // Save to localStorage
    localStorage.setItem('uz_finance_app_v5', JSON.stringify({
      profile: updatedProfileToSave,
      expenses,
      loans,
      lendings,
      chatHistory,
      lang
    }));

    // Save to backend if authenticated
    if (authToken && authUser) {
      saveStateRemote(authToken, {
        profile: updatedProfileToSave,
        expenses,
        loans,
        lendings,
        chatHistory,
        lang, // Include language in saved state
      }).catch(err => {
        console.error('Failed to save state remotely:', err);
      });
    }
  }, [profile, expenses, loans, lendings, chatHistory, lang, authToken, authUser]);

  // 3. Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-GB', { 
        timeZone: 'Asia/Tashkent', 
        hour: '2-digit', 
        minute: '2-digit'
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Logic ---

  // Handle language change - save immediately to backend
  const handleLangChange = async (newLang: Language) => {
    setLang(newLang);
    
    // Save to localStorage immediately
    const savedData = localStorage.getItem('uz_finance_app_v5');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        parsed.lang = newLang;
        localStorage.setItem('uz_finance_app_v5', JSON.stringify(parsed));
      } catch {}
    }
    
    // Save to backend if authenticated
    if (authToken && authUser) {
      const currentMonthStr = new Date().toISOString().slice(0, 7);
      const currentMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonthStr));
      const aggregated = currentMonthExpenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {} as Record<string, number>);
      
      const updatedProfileToSave = { ...profile, expenses: aggregated };
      
      try {
        await saveStateRemote(authToken, {
          profile: updatedProfileToSave,
          expenses,
          loans,
          lendings,
          chatHistory,
          lang: newLang, // Save new language
        });
      } catch (err) {
        console.error('Failed to save language change:', err);
      }
    }
  };

  const handleOnboardingSave = async (details: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...details };
    setProfile(updatedProfile);
    setShowOnboarding(false);
    
    // Save profile to backend immediately after onboarding
    if (authToken) {
      try {
        const currentMonthStr = new Date().toISOString().slice(0, 7);
        const currentMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonthStr));
        const aggregated = currentMonthExpenses.reduce((acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
          return acc;
        }, {} as Record<string, number>);
        
        const profileToSave = { ...updatedProfile, expenses: aggregated };
        
        await saveStateRemote(authToken, {
          profile: profileToSave,
          expenses,
          loans,
          lendings,
          chatHistory,
          lang,
        });
      } catch (err) {
        console.error('Failed to save profile after onboarding:', err);
      }
    }
    
    // Welcome message in current language
    const welcomeMsg: AiMessage = {
      id: crypto.randomUUID(),
      role: 'model',
      text: lang === 'UZ' 
        ? `Xush kelibsiz, ${details.name}! Men sizga ${details.city}da yordam berishga tayyorman. Moliyangizni halol tarzda boshqaramiz.`
        : lang === 'RU'
        ? `Добро пожаловать, ${details.name}! Я готов помочь вам в ${details.city}. Давайте управлять финансами халяльным способом.`
        : `Welcome ${details.name}! I am set up to help you in ${details.city}. Let's manage your finances the Halal way.`,
      timestamp: Date.now()
    };
    setChatHistory(prev => [...prev, welcomeMsg]);
    setUnreadCount(prev => prev + 1);
  };

  const handleAiReaction = (type: 'EXPENSE' | 'INCOME' | 'LOAN' | 'LENDING' | 'GOAL', data: any) => {
    const reaction = generateReaction(type, data, profile, lang);
    if (reaction) {
      const msg: AiMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: reaction,
        timestamp: Date.now()
      };
      setChatHistory(prev => [...prev, msg]);
      setUnreadCount(prev => prev + 1);
    }
  };

  // --- Derived Stats ---
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const totalMonthExpenses = expenses
    .filter(e => e.date.startsWith(currentMonthStr))
    .reduce((sum, e) => sum + e.amount, 0);

  const totalDebt = loans.reduce((acc, l) => acc + (l.originalAmount - l.paidAmount), 0);
  const totalLent = lendings.reduce((acc, l) => acc + (l.originalAmount - l.repaidAmount), 0);
  const netIncome = taxResult.netIncomeThisMonth;
  const monthlySurplus = netIncome - totalMonthExpenses;
  const netWorth = (profile.currentSavings + totalLent) - totalDebt;

  // Handlers
  const handleAddExpense = (newExpense: Expense) => setExpenses(prev => [newExpense, ...prev]);
  const handleDeleteExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));
  
  const handleAddLoan = (newLoan: Loan) => setLoans(prev => [...prev, newLoan]);
  const handleDeleteLoan = (id: string) => setLoans(prev => prev.filter(l => l.id !== id));
  const handleUpdateLoan = (updated: Loan) => setLoans(prev => prev.map(l => l.id === updated.id ? updated : l));

  const handleAddLending = (newL: Lending) => setLendings(prev => [...prev, newL]);
  const handleDeleteLending = (id: string) => setLendings(prev => prev.filter(l => l.id !== id));
  const handleUpdateLending = (updated: Lending) => setLendings(prev => prev.map(l => l.id === updated.id ? updated : l));

  const handleAuthSuccess = async (user: AuthUser, token: string) => {
    setAuthUser(user);
    setAuthToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    setShowAuth(false);
    
    // Language: URL param takes priority, but if no URL param, use user's preferred_lang
    if (!urlLangParam) {
      if (user.preferred_lang === 'UZ' || user.preferred_lang === 'RU' || user.preferred_lang === 'EN') {
        setLang(user.preferred_lang as Language);
      }
    }
    
    // Fetch existing user data to check if profile is complete
    try {
      const data = await getMe(token);
      if (data.state && data.state.profile && data.state.profile.name) {
        // Profile exists, load it and skip onboarding
        const parsed = data.state;
        const migratedLoans = (parsed.loans || []).map((l: any) => ({
          ...l,
          originalAmount: l.originalAmount || l.amount || 0,
          paidAmount: l.paidAmount || 0,
          monthlyPayment: l.monthlyPayment || 0,
          interestRate: l.interestRate || 0,
          description: l.description || l.type || '',
        }));
        const migratedLendings = (parsed.lendings || []).map((l: any) => ({
          ...l,
          originalAmount: l.originalAmount || l.amount || 0,
          repaidAmount: l.repaidAmount || 0,
          expectedInterest: l.expectedInterest || 0,
          description: l.description || 'Lent money',
        }));
        setProfile({ ...INITIAL_PROFILE, ...parsed.profile, goals: parsed.profile?.goals || [] });
        setExpenses(parsed.expenses || []);
        setLoans(migratedLoans);
        setLendings(migratedLendings);
        setChatHistory(parsed.chatHistory || []);
        
        // Language: URL param takes priority
        if (!urlLangParam && parsed.lang) {
          setLang(parsed.lang);
        }
        
        setShowOnboarding(false); // Skip onboarding if profile exists
      } else {
        // No profile yet, show onboarding
        setShowOnboarding(true);
      }
    } catch (err) {
      console.error('Failed to load user data after auth:', err);
      // If fetch fails, show onboarding as fallback
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
    setAuthToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('uz_finance_app_v5');
    setProfile(INITIAL_PROFILE);
    setExpenses([]);
    setLoans([]);
    setLendings([]);
    setChatHistory([]);
    setShowOnboarding(false);
    setShowAuth(true);
    // Reset language to URL param or default
    setLang(getInitialLang());
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">{t.appTitle}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 font-sans selection:bg-emerald-500 selection:text-white">
      <AuthModal
        isOpen={showAuth}
        lang={lang}
        onAuthSuccess={handleAuthSuccess}
      />
      <OnboardingModal 
        isOpen={showOnboarding && !!authUser} 
        onSave={handleOnboardingSave} 
        lang={lang} 
        setLang={handleLangChange} 
      />
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-900/50">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-100 tracking-tight leading-none">{t.appTitle}</h1>
              <p className="text-[10px] md:text-xs text-slate-400">{profile.name ? `${profile.name} • ` : ''}{t.subTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-mono font-medium text-slate-300">{currentTime || '--:--'}</span>
            </div>
            
            {/* Lang Selector */}
            <div className="relative group hidden md:block">
              <button className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold">{lang}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-24 bg-slate-800 border border-slate-700 rounded-lg shadow-xl hidden group-hover:block z-50">
                {['EN', 'UZ', 'RU'].map(l => (
                  <button 
                    key={l} 
                    onClick={() => { handleLangChange(l as Language); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700 text-slate-300 hover:text-white first:rounded-t-lg last:rounded-b-lg"
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            
            {/* AI Assistant trigger */}
            <button
              type="button"
              onClick={() => { setIsChatOpen(prev => !prev); setUnreadCount(0); }}
              className="hidden md:flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg border border-blue-500 text-xs font-semibold text-white shadow-sm"
            >
              <TrendingUp className="w-4 h-4" />
              <span>AI Assistant</span>
            </button>
            
            {authUser && (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden md:inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-200"
              >
                <span>Log out</span>
              </button>
            )}
            
            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-slate-400" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 p-4 space-y-2">
            {['EN', 'UZ', 'RU'].map(l => (
              <button 
                key={l} 
                onClick={() => { handleLangChange(l as Language); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-2 rounded ${lang === l ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
              >
                {l}
              </button>
            ))}
            <button
              onClick={() => { setIsChatOpen(prev => !prev); setShowMobileMenu(false); setUnreadCount(0); }}
              className="w-full text-left px-4 py-2 rounded bg-blue-600 text-white mt-2"
            >
              AI Assistant
            </button>
            {authUser && (
              <button
                onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                className="w-full text-left px-4 py-2 rounded bg-slate-700 text-white mt-2"
              >
                Log out
              </button>
            )}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (Inputs & Assets) */}
          <div className="lg:col-span-5 space-y-6">
            <FinancialTools profile={profile} onUpdateProfile={setProfile} lang={lang} netWorth={netWorth} onAction={handleAiReaction} />
            <InputSection profile={profile} setProfile={setProfile} lang={lang} onAction={handleAiReaction} />
            <LoanManager loans={loans} onAddLoan={handleAddLoan} onDeleteLoan={handleDeleteLoan} onUpdateLoan={handleUpdateLoan} lang={lang} onAction={handleAiReaction} />
            <LendingManager lendings={lendings} onAddLending={handleAddLending} onDeleteLending={handleDeleteLending} onUpdateLending={handleUpdateLending} lang={lang} onAction={handleAiReaction} />
          </div>

          {/* Right Column (Analytics & Expenses) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-16 h-16 text-slate-500"/></div>
                <p className="text-sm font-medium text-slate-400 mb-1">{t.spentThisMonth}</p>
                <p className="text-3xl font-bold text-slate-100">{formatCurrency(totalMonthExpenses)}</p>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
                <p className="text-sm font-medium text-slate-400 mb-1">{t.remainingBudget}</p>
                <p className={`text-3xl font-bold ${monthlySurplus >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                  {formatCurrency(monthlySurplus)}
                </p>
              </div>
            </div>

            {/* Expenses */}
            <ExpenseTracker 
              expenses={expenses} 
              onAddExpense={handleAddExpense} 
              onDeleteExpense={handleDeleteExpense} 
              lang={lang} 
              onAction={handleAiReaction}
            />

            {/* Visuals */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
                <h3 className="text-lg font-bold text-slate-100 mb-4">{t.monthlyBreakdown}</h3>
                {totalMonthExpenses > 0 ? (
                  <BreakdownChart taxResult={taxResult} expenses={profile.expenses} />
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-600 bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-800">
                    {t.noData}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat controlled from header buttons */}
      <FloatingChat 
        profile={profile} 
        taxResult={taxResult} 
        expenses={expenses} 
        loans={loans}
        lendings={lendings}
        history={chatHistory} 
        onUpdateHistory={setChatHistory} 
        lang={lang}
        isOpen={isChatOpen}
        onToggle={() => { setIsChatOpen(prev => !prev); if (!isChatOpen) setUnreadCount(0); }}
      />

    </div>
  );
};

export default App;
