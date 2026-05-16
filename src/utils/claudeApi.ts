import { GoogleGenerativeAI } from '@google/generative-ai'
import type { UserProfile, DecisionResult, Category, Currency } from '../types'

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EGP: 'ج.م',
  SAR: 'ر.س',
  AED: 'د.إ',
  USD: '$',
}

function buildPrompt(
  itemName: string,
  price: number,
  category: Category,
  notes: string,
  profile: UserProfile,
): string {
  const disposableIncome = profile.monthlyIncome - profile.monthlyExpenses
  const priceToIncome = ((price / profile.monthlyIncome) * 100).toFixed(1)
  const currency = profile.currency
  const symbol = CURRENCY_SYMBOLS[currency]

  const goalsText = profile.goals.length > 0
    ? profile.goals.map(g => `- ${g.name}: target ${symbol}${g.targetAmount} by ${g.deadline}, saved ${symbol}${g.currentAmount} so far`).join('\n')
    : 'No savings goals set'

  return `You are a financial advisor for consumers in the MENA region. Analyze this purchase decision and return a JSON object ONLY — no extra text, no markdown code blocks, just raw JSON.

USER PROFILE:
- Monthly income: ${symbol}${profile.monthlyIncome} ${currency}
- Monthly fixed expenses: ${symbol}${profile.monthlyExpenses} ${currency}
- Disposable income: ${symbol}${disposableIncome} ${currency}
- Savings goals:
${goalsText}

PURCHASE REQUEST:
- Item: ${itemName}
- Price: ${symbol}${price} ${currency}
- Category: ${category}
- Price is ${priceToIncome}% of monthly income
- Notes: ${notes || 'None'}

Calculate installments (price / months) and analyze goal impact.

Return EXACTLY this JSON structure (no other text):
{
  "score": <integer 1-10>,
  "verdict_en": <"Buy Now" | "Wait" | "Skip">,
  "verdict_ar": <"اشترِ الآن" | "انتظر" | "تجاهل">,
  "reasoning_en": "<2-3 sentences in English explaining the decision>",
  "reasoning_ar": "<2-3 sentences in Arabic explaining the decision>",
  "installment_3": <price/3 rounded to 2 decimal places>,
  "installment_6": <price/6 rounded to 2 decimal places>,
  "installment_12": <price/12 rounded to 2 decimal places>,
  "goal_impact": [
    {
      "goalName": "<goal name>",
      "monthsDelayed": <number of months this purchase would delay achieving the goal>,
      "percentageOfGoal": <price as percentage of remaining goal amount, 0-100>
    }
  ]
}

Scoring guide:
- 8-10: Clearly affordable, good value, aligns with financial situation
- 5-7: Affordable but worth considering timing or alternatives
- 1-4: Strains budget significantly or poor timing given goals

verdict_en mapping: score 7-10 = "Buy Now", score 4-6 = "Wait", score 1-3 = "Skip"`
}

export async function analyzeDecision(
  itemName: string,
  price: number,
  category: Category,
  notes: string,
  profile: UserProfile,
): Promise<DecisionResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('API_KEY_MISSING')

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await model.generateContent(buildPrompt(itemName, price, category, notes, profile))
  const raw = result.response.text().trim()
    .replace(/^```json\s*/, '')
    .replace(/\s*```$/, '')

  return JSON.parse(raw) as DecisionResult
}
