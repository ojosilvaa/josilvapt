'use client'
import { useState } from 'react'
import { useDash } from '../layout'
import { useGoals } from '@/lib/hooks/useGoals'
import { useDebts } from '@/lib/hooks/useDebts'
import { useBudgets } from '@/lib/hooks/useBudgets'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatEUR } from '@/lib/utils/currency'
import { debtPayoffMonths } from '@/lib/ai/forecast'
import { useToast } from '@/components/ui/Toast'
import { CATEGORIES, getCategoryMeta } from '@/lib/ai/categorize'

const GOAL_COLORS = ['#00C896','#3B82F6','#8B5CF6','#F59E0B','#EF4444']

export default function MetasPage() {
  const { userId, transactions, awardXP } = useDash()
  const { goals, addGoal, depositToGoal } = useGoals(userId)
  const { debts, addDebt } = useDebts(userId)
  const { budgets, upsertBudget } = useBudgets(userId)
  const toast = useToast()

  const [goalModal, setGoalModal] = useState(false)
  const [debtModal, setDebtModal] = useState(false)
  const [depositModal, setDepositModal] = useState<string | null>(null)
  const [budgetModal, setBudgetModal] = useState(false)

  // Goal form
  const [gName, setGName] = useState('')
  const [gTarget, setGTarget] = useState('')
  const [gDeadline, setGDeadline] = useState('')
  const [gType, setGType] = useState('other')
  const [gColor, setGColor] = useState(GOAL_COLORS[0])

  // Debt form
  const [dName, setDName] = useState('')
  const [dTotal, setDTotal] = useState('')
  const [dRate, setDRate] = useState('')
  const [dPayment, setDPayment] = useState('')
  const [dDue, setDDue] = useState('')

  // Budget form
  const [bCat, setBCat] = useState('')
  const [bLimit, setBLimit] = useState('')

  // Deposit form
  const [depositAmt, setDepositAmt] = useState('')

  const catTotals: Record<string, number> = {}
  transactions.filter(t => !t.is_income).forEach(t => { catTotals[t.category] = (catTotals[t.category] ?? 0) + Number(t.amount) })
  const totalDebt = debts.reduce((s, d) => s + Number(d.remaining_amount), 0)

  async function handleSaveGoal() {
    if (!gName || !gTarget) return
    await addGoal({ name: gName, target_amount: Number(gTarget), deadline: gDeadline || undefined, goal_type: gType, color: gColor })
    toast('🎯', 'Meta criada! +50 XP')
    await awardXP('weekly_review')
    setGoalModal(false)
    setGName(''); setGTarget(''); setGDeadline('')
  }

  async function handleSaveDebt() {
    if (!dName || !dTotal) return
    await addDebt({ name: dName, total_amount: Number(dTotal), remaining_amount: Number(dTotal), monthly_payment: Number(dPayment) || 0, interest_rate: Number(dRate) || 0, due_day: Number(dDue) || 10, debt_type: 'other', priority: debts.length + 1 })
    toast('✅', 'Dívida registada')
    setDebtModal(false)
    setDName(''); setDTotal(''); setDRate(''); setDPayment(''); setDDue('')
  }

  async function handleDeposit() {
    if (!depositModal || !depositAmt) return
    const completed = await depositToGoal(depositModal, Number(depositAmt))
    const xp = await awardXP('goal_deposit')
    toast('💰', completed ? `Meta atingida! +200 XP` : `Depositado! +${xp ?? 15} XP`)
    if (completed) await awardXP('goal_completed')
    setDepositModal(null)
    setDepositAmt('')
  }

  async function handleSaveBudget() {
    if (!bCat || !bLimit) return
    await upsertBudget(bCat, Number(bLimit))
    toast('✅', 'Orçamento guardado')
    setBudgetModal(false)
    setBCat(''); setBLimit('')
  }

  const debtColors = ['#EF4444','#F59E0B','#00C896']

  return (
    <div className="p-4 space-y-6">
      {/* Goals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[14px] font-semibold">Metas de poupança</div>
          <button onClick={() => setGoalModal(true)} className="px-4 py-2 bg-fm-green text-white text-[13px] font-bold rounded-[10px] border-0 cursor-pointer">+ Nova meta</button>
        </div>
        {goals.length === 0 ? (
          <div className="text-center text-fm-text3 py-8 text-[14px] bg-fm-bg3 border border-fm-border rounded-[14px]">Sem metas ainda. Cria a tua primeira!</div>
        ) : goals.map(g => {
          const pct = (g.current_amount / g.target_amount) * 100
          const remaining = g.target_amount - g.current_amount
          let daysInfo = null
          if (g.deadline) {
            const d = Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000)
            daysInfo = d
          }
          const dailySave = daysInfo && daysInfo > 0 ? (remaining / daysInfo).toFixed(2) : null
          return (
            <div key={g.id} className="bg-fm-bg3 border border-fm-border rounded-[14px] p-[14px] mb-2">
              <div className="flex justify-between items-start mb-2.5">
                <div>
                  <div className="text-[15px] font-semibold">{g.name}</div>
                  <div className="text-[12px] text-fm-text2 mt-1 flex items-center gap-2">
                    {formatEUR(g.current_amount)} de {formatEUR(g.target_amount)}
                    {daysInfo !== null && daysInfo >= 0 && (
                      <span className="bg-[rgba(245,158,11,0.15)] text-fm-amber border border-[rgba(245,158,11,0.3)] rounded-full px-2 py-0.5 text-[10px] font-semibold">{daysInfo} dias</span>
                    )}
                  </div>
                </div>
                <div className="text-[18px] font-bold" style={{ color: g.color }}>{pct.toFixed(0)}%</div>
              </div>
              <ProgressBar pct={pct} color={g.color} />
              {dailySave && <div className="text-[12px] text-fm-text2 mt-2">💡 Poupe €{dailySave}/dia para chegar lá no prazo</div>}
              <div className="flex gap-2 mt-3">
                <button onClick={() => setDepositModal(g.id)} className="px-4 py-2 bg-fm-green text-white text-[13px] font-bold rounded-[10px] border-0 cursor-pointer">+ Depositar</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Budgets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[14px] font-semibold">Orçamentos mensais</div>
          <button onClick={() => setBudgetModal(true)} className="px-4 py-2 bg-fm-bg4 text-fm-text text-[13px] font-bold rounded-[10px] border border-fm-border2 cursor-pointer">+ Orçamento</button>
        </div>
        {budgets.length === 0 ? (
          <div className="text-center text-fm-text3 py-6 text-[14px] bg-fm-bg3 border border-fm-border rounded-[14px]">Sem orçamentos definidos.</div>
        ) : (
          <div className="bg-fm-bg3 border border-fm-border rounded-[14px] p-4 space-y-3">
            {budgets.map(b => {
              const cat = getCategoryMeta(b.category)
              const spent = catTotals[b.category] ?? 0
              const pct = (spent / b.limit_amount) * 100
              const color = pct >= 100 ? '#EF4444' : pct >= 75 ? '#F59E0B' : '#00C896'
              return (
                <div key={b.id}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px] font-medium">{cat.emoji} {b.category}</span>
                    <span className={`text-[12px] ${pct > 100 ? 'text-fm-red' : 'text-fm-text2'}`}>{formatEUR(spent)} / {formatEUR(b.limit_amount)} {pct > 100 ? '⚠️' : ''}</span>
                  </div>
                  <ProgressBar pct={pct} color={color} />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Debts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[14px] font-semibold">Dívidas</div>
          <button onClick={() => setDebtModal(true)} className="px-4 py-2 bg-fm-bg4 text-fm-text text-[13px] font-bold rounded-[10px] border border-fm-border2 cursor-pointer">+ Dívida</button>
        </div>
        {totalDebt > 0 && (
          <div className="flex gap-3 p-[14px] rounded-[14px] mb-3" style={{ background: 'linear-gradient(135deg,#1A0D0D,#1A1230)', border: '0.5px solid rgba(239,68,68,0.3)' }}>
            <div className="w-9 h-9 rounded-[10px] bg-[rgba(239,68,68,0.15)] flex items-center justify-center text-[17px] flex-shrink-0">💳</div>
            <div>
              <div className="text-[10px] text-fm-red font-bold uppercase tracking-[0.5px] mb-1">Total em dívidas</div>
              <div className="text-[13px] text-white/80">Deves <strong className="text-fm-red">{formatEUR(totalDebt)}</strong> no total. Prioridade: Método Avalanche.</div>
            </div>
          </div>
        )}
        {debts.length === 0 ? (
          <div className="text-center text-fm-text3 py-6 text-[14px] bg-fm-bg3 border border-fm-border rounded-[14px]">Sem dívidas registadas. 🎉</div>
        ) : debts.map((d, i) => {
          const months = debtPayoffMonths(d.remaining_amount, d.monthly_payment, d.interest_rate)
          const pct = Math.round((1 - d.remaining_amount / d.total_amount) * 100)
          const color = debtColors[i] ?? '#6B7280'
          return (
            <div key={d.id} className="bg-fm-bg3 border border-fm-border rounded-[14px] p-[14px] mb-2">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: color }}>{i + 1}</div>
                  <div className="text-[14px] font-semibold">{d.name}</div>
                </div>
                <div className="text-[16px] font-bold text-fm-red">{formatEUR(d.remaining_amount)}</div>
              </div>
              <div className="flex justify-between text-[12px] text-fm-text3 mb-2">
                <span>Parcela: {formatEUR(d.monthly_payment)}/mês</span>
                <span>{d.interest_rate > 0 ? `${d.interest_rate}% a.m.` : 'Sem juros'}</span>
                <span>Vence dia {d.due_day}</span>
              </div>
              <ProgressBar pct={pct} color={color} />
              <div className="text-[12px] text-fm-text2 mt-1.5">Quitação ~{isFinite(months) ? `${months} meses` : '∞'} • Pago: {pct}%</div>
            </div>
          )
        })}
      </div>

      {/* New Goal Modal */}
      <Modal open={goalModal} onClose={() => setGoalModal(false)} title="Nova meta de poupança">
        <div className="space-y-[14px]">
          <Field label="Nome da meta"><input className={inputCls} value={gName} onChange={e => setGName(e.target.value)} placeholder="Ex: Férias no Algarve 🏖️" /></Field>
          <Field label="Valor alvo (€)"><input type="number" className={inputCls} value={gTarget} onChange={e => setGTarget(e.target.value)} placeholder="3500" /></Field>
          <Field label="Prazo (opcional)"><input type="date" className={inputCls} value={gDeadline} onChange={e => setGDeadline(e.target.value)} /></Field>
          <Field label="Cor">
            <div className="flex gap-2">
              {GOAL_COLORS.map(c => (
                <button key={c} onClick={() => setGColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${gColor === c ? 'border-white scale-110' : 'border-transparent'}`} style={{ background: c }} />
              ))}
            </div>
          </Field>
          <Button onClick={handleSaveGoal} disabled={!gName || !gTarget}>Criar meta 🎯</Button>
          <Button variant="secondary" onClick={() => setGoalModal(false)}>Cancelar</Button>
        </div>
      </Modal>

      {/* New Debt Modal */}
      <Modal open={debtModal} onClose={() => setDebtModal(false)} title="Adicionar dívida">
        <div className="space-y-[14px]">
          <Field label="Nome"><input className={inputCls} value={dName} onChange={e => setDName(e.target.value)} placeholder="Ex: Cartão Millennium BCP" /></Field>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Valor total (€)"><input type="number" className={inputCls} value={dTotal} onChange={e => setDTotal(e.target.value)} placeholder="5000" /></Field>
            <Field label="Juros ao mês (%)"><input type="number" className={inputCls} value={dRate} onChange={e => setDRate(e.target.value)} placeholder="3.5" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Parcela mensal"><input type="number" className={inputCls} value={dPayment} onChange={e => setDPayment(e.target.value)} placeholder="500" /></Field>
            <Field label="Dia de vencimento"><input type="number" className={inputCls} value={dDue} onChange={e => setDDue(e.target.value)} placeholder="10" min={1} max={31} /></Field>
          </div>
          <Button onClick={handleSaveDebt} disabled={!dName || !dTotal}>Adicionar dívida</Button>
          <Button variant="secondary" onClick={() => setDebtModal(false)}>Cancelar</Button>
        </div>
      </Modal>

      {/* Budget Modal */}
      <Modal open={budgetModal} onClose={() => setBudgetModal(false)} title="Definir orçamento">
        <div className="space-y-[14px]">
          <Field label="Categoria">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c.key} onClick={() => setBCat(c.key)}
                  className={`px-[14px] py-2 rounded-full text-[13px] border transition-all ${bCat === c.key ? 'bg-[rgba(0,200,150,0.15)] border-fm-green text-fm-green' : 'bg-fm-bg4 border-fm-border2 text-fm-text2'}`}>
                  {c.emoji} {c.key}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Limite mensal (€)"><input type="number" className={inputCls} value={bLimit} onChange={e => setBLimit(e.target.value)} placeholder="400" /></Field>
          <Button onClick={handleSaveBudget} disabled={!bCat || !bLimit}>Guardar orçamento</Button>
          <Button variant="secondary" onClick={() => setBudgetModal(false)}>Cancelar</Button>
        </div>
      </Modal>

      {/* Deposit Modal */}
      <Modal open={!!depositModal} onClose={() => setDepositModal(null)} title="Depositar na meta">
        <div className="space-y-[14px]">
          <Field label="Valor a depositar (€)"><input type="number" className={inputCls} value={depositAmt} onChange={e => setDepositAmt(e.target.value)} placeholder="100" /></Field>
          <Button onClick={handleDeposit} disabled={!depositAmt}>Depositar 💰</Button>
          <Button variant="secondary" onClick={() => setDepositModal(null)}>Cancelar</Button>
        </div>
      </Modal>
    </div>
  )
}

const inputCls = 'w-full bg-fm-bg4 border border-fm-border2 rounded-[10px] px-[14px] py-3 text-[15px] text-fm-text outline-none focus:border-fm-green placeholder:text-fm-text3 transition-all'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[12px] text-fm-text2 font-medium mb-1.5">{label}</div>
      {children}
    </div>
  )
}
