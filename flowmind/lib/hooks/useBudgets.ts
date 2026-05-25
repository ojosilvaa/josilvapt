'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Budget {
  id: string
  user_id: string
  category: string
  limit_amount: number
  month: number
  year: number
}

export function useBudgets(userId?: string) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const fetchBudgets = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year)
    setBudgets(data ?? [])
    setLoading(false)
  }, [userId, supabase, month, year])

  useEffect(() => { fetchBudgets() }, [fetchBudgets])

  const upsertBudget = async (category: string, limit_amount: number) => {
    if (!userId) return
    const { data } = await supabase
      .from('budgets')
      .upsert([{ user_id: userId, category, limit_amount, month, year }], {
        onConflict: 'user_id,category,month,year'
      })
      .select()
      .single()
    if (data) setBudgets(prev => {
      const exists = prev.find(b => b.category === category)
      return exists ? prev.map(b => b.category === category ? data : b) : [...prev, data]
    })
  }

  return { budgets, loading, upsertBudget, refetch: fetchBudgets }
}
