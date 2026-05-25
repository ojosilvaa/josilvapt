'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'register'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) return
    if (mode === 'register' && !name.trim()) return
    setLoading(true)
    setError('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message === 'Invalid login credentials' ? 'Email ou password incorretos.' : error.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })
      if (error) {
        setError(error.message)
      } else {
        // Auto sign in after register
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
        if (!loginError) {
          router.push('/onboarding')
          router.refresh()
        } else {
          setError('Conta criada. Faz login.')
          setMode('login')
        }
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-fm-bg flex flex-col items-center justify-center p-6 text-fm-text">
      <div className="w-full max-w-sm animate-fadeUp">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-[48px] mb-3">💸</div>
          <div className="text-[32px] font-bold tracking-tight text-fm-green">
            Flow<span className="text-fm-text2 font-normal">Mind</span>
          </div>
          <div className="text-[14px] text-fm-text2 mt-2">O teu dinheiro, a tua mentalidade</div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 bg-fm-bg4 rounded-[10px] p-[3px] mb-6">
          <button
            onClick={() => { setMode('login'); setError('') }}
            className={`flex-1 py-2.5 rounded-[8px] text-[14px] font-semibold border-0 cursor-pointer transition-all ${mode === 'login' ? 'bg-fm-bg3 text-fm-text' : 'bg-transparent text-fm-text3'}`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setMode('register'); setError('') }}
            className={`flex-1 py-2.5 rounded-[8px] text-[14px] font-semibold border-0 cursor-pointer transition-all ${mode === 'register' ? 'bg-fm-bg3 text-fm-text' : 'bg-transparent text-fm-text3'}`}
          >
            Criar conta
          </button>
        </div>

        <div className="space-y-[14px]">
          {mode === 'register' && (
            <div>
              <div className="text-[12px] text-fm-text2 font-medium mb-1.5">Nome</div>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="O teu nome"
                className="w-full bg-fm-bg4 border border-fm-border2 rounded-[10px] px-[14px] py-3 text-[15px] text-fm-text outline-none focus:border-fm-green placeholder:text-fm-text3 transition-all"
              />
            </div>
          )}

          <div>
            <div className="text-[12px] text-fm-text2 font-medium mb-1.5">Email</div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="o-teu@email.com"
              className="w-full bg-fm-bg4 border border-fm-border2 rounded-[10px] px-[14px] py-3 text-[15px] text-fm-text outline-none focus:border-fm-green placeholder:text-fm-text3 transition-all"
            />
          </div>

          <div>
            <div className="text-[12px] text-fm-text2 font-medium mb-1.5">Password</div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              className="w-full bg-fm-bg4 border border-fm-border2 rounded-[10px] px-[14px] py-3 text-[15px] text-fm-text outline-none focus:border-fm-green placeholder:text-fm-text3 transition-all"
            />
          </div>

          {error && (
            <div className="text-fm-red text-[13px] bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-[9px] px-3 py-2">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password || (mode === 'register' && !name)}
            className="w-full py-[15px] bg-fm-green text-white font-bold text-[15px] rounded-xl border-0 cursor-pointer hover:bg-[#00b085] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'A processar...' : mode === 'login' ? 'Entrar →' : 'Criar conta →'}
          </button>
        </div>
      </div>
    </div>
  )
}
