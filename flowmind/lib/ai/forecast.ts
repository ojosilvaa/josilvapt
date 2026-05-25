export function forecastMonthEnd(transactions: { amount: number; date: string }[], today = new Date()): number {
  const dayOfMonth = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0)
  const dailyAvg = totalSpent / Math.max(dayOfMonth, 1)
  return dailyAvg * daysInMonth
}

export function daysToGoal(targetAmount: number, currentAmount: number, dailySavingsRate: number): number {
  const remaining = targetAmount - currentAmount
  if (dailySavingsRate <= 0) return Infinity
  return Math.ceil(remaining / dailySavingsRate)
}

export function generateInsight(
  spent: number,
  income: number,
  topCategory: string,
  topAmount: number,
  forecast: number
): string {
  const budget = income
  const overBudget = forecast > budget
  const pct = spent > 0 ? Math.round((topAmount / spent) * 100) : 0

  if (overBudget) {
    const over = Math.round(forecast - budget)
    return `Mantendo este ritmo, gastarás €${forecast.toFixed(0)} até ao fim do mês — €${over} acima do orçamento. Reduzir em ${topCategory} resolve.`
  }
  return `Boa gestão! ${topCategory} representa ${pct}% dos gastos. Estás dentro do orçamento este mês. 🎉`
}

export function debtPayoffMonths(remaining: number, payment: number, rateMonthly: number): number {
  if (payment <= 0) return Infinity
  if (rateMonthly <= 0) return Math.ceil(remaining / payment)
  const r = rateMonthly / 100
  return Math.ceil(Math.log(payment / (payment - remaining * r)) / Math.log(1 + r))
}
