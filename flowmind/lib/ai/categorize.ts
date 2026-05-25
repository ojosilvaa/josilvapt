const CATEGORY_RULES: Record<string, string[]> = {
  'Alimentação': ['continente', 'pingo doce', 'lidl', 'aldi', 'minipreço', 'mcdonald', 'burger king', 'kfc', 'uber eats', 'glovo', 'bolt food', 'pizza hut', 'nando', 'tasca', 'restaurante', 'café', 'padaria', 'talho', 'peixaria', 'mercado', 'intermarché', 'jumbo', 'el corte inglés alimentação'],
  'Transporte': ['galp', 'bp', 'repsol', 'uber', 'bolt', 'cp comboios', 'metro', 'carris', 'navegante', 'via verde', 'stcp', 'combustível', 'portagem', 'estacionamento'],
  'Moradia': ['renda', 'egás', 'edp', 'aguas de', 'condomínio', 'ikea', 'leroy merlin', 'worten', 'eletricidade', 'gás'],
  'Saúde': ['farmácia', 'wells', 'dr.consulta', 'hospital', 'clínica', 'óptica', 'continente saúde', 'medical', 'dentista', 'ginásio', 'holmes place'],
  'Lazer': ['netflix', 'spotify', 'youtube', 'cinema', 'ticketmaster', 'booking', 'airbnb', 'fnac', 'teatro', 'concerto', 'bar', 'discoteca'],
  'Vestuário': ['zara', 'h&m', 'pull&bear', 'bershka', 'mango', 'el corte inglés moda', 'primark', 'sport zone', 'decathlon'],
  'Assinaturas': ['netflix', 'hbo', 'amazon prime', 'apple', 'google', 'microsoft', 'nos', 'meo', 'vodafone', 'nowo', 'dazn', 'paramount'],
  'Educação': ['wook', 'bertrand', 'udemy', 'coursera', 'escola', 'universidade', 'fnac livros'],
}

export function categorizeByRules(description: string): string | null {
  const lower = description.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some(k => lower.includes(k))) return category
  }
  return null
}

export async function categorizeWithAI(description: string, amount: number): Promise<string> {
  const ruleResult = categorizeByRules(description)
  if (ruleResult) return ruleResult
  try {
    const res = await fetch('/api/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount })
    })
    const { category } = await res.json()
    return category || 'Outros'
  } catch {
    return 'Outros'
  }
}

export const CATEGORIES = [
  { key: 'Alimentação', emoji: '🍔', color: '#EF4444' },
  { key: 'Transporte', emoji: '🚗', color: '#3B82F6' },
  { key: 'Moradia', emoji: '🏠', color: '#F59E0B' },
  { key: 'Lazer', emoji: '🎮', color: '#8B5CF6' },
  { key: 'Saúde', emoji: '💊', color: '#00C896' },
  { key: 'Vestuário', emoji: '👕', color: '#3B82F6' },
  { key: 'Assinaturas', emoji: '📱', color: '#8B5CF6' },
  { key: 'Educação', emoji: '📚', color: '#3B82F6' },
  { key: 'Outros', emoji: '❓', color: '#6B7280' },
]

export function getCategoryMeta(cat: string) {
  return CATEGORIES.find(c => c.key === cat) ?? CATEGORIES[CATEGORIES.length - 1]
}
