'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const GOALS = [
  { emoji: '💰', label: 'Poupar dinheiro', key: 'save' },
  { emoji: '💳', label: 'Sair das dívidas', key: 'debt' },
  { emoji: '📊', label: 'Organizar os meus gastos', key: 'organize' },
  { emoji: '📈', label: 'Começar a investir', key: 'invest' },
]

const CATS = ['🍔 Alimentação','🚗 Transporte','🏠 Moradia','🎮 Lazer','💊 Saúde','👕 Vestuário','📱 Assinaturas','📚 Educação']

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState('')
  const [income, setIncome] = useState(1500)
  const [cats, setCats] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const TOTAL_STEPS = 5
  const Dots = ({ active }: { active: number }) => (
    <div className="flex gap-1.5 mt-2">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className={`rounded-full transition-all ${i + 1 === active ? 'w-5 h-1.5 bg-fm-green' : 'w-1.5 h-1.5 bg-white/15'}`} />
      ))}
    </div>
  )

  async function finish(notifs: boolean) {
    setSaving(true)
    const supabaseClient = supabase
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (user) {
      await supabaseClient.from('profiles').update({
        monthly_income: income,
        goal_type: goal,
        onboarding_completed: true,
      }).eq('id', user.id)
    }
    router.push('/dashboard')
  }

  if (step === 1) return (
    <Screen>
      <div className="text-[64px] mb-2">💸</div>
      <h1 className="text-[26px] font-bold tracking-tight">Bem-vindo ao FlowMind</h1>
      <p className="text-[15px] text-fm-text2 leading-relaxed max-w-xs text-center">O único app financeiro que entende que dinheiro é emoção, não planilha.</p>
      <Dots active={1} />
      <div className="flex flex-col gap-2 w-full max-w-[280px] mt-5">
        <BigBtn onClick={() => setStep(2)}>Começar agora →</BigBtn>
        <SmallBtn onClick={() => router.push('/dashboard')}>Já tenho conta</SmallBtn>
      </div>
    </Screen>
  )

  if (step === 2) return (
    <Screen>
      <div className="text-[64px] mb-2">🎯</div>
      <h1 className="text-[26px] font-bold tracking-tight">Qual é o teu objetivo?</h1>
      <p className="text-[15px] text-fm-text2">Vamos personalizar tudo para ti.</p>
      <div className="flex flex-col gap-2.5 w-full max-w-[340px]">
        {GOALS.map(g => (
          <button key={g.key} onClick={() => setGoal(g.key)}
            className={`flex items-center gap-3 px-5 py-[14px] rounded-[14px] border text-[15px] font-medium text-left transition-all ${goal === g.key ? 'bg-[rgba(0,200,150,0.15)] border-fm-green text-fm-green' : 'bg-fm-bg3 border-fm-border2 text-fm-text'}`}>
            <span className="text-[22px]">{g.emoji}</span>{g.label}
          </button>
        ))}
      </div>
      <Dots active={2} />
      <BigBtn disabled={!goal} className="max-w-[280px] mt-3" onClick={() => setStep(3)}>Continuar →</BigBtn>
    </Screen>
  )

  if (step === 3) return (
    <Screen>
      <div className="text-[64px] mb-2">💵</div>
      <h1 className="text-[26px] font-bold tracking-tight">O teu rendimento mensal?</h1>
      <p className="text-[15px] text-fm-text2">Aproximado. Podes mudar depois.</p>
      <div className="w-full max-w-xs flex flex-col gap-2">
        <div className="text-[28px] font-bold text-fm-green tracking-tight text-center" style={{ letterSpacing: '-1px' }}>
          € {income.toLocaleString('pt-PT')}
        </div>
        <input type="range" min={300} max={10000} step={200} value={income} onChange={e => setIncome(Number(e.target.value))} />
        <div className="flex justify-between text-[11px] text-fm-text3"><span>€300</span><span>€10.000+</span></div>
      </div>
      <Dots active={3} />
      <BigBtn className="max-w-[280px] mt-3" onClick={() => setStep(4)}>Continuar →</BigBtn>
    </Screen>
  )

  if (step === 4) return (
    <Screen>
      <div className="text-[64px] mb-2">🏷️</div>
      <h1 className="text-[26px] font-bold tracking-tight">Onde tu mais gastas?</h1>
      <p className="text-[15px] text-fm-text2">Seleciona as principais categorias.</p>
      <div className="flex flex-wrap gap-2 justify-center max-w-[340px]">
        {CATS.map(cat => (
          <button key={cat} onClick={() => setCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
            className={`px-[14px] py-2 rounded-full text-[13px] border transition-all ${cats.includes(cat) ? 'bg-[rgba(0,200,150,0.15)] border-fm-green text-fm-green' : 'bg-fm-bg4 border-fm-border2 text-fm-text2'}`}>
            {cat}
          </button>
        ))}
      </div>
      <Dots active={4} />
      <BigBtn className="max-w-[280px] mt-3" onClick={() => setStep(5)}>Continuar →</BigBtn>
    </Screen>
  )

  return (
    <Screen>
      <div className="text-[64px] mb-2">🔔</div>
      <h1 className="text-[26px] font-bold tracking-tight">Posso lembrar-te?</h1>
      <p className="text-[15px] text-fm-text2 leading-relaxed max-w-xs text-center">Notificações inteligentes ajudam-te a manter a sequência.</p>
      <div className="bg-fm-bg3 border border-fm-border2 rounded-[14px] p-4 max-w-xs w-full text-left text-[13px] text-fm-text2 leading-[1.8]">
        📊 Resumo diário às 22h<br />
        🔥 Alerta de streak em risco<br />
        ⚡ Contas vencendo em breve<br />
        💡 Insights semanais personalizados
      </div>
      <Dots active={5} />
      <div className="flex flex-col gap-2 w-full max-w-[280px] mt-3">
        <BigBtn onClick={() => finish(true)} disabled={saving}>{saving ? 'A preparar...' : 'Ativar e entrar 🚀'}</BigBtn>
        <SmallBtn onClick={() => finish(false)}>Agora não</SmallBtn>
      </div>
    </Screen>
  )
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-fm-bg flex flex-col items-center justify-center p-8 gap-4 text-fm-text text-center animate-fadeUp">
      {children}
    </div>
  )
}

function BigBtn({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      className={`w-full py-[15px] bg-fm-green text-white font-bold text-[15px] rounded-xl border-0 cursor-pointer hover:bg-[#00b085] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >{children}</button>
  )
}

function SmallBtn({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="w-full py-2.5 bg-fm-bg4 text-fm-text font-bold text-[13px] rounded-[10px] border border-fm-border2 cursor-pointer hover:bg-fm-bg3 transition-all"
      {...props}
    >{children}</button>
  )
}
