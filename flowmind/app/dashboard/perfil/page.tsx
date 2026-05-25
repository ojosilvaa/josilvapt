'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDash } from '../layout'
import { createClient } from '@/lib/supabase/client'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { getLevelForXP, getNextLevel, LEVELS } from '@/lib/hooks/useGamification'
import { formatMonthPT } from '@/lib/utils/dates'

const BADGES = [
  { emoji: '🔥', name: '7 dias seguidos', key: 'streak_7', check: (g: { streak: number }) => g.streak >= 7 },
  { emoji: '🎯', name: 'Primeira meta', key: 'first_goal', check: () => false },
  { emoji: '📸', name: 'Mestre do OCR', key: 'ocr_master', check: () => false },
  { emoji: '💡', name: 'Autoconsciência', key: 'emotional_5', check: () => false },
  { emoji: '⚡', name: 'Nível 3', key: 'level_3', check: (g: { level: number }) => g.level >= 3 },
  { emoji: '💰', name: 'Economizador', key: 'saver', check: () => false },
  { emoji: '🏆', name: '30 dias seguidos', key: 'streak_30', check: (g: { streak: number }) => g.streak >= 30 },
  { emoji: '❤️', name: 'Sem dívidas', key: 'no_debt', check: () => false },
  { emoji: '👑', name: 'Lenda Financeira', key: 'level_5', check: (g: { level: number }) => g.level >= 5 },
]

export default function PerfilPage() {
  const { userId, profile, gamification, transactions } = useDash()
  const [bills, setBills] = useState<{ name: string; amount: number; due_day: number; icon: string }[]>([])
  const [calOffset, setCalOffset] = useState(0)
  const [notifs] = useState([
    { text: '🔥 A tua sequência termina em breve! Regista um gasto.', time: 'Agora' },
    { text: '📊 Resumo diário disponível.', time: '22h de ontem' },
    { text: '💡 Insights semanais: analisa os teus padrões.', time: 'Dom, 09h' },
  ])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return
    supabase.from('bills').select('*').eq('user_id', userId).eq('is_active', true).then(({ data }) => setBills(data ?? []))
  }, [userId, supabase])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const g = gamification
  const level = g ? getLevelForXP(g.xp) : LEVELS[0]
  const nextLevel = g ? getNextLevel(g.xp) : LEVELS[1]
  const xpForNext = nextLevel ? nextLevel.minXP - level.minXP : 1
  const xpProgress = g ? ((g.xp - level.minXP) / xpForNext) * 100 : 0
  const xpToNext = nextLevel ? nextLevel.minXP - (g?.xp ?? 0) : 0

  const initials = profile?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? 'FM'
  const gForBadge = { streak: g?.streak ?? 0, level: g?.level ?? 1 }

  return (
    <div className="p-4 space-y-4">
      {/* Profile header */}
      <div className="flex items-center gap-3.5">
        <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-fm-green to-[#0088cc] flex items-center justify-center text-[22px] font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <div className="text-[18px] font-bold">{profile?.name ?? 'Utilizador'}</div>
          <div className="text-[13px] text-fm-text3">{level.name}</div>
          <div className="inline-flex items-center gap-1 bg-[rgba(0,200,150,0.15)] border border-[rgba(0,200,150,0.3)] rounded-full px-2.5 py-0.5 mt-1">
            <span className="text-[10px] font-bold text-fm-green">{level.name}</span>
          </div>
        </div>
      </div>

      {/* Level card */}
      <div className="rounded-[20px] p-5" style={{ background: 'linear-gradient(135deg,#1A1230,#0D1825)', border: '0.5px solid rgba(139,92,246,0.3)' }}>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[12px] text-fm-purple/70 font-semibold uppercase tracking-[0.5px]">Nível</div>
            <div className="text-[42px] font-bold text-fm-purple" style={{ letterSpacing: '-2px' }}>{level.level}</div>
            <div className="text-[13px] text-fm-text2">{level.name}</div>
          </div>
          <div className="text-right">
            <div className="text-[12px] text-fm-text3">XP Total</div>
            <div className="text-[24px] font-bold text-fm-purple">{g?.xp ?? 0}</div>
            {nextLevel && <div className="text-[11px] text-fm-text3">{xpToNext} XP para Lv.{nextLevel.level}</div>}
          </div>
        </div>
        <div className="mt-3.5 h-[10px] rounded-full overflow-hidden bg-[rgba(139,92,246,0.1)]">
          <div className="h-full rounded-full" style={{ width: `${Math.min(xpProgress, 100)}%`, background: 'linear-gradient(90deg,#8B5CF6,#3B82F6)' }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 rounded-[14px] overflow-hidden border border-fm-border" style={{ background: 'transparent' }}>
        {[
          { val: `🔥 ${g?.streak ?? 0}`, label: 'Dias seguidos', color: 'text-fm-amber' },
          { val: String(transactions.length), label: 'Transações', color: 'text-fm-green' },
          { val: String(BADGES.filter(b => b.check(gForBadge)).length), label: 'Conquistas', color: 'text-fm-purple' },
        ].map((s, i) => (
          <div key={i} className={`bg-fm-bg3 p-3 text-center ${i < 2 ? 'border-r border-fm-border' : ''}`}>
            <div className={`text-[20px] font-bold ${s.color}`}>{s.val}</div>
            <div className="text-[10px] text-fm-text3 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div>
        <div className="text-[14px] font-semibold mb-3">Conquistas</div>
        <div className="grid grid-cols-3 gap-2">
          {BADGES.map(b => {
            const unlocked = b.check(gForBadge)
            return (
              <div key={b.key} className={`bg-fm-bg3 border border-fm-border rounded-[9px] p-3 text-center ${!unlocked ? 'opacity-35' : ''}`}>
                <div className="text-[26px] mb-1.5">{b.emoji}</div>
                <div className="text-[10px] text-fm-text2 font-medium">{b.name}</div>
                {!unlocked && <div className="text-[10px] text-fm-text3">Bloqueado</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Calendar */}
      <div>
        <div className="text-[14px] font-semibold mb-3">Calendário Financeiro</div>
        <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-4">
          <div className="flex justify-between items-center mb-3">
            <button onClick={() => setCalOffset(p => p - 1)} className="bg-none border-none text-fm-text2 text-[18px] cursor-pointer p-1">‹</button>
            <div className="text-[15px] font-semibold">{formatMonthPT(new Date(new Date().getFullYear(), new Date().getMonth() + calOffset, 1))}</div>
            <button onClick={() => setCalOffset(p => p + 1)} className="bg-none border-none text-fm-text2 text-[18px] cursor-pointer p-1">›</button>
          </div>
          <CalendarGrid offset={calOffset} billDays={bills.map(b => b.due_day)} />
        </div>
      </div>

      {/* Notifications */}
      <div>
        <div className="text-[14px] font-semibold mb-3">Notificações</div>
        <div className="bg-fm-bg3 border border-fm-border rounded-[14px] divide-y divide-fm-border">
          {notifs.map((n, i) => (
            <div key={i} className="flex gap-3 p-3">
              <div className="w-2 h-2 rounded-full bg-fm-green mt-1.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-[13px] leading-[1.5]">{n.text}</div>
                <div className="text-[11px] text-fm-text3 mt-0.5">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div>
        <div className="text-[14px] font-semibold mb-3">Configurações</div>
        <div className="bg-fm-bg3 border border-fm-border rounded-[14px] divide-y divide-fm-border">
          {[
            { icon: '🔔', label: 'Notificações push', sub: 'Resumo diário e alertas', color: 'bg-[rgba(0,200,150,0.15)] text-fm-green', checked: true },
            { icon: '🌙', label: 'Tema escuro', sub: 'Sempre ativo', color: 'bg-[rgba(139,92,246,0.15)] text-fm-purple', checked: true },
            { icon: '🔒', label: 'Biometria', sub: 'Acesso rápido e seguro', color: 'bg-[rgba(59,130,246,0.15)] text-fm-blue', checked: false },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between p-[14px]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-[17px] ${row.color}`}>{row.icon}</div>
                <div>
                  <div className="text-[14px] font-medium">{row.label}</div>
                  <div className="text-[12px] text-fm-text2">{row.sub}</div>
                </div>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked={row.checked} />
                <span className="switch-slider" />
              </label>
            </div>
          ))}
          <div className="flex items-center justify-between p-[14px]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[17px] bg-[rgba(245,158,11,0.15)] text-fm-amber">👑</div>
              <div>
                <div className="text-[14px] font-medium">FlowMind Pro</div>
                <div className="text-[12px] text-fm-text2">IA avançada, metas ilimitadas</div>
              </div>
            </div>
            <span className="bg-[rgba(245,158,11,0.15)] text-fm-amber border border-[rgba(245,158,11,0.3)] rounded-full px-2.5 py-1 text-[11px] font-semibold">Em breve</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="pb-4">
        <button
          onClick={handleLogout}
          className="w-full py-[15px] bg-fm-bg4 text-fm-text font-bold text-[15px] rounded-xl border border-fm-border2 cursor-pointer hover:bg-fm-bg3 transition-all"
        >
          Sair da conta
        </button>
      </div>
    </div>
  )
}

function CalendarGrid({ offset, billDays }: { offset: number; billDays: number[] }) {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const firstDay = d.getDay()
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  const today = offset === 0 ? now.getDate() : -1
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

  return (
    <>
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {days.map(d => <div key={d} className="text-center text-[11px] text-fm-text3 font-semibold">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const isToday = day === today
          const hasBill = billDays.includes(day)
          return (
            <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-[8px] text-[12px] font-medium relative cursor-pointer
              ${isToday ? 'bg-[rgba(0,200,150,0.15)] text-fm-green font-bold' : 'text-fm-text2 hover:bg-fm-bg4'}`}>
              {day}
              {hasBill && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-fm-red" />}
            </div>
          )
        })}
      </div>
    </>
  )
}
