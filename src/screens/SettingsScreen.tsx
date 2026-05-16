import { useState } from 'react'
import type { UserProfile, Currency, Language, SavingsGoal } from '../types'
import { t } from '../utils/i18n'
import { saveProfile, clearAllData } from '../utils/storage'

const currencies: Currency[] = ['EGP', 'SAR', 'AED', 'USD']

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

interface SettingsScreenProps {
  profile: UserProfile
  lang: Language
  onProfileUpdated: (profile: UserProfile) => void
  onLangChange: (l: Language) => void
  onDataCleared: () => void
}

export default function SettingsScreen({ profile, lang, onProfileUpdated, onLangChange, onDataCleared }: SettingsScreenProps) {
  const isRtl = lang === 'ar'
  const [monthlyIncome, setMonthlyIncome] = useState(String(profile.monthlyIncome))
  const [monthlyExpenses, setMonthlyExpenses] = useState(String(profile.monthlyExpenses))
  const [currency, setCurrency] = useState<Currency>(profile.currency)
  const [goals, setGoals] = useState<SavingsGoal[]>(profile.goals)
  const [saved, setSaved] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

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

  function handleSave() {
    const income = parseFloat(monthlyIncome) || 0
    const expenses = parseFloat(monthlyExpenses) || 0
    const updated: UserProfile = { ...profile, monthlyIncome: income, monthlyExpenses: expenses, currency, language: lang, goals }
    saveProfile(updated)
    onProfileUpdated(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleClear() {
    clearAllData()
    onDataCleared()
  }

  const inputClass = "w-full bg-navy-700 border border-navy-600 rounded-xl px-4 py-3 text-white placeholder-navy-600 focus:outline-none focus:border-gold transition-colors"
  const labelClass = "block text-gray-400 text-sm mb-1.5"
  const sectionTitle = "text-gold text-sm font-semibold mb-4"

  return (
    <div className="flex flex-col min-h-full" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">{t('settingsTitle', lang)}</h1>
      </div>

      <div className="flex-1 px-6 pb-24 overflow-y-auto space-y-6">
        {/* App Settings */}
        <div>
          <h2 className={sectionTitle}>{t('appSettings', lang)}</h2>
          <div className="bg-navy-800 rounded-2xl p-5 space-y-4">
            <div>
              <label className={labelClass}>{t('language', lang)}</label>
              <div className="flex gap-3">
                {(['ar', 'en'] as Language[]).map(l => (
                  <button
                    key={l}
                    onClick={() => onLangChange(l)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      lang === l ? 'border-gold text-gold bg-gold/10' : 'border-navy-600 text-gray-400 bg-navy-700'
                    }`}
                  >
                    {l === 'ar' ? t('arabic', lang) : t('english', lang)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>{t('currency', lang)}</label>
              <div className="grid grid-cols-4 gap-2">
                {currencies.map(c => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                      currency === c ? 'border-gold text-gold bg-gold/10' : 'border-navy-600 text-gray-400 bg-navy-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div>
          <h2 className={sectionTitle}>{t('profileSettings', lang)}</h2>
          <div className="bg-navy-800 rounded-2xl p-5 space-y-4">
            <div>
              <label className={labelClass}>{t('monthlyIncome', lang)}</label>
              <input
                type="number"
                inputMode="numeric"
                value={monthlyIncome}
                onChange={e => setMonthlyIncome(e.target.value)}
                className={inputClass}
                dir="ltr"
              />
            </div>
            <div>
              <label className={labelClass}>{t('monthlyExpenses', lang)}</label>
              <input
                type="number"
                inputMode="numeric"
                value={monthlyExpenses}
                onChange={e => setMonthlyExpenses(e.target.value)}
                className={inputClass}
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Goals */}
        <div>
          <h2 className={sectionTitle}>{t('savingsGoals', lang)}</h2>
          <div className="space-y-4">
            {goals.map((goal, idx) => (
              <div key={goal.id} className="bg-navy-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gold text-xs font-medium">#{idx + 1}</span>
                  <button onClick={() => removeGoal(goal.id)} className="text-red-400 text-xs hover:text-red-300 transition-colors">
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
            {goals.length < 3 && (
              <button
                onClick={addGoal}
                className="w-full py-3 rounded-xl border border-dashed border-navy-600 text-gold text-sm font-medium hover:border-gold transition-colors"
              >
                + {t('addGoal', lang)}
              </button>
            )}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-gold text-navy hover:bg-gold-dark active:scale-95'
          }`}
        >
          {saved ? t('settingsSaved', lang) : t('saveSettings', lang)}
        </button>

        {/* Danger Zone */}
        <div>
          <h2 className="text-red-400 text-sm font-semibold mb-4">{t('dangerZone', lang)}</h2>
          <div className="bg-navy-800 rounded-2xl p-5">
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="w-full py-3 rounded-xl border border-red-400/30 text-red-400 text-sm font-semibold hover:bg-red-400/10 transition-all"
              >
                {t('clearData', lang)}
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-300 text-sm text-center">{t('clearDataConfirm', lang)}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="flex-1 py-3 rounded-xl bg-navy-700 text-gray-400 text-sm font-medium"
                  >
                    {t('cancel', lang)}
                  </button>
                  <button
                    onClick={handleClear}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold"
                  >
                    {t('confirmClear', lang)}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="bg-navy-800 rounded-2xl p-5">
          <h3 className="text-white text-sm font-semibold mb-2">{t('privacyPolicy', lang)}</h3>
          <p className="text-navy-600 text-xs leading-relaxed">{t('privacyContent', lang)}</p>
        </div>

        <p className="text-center text-navy-600 text-xs pb-2">Qarar v1.0.0</p>
      </div>
    </div>
  )
}
