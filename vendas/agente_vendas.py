"""
Agente de Vendas com Claude — responde a mensagens WhatsApp com contexto de vendas.
Usa claude-3-haiku (barato + rápido) e monitoriza tokens.
"""
import json, os, sys, requests
sys.stdout = __import__('io').TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(DIR, "config.json")

with open(CONFIG_FILE, encoding="utf-8") as f:
    CFG = json.load(f)

from token_monitor import pode_chamar, registar, relatorio

SYSTEM_PROMPT = """És o assistente de vendas do Jo Silva, especialista em criação de websites e SEO local em Portugal.

SOBRE O NEGÓCIO:
- Serviço: Criação de websites profissionais + SEO local (Google Maps/Pesquisa)
- Preços: Website básico €350 | Website profissional €600 | SEO mensal €80 | Pack completo €599 (site + 3 meses SEO) | Manutenção anual €120
- Prazo: Website pronto em 2 semanas
- Diferencial: Especializado em negócios locais do Porto — aparece no Google quando alguém pesquisa o teu tipo de negócio em {cidade}
- Clientes: Cabeleireiros, clínicas, restaurantes, oficinas, qualquer negócio local

TÉCNICA DE VENDA:
1. Cumprimento breve e pessoal (usa o nome do negócio se souberes)
2. Mostra o problema: sem website = invisível no Google
3. Proposta concreta com prazo e preço
4. Prova social: "já criei para X negócios em Porto/Gaia/Matosinhos"
5. Call to action claro: ligar, ver exemplos, ou aceitar proposta

OBJEÇÕES COMUNS:
- "Tenho Facebook/Instagram" → "Google não mostra redes sociais nas pesquisas locais. Quando alguém pesquisa 'cabeleireiro Porto' só aparecem websites."
- "É muito caro" → "O investimento recupera-se com 1-2 novos clientes por mês. E pode pagar em 2x."
- "Não tenho tempo" → "Eu trato de tudo. Preciso só de 30 minutos da sua parte para recolher informações."
- "Já tenho website" → "Posso auditar o seu website gratuitamente para ver se aparece no Google."
- "Vou pensar" → "Entendo. Posso enviar-lhe 3 exemplos de websites que criei para negócios semelhantes?"

TOM:
- Português de Portugal (não brasileiro)
- Direto, confiante, sem pressão excessiva
- Mensagens curtas (WhatsApp) — máximo 150 palavras
- Uma mensagem de cada vez, não envies paredes de texto
- Usa emojis com moderação (1-2 por mensagem)

ESTÁGIO DA CONVERSA:
- Se for primeiro contacto: apresenta-te e mostra o problema
- Se já houve troca: continua naturalmente a conversa
- Se mostrou interesse: vai direto para fechar (preço, prazo, próximos passos)
- Se recusou: agradece e pede para guardar o contacto para o futuro

IMPORTANTE: Responde APENAS com a mensagem que deves enviar. Sem explicações extra."""

HISTORICO_FILE = os.path.join(DIR, "historico_conversas.json")

def carregar_historico():
    if not os.path.exists(HISTORICO_FILE):
        return {}
    with open(HISTORICO_FILE, encoding="utf-8") as f:
        return json.load(f)

def guardar_historico(h):
    with open(HISTORICO_FILE, "w", encoding="utf-8") as f:
        json.dump(h, f, indent=2, ensure_ascii=False)

def responder(telefone, mensagem_recebida, nome_negocio="", categoria="", cidade="Porto", preview_url=""):
    """
    Gera resposta para uma mensagem recebida.
    telefone: identificador do lead (e.g. '912345678')
    """
    pode, restantes = pode_chamar(3000)
    if not pode:
        print(f"⛔ Limite de tokens atingido! Restantes hoje: {restantes}")
        return None

    hist = carregar_historico()
    conversa = hist.get(telefone, [])

    # Contexto do lead
    contexto_lead = ""
    if nome_negocio:
        contexto_lead += f"Negócio: {nome_negocio}"
    if categoria:
        contexto_lead += f" | Categoria: {categoria}"
    if cidade:
        contexto_lead += f" | Cidade: {cidade}"
    if preview_url:
        contexto_lead += f" | Preview já enviado: {preview_url}"

    # Constrói mensagens para Claude
    msgs = []
    for m in conversa[-8:]:  # últimas 8 mensagens para poupar tokens
        msgs.append({"role": m["role"], "content": m["content"]})

    msgs.append({"role": "user", "content": mensagem_recebida})

    system = SYSTEM_PROMPT + (f"\n\nCONTEXTO DO LEAD: {contexto_lead}" if contexto_lead else "")

    # Chamada Claude API
    headers = {
        "x-api-key": CFG["claude"]["api_key"],
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    body = {
        "model": CFG["claude"]["modelo"],
        "max_tokens": 400,
        "system": system,
        "messages": msgs
    }

    try:
        r = requests.post("https://api.anthropic.com/v1/messages", json=body, headers=headers, timeout=30)
        if r.status_code != 200:
            print(f"Erro API: {r.status_code} — {r.text[:200]}")
            return None
        data = r.json()
        resposta = data["content"][0]["text"].strip()
        # Regista tokens
        t_in = data["usage"]["input_tokens"]
        t_out = data["usage"]["output_tokens"]
        registar(t_in, t_out, f"{nome_negocio[:30]} — {mensagem_recebida[:30]}")
        # Guarda histórico
        conversa.append({"role": "user", "content": mensagem_recebida})
        conversa.append({"role": "assistant", "content": resposta})
        hist[telefone] = conversa[-20:]  # máximo 20 mensagens por lead
        guardar_historico(hist)
        return resposta
    except Exception as e:
        print(f"Erro: {e}")
        return None

def modo_interativo():
    """CLI para testar o agente manualmente."""
    print("\n" + "="*50)
    print(" AGENTE DE VENDAS — Jo Silva Websites")
    print("="*50)
    relatorio()

    print("Dados do lead (Enter para saltar):")
    tel = input("Telefone: ").strip() or "teste"
    nome = input("Nome do negócio: ").strip()
    cat = input("Categoria: ").strip()
    cidade = input("Cidade: ").strip() or "Porto"
    url = input("URL do preview (se enviado): ").strip()

    print("\n" + "-"*50)
    print("Conversa iniciada. Ctrl+C para sair.")
    print("(Simula mensagens recebidas do cliente)")
    print("-"*50 + "\n")

    while True:
        try:
            msg = input("📱 Mensagem recebida: ").strip()
            if not msg:
                continue
            print("\n⏳ A gerar resposta...")
            resp = responder(tel, msg, nome, cat, cidade, url)
            if resp:
                print(f"\n✉️  Resposta sugerida:\n")
                print(resp)
                print("\n" + "-"*50)
            else:
                print("Não foi possível gerar resposta.")
        except KeyboardInterrupt:
            print("\n\nSessão terminada.")
            relatorio()
            break

if __name__ == "__main__":
    modo_interativo()
