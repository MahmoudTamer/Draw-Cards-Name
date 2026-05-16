import { useState } from 'react'
import type { SavingsGoal, Language, Currency, DecisionRecord } from '../types'
import { t } from '../utils/i18n'
import { updateGoalAmount } from '../utils/storage'

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EGP: 'ج.م', SAR: 'ر.س', AED: 'د.إ', USD: '$',
}

interface GoalsScreenProps {
  goals: SavingsGoal[]
  currency: Currency
  lang: Language
  history: DecisionRecord[]
  onGoalUpdated: (goalId: string, newAmount: number) => void
}

function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct))
  const color = clamped >= 75 ? 'bg-green-400' : clamped >= 40 ? 'bg-gold' : 'bg-blue-400'
  return (
    <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

function formatDate(iso: string, lang: Language) {
  try {
    return new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch {
    return iso
  }
}

export default function GoalsScreen({ goals, currency, lang, history, onGoalUpdated }: GoalsScreenProps) {
  const isRtl = lang === 'ar'
  const sym = CURRENCY_SYMBOLS[currency]
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  function savedFromDecisions(goalName: string): number {
    return history
      .filter(r => r.result.verdict_en !== 'Buy Now' && r.result.goal_impact.some(g => g.goalName === goalName))
      .reduce((sum, r) => sum + r.price, 0)
  }

  function startEdit(goal: SavingsGoal) {
    setEditingId(goal.id)
    setEditValue(String(goal.currentAmount))
  }

  function saveEdit(goalId: string) {
    const val = parseFloat(editValue)
    if (!isNaN(val) && val >= 0) {
      updateGoalAmount(goalId, val)
      onGoalUpdated(goalId, val)
    }
    setEditingId(null)
  }

  return (
    <div className="flex flex-col min-h-full" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">{t('goalsTitle', lang)}</h1>
      </div>

      {goals.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-navy-800 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-navy-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-white font-semibold">{t('noGoals', lang)}</p>
          <p className="text-navy-600 text-sm">{t('noGoalsDesc', lang)}</p>
        </div>
      ) : (
        <div className="flex-1 px-6 pb-24 overflow-y-auto space-y-4">
          {goals.map(goal => {
            const pct = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
            const fromDecisions = savedFromDecisions(goal.name)

            return (
              <div key={goal.id} className="bg-navy-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-white font-semibold">{goal.name}</p>
                    <p className="text-navy-600 text-xs mt-0.5">{formatDate(goal.deadline, lang)}</p>
                  </div>
                  <span className="text-gold text-sm font-bold shrink-0">{pct.toFixed(0)}%</span>
                </div>

                <ProgressBar pct={pct} />

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-navy-700 rounded-xl p-3">
                    <p className="text-navy-600 text-xs mb-1">{t('currentSaved', lang)}</p>
                    <p className="text-white font-bold">{sym}{goal.currentAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-navy-700 rounded-xl p-3">
                    <p className="text-navy-600 text-xs mb-1">{t('targetAmount', lang)}</p>
                    <p className="text-white font-bold">{sym}{goal.targetAmount.toLocaleString()}</p>
                  </div>
                </div>

                {fromDecisions > 0 && (
                  <div className="flex items-center gap-2 bg-green-400/5 border border-green-400/20 rounded-xl px-3 py-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-green-400 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-400 text-xs">
                      {sym}{fromDecisions.toLocaleString()} {t('savedFromDecisions', lang)}
                    </p>
                  </div>
                )}

                {editingId === goal.id ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="flex-1 bg-navy-700 border border-gold rounded-xl px-4 py-2.5 text-white focus:outline-none"
                      dir="ltr"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(goal.id)}
                      className="px-4 py-2.5 rounded-xl bg-gold text-navy font-semibold text-sm"
                    >
                      {t('save', lang)}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2.5 rounded-xl bg-navy-700 text-gray-400 text-sm"
                    >
                      {t('cancel', lang)}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(goal)}
                    className="w-full py-2.5 rounded-xl border border-navy-600 text-gray-400 text-sm font-medium hover:border-gold hover:text-gold transition-all"
                  >
                    {t('editAmount', lang)}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
