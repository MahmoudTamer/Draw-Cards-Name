import type { DecisionResult, Language, Currency } from '../types'
import { t } from '../utils/i18n'

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EGP: 'ج.م',
  SAR: 'ر.س',
  AED: 'د.إ',
  USD: '$',
}

interface ScoreCardProps {
  result: DecisionResult
  itemName: string
  price: number
  currency: Currency
  lang: Language
  onNewDecision: () => void
}

function ScoreRing({ score }: { score: number }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const progress = (score / 10) * circumference
  const color = score >= 7 ? '#22c55e' : score >= 4 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <span className="absolute text-2xl font-bold" style={{ color }}>{score}</span>
    </div>
  )
}

export default function ScoreCard({ result, itemName, price, currency, lang, onNewDecision }: ScoreCardProps) {
  const isRtl = lang === 'ar'
  const symbol = CURRENCY_SYMBOLS[currency]
  const verdict = lang === 'ar' ? result.verdict_ar : result.verdict_en
  const reasoning = lang === 'ar' ? result.reasoning_ar : result.reasoning_en

  const verdictColor =
    result.verdict_en === 'Buy Now' ? 'text-green-400 bg-green-400/10' :
    result.verdict_en === 'Wait' ? 'text-gold bg-gold/10' :
    'text-red-400 bg-red-400/10'

  const scoreColor =
    result.score >= 7 ? 'text-green-400' :
    result.score >= 4 ? 'text-gold' :
    'text-red-400'

  return (
    <div className="animate-slide-up space-y-4">
      {/* Score + Verdict */}
      <div className="bg-navy-800 rounded-2xl p-6 flex flex-col items-center gap-4">
        <ScoreRing score={result.score} />
        <div className="text-center">
          <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${scoreColor}`}>
            {t('decisionScore', lang)}
          </p>
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${verdictColor}`}>
            {verdict}
          </span>
        </div>
        <div className="text-center">
          <p className="text-navy-600 text-xs mb-1">{itemName}</p>
          <p className="text-white font-semibold">{symbol}{price.toLocaleString()}</p>
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-navy-800 rounded-2xl p-5">
        <h3 className="text-gold text-sm font-semibold mb-3">{t('reasoning', lang)}</h3>
        <p className="text-gray-300 text-sm leading-relaxed" dir={isRtl ? 'rtl' : 'ltr'}>
          {reasoning}
        </p>
      </div>

      {/* Installments */}
      <div className="bg-navy-800 rounded-2xl p-5">
        <h3 className="text-gold text-sm font-semibold mb-3">{t('installmentPlan', lang)}</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: t('months3', lang), amount: result.installment_3 },
            { label: t('months6', lang), amount: result.installment_6 },
            { label: t('months12', lang), amount: result.installment_12 },
          ].map(({ label, amount }) => (
            <div key={label} className="bg-navy-700 rounded-xl p-3 text-center">
              <p className="text-navy-600 text-xs mb-1">{label}</p>
              <p className="text-white text-sm font-bold">{symbol}{amount.toLocaleString()}</p>
              <p className="text-navy-600 text-xs">{t('perMonth', lang)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Impact */}
      {result.goal_impact && result.goal_impact.length > 0 && (
        <div className="bg-navy-800 rounded-2xl p-5">
          <h3 className="text-gold text-sm font-semibold mb-3">{t('goalImpact', lang)}</h3>
          <div className="space-y-3">
            {result.goal_impact.map((impact, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <p className="text-gray-300 text-sm truncate flex-1">{impact.goalName}</p>
                <div className="flex items-center gap-2 shrink-0">
                  {impact.monthsDelayed > 0 && (
                    <span className="text-red-400 text-xs bg-red-400/10 px-2 py-0.5 rounded-full">
                      +{impact.monthsDelayed} {t('monthsDelay', lang)}
                    </span>
                  )}
                  <span className="text-navy-600 text-xs">
                    {impact.percentageOfGoal.toFixed(0)}% {t('ofGoal', lang)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Decision Button */}
      <button
        onClick={onNewDecision}
        className="w-full py-4 rounded-2xl bg-navy-800 border border-navy-700 text-gray-300 font-semibold hover:border-gold hover:text-gold transition-all duration-200"
      >
        {t('newDecision', lang)}
      </button>
    </div>
  )
}
