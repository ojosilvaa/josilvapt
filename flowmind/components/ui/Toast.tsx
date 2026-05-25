'use client'
import { useState, useEffect, createContext, useContext, useCallback } from 'react'

interface ToastItem { id: number; icon: string; msg: string }

const ToastCtx = createContext<(icon: string, msg: string) => void>(() => {})

export function useToast() { return useContext(ToastCtx) }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  let nextId = 0

  const showToast = useCallback((icon: string, msg: string) => {
    const id = ++nextId
    setToasts(p => [...p, { id, icon, msg }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200)
  }, [])

  return (
    <ToastCtx.Provider value={showToast}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="bg-fm-bg3 border border-fm-border2 rounded-[14px] px-5 py-3 text-[13px] text-fm-text flex items-center gap-2 shadow-xl animate-fadeUp whitespace-nowrap"
          >
            <span className="text-[18px]">{t.icon}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
