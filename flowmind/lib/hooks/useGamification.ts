'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Gamification {
  id: string
  user_id: string
  xp: number
  level: number
  streak: number
  longest_streak: number
  last_active_date?: string
  badges: string[]
}

export const LEVELS = [
  { level: 1, name: 'Iniciante 🌱', minXP: 0 },
  { level: 2, name: 'Consciente 💡', minXP: 500 },
  { level: 3, name: 'Estrategista ⚡', minXP: 2000 },
  { level: 4, name: 'Mestre das Finanças 🏆', minXP: 5000 },
  { level: 5, name: 'Lenda Financeira 👑', minXP: 15000 },
]

export const XP_REWARDS = {
  manual_transaction: 5,
  ocr_transaction: 10,
  voice_transaction: 8,
  daily_streak: 15,
  weekly_review: 50,
  goal_deposit: 15,
  goal_completed: 200,
  emotional_log: 8,
  budget_respected: 100,
}

export function getLevelForXP(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getNextLevel(xp: number) {
  const current = getLevelForXP(xp)
  return LEVELS.find(l => l.level === current.level + 1) ?? null
}

export function useGamification(userId?: string) {
  const [gamification, setGamification] = useState<Gamification | null>(null)
  const supabase = createClient()

  const fetchGamification = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('gamification')
      .select('*')
      .eq('user_id', userId)
      .single()
    setGamification(data)
  }, [userId, supabase])

  useEffect(() => { fetchGamification() }, [fetchGamification])

  const awardXP = async (action: keyof typeof XP_REWARDS) => {
    if (!userId || !gamification) return
    const xp = XP_REWARDS[action]
    const newXP = gamification.xp + xp
    const newLevel = getLevelForXP(newXP).level

    // update streak via RPC
    try { await supabase.rpc('update_streak', { p_user_id: userId }) } catch { /* silent */ }

    const { data } = await supabase
      .from('gamification')
      .update({ xp: newXP, level: newLevel })
      .eq('user_id', userId)
      .select()
      .single()
    if (data) setGamification(data)
    return xp
  }

  return { gamification, awardXP, refetch: fetchGamification }
}
