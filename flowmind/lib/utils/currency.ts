export function formatEUR(amount: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatEURShort(amount: number): string {
  return '€' + amount.toFixed(2).replace('.', ',')
}

export function formatEURCompact(amount: number): string {
  if (amount >= 1000) return '€' + (amount / 1000).toFixed(1).replace('.', ',') + 'k'
  return '€' + amount.toFixed(0)
}
