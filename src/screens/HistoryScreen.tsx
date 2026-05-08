import { useState } from 'react'
import type { DecisionRecord, Language } from '../types'
import { t } from '../utils/i18n'

const CURRENCY_SYMBOLS: Record<string, string> = {
  EGP: 'ج.م', SAR: 'ر.س', AED: 'د.إ', USD: '$',
}

interface HistoryScreenProps {
  history: DecisionRecord[]
  lang: Language
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

function VerdictBadge({ verdict, lang }: { verdict: string; lang: Language }) {
  const isAr = lang === 'ar'
  const map: Record<string, { label_ar: string; color: string }> = {
    'Buy Now': { label_ar: 'اشترِ الآن', color: 'text-green-400 bg-green-400/10' },
    'Wait': { label_ar: 'انتظر', color: 'text-gold bg-gold/10' },
    'Skip': { label_ar: 'تجاهل', color: 'text-red-400 bg-red-400/10' },
  }
  const entry = map[verdict] ?? { label_ar: verdict, color: 'text-gray-400 bg-navy-700' }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${entry.color}`}>
      {isAr ? entry.label_ar : verdict}
    </span>
  )
}

export default function HistoryScreen({ history, lang }: HistoryScreenProps) {
  const isRtl = lang === 'ar'
  const [selected, setSelected] = useState<DecisionRecord | null>(null)

  const totalSaved = history
    .filter(r => r.result.verdict_en !== 'Buy Now')
    .reduce((sum, r) => sum + r.price, 0)

  if (selected) {
    const sym = CURRENCY_SYMBOLS[selected.currency] ?? selected.currency
    const reasoning = lang === 'ar' ? selected.result.reasoning_ar : selected.result.reasoning_en
    return (
      <div className="flex flex-col min-h-full" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="px-6 pt-12 pb-4 flex items-center gap-3">
          <button
            onClick={() => setSelected(null)}
            className="text-gold hover:text-gold-dark transition-colors"
          >
            {isRtl ? '→' : '←'} {t('historyTitle', lang)}
          </button>
        </div>
        <div className="flex-1 px-6 pb-24 overflow-y-auto space-y-4 animate-fade-in">
          <div className="bg-navy-800 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-2 mb-4">
              <div>
                <p className="text-white font-semibold">{selected.itemName}</p>
                <p className="text-navy-600 text-sm">{formatDate(selected.date, lang)}</p>
              </div>
              <VerdictBadge verdict={selected.result.verdict_en} lang={lang} />
            </div>
            <p className="text-gold font-bold text-xl">{sym}{selected.price.toLocaleString()}</p>
          </div>
          <div className="bg-navy-800 rounded-2xl p-5">
            <h3 className="text-gold text-sm font-semibold mb-2">{t('reasoning', lang)}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{reasoning}</p>
          </div>
          <div className="bg-navy-800 rounded-2xl p-5">
            <h3 className="text-gold text-sm font-semibold mb-3">{t('installmentPlan', lang)}</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: t('months3', lang), v: selected.result.installment_3 },
                { label: t('months6', lang), v: selected.result.installment_6 },
                { label: t('months12', lang), v: selected.result.installment_12 },
              ].map(({ label, v }) => (
                <div key={label} className="bg-navy-700 rounded-xl p-3 text-center">
                  <p className="text-navy-600 text-xs mb-1">{label}</p>
                  <p className="text-white text-sm font-bold">{sym}{v.toLocaleString()}</p>
                  <p className="text-navy-600 text-xs">{t('perMonth', lang)}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setSelected(null)}
            className="w-full py-4 rounded-2xl bg-navy-800 border border-navy-700 text-gray-300 font-semibold hover:border-gold hover:text-gold transition-all"
          >
            {t('close', lang)}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">{t('historyTitle', lang)}</h1>
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-navy-800 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-navy-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white font-semibold">{t('noHistory', lang)}</p>
          <p className="text-navy-600 text-sm">{t('noHistoryDesc', lang)}</p>
        </div>
      ) : (
        <div className="flex-1 px-6 pb-24 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-navy-800 rounded-2xl p-4 text-center">
              <p className="text-gold text-2xl font-bold">{history.length}</p>
              <p className="text-navy-600 text-xs mt-1">{t('totalEvaluated', lang)}</p>
            </div>
            <div className="bg-navy-800 rounded-2xl p-4 text-center">
              <p className="text-green-400 text-2xl font-bold">
                {history[0] ? CURRENCY_SYMBOLS[history[0].currency] : ''}{totalSaved.toLocaleString()}
              </p>
              <p className="text-navy-600 text-xs mt-1">{t('totalSaved', lang)}</p>
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {history.map(record => {
              const sym = CURRENCY_SYMBOLS[record.currency] ?? record.currency
              return (
                <div
                  key={record.id}
                  className="bg-navy-800 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-navy-700 transition-colors"
                  onClick={() => setSelected(record)}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                      record.result.score >= 7 ? 'bg-green-400/10 text-green-400' :
                      record.result.score >= 4 ? 'bg-gold/10 text-gold' :
                      'bg-red-400/10 text-red-400'
                    }`}
                  >
                    {record.result.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{record.itemName}</p>
                    <p className="text-navy-600 text-xs">{formatDate(record.date, lang)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white text-sm font-semibold">{sym}{record.price.toLocaleString()}</p>
                    <VerdictBadge verdict={record.result.verdict_en} lang={lang} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
