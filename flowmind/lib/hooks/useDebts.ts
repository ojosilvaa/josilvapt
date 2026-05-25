'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Debt {
  id: string
  user_id: string
  name: string
  total_amount: number
  remaining_amount: number
  monthly_payment: number
  interest_rate: number
  due_day: number
  debt_type: string
  priority: number
  is_paid: boolean
  created_at: string
}

export function useDebts(userId?: string) {
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchDebts = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('debts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_paid', false)
      .order('interest_rate', { ascending: false })
    setDebts(data ?? [])
    setLoading(false)
  }, [userId, supabase])

  useEffect(() => { fetchDebts() }, [fetchDebts])

  const addDebt = async (debt: Omit<Debt, 'id' | 'user_id' | 'created_at' | 'is_paid'>) => {
    if (!userId) return null
    const { data, error } = await supabase
      .from('debts')
      .insert([{ ...debt, user_id: userId, is_paid: false }])
      .select()
      .single()
    if (!error && data) {
      setDebts(prev => [...prev, data].sort((a, b) => b.interest_rate - a.interest_rate))
      return data
    }
    return null
  }

  return { debts, loading, addDebt, refetch: fetchDebts }
}
