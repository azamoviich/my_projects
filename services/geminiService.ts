import { GoogleGenAI } from "@google/genai";
import { UserProfile, TaxResult, Expense, Loan, Lending, Language, Goal } from "../types";
import { formatCurrency, BUDGET_MAPPING } from "../constants";

const getSystemInstruction = (profile: UserProfile, lang: Language) => {
    const langName = lang === 'UZ' ? 'Uzbek' : lang === 'RU' ? 'Russian' : 'English';
    const langCode = lang === 'UZ' ? 'uz' : lang === 'RU' ? 'ru' : 'en';
    
    return `
    You are a brutally honest, strict, and culturally aware financial advisor for ${profile.name || 'the user'}, a ${profile.age}-year-old ${profile.status} person living in ${profile.city || 'Uzbekistan'}.
    
    CRITICAL LANGUAGE REQUIREMENT:
    - You MUST reply ONLY in ${langName} (${langCode}).
    - NEVER switch to another language, even if the user asks in a different language.
    - If you cannot respond in ${langName}, say "I can only respond in ${langName}" and ask them to rephrase.
    - All numbers, calculations, and financial terms must be presented in ${langName}.
    
    Core Principles:
    1. **Blunt Truth:** Do not sugarcoat. If user buys coffee when broke, roast them nicely.
    2. **Islamic Finance:** Strictly adhere to Sharia. Interest (Riba) is HARAM. Suggest Halal investments (Gold, Sukuk, Trade).
    3. **Context:** User is ${profile.age} and ${profile.status}. Tailor advice (marriage saving vs house buying).
    4. **Proactive:** Suggest budget adjustments.
    
    Remember: ALWAYS respond in ${langName}. This is non-negotiable.
    `;
};

const createPrompt = (profile: UserProfile, taxResult: TaxResult, totalExpenses: number, loans: Loan[], lendings: Lending[]): string => {
  const totalDebt = loans.reduce((acc, loan) => acc + (loan.originalAmount - loan.paidAmount), 0);
  const totalLent = lendings.reduce((acc, l) => acc + (l.originalAmount - l.repaidAmount), 0);
  const netWorth = (profile.currentSavings + totalLent) - totalDebt;
  
  return `
    Financial Context:
    - Net Income: ${formatCurrency(taxResult.netIncomeThisMonth)}
    - Total Spent: ${formatCurrency(totalExpenses)}
    - Net Worth: ${formatCurrency(netWorth)}
    - Active Loans: ${loans.length}
    - Active Lendings: ${lendings.length}
  `;
};

// --- Reactive AI Logic (Local Simulation) ---

export const generateReaction = (actionType: 'EXPENSE' | 'INCOME' | 'LOAN' | 'LENDING' | 'GOAL', data: any, profile: UserProfile, lang: Language): string | null => {
    const t = (en: string, uz: string, ru: string) => lang === 'UZ' ? uz : lang === 'RU' ? ru : en;

    if (actionType === 'EXPENSE') {
        const { amount, description, category } = data;
        const lowerDesc = description.toLowerCase();

        // 1. Positive Keywords (Education/Skills)
        if (['cline', 'course', 'book', 'programming', 'code', 'skill', 'university', 'lesson'].some(k => lowerDesc.includes(k))) {
             return t(
                 `🚀 Excellent investment! Spending on "${description}" adds to your human capital. This will pay off 10x.`,
                 `🚀 Ajoyib sarmoya! "${description}" uchun sarflangan pul bilimingizni oshiradi. Bu kelajakda 10 barobar qaytadi.`,
                 `🚀 Отличная инвестиция! Траты на "${description}" увеличивают ваш капитал знаний. Это окупится в 10 раз.`
             );
        }

        // 2. Coffee/Taxi Habit Check
        if (lowerDesc.includes('coffee') || lowerDesc.includes('starbucks') || lowerDesc.includes('latte')) {
             if (amount > 20000) {
                 return t(
                     `☕ Again? ${formatCurrency(amount)} for coffee is steep. Brewing at home costs ~3,000 UZS. Save the difference!`,
                     `☕ Yana kofemi? ${formatCurrency(amount)} juda qimmat. Uyda damlasangiz ~3,000 so'm tushadi. Farqini tejang!`,
                     `☕ Опять? ${formatCurrency(amount)} за кофе — это дорого. Дома дешевле (~3000 сум). Экономьте разницу!`
                 );
             }
        }
        
        if (lowerDesc.includes('taxi') || lowerDesc.includes('yandex')) {
             return t(
                 `🚖 Taxi again? Could you have walked or taken the bus? Small leaks sink great ships.`,
                 `🚖 Yana taksimi? Piyoda yoki avtobusda yursangiz bo'lmasmidi? Kichik xarajatlar katta boylikni yeydi.`,
                 `🚖 Опять такси? Могли бы пройтись или поехать на автобусе? Малые траты топят большие корабли.`
             );
        }

        // 3. High Relative Expense
        if (amount > 1000000 && category !== 'Housing') {
            return t(
                `💸 Huge spend alert! ${formatCurrency(amount)}. I hope this was absolutely essential, ${profile.name}.`,
                `💸 Katta xarajat! ${formatCurrency(amount)}. Umid qilamanki, bu juda zarur edi, ${profile.name}.`,
                `💸 Огромная трата! ${formatCurrency(amount)}. Надеюсь, это было абсолютно необходимо, ${profile.name}.`
            );
        }
    }

    if (actionType === 'LOAN') {
         const { interestRate } = data;
         if (interestRate > 0) {
             return t(
                 `⛔ **HARAM ALERT**: You added a loan with ${interestRate}% interest. This is Riba. Pay this off immediately to purify your wealth.`,
                 `⛔ **HAROM**: Siz ${interestRate}% foizli qarz qo'shdingiz. Bu Ribo. Boyligingizni tozalash uchun buni darhol to'lang.`,
                 `⛔ **ХАРАМ**: Вы добавили кредит под ${interestRate}%. Это Риба. Погасите его немедленно.`
             );
         }
         return t(
             `📉 Loan added. Ensure you have a repayment plan. Debt is a heavy burden in Islam.`,
             `📉 Qarz qo'shildi. To'lash rejangiz borligiga ishonch hosil qiling. Qarz — Islomda og'ir yuk.`,
             `📉 Долг добавлен. Убедитесь, что есть план погашения. Долг — тяжкое бремя в Исламе.`
         );
    }

    if (actionType === 'LENDING') {
         const { expectedInterest } = data;
         if (expectedInterest > 0) {
             return t(
                 `⛔ Asking for interest/return is Riba. Lend as Qard Hasan (charity loan) or investment partnership only.`,
                 `⛔ Foiz talab qilish — Ribo. Faqat Qarz Hasana (xolis qarz) yoki sherikchilik asosida bering.`,
                 `⛔ Просить проценты — это Риба. Одалживайте только как Кард Хасан (благотворительный долг) или партнерство.`
             );
         }
         return t(
             `🤝 Ma'sha'Allah. Helping others with Qard Hasan is a great deed. Make sure to write it down (Surah Baqarah: 282).`,
             `🤝 Ma'sha'Allah. Boshqalarga yordam berish savobli ish. Qarzni yozib qo'yishni unutmang (Baqara: 282).`,
             `🤝 Машаллах. Помощь другим — благое дело. Не забудьте записать долг (Сура Бакара: 282).`
         );
    }

    if (actionType === 'GOAL') {
        const { targetAmount, name } = data;
        const inflated = Math.round(targetAmount * 1.10);
        return t(
            `🎯 New goal "${name}" set! Note: With ~10% inflation, you might actually need ${formatCurrency(inflated)} by next year.`,
            `🎯 Yangi maqsad "${name}"! Eslatma: ~10% inflatsiya bilan, kelasi yilga ${formatCurrency(inflated)} kerak bo'lishi mumkin.`,
            `🎯 Цель "${name}" добавлена! Учтите ~10% инфляцию: вам может понадобиться ${formatCurrency(inflated)}.`
        );
    }

    return null;
}


// --- Main Gemini API Call ---

export const getFinancialAdvice = async (
    profile: UserProfile, 
    taxResult: TaxResult, 
    expenses: Expense[], 
    loans: Loan[], 
    lendings: Lending[], 
    userQuery: string,
    lang: Language
): Promise<string> => {
  
  // 1. Local NLU Check
  const lower = userQuery.toLowerCase();
  
  // 2. Gemini API
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return lang === 'UZ' ? "API kaliti yo'q. (Local mode)" : "I need an API key for deep thinking.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const totalExpenses = Object.values(profile.expenses).reduce((a, b) => a + b, 0);

    const langName = lang === 'UZ' ? 'Uzbek' : lang === 'RU' ? 'Russian' : 'English';
    const langCode = lang === 'UZ' ? 'uz' : lang === 'RU' ? 'ru' : 'en';
    
    const finalPrompt = `
      ${getSystemInstruction(profile, lang)}
      ${createPrompt(profile, taxResult, totalExpenses, loans, lendings)}
      
      User Question: "${userQuery}"
      
      CRITICAL LANGUAGE REQUIREMENT - THIS IS MANDATORY:
      - You MUST respond ONLY in ${langName} (${langCode}).
      - NEVER use English, Russian, or Uzbek if the target language is different.
      - If the user asks in a different language, still respond in ${langName}.
      - All numbers, currency, and financial terms must be presented in ${langName}.
      - If you catch yourself writing in the wrong language, immediately stop and rewrite in ${langName}.
      
      Respond conversationally in ${langName}. If asked about budget, suggest 50/30/20.
      If asked about investment, suggest Gold or Sukuk.
      
      Remember: Your response language is ${langName}. This is non-negotiable.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
      config: { temperature: 0.7 }
    });

    return response.text || "No response.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection Error.";
  }
};