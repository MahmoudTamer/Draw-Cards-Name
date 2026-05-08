export type Language = 'ar' | 'en'
export type Currency = 'EGP' | 'SAR' | 'AED' | 'USD'
export type Category = 'electronics' | 'furniture' | 'clothing' | 'food' | 'transport' | 'other'
export type Verdict = 'Buy Now' | 'Wait' | 'Skip'

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
}

export interface UserProfile {
  monthlyIncome: number
  monthlyExpenses: number
  currency: Currency
  language: Language
  goals: SavingsGoal[]
}

export interface DecisionResult {
  score: number
  verdict_en: Verdict
  verdict_ar: string
  reasoning_en: string
  reasoning_ar: string
  installment_3: number
  installment_6: number
  installment_12: number
  goal_impact: GoalImpact[]
}

export interface GoalImpact {
  goalName: string
  monthsDelayed: number
  percentageOfGoal: number
}

export interface DecisionRecord {
  id: string
  date: string
  itemName: string
  price: number
  category: Category
  notes: string
  currency: Currency
  result: DecisionResult
}
