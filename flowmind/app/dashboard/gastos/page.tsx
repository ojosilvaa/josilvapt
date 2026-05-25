'use client'
import { useState } from 'react'
import { useDash } from '../layout'
import { getCategoryMeta, CATEGORIES } from '@/lib/ai/categorize'
import { formatEUR } from '@/lib/utils/currency'
import { formatDatePT } from '@/lib/utils/dates'

export default function GastosPage() {
  const { transactions } = useDash()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const expenses = transactions.filter(t => !t.is_income)
  const filtered = expenses.filter(t => {
    const matchesCat = filter === 'all' || t.category === filter
    const matchesSearch = !search || t.description.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  const totalMonth = expenses.reduce((s, t) => s + Number(t.amount), 0)
  const totalIncome = transactions.filter(t => t.is_income).reduce((s, t) => s + Number(t.amount), 0)

  // Group by date
  const grouped: Record<string, typeof filtered> = {}
  filtered.forEach(tx => {
    if (!grouped[tx.date]) grouped[tx.date] = []
    grouped[tx.date].push(tx)
  })

  return (
    <div className="p-4">
      {/* Search + filter */}
      <div className="flex gap-2 mb-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Buscar transação..."
          className="flex-1 bg-fm-bg3 border border-fm-border2 rounded-[10px] px-3 py-2.5 text-[14px] text-fm-text outline-none focus:border-fm-green placeholder:text-fm-text3"
        />
      </div>

      {/* Category filter chips */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        <CatChip active={filter === 'all'} onClick={() => setFilter('all')}>Todos</CatChip>
        {CATEGORIES.slice(0, -1).map(cat => (
          <CatChip key={cat.key} active={filter === cat.key} onClick={() => setFilter(cat.key)}>
            {cat.emoji} {cat.key}
          </CatChip>
        ))}
      </div>

      {/* Transaction list */}
      {filtered.length === 0 ? (
        <div className="text-center text-fm-text3 py-12 text-[14px]">Nenhuma transação encontrada</div>
      ) : (
        <div className="bg-fm-bg3 border border-fm-border rounded-[14px] overflow-hidden mb-4">
          {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, txs]) => (
            <div key={date}>
              <div className="text-[11px] text-fm-text3 px-4 py-2 uppercase tracking-[0.4px] font-semibold bg-fm-bg4">
                {formatDatePT(date)}
              </div>
              {txs.map(tx => {
                const cat = getCategoryMeta(tx.category)
                return (
                  <div key={tx.id} className="flex items-center gap-3 px-4 py-3 border-b border-fm-border last:border-0">
                    <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[18px] flex-shrink-0" style={{ background: `${cat.color}26` }}>
                      {cat.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium truncate">{tx.description}</div>
                      <div className="text-[11px] text-fm-text3">{tx.category} • {tx.source} {emotionEmoji(tx.emotional_state)}</div>
                    </div>
                    <div className={`text-[15px] font-semibold flex-shrink-0 ${tx.is_income ? 'text-fm-green' : 'text-fm-red'}`}>
                      {tx.is_income ? '+' : '-'}{formatEUR(Number(tx.amount))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Month summary */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-3 text-center">
          <div className="text-[11px] text-fm-text3 uppercase tracking-[0.6px] mb-1 font-dm">Total gasto</div>
          <div className="text-[22px] font-bold text-fm-red">{formatEUR(totalMonth)}</div>
        </div>
        <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-3 text-center">
          <div className="text-[11px] text-fm-text3 uppercase tracking-[0.6px] mb-1 font-dm">Transações</div>
          <div className="text-[22px] font-bold text-fm-blue">{filtered.length}</div>
        </div>
      </div>
      {totalIncome > 0 && (
        <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-3 text-center">
          <div className="text-[11px] text-fm-text3 uppercase tracking-[0.6px] mb-1 font-dm">Rendimentos este mês</div>
          <div className="text-[22px] font-bold text-fm-green">{formatEUR(totalIncome)}</div>
        </div>
      )}
    </div>
  )
}

function CatChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-[14px] py-2 rounded-full text-[13px] border transition-all whitespace-nowrap ${active ? 'bg-[rgba(0,200,150,0.15)] border-fm-green text-fm-green' : 'bg-fm-bg4 border-fm-border2 text-fm-text2'}`}
    >
      {children}
    </button>
  )
}

function emotionEmoji(state?: string | null) {
  const map: Record<string, string> = { happy: '😊', neutral: '😐', guilty: '😬', impulsive: '😤', anxious: '😟' }
  return state ? (map[state] ?? '') : ''
}
