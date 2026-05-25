'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleMagicLink() {
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-fm-bg flex flex-col items-center justify-center p-6 text-fm-text">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-[48px] mb-3">💸</div>
          <div className="text-[32px] font-bold tracking-tight text-fm-green">
            Flow<span className="text-fm-text2 font-normal">Mind</span>
          </div>
          <div className="text-[14px] text-fm-text2 mt-2">O teu dinheiro, a tua mentalidade</div>
        </div>

        {sent ? (
          <div className="bg-[rgba(0,200,150,0.1)] border border-[rgba(0,200,150,0.3)] rounded-[var(--radius-lg)] p-6 text-center animate-fadeUp">
            <div className="text-[40px] mb-3">📧</div>
            <div className="text-[16px] font-semibold mb-2">Verifica o teu email</div>
            <div className="text-[14px] text-fm-text2 leading-relaxed">
              Enviámos um link mágico para <strong>{email}</strong>. Clica no link para entrar.
            </div>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-[13px] text-fm-text3 underline cursor-pointer bg-none border-none"
            >
              Usar outro email
            </button>
          </div>
        ) : (
          <div className="animate-fadeUp">
            <div className="mb-[14px]">
              <div className="text-[12px] text-fm-text2 font-medium mb-1.5">Email</div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleMagicLink()}
                placeholder="o-teu@email.com"
                className="w-full bg-fm-bg4 border border-fm-border2 rounded-[10px] px-[14px] py-3 text-[15px] text-fm-text outline-none focus:border-fm-green placeholder:text-fm-text3 transition-all"
              />
            </div>
            {error && <div className="text-fm-red text-[13px] mb-3">{error}</div>}
            <button
              onClick={handleMagicLink}
              disabled={loading || !email}
              className="w-full py-[15px] bg-fm-green text-white font-bold text-[15px] rounded-xl border-0 cursor-pointer hover:bg-[#00b085] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'A enviar...' : 'Entrar com link mágico ✨'}
            </button>
            <div className="text-center text-[12px] text-fm-text3 mt-4">
              Sem passwords. Apenas um clique no teu email.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
