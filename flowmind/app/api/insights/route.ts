import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { transactions, income, topCategory, topAmount, forecast } = await req.json()

  // Local fallback (no AI needed for basic insight)
  const spent = transactions?.reduce((s: number, t: { amount: number }) => s + Number(t.amount), 0) ?? 0
  const overBudget = forecast > income
  const pct = spent > 0 ? Math.round((topAmount / spent) * 100) : 0

  if (!process.env.ANTHROPIC_API_KEY) {
    const msg = overBudget
      ? `Mantendo este ritmo, gastarás €${Math.round(forecast)} até ao fim do mês — €${Math.round(forecast - income)} acima do orçamento. Reduzir em ${topCategory} resolve.`
      : `Boa gestão! ${topCategory} representa ${pct}% dos gastos. Estás dentro do orçamento este mês. 🎉`
    return NextResponse.json({ insight: msg })
  }

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic()
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 120,
      messages: [{
        role: 'user',
        content: `Gera um insight financeiro personalizado em português europeu (máx 2 frases, informal mas profissional):
- Total gasto este mês: €${Math.round(spent)}
- Rendimento: €${income}
- Previsão fim do mês: €${Math.round(forecast)}
- Categoria principal: ${topCategory} (€${Math.round(topAmount)}, ${pct}%)
- ${overBudget ? 'Está acima do orçamento' : 'Está dentro do orçamento'}
Responde APENAS com o insight, sem introdução.`
      }]
    })
    const insight = (message.content[0] as { type: string; text: string }).text?.trim()
    return NextResponse.json({ insight })
  } catch {
    const msg = overBudget
      ? `Mantendo este ritmo, gastarás €${Math.round(forecast)} até ao fim do mês — €${Math.round(forecast - income)} acima do orçamento. Reduzir em ${topCategory} resolve.`
      : `Boa gestão! ${topCategory} representa ${pct}% dos gastos. Estás dentro do orçamento este mês. 🎉`
    return NextResponse.json({ insight: msg })
  }
}
