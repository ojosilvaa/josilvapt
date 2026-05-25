'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline?: string
  goal_type: string
  color: string
  is_completed: boolean
  created_at: string
}

export function useGoals(userId?: string) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchGoals = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('is_completed', false)
      .order('created_at', { ascending: false })
    setGoals(data ?? [])
    setLoading(false)
  }, [userId, supabase])

  useEffect(() => { fetchGoals() }, [fetchGoals])

  const addGoal = async (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'is_completed' | 'current_amount'>) => {
    if (!userId) return null
    const { data, error } = await supabase
      .from('goals')
      .insert([{ ...goal, user_id: userId, current_amount: 0, is_completed: false }])
      .select()
      .single()
    if (!error && data) {
      setGoals(prev => [data, ...prev])
      return data
    }
    return null
  }

  const depositToGoal = async (goalId: string, amount: number, note?: string) => {
    if (!userId) return
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return
    const newAmount = Math.min(goal.current_amount + amount, goal.target_amount)
    const isCompleted = newAmount >= goal.target_amount

    await supabase.from('goal_deposits').insert([{ goal_id: goalId, user_id: userId, amount, note }])
    const { data } = await supabase
      .from('goals')
      .update({ current_amount: newAmount, is_completed: isCompleted })
      .eq('id', goalId)
      .select()
      .single()
    if (data) setGoals(prev => prev.map(g => g.id === goalId ? data : g).filter(g => !g.is_completed))
    return isCompleted
  }

  return { goals, loading, addGoal, depositToGoal, refetch: fetchGoals }
}
