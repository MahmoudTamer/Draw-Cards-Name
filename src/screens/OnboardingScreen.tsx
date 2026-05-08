import { useState } from 'react'
import type { UserProfile, Currency, Language, SavingsGoal } from '../types'
import { t } from '../utils/i18n'
import { saveProfile } from '../utils/storage'

const currencies: Currency[] = ['EGP', 'SAR', 'AED', 'USD']

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void
  lang: Language
  setLang: (l: Language) => void
}

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function OnboardingScreen({ onComplete, lang, setLang }: OnboardingScreenProps) {
  const isRtl = lang === 'ar'
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [monthlyExpenses, setMonthlyExpenses] = useState('')
  const [currency, setCurrency] = useState<Currency>('EGP')
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [error, setError] = useState('')

  function addGoal() {
    if (goals.length >= 3) return
    setGoals(prev => [...prev, { id: generateId(), name: '', targetAmount: 0, currentAmount: 0, deadline: '' }])
  }

  function removeGoal(id: string) {
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  function updateGoal(id: string, field: keyof SavingsGoal, value: string | number) {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g))
  }

  function handleSubmit() {
    const income = parseFloat(monthlyIncome)
    const expenses = parseFloat(monthlyExpenses)

    if (!income || !expenses) {
      setError(t('fillRequired', lang))
      return
    }

    for (const g of goals) {
      if (!g.name || !g.targetAmount || !g.deadline) {
        setError(t('fillRequired', lang))
        return
      }
    }

    setError('')
    const profile: UserProfile = {
      monthlyIncome: income,
      monthlyExpenses: expenses,
      currency,
      language: lang,
      goals,
    }
    saveProfile(profile)
    onComplete(profile)
  }

  const inputClass = "w-full bg-navy-700 border border-navy-600 rounded-xl px-4 py-3 text-white placeholder-navy-600 focus:outline-none focus:border-gold transition-colors"
  const labelClass = "block text-gray-400 text-sm mb-1.5"

  return (
    <div className="min-h-screen bg-navy flex flex-col" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="px-6 pt-14 pb-8 text-center">
        <h1 className="text-3xl font-bold text-gold mb-2">{t('appName', lang)}</h1>
        <p className="text-gray-400 text-sm">{t('onboardingSubtitle', lang)}</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-8 space-y-5 overflow-y-auto">
        {/* Language Toggle */}
        <div>
          <label className={labelClass}>{t('language', lang)}</label>
          <div className="flex gap-3">
            {(['ar', 'en'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex-1 py-3 rounded-xl border font-medium text-sm transition-all duration-200 ${
                  lang === l
                    ? 'border-gold text-gold bg-gold/10'
                    : 'border-navy-600 text-gray-400 bg-navy-700'
                }`}
              >
                {l === 'ar' ? t('arabic', lang) : t('english', lang)}
              </button>
            ))}
          </div>
        </div>

        {/* Income */}
        <div>
          <label className={labelClass}>{t('monthlyIncome', lang)}</label>
          <input
            type="number"
            inputMode="numeric"
            value={monthlyIncome}
            onChange={e => setMonthlyIncome(e.target.value)}
            placeholder="0"
            className={inputClass}
            dir="ltr"
          />
        </div>

        {/* Expenses */}
        <div>
          <label className={labelClass}>{t('monthlyExpenses', lang)}</label>
          <input
            type="number"
            inputMode="numeric"
            value={monthlyExpenses}
            onChange={e => setMonthlyExpenses(e.target.value)}
            placeholder="0"
            className={inputClass}
            dir="ltr"
          />
        </div>

        {/* Currency */}
        <div>
          <label className={labelClass}>{t('currency', lang)}</label>
          <div className="grid grid-cols-4 gap-2">
            {currencies.map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                  currency === c
                    ? 'border-gold text-gold bg-gold/10'
                    : 'border-navy-600 text-gray-400 bg-navy-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Savings Goals */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass.replace('mb-1.5', '')}>{t('savingsGoals', lang)}</label>
            <span className="text-navy-600 text-xs">{t('upTo3Goals', lang)}</span>
          </div>

          <div className="space-y-4">
            {goals.map((goal, idx) => (
              <div key={goal.id} className="bg-navy-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gold text-xs font-medium">#{idx + 1}</span>
                  <button
                    onClick={() => removeGoal(goal.id)}
                    className="text-red-400 text-xs hover:text-red-300 transition-colors"
                  >
                    {t('removeGoal', lang)}
                  </button>
                </div>
                <input
                  type="text"
                  value={goal.name}
                  onChange={e => updateGoal(goal.id, 'name', e.target.value)}
                  placeholder={t('goalName', lang)}
                  className={inputClass}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  value={goal.targetAmount || ''}
                  onChange={e => updateGoal(goal.id, 'targetAmount', parseFloat(e.target.value) || 0)}
                  placeholder={t('targetAmount', lang)}
                  className={inputClass}
                  dir="ltr"
                />
                <input
                  type="date"
                  value={goal.deadline}
                  onChange={e => updateGoal(goal.id, 'deadline', e.target.value)}
                  className={`${inputClass} [color-scheme:dark]`}
                  dir="ltr"
                />
              </div>
            ))}
          </div>

          {goals.length < 3 && (
            <button
              onClick={addGoal}
              className="mt-3 w-full py-3 rounded-xl border border-dashed border-navy-600 text-gold text-sm font-medium hover:border-gold transition-colors"
            >
              + {t('addGoal', lang)}
            </button>
          )}
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl bg-gold text-navy font-bold text-base hover:bg-gold-dark active:scale-95 transition-all duration-200"
        >
          {t('getStarted', lang)}
        </button>
      </div>
    </div>
  )
}
