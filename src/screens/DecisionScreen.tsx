import { useState } from 'react'
import type { UserProfile, Category, Language, DecisionRecord, DecisionResult } from '../types'
import { t } from '../utils/i18n'
import { analyzeDecision } from '../utils/claudeApi'
import { saveDecision } from '../utils/storage'
import ScoreCard from '../components/ScoreCard'
import LoadingSpinner from '../components/LoadingSpinner'

const categories: Category[] = ['electronics', 'furniture', 'clothing', 'food', 'transport', 'other']

interface DecisionScreenProps {
  profile: UserProfile
  lang: Language
  onDecisionSaved: () => void
}

export default function DecisionScreen({ profile, lang, onDecisionSaved }: DecisionScreenProps) {
  const isRtl = lang === 'ar'
  const [itemName, setItemName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState<Category>('electronics')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<DecisionResult | null>(null)
  const [savedRecord, setSavedRecord] = useState<DecisionRecord | null>(null)

  async function handleAnalyze() {
    if (!itemName.trim() || !price) {
      setError(t('fillRequired', lang))
      return
    }

    setError('')
    setLoading(true)

    try {
      const priceNum = parseFloat(price)
      const decisionResult = await analyzeDecision(itemName, priceNum, category, notes, profile)

      const record: DecisionRecord = {
        id: Math.random().toString(36).slice(2, 10),
        date: new Date().toISOString(),
        itemName,
        price: priceNum,
        category,
        notes,
        currency: profile.currency,
        result: decisionResult,
      }

      saveDecision(record)
      setSavedRecord(record)
      setResult(decisionResult)
      onDecisionSaved()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg === 'API_KEY_MISSING') {
        setError(t('apiKeyMissing', lang))
      } else {
        setError(t('analysisError', lang))
      }
    } finally {
      setLoading(false)
    }
  }

  function handleNewDecision() {
    setResult(null)
    setSavedRecord(null)
    setItemName('')
    setPrice('')
    setCategory('electronics')
    setNotes('')
    setError('')
  }

  const inputClass = "w-full bg-navy-700 border border-navy-600 rounded-xl px-4 py-3 text-white placeholder-navy-600 focus:outline-none focus:border-gold transition-colors"
  const labelClass = "block text-gray-400 text-sm mb-1.5"

  return (
    <div className="flex flex-col min-h-full" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white">{t('decisionTitle', lang)}</h1>
      </div>

      <div className="flex-1 px-6 pb-24 overflow-y-auto">
        {loading ? (
          <LoadingSpinner text={t('analyzing', lang)} />
        ) : result && savedRecord ? (
          <ScoreCard
            result={result}
            itemName={savedRecord.itemName}
            price={savedRecord.price}
            currency={profile.currency}
            lang={lang}
            onNewDecision={handleNewDecision}
          />
        ) : (
          <div className="space-y-5 animate-fade-in">
            {/* Item Name */}
            <div>
              <label className={labelClass}>{t('itemName', lang)}</label>
              <input
                type="text"
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: آيفون 15' : 'e.g. iPhone 15'}
                className={inputClass}
              />
            </div>

            {/* Price */}
            <div>
              <label className={labelClass}>{t('price', lang)}</label>
              <input
                type="number"
                inputMode="decimal"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0"
                className={inputClass}
                dir="ltr"
              />
            </div>

            {/* Category */}
            <div>
              <label className={labelClass}>{t('category', lang)}</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                      category === cat
                        ? 'border-gold text-gold bg-gold/10'
                        : 'border-navy-600 text-gray-400 bg-navy-700'
                    }`}
                  >
                    {t(cat, lang)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={labelClass}>{t('notes', lang)}</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={t('notesPlaceholder', lang)}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleAnalyze}
              className="w-full py-4 rounded-2xl bg-gold text-navy font-bold text-base hover:bg-gold-dark active:scale-95 transition-all duration-200"
            >
              {t('analyzeDecision', lang)}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
