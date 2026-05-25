'use client'
import { useEffect, useState } from 'react'
import { useDash } from './layout'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatEUR } from '@/lib/utils/currency'
import { forecastMonthEnd } from '@/lib/ai/forecast'
import { getCategoryMeta } from '@/lib/ai/categorize'
import { daysUntil } from '@/lib/utils/dates'
import { createClient } from '@/lib/supabase/client'
import { Goal } from '@/lib/hooks/useGoals'

export default function DashboardHome() {
  const { profile, transactions, userId } = useDash()
  const [goals, setGoals] = useState<Goal[]>([])
  const [bills, setBills] = useState<{ name: string; amount: number; due_day: number; icon: string }[]>([])
  const [insight, setInsight] = useState('')
  const supabase = createClient()

  const income = profile?.monthly_income ?? 0
  const spent = transactions.filter(t => !t.is_income).reduce((s, t) => s + Number(t.amount), 0)
  const balance = income - spent
  const pctUsed = income > 0 ? (spent / income) * 100 : 0
  const forecast = forecastMonthEnd(transactions.filter(t => !t.is_income))
  const now = new Date()
  const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate()

  // Top category
  const catTotals: Record<string, number> = {}
  transactions.filter(t => !t.is_income).forEach(t => { catTotals[t.category] = (catTotals[t.category] ?? 0) + Number(t.amount) })
  const topCat = Object.entries(catTotals).sort(([,a],[,b]) => b - a)[0]

  useEffect(() => {
    if (!userId) return
    supabase.from('goals').select('*').eq('user_id', userId).eq('is_completed', false).order('created_at', { ascending: false }).limit(2).then(({ data }) => setGoals(data ?? []))
    supabase.from('bills').select('*').eq('user_id', userId).eq('is_active', true).order('due_day').then(({ data }) => setBills(data ?? []))
  }, [userId, supabase])

  useEffect(() => {
    if (!topCat || !income) return
    fetch('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions, income, topCategory: topCat[0], topAmount: topCat[1], forecast })
    }).then(r => r.json()).then(d => setInsight(d.insight)).catch(() => {})
  }, [transactions.length, income])

  // Budget data
  const [budgets, setBudgets] = useState<{ category: string; limit_amount: number }[]>([])
  useEffect(() => {
    if (!userId) return
    const m = now.getMonth() + 1, y = now.getFullYear()
    supabase.from('budgets').select('*').eq('user_id', userId).eq('month', m).eq('year', y).then(({ data }) => setBudgets(data ?? []))
  }, [userId, supabase])

  const monthName = now.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' }).replace(/^./, c => c.toUpperCase())

  return (
    <div>
      {/* Hero card */}
      <div className="p-4">
        <div className="rounded-[20px] p-5" style={{ background: 'linear-gradient(135deg,#0D2E23 0%,#162433 100%)', border: '0.5px solid rgba(0,200,150,0.2)' }}>
          <div className="text-[11px] text-fm-text3 uppercase tracking-[0.6px] mb-1.5 font-dm">Saldo disponível — {monthName}</div>
          <div className="text-[32px] font-bold tracking-tight text-fm-green">{formatEUR(balance)}</div>
          <div className="text-[12px] text-fm-text2 mt-1">Gastaste {formatEUR(spent)} de {formatEUR(income)}</div>
          <ProgressBar pct={pctUsed} color={pctUsed > 90 ? '#EF4444' : pctUsed > 75 ? '#F59E0B' : '#00C896'} height={6} />
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-fm-green/60">{pctUsed.toFixed(1)}% usado</span>
            <span className="text-[11px] text-fm-text3">{daysLeft} dias restantes</span>
          </div>
        </div>
      </div>

      {/* 3 mini stats */}
      <div className="grid grid-cols-3 gap-2.5 px-4 pb-4">
        {[
          { label: 'Gasto hoje', val: formatEUR(transactions.filter(t => !t.is_income && t.date === now.toISOString().split('T')[0]).reduce((s, t) => s + Number(t.amount), 0)), color: 'text-fm-red' },
          { label: 'Economizado', val: formatEUR(balance > 0 ? balance : 0), color: 'text-fm-green' },
          { label: 'XP Total', val: String(useDashGamificationXP() ?? 0), color: 'text-fm-blue' },
        ].map(stat => (
          <div key={stat.label} className="bg-fm-bg3 border border-fm-border rounded-[14px] p-3">
            <div className="text-[11px] text-fm-text3 uppercase tracking-[0.6px] mb-1 font-dm">{stat.label}</div>
            <div className={`text-[18px] font-bold ${stat.color}`}>{stat.val}</div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      {insight && (
        <div className="px-4 pb-4">
          <div className="flex gap-3 p-[14px] rounded-[14px]" style={{ background: 'linear-gradient(135deg,#1A1230,#0F1825)', border: '0.5px solid rgba(139,92,246,0.3)' }}>
            <div className="w-9 h-9 rounded-[10px] bg-[rgba(139,92,246,0.15)] flex items-center justify-center text-[17px] flex-shrink-0">✦</div>
            <div>
              <div className="text-[10px] text-fm-purple font-bold uppercase tracking-[0.5px] mb-1">✦ FlowMind IA</div>
              <div className="text-[13px] text-white/80 leading-[1.5]">{insight}</div>
            </div>
          </div>
        </div>
      )}

      {/* Budgets */}
      {budgets.length > 0 && (
        <Section title="Orçamentos">
          <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-4">
            {budgets.map(b => {
              const cat = getCategoryMeta(b.category)
              const s = catTotals[b.category] ?? 0
              const pct = (s / b.limit_amount) * 100
              const color = pct >= 100 ? '#EF4444' : pct >= 75 ? '#F59E0B' : '#00C896'
              return (
                <div key={b.category} className="mb-3 last:mb-0">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px] font-medium">{cat.emoji} {b.category}</span>
                    <span className={`text-[12px] ${pct > 100 ? 'text-fm-red' : 'text-fm-text2'}`}>{formatEUR(s)} / {formatEUR(b.limit_amount)}</span>
                  </div>
                  <ProgressBar pct={pct} color={color} />
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* Weekly bar chart */}
      <Section title="Gastos — últimos 7 dias">
        <WeeklyBars transactions={transactions.filter(t => !t.is_income)} />
      </Section>

      {/* Goals */}
      {goals.length > 0 && (
        <Section title="Metas ativas" linkLabel="Ver todas →" linkHref="/dashboard/metas">
          {goals.map(g => {
            const pct = (g.current_amount / g.target_amount) * 100
            return (
              <div key={g.id} className="bg-fm-bg3 border border-fm-border rounded-[14px] p-4 mb-2">
                <div className="flex justify-between mb-2">
                  <div className="text-[15px] font-semibold">{g.name}</div>
                  <div className="text-[16px] font-bold" style={{ color: g.color }}>{pct.toFixed(0)}%</div>
                </div>
                <ProgressBar pct={pct} color={g.color} />
                <div className="text-[12px] text-fm-text2 mt-1.5">{formatEUR(g.current_amount)} / {formatEUR(g.target_amount)}</div>
              </div>
            )
          })}
        </Section>
      )}

      {/* Recent transactions */}
      {transactions.length > 0 && (
        <Section title="Últimos gastos" linkLabel="Ver todos →" linkHref="/dashboard/gastos">
          <div className="bg-fm-bg3 border border-fm-border rounded-[14px] divide-y divide-fm-border">
            {transactions.slice(0, 4).map(tx => {
              const cat = getCategoryMeta(tx.category)
              return (
                <div key={tx.id} className="flex items-center gap-3 p-3">
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[18px] flex-shrink-0" style={{ background: `${cat.color}26` }}>
                    {cat.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-medium">{tx.description}</div>
                    <div className="text-[11px] text-fm-text3">{tx.category}</div>
                  </div>
                  <div className={`text-[15px] font-semibold ${tx.is_income ? 'text-fm-green' : 'text-fm-red'}`}>
                    {tx.is_income ? '+' : '-'}{formatEUR(Number(tx.amount))}
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* Upcoming bills */}
      {bills.length > 0 && (
        <Section title="Contas próximas">
          {bills.slice(0, 4).map(b => {
            const days = daysUntil(b.due_day)
            const urgent = days <= 3
            return (
              <div key={b.name} className="flex items-center gap-3 bg-fm-bg3 border border-fm-border rounded-[9px] p-3 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${urgent ? 'bg-fm-red' : 'bg-fm-amber'}`} />
                <div className="flex-1">
                  <div className="text-[13px] font-semibold">{b.icon} {b.name}</div>
                  <div className="text-[11px] text-fm-text3">{urgent ? '⚠️ ' : ''}Vence em {days} dias (dia {b.due_day})</div>
                </div>
                <div className="text-[14px] font-bold text-fm-red">{formatEUR(b.amount)}</div>
              </div>
            )
          })}
        </Section>
      )}

      <div className="h-4" />
    </div>
  )
}

function useDashGamificationXP() {
  const { gamification } = useDash()
  return gamification?.xp
}

function Section({ title, children, linkLabel, linkHref }: { title: string; children: React.ReactNode; linkLabel?: string; linkHref?: string }) {
  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-2.5">
        <div className="text-[14px] font-semibold">{title}</div>
        {linkLabel && linkHref && (
          <a href={linkHref} className="text-[12px] text-fm-green">{linkLabel}</a>
        )}
      </div>
      {children}
    </div>
  )
}

function WeeklyBars({ transactions }: { transactions: { date: string; amount: number }[] }) {
  const days: { label: string; date: string; amount: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().split('T')[0]
    const amount = transactions.filter(t => t.date === iso).reduce((s, t) => s + Number(t.amount), 0)
    days.push({ label: d.toLocaleDateString('pt-PT', { weekday: 'short' }), date: iso, amount })
  }
  const max = Math.max(...days.map(d => d.amount), 1)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-4">
      <div className="flex items-end gap-2 h-[120px]">
        {days.map(d => {
          const pct = (d.amount / max) * 100
          const isToday = d.date === today
          const color = d.amount > max * 0.8 ? '#EF4444' : d.amount > max * 0.6 ? '#F59E0B' : '#00C896'
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className="w-full rounded-[8px] transition-all" style={{ height: `${Math.max(pct, 4)}%`, background: isToday ? color : `${color}99` }} />
              <div className="text-[10px] text-fm-text3">{d.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
