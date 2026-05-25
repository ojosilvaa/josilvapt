'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Transaction {
  id: string
  user_id: string
  amount: number
  description: string
  category: string
  subcategory?: string
  source: string
  date: string
  emotional_state?: string
  emotional_note?: string
  is_income: boolean
  created_at: string
}

export function useTransactions(userId?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchTransactions = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const now = new Date()
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', from)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    setTransactions(data ?? [])
    setLoading(false)
  }, [userId, supabase])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return null
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...tx, user_id: userId }])
      .select()
      .single()
    if (!error && data) {
      setTransactions(prev => [data, ...prev])
      return data
    }
    return null
  }

  const deleteTransaction = async (id: string) => {
    await supabase.from('transactions').delete().eq('id', id)
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  return { transactions, loading, addTransaction, deleteTransaction, refetch: fetchTransactions }
}
