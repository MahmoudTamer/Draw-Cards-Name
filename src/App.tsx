import { useState, useEffect, useCallback } from 'react'
import type { UserProfile, Language, DecisionRecord } from './types'
import { getProfile, getHistory } from './utils/storage'
import BottomNav from './components/BottomNav'
import OnboardingScreen from './screens/OnboardingScreen'
import DecisionScreen from './screens/DecisionScreen'
import HistoryScreen from './screens/HistoryScreen'
import GoalsScreen from './screens/GoalsScreen'
import SettingsScreen from './screens/SettingsScreen'

type Screen = 'decision' | 'history' | 'goals' | 'settings'

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [history, setHistory] = useState<DecisionRecord[]>([])
  const [activeScreen, setActiveScreen] = useState<Screen>('decision')
  const [lang, setLang] = useState<Language>('ar')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = getProfile()
    if (stored) {
      setProfile(stored)
      setLang(stored.language)
      setHistory(getHistory())
    }
    setReady(true)
  }, [])

  const refreshHistory = useCallback(() => {
    setHistory(getHistory())
  }, [])

  const handleGoalUpdated = useCallback((goalId: string, newAmount: number) => {
    setProfile(prev => {
      if (!prev) return prev
      return { ...prev, goals: prev.goals.map(g => g.id === goalId ? { ...g, currentAmount: newAmount } : g) }
    })
  }, [])

  const handleProfileUpdated = useCallback((updated: UserProfile) => {
    setProfile(updated)
    setLang(updated.language)
  }, [])

  const handleLangChange = useCallback((l: Language) => {
    setLang(l)
    setProfile(prev => prev ? { ...prev, language: l } : prev)
  }, [])

  const handleDataCleared = useCallback(() => {
    setProfile(null)
    setHistory([])
    setActiveScreen('decision')
    setLang('ar')
  }, [])

  if (!ready) return null

  if (!profile) {
    return (
      <OnboardingScreen
        onComplete={p => { setProfile(p); setLang(p.language) }}
        lang={lang}
        setLang={setLang}
      />
    )
  }

  const isRtl = lang === 'ar'

  return (
    <div
      className="min-h-screen bg-navy text-white"
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'Inter, sans-serif' }}
    >
      <main className="pb-16">
        {activeScreen === 'decision' && (
          <DecisionScreen
            profile={profile}
            lang={lang}
            onDecisionSaved={refreshHistory}
          />
        )}
        {activeScreen === 'history' && (
          <HistoryScreen
            history={history}
            lang={lang}
          />
        )}
        {activeScreen === 'goals' && (
          <GoalsScreen
            goals={profile.goals}
            currency={profile.currency}
            lang={lang}
            history={history}
            onGoalUpdated={handleGoalUpdated}
          />
        )}
        {activeScreen === 'settings' && (
          <SettingsScreen
            profile={profile}
            lang={lang}
            onProfileUpdated={handleProfileUpdated}
            onLangChange={handleLangChange}
            onDataCleared={handleDataCleared}
          />
        )}
      </main>
      <BottomNav
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        lang={lang}
      />
    </div>
  )
}
