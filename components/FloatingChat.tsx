import React, { useEffect, useRef } from 'react';
import { UserProfile, TaxResult, AiMessage, Expense, Loan, Lending, Language } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';
import { MessageSquare, Bot, X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface FloatingChatProps {
  profile: UserProfile;
  taxResult: TaxResult;
  expenses: Expense[];
  loans: Loan[];
  lendings: Lending[];
  history: AiMessage[];
  onUpdateHistory: (msgs: AiMessage[]) => void;
  lang: Language;
  isOpen: boolean;
  onToggle: () => void;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ profile, taxResult, expenses, loans, lendings, history, onUpdateHistory, lang, isOpen, onToggle }) => {
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  // Initialize with welcome if empty
  useEffect(() => {
    if (history.length === 0) {
      onUpdateHistory([{
        id: 'init',
        role: 'model',
        text: lang === 'UZ' ? 'Salom! Men sizning halol moliyaviy yordamchingizman.' : 
              lang === 'RU' ? 'Привет! Я ваш честный финансовый помощник.' :
              'Hello! I am your brutally honest financial advisor.',
        timestamp: Date.now()
      }]);
    }
  }, [lang]); 

  useEffect(() => {
    if (isOpen) {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: AiMessage = { id: crypto.randomUUID(), role: 'user', text: input, timestamp: Date.now() };
    const newHistory = [...history, userMsg];
    onUpdateHistory(newHistory);
    setInput('');
    setIsLoading(true);

    try {
        const responseText = await getFinancialAdvice(profile, taxResult, expenses, loans, lendings, userMsg.text, lang);
        const botMsg: AiMessage = { id: crypto.randomUUID(), role: 'model', text: responseText, timestamp: Date.now() };
        onUpdateHistory([...newHistory, botMsg]);
    } catch (e) {
        const errMsg: AiMessage = { id: crypto.randomUUID(), role: 'model', text: "Connection failed.", timestamp: Date.now() };
        onUpdateHistory([...newHistory, errMsg]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window - bottom sheet on mobile, panel on desktop */}
      {isOpen && (
        <div className="
          fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:right-8
          w-full md:w-96 max-h-[70vh]
          bg-slate-900 rounded-t-2xl md:rounded-2xl shadow-2xl border border-slate-700
          z-50 flex flex-col overflow-hidden
          md:transform md:-translate-y-1/2
        ">
           
           {/* Header */}
           <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-900/50 p-2 rounded-full border border-blue-700">
                    <Bot className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-200 text-sm">{t.appTitle}</h3>
                    <p className="text-[10px] text-slate-400">Strict & Halal Mode</p>
                </div>
              </div>
              {/* Close button inside chat */}
              <button
                type="button"
                onClick={onToggle}
                className="p-1 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
           </div>

           {/* Messages */}
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950 scrollbar-hide h-80">
              {history.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                      }`}>
                          {msg.role === 'model'
                              ? <div className="prose prose-invert prose-sm max-w-none"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                              : msg.text}
                      </div>
                  </div>
              ))}
              {isLoading && (
                  <div className="flex justify-start">
                      <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none text-xs text-slate-400">Thinking...</div>
                  </div>
              )}
              <div ref={scrollRef} />
           </div>

           {/* Input */}
           <div className="p-3 border-t border-slate-700 bg-slate-900 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.chatPlaceholder}
                className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 text-white p-2 rounded-full disabled:bg-slate-700 hover:bg-blue-500"
              >
                  <Send className="w-4 h-4" />
              </button>
           </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;