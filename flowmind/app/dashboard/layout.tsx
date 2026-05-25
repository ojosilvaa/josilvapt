'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import { BottomNav } from '@/components/layout/BottomNav'
import { AddTransactionModal } from '@/components/gastos/AddTransactionModal'
import { ToastProvider, useToast } from '@/components/ui/Toast'
import { useTransactions } from '@/lib/hooks/useTransactions'
import { useGamification } from '@/lib/hooks/useGamification'

interface DashCtxType {
  userId: string
  profile: { name: string; monthly_income: number } | null
  transactions: ReturnType<typeof useTransactions>['transactions']
  addTransaction: ReturnType<typeof useTransactions>['addTransaction']
  gamification: ReturnType<typeof useGamification>['gamification']
  awardXP: ReturnType<typeof useGamification>['awardXP']
  refetchTransactions: () => void
}

export const DashCtx = createContext<DashCtxType | null>(null)
export const useDash = () => {
  const ctx = useContext(DashCtx)
  if (!ctx) throw new Error('useDash must be used within DashboardLayout')
  return ctx
}

function DashboardInner({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState('')
  const [profile, setProfile] = useState<{ name: string; monthly_income: number } | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const toast = useToast()

  const { transactions, addTransaction, refetch } = useTransactions(userId || undefined)
  const { gamification, awardXP } = useGamification(userId || undefined)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth'); return }
      setUserId(user.id)
      supabase.from('profiles').select('name,monthly_income').eq('id', user.id).single()
        .then(({ data }) => { if (data) setProfile(data) })
    })
  }, [supabase, router])

  async function handleAddTransaction(data: Parameters<typeof addTransaction>[0]) {
    const tx = await addTransaction(data)
    if (tx) {
      const xp = await awardXP(data.source === 'ocr' ? 'ocr_transaction' : 'manual_transaction')
      toast('✅', `Registado! +${xp ?? 5} XP`)
    }
  }

  const initials = profile?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? 'FM'

  if (!userId) return (
    <div className="min-h-screen bg-fm-bg flex items-center justify-center">
      <div className="text-fm-text3 text-[14px]">A carregar...</div>
    </div>
  )

  return (
    <DashCtx.Provider value={{ userId, profile, transactions, addTransaction, gamification, awardXP, refetchTransactions: refetch }}>
      <div className="flex flex-col bg-fm-bg min-h-screen max-w-[480px] mx-auto border-x border-fm-border">
        <TopBar
          streak={gamification?.streak ?? 0}
          initials={initials}
          onProfileClick={() => router.push('/dashboard/perfil')}
        />
        <main className="flex-1 overflow-y-auto pb-[72px]" style={{ scrollbarWidth: 'none' }}>
          {children}
        </main>
        <BottomNav onAddClick={() => setAddOpen(true)} />
        <AddTransactionModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSave={handleAddTransaction}
        />
      </div>
    </DashCtx.Provider>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <DashboardInner>{children}</DashboardInner>
    </ToastProvider>
  )
}
