'use client'
import { useState, useRef } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { CATEGORIES, categorizeByRules } from '@/lib/ai/categorize'
import { todayISO } from '@/lib/utils/dates'

const EMOTIONS = [
  { emoji: '😊', key: 'happy', label: 'Feliz' },
  { emoji: '😐', key: 'neutral', label: 'Neutro' },
  { emoji: '😬', key: 'guilty', label: 'Culpado' },
  { emoji: '😤', key: 'impulsive', label: 'Impulsivo' },
  { emoji: '😟', key: 'anxious', label: 'Ansioso' },
]

interface Props {
  open: boolean
  onClose: () => void
  onSave: (data: {
    amount: number
    description: string
    category: string
    date: string
    emotional_state: string
    source: string
    is_income: boolean
  }) => Promise<void>
}

export function AddTransactionModal({ open, onClose, onSave }: Props) {
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const [category, setCategory] = useState('')
  const [emotion, setEmotion] = useState('')
  const [date, setDate] = useState(todayISO())
  const [saving, setSaving] = useState(false)
  const [isIncome, setIsIncome] = useState(false)
  const [ocrData, setOcrData] = useState<{ amount?: string; desc?: string } | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  function reset() {
    setAmount(''); setDesc(''); setCategory(''); setEmotion(''); setDate(todayISO()); setIsIncome(false); setOcrData(null); setSaving(false)
  }

  function handleClose() { reset(); onClose() }

  function handleDescChange(v: string) {
    setDesc(v)
    const auto = categorizeByRules(v)
    if (auto && !category) setCategory(auto)
  }

  async function handleImageOCR(file: File) {
    setScanning(true)
    setScanProgress(0)
    try {
      const Tesseract = (await import('tesseract.js')).default
      const canvas = document.createElement('canvas')
      const img = new Image()
      img.src = URL.createObjectURL(file)
      await new Promise<void>(r => { img.onload = () => r() })
      canvas.width = Math.min(img.width, 1200)
      canvas.height = (canvas.width / img.width) * img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        const val = avg > 128 ? 255 : 0
        data[i] = data[i + 1] = data[i + 2] = val
      }
      ctx.putImageData(imageData, 0, 0)
      const { data: { text } } = await Tesseract.recognize(canvas.toDataURL(), 'por', {
        logger: (m: { progress: number }) => setScanProgress(Math.round(m.progress * 100))
      })
      const amountMatch = text.match(/total[:\s]*[€]?\s*(\d+[.,]\d{2})/i)
        || text.match(/[€]\s*(\d+[.,]\d{2})/)
        || text.match(/(\d+[.,]\d{2})\s*€/)
      const lines = text.split('\n').filter((l: string) => l.trim().length > 3)
      const estab = lines[0]?.trim() ?? ''
      const extractedAmount = amountMatch ? amountMatch[1].replace(',', '.') : ''
      setOcrData({ amount: extractedAmount, desc: estab })
      if (extractedAmount) setAmount(extractedAmount)
      if (estab) { setDesc(estab); const auto = categorizeByRules(estab); if (auto) setCategory(auto) }
    } catch {
      // fail silently, user can fill manually
    }
    setScanning(false)
  }

  async function handleSave() {
    const val = parseFloat(amount)
    if (!val || val <= 0 || !desc.trim() || !category) return
    setSaving(true)
    await onSave({
      amount: val,
      description: desc.trim(),
      category,
      date,
      emotional_state: emotion || 'neutral',
      source: ocrData ? 'ocr' : 'manual',
      is_income: isIncome,
    })
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={isIncome ? 'Novo rendimento' : 'Novo gasto'}>
      {/* Income / Expense toggle */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setIsIncome(false)}
          className={`flex-1 py-2 rounded-[10px] text-[13px] font-semibold border transition-all ${!isIncome ? 'bg-[rgba(239,68,68,0.15)] border-fm-red text-fm-red' : 'bg-fm-bg4 border-fm-border2 text-fm-text3'}`}
        >
          💸 Gasto
        </button>
        <button
          onClick={() => setIsIncome(true)}
          className={`flex-1 py-2 rounded-[10px] text-[13px] font-semibold border transition-all ${isIncome ? 'bg-[rgba(0,200,150,0.15)] border-fm-green text-fm-green' : 'bg-fm-bg4 border-fm-border2 text-fm-text3'}`}
        >
          💰 Rendimento
        </button>
      </div>

      {/* Amount */}
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-1">
          <span className="text-[20px] text-fm-text3">€</span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0,00"
            className="text-[36px] font-bold bg-transparent border-none text-fm-green text-center outline-none w-full"
            style={{ letterSpacing: '-1px', fontFamily: 'inherit' }}
          />
        </div>
        <div className="h-px bg-fm-border2 mt-2" />
      </div>

      {/* Description */}
      <div className="mb-[14px]">
        <div className="text-[12px] text-fm-text2 font-medium mb-1.5">Descrição</div>
        <input
          className="w-full bg-fm-bg4 border border-fm-border2 rounded-[10px] px-[14px] py-3 text-[15px] text-fm-text outline-none focus:border-fm-green placeholder:text-fm-text3 transition-all"
          placeholder="Ex: Almoço no restaurante"
          value={desc}
          onChange={e => handleDescChange(e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="mb-[14px]">
        <div className="text-[12px] text-fm-text2 font-medium mb-2">Categoria</div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-[14px] py-2 rounded-full text-[13px] border transition-all ${category === cat.key ? 'bg-[rgba(0,200,150,0.15)] border-fm-green text-fm-green' : 'bg-fm-bg4 border-fm-border2 text-fm-text2 hover:border-fm-border'}`}
            >
              {cat.emoji} {cat.key}
            </button>
          ))}
        </div>
      </div>

      {/* Emotion */}
      {!isIncome && (
        <div className="mb-[14px]">
          <div className="text-[12px] text-fm-text2 font-medium mb-2">Como te sentiste?</div>
          <div className="flex gap-2 justify-center">
            {EMOTIONS.map(e => (
              <button
                key={e.key}
                title={e.label}
                onClick={() => setEmotion(e.key)}
                className={`w-[52px] h-[52px] rounded-full text-[24px] border transition-all ${emotion === e.key ? 'border-fm-green bg-[rgba(0,200,150,0.15)] scale-110' : 'border-fm-border2 bg-fm-bg4'}`}
              >
                {e.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Date */}
      <div className="mb-4">
        <div className="text-[12px] text-fm-text2 font-medium mb-1.5">Data</div>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full bg-fm-bg4 border border-fm-border2 rounded-[10px] px-[14px] py-3 text-[15px] text-fm-text outline-none focus:border-fm-green"
        />
      </div>

      {/* OCR / Voice */}
      <div className="flex gap-2 mb-4">
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={e => e.target.files?.[0] && handleImageOCR(e.target.files[0])} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={scanning}
          className="flex-1 flex items-center gap-2 bg-fm-bg4 border border-dashed border-fm-border2 rounded-[var(--radius-card)] p-3 text-left hover:border-fm-green transition-all"
        >
          {scanning ? (
            <>
              <span className="text-[20px] animate-spin">⏳</span>
              <div>
                <div className="text-[13px] font-medium">OCR... {scanProgress}%</div>
                <div className="text-[11px] text-fm-text3">A ler recibo</div>
              </div>
            </>
          ) : (
            <>
              <span className="text-[20px] text-fm-green">📸</span>
              <div>
                <div className="text-[13px] font-medium">Fotografar recibo</div>
                <div className="text-[11px] text-fm-text3">OCR automático</div>
              </div>
            </>
          )}
        </button>
        <button
          onClick={() => {
            // Web Speech API voice input
            type SR = { lang: string; onresult: (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void; start: () => void }
            const w = window as unknown as Record<string, new () => SR>
            const SRClass = w['SpeechRecognition'] ?? w['webkitSpeechRecognition']
            if (!SRClass) return
            const recog = new SRClass()
            recog.lang = 'pt-PT'
            recog.onresult = (e) => {
              const transcript = e.results[0][0].transcript
              setDesc(transcript)
              const auto = categorizeByRules(transcript)
              if (auto) setCategory(auto)
            }
            recog.start()
          }}
          className="flex-1 flex items-center gap-2 bg-fm-bg4 border border-dashed border-fm-border2 rounded-[var(--radius-card)] p-3 text-left hover:border-fm-blue transition-all"
        >
          <span className="text-[20px] text-fm-blue">🎤</span>
          <div>
            <div className="text-[13px] font-medium">Falar descrição</div>
            <div className="text-[11px] text-fm-text3">Voz para texto</div>
          </div>
        </button>
      </div>

      <Button onClick={handleSave} disabled={saving || !amount || !desc || !category}>
        {saving ? 'A guardar...' : `Registar ${isIncome ? 'rendimento' : 'gasto'}`}
      </Button>
      <Button variant="secondary" className="mt-2" onClick={handleClose}>Cancelar</Button>
    </Modal>
  )
}
