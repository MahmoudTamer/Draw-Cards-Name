import type { UserProfile, DecisionRecord } from '../types'

const PROFILE_KEY = 'qarar_profile'
const HISTORY_KEY = 'qarar_history'

export function getProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function getHistory(): DecisionRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveDecision(record: DecisionRecord): void {
  const history = getHistory()
  history.unshift(record)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function clearAllData(): void {
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem(HISTORY_KEY)
}

export function updateGoalAmount(goalId: string, newAmount: number): void {
  const profile = getProfile()
  if (!profile) return
  profile.goals = profile.goals.map(g =>
    g.id === goalId ? { ...g, currentAmount: newAmount } : g,
  )
  saveProfile(profile)
}
