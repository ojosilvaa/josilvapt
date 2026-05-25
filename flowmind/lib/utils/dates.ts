export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function formatDatePT(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date + 'T12:00:00') : date
  return d.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatMonthPT(date: Date): string {
  return date.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })
    .replace(/^./, c => c.toUpperCase())
}

export function daysUntil(dueDay: number): number {
  const today = new Date().getDate()
  return dueDay >= today ? dueDay - today : 30 - (today - dueDay)
}

export function currentMonthYear() {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}
