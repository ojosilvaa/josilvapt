'use client'
import { useEffect, useRef } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center animate-fadeIn"
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className="bg-fm-bg2 rounded-t-[24px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto animate-slideUp"
        style={{ padding: '24px' }}
      >
        <div className="w-9 h-1 rounded-full bg-white/10 mx-auto mb-5" />
        {title && <div className="text-[18px] font-bold mb-5">{title}</div>}
        {children}
      </div>
    </div>
  )
}
