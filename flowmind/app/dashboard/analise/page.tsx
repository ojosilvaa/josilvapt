'use client'
import { useState, useEffect, useRef } from 'react'
import { useDash } from '../layout'
import { getCategoryMeta } from '@/lib/ai/categorize'
import { formatEUR } from '@/lib/utils/currency'
import { forecastMonthEnd } from '@/lib/ai/forecast'
import { createClient } from '@/lib/supabase/client'

const TABS = ['Gastos', 'Evolução', 'Emocional', 'Previsão'] as const
type Tab = typeof TABS[number]

const EMOTION_MAP: Record<string, { label: string; emoji: string; color: string }> = {
  happy:     { label: '😊 Feliz', emoji: '😊', color: '#00C896' },
  neutral:   { label: '😐 Neutro', emoji: '😐', color: '#6B7280' },
  guilty:    { label: '😬 Culpado', emoji: '😬', color: '#F59E0B' },
  impulsive: { label: '😤 Impulsivo', emoji: '😤', color: '#EF4444' },
  anxious:   { label: '😟 Ansioso', emoji: '😟', color: '#8B5CF6' },
}

export default function AnalisePage() {
  const { transactions, userId } = useDash()
  const [tab, setTab] = useState<Tab>('Gastos')
  const [history, setHistory] = useState<{ month: string; spent: number; income: number }[]>([])
  const supabase = createClient()

  const expenses = transactions.filter(t => !t.is_income)
  const incomes = transactions.filter(t => t.is_income)
  const totalSpent = expenses.reduce((s, t) => s + Number(t.amount), 0)

  // Category breakdown
  const catTotals: Record<string, number> = {}
  expenses.forEach(t => { catTotals[t.category] = (catTotals[t.category] ?? 0) + Number(t.amount) })
  const sortedCats = Object.entries(catTotals).sort(([,a],[,b]) => b - a)

  // Emotion breakdown
  const emotionCounts: Record<string, number> = {}
  expenses.forEach(t => {
    const e = t.emotional_state ?? 'neutral'
    emotionCounts[e] = (emotionCounts[e] ?? 0) + 1
  })
  const totalEmotions = Object.values(emotionCounts).reduce((s, n) => s + n, 0)

  const forecast = forecastMonthEnd(expenses)
  const now = new Date()
  const dayOfMonth = now.getDate()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

  useEffect(() => {
    if (!userId) return
    // Fetch last 6 months of cached reports or compute from transactions
    const months: { month: string; spent: number; income: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({ month: d.toLocaleDateString('pt-PT', { month: 'short' }), spent: 0, income: 0 })
    }
    // Use current month's data for the last entry
    months[5].spent = totalSpent
    months[5].income = incomes.reduce((s, t) => s + Number(t.amount), 0)
    setHistory(months)
  }, [userId, transactions.length])

  return (
    <div className="p-4">
      {/* Tab bar */}
      <div className="flex gap-1 bg-fm-bg4 rounded-[10px] p-[3px] mb-4">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-[8px] text-[12px] font-semibold transition-all border-0 cursor-pointer ${tab === t ? 'bg-fm-bg3 text-fm-text' : 'bg-transparent text-fm-text3'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Gastos' && (
        <div>
          <div className="text-[14px] font-semibold mb-3">Por categoria — este mês</div>
          <DonutChart categories={sortedCats} total={totalSpent} />
          <div className="bg-fm-bg3 border border-fm-border rounded-[14px] overflow-hidden mt-3">
            {sortedCats.map(([cat, val]) => {
              const meta = getCategoryMeta(cat)
              const pct = totalSpent > 0 ? Math.round((val / totalSpent) * 100) : 0
              return (
                <div key={cat} className="flex items-center px-4 py-3 border-b border-fm-border last:border-0">
                  <span className="w-28 text-[13px]">{meta.emoji} {cat}</span>
                  <span className="flex-1 text-center text-[12px] text-fm-text3">{pct}%</span>
                  <span className="text-[13px] font-semibold w-20 text-right">{formatEUR(val)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'Evolução' && (
        <div>
          <div className="text-[14px] font-semibold mb-3">Rendimento vs Despesas — 6 meses</div>
          <LineChartSVG data={history} />
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-3 text-center">
              <div className="text-[11px] text-fm-text3 uppercase tracking-[0.6px] mb-1 font-dm">Total gasto</div>
              <div className="text-[16px] font-bold text-fm-red">{formatEUR(totalSpent)}</div>
              <div className="text-[12px] text-fm-text3">este mês</div>
            </div>
            <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-3 text-center">
              <div className="text-[11px] text-fm-text3 uppercase tracking-[0.6px] mb-1 font-dm">Rendimentos</div>
              <div className="text-[16px] font-bold text-fm-green">{formatEUR(incomes.reduce((s, t) => s + Number(t.amount), 0))}</div>
              <div className="text-[12px] text-fm-text3">este mês</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Emocional' && (
        <div>
          <div className="flex gap-3 p-[14px] rounded-[14px] mb-4" style={{ background: 'linear-gradient(135deg,#1A1230,#0F1825)', border: '0.5px solid rgba(139,92,246,0.3)' }}>
            <div className="w-9 h-9 rounded-[10px] bg-[rgba(139,92,246,0.15)] flex items-center justify-center text-[17px] flex-shrink-0">🧠</div>
            <div>
              <div className="text-[10px] text-fm-purple font-bold uppercase tracking-[0.5px] mb-1">✦ Análise comportamental</div>
              <div className="text-[13px] text-white/80 leading-[1.5]">
                {expenses.length === 0 ? 'Regista gastos para ver padrões emocionais.' :
                  `Registaste ${expenses.length} gastos este mês. Emoção dominante: ${EMOTION_MAP[Object.entries(emotionCounts).sort(([,a],[,b]) => b - a)[0]?.[0] ?? 'neutral']?.emoji ?? '😐'}.`}
              </div>
            </div>
          </div>

          <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-4 mb-4">
            <div className="text-[14px] font-semibold mb-3">Emoções ao gastar</div>
            {Object.entries(EMOTION_MAP).map(([key, meta]) => {
              const count = emotionCounts[key] ?? 0
              const pct = totalEmotions > 0 ? Math.round((count / totalEmotions) * 100) : 0
              return (
                <div key={key} className="flex items-center gap-2.5 mb-2">
                  <div className="w-[70px] text-[12px] text-fm-text2">{meta.label}</div>
                  <div className="flex-1 h-[10px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: meta.color }} />
                  </div>
                  <div className="text-[12px] text-fm-text2 w-8 text-right">{pct}%</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'Previsão' && (
        <div>
          <div className="flex gap-3 p-[14px] rounded-[14px] mb-4" style={{ background: 'linear-gradient(135deg,#1A1230,#0F1825)', border: '0.5px solid rgba(139,92,246,0.3)' }}>
            <div className="w-9 h-9 rounded-[10px] bg-[rgba(139,92,246,0.15)] flex items-center justify-center text-[17px] flex-shrink-0">📈</div>
            <div>
              <div className="text-[10px] text-fm-purple font-bold uppercase tracking-[0.5px] mb-1">✦ IA Preditiva</div>
              <div className="text-[13px] text-white/80 leading-[1.5]">
                Mantendo este ritmo, gastarás <strong className="text-white">{formatEUR(forecast)}</strong> até ao fim do mês.
                {' '}({Math.round((forecast / totalSpent - 1) * 100) > 0 ? `+${Math.round((forecast / totalSpent - 1) * 100)}% vs hoje` : 'dentro do previsto'})
              </div>
            </div>
          </div>

          <ForecastChartSVG expenses={expenses} dayOfMonth={dayOfMonth} daysInMonth={daysInMonth} />
        </div>
      )}
    </div>
  )
}

function DonutChart({ categories, total }: { categories: [string, number][]; total: number }) {
  if (total === 0) return (
    <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-8 text-center text-fm-text3 text-[14px]">Sem gastos este mês</div>
  )
  const colors = ['#EF4444','#3B82F6','#F59E0B','#8B5CF6','#00C896','#6B7280','#F97316','#EC4899']
  const size = 180
  const cx = size / 2, cy = size / 2, r = 70, innerR = 45
  let angle = -Math.PI / 2
  const slices = categories.map(([cat, val], i) => {
    const frac = val / total
    const startAngle = angle
    angle += frac * 2 * Math.PI
    const endAngle = angle
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle)
    const ix1 = cx + innerR * Math.cos(endAngle), iy1 = cy + innerR * Math.sin(endAngle)
    const ix2 = cx + innerR * Math.cos(startAngle), iy2 = cy + innerR * Math.sin(startAngle)
    const large = frac > 0.5 ? 1 : 0
    return { cat, val, color: colors[i % colors.length], path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2} Z`, pct: Math.round(frac * 100) }
  })

  return (
    <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-4">
      <div className="flex justify-center">
        <svg width={size} height={size}>
          {slices.map(s => <path key={s.cat} d={s.path} fill={s.color} />)}
          <text x={cx} y={cy - 8} textAnchor="middle" fill="rgba(240,242,245,0.6)" fontSize="11" fontFamily="DM Sans">Total</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="#F0F2F5" fontSize="14" fontWeight="700" fontFamily="Plus Jakarta Sans">{formatEUR(total)}</text>
        </svg>
      </div>
    </div>
  )
}

function LineChartSVG({ data }: { data: { month: string; spent: number; income: number }[] }) {
  if (data.every(d => d.spent === 0 && d.income === 0)) return (
    <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-8 text-center text-fm-text3 text-[14px]">Sem histórico disponível ainda</div>
  )
  const W = 340, H = 160, padL = 40, padR = 10, padT = 10, padB = 30
  const maxVal = Math.max(...data.flatMap(d => [d.spent, d.income]), 1)
  const toY = (v: number) => padT + (1 - v / maxVal) * (H - padT - padB)
  const toX = (i: number) => padL + (i / (data.length - 1)) * (W - padL - padR)
  const makePath = (vals: number[]) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ')

  return (
    <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-4">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        {data.map((d, i) => (
          <text key={i} x={toX(i)} y={H - 4} textAnchor="middle" fill="rgba(240,242,245,0.35)" fontSize="10" fontFamily="DM Sans">{d.month}</text>
        ))}
        <path d={makePath(data.map(d => d.income))} fill="none" stroke="#00C896" strokeWidth="2" />
        <path d={makePath(data.map(d => d.spent))} fill="none" stroke="#EF4444" strokeWidth="2" />
        <text x={padL - 4} y={padT + 4} textAnchor="end" fill="rgba(240,242,245,0.35)" fontSize="9" fontFamily="DM Sans">€{Math.round(maxVal)}</text>
      </svg>
      <div className="flex gap-4 mt-2 text-[11px]">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-fm-green" />Rendimento</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-fm-red" />Despesas</span>
      </div>
    </div>
  )
}

function ForecastChartSVG({ expenses, dayOfMonth, daysInMonth }: { expenses: { date: string; amount: number }[]; dayOfMonth: number; daysInMonth: number }) {
  const W = 340, H = 160, padL = 40, padR = 10, padT = 10, padB = 30
  // Accumulate real spending per day
  const real: number[] = Array(dayOfMonth).fill(0)
  expenses.forEach(t => {
    const d = new Date(t.date + 'T12:00:00').getDate()
    if (d <= dayOfMonth) real[d - 1] = (real[d - 1] ?? 0) + Number(t.amount)
  })
  const cumReal: number[] = real.reduce((acc: number[], v, i) => [...acc, (acc[i - 1] ?? 0) + v], [])
  const lastReal = cumReal[cumReal.length - 1] ?? 0
  const dailyAvg = lastReal / dayOfMonth
  const cumForecast: number[] = Array.from({ length: daysInMonth }, (_, i) =>
    i < dayOfMonth ? cumReal[i] ?? 0 : lastReal + dailyAvg * (i - dayOfMonth + 1)
  )
  const maxVal = Math.max(...cumForecast, 1)
  const toY = (v: number) => padT + (1 - v / maxVal) * (H - padT - padB)
  const toX = (i: number) => padL + (i / (daysInMonth - 1)) * (W - padL - padR)
  const realPath = cumReal.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ')
  const forecastPath = cumForecast.slice(dayOfMonth - 1).map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(dayOfMonth - 1 + i)} ${toY(v)}`).join(' ')

  return (
    <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-4">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        {[0, 0.5, 1].map(f => (
          <line key={f} x1={padL} x2={W - padR} y1={toY(maxVal * f)} y2={toY(maxVal * f)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        <path d={realPath} fill="none" stroke="#00C896" strokeWidth="2" />
        <path d={forecastPath} fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 4" />
        {[1, 8, 15, 22, daysInMonth].map(d => (
          <text key={d} x={toX(d - 1)} y={H - 4} textAnchor="middle" fill="rgba(240,242,245,0.35)" fontSize="9" fontFamily="DM Sans">{d}</text>
        ))}
        <text x={padL - 4} y={padT + 8} textAnchor="end" fill="rgba(240,242,245,0.35)" fontSize="9" fontFamily="DM Sans">€{Math.round(maxVal)}</text>
      </svg>
      <div className="flex gap-4 mt-2 text-[11px]">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-fm-green" />Real</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-fm-amber border-dashed" style={{ borderTop: '1px dashed #F59E0B', height: 1 }} />Previsão</span>
      </div>
    </div>
  )
}
