import { NextRequest, NextResponse } from 'next/server'

const CATEGORIES = ['Alimentação','Transporte','Moradia','Lazer','Saúde','Vestuário','Assinaturas','Educação','Outros']

export async function POST(req: NextRequest) {
  const { description, amount } = await req.json()

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ category: 'Outros' })
  }

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic()
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 20,
      messages: [{
        role: 'user',
        content: `Classifica esta transação portuguesa numa categoria. Responde APENAS com o nome da categoria, sem mais nada.
Categorias: ${CATEGORIES.join(', ')}
Transação: "${description}" - €${amount}`
      }]
    })
    const category = (message.content[0] as { type: string; text: string }).text?.trim()
    return NextResponse.json({ category: CATEGORIES.includes(category) ? category : 'Outros' })
  } catch {
    return NextResponse.json({ category: 'Outros' })
  }
}
