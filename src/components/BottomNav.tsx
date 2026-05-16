import type { Language } from '../types'
import { t } from '../utils/i18n'

type Screen = 'decision' | 'history' | 'goals' | 'settings'

interface BottomNavProps {
  activeScreen: Screen
  onNavigate: (screen: Screen) => void
  lang: Language
}

const DecisionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const GoalsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const navItems: { id: Screen; labelKey: string; Icon: React.FC }[] = [
  { id: 'decision', labelKey: 'navDecision', Icon: DecisionIcon },
  { id: 'history', labelKey: 'navHistory', Icon: HistoryIcon },
  { id: 'goals', labelKey: 'navGoals', Icon: GoalsIcon },
  { id: 'settings', labelKey: 'navSettings', Icon: SettingsIcon },
]

export default function BottomNav({ activeScreen, onNavigate, lang }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-navy-800 border-t border-navy-700 z-50 safe-area-pb">
      <div className="flex items-stretch h-16">
        {navItems.map(({ id, labelKey, Icon }) => {
          const isActive = activeScreen === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                isActive ? 'text-gold' : 'text-navy-600 hover:text-gray-300'
              }`}
            >
              <Icon />
              <span className="text-xs font-medium" style={{ fontFamily: lang === 'ar' ? 'Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                {t(labelKey, lang)}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-gold rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
