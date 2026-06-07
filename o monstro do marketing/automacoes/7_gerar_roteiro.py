"""
GERAR ROTEIRO COM CLAUDE AI (gratuito via API Anthropic)
Requer: ANTHROPIC_API_KEY na variável de ambiente
Uso: python 7_gerar_roteiro.py "tema do vídeo" [tipo]
Tipos: short, reels, tiktok, youtube
"""
import sys, os, requests, json
from datetime import datetime

def gerar_roteiro(tema, tipo="short"):
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        print("ERRO: Define ANTHROPIC_API_KEY nas variáveis de ambiente")
        print("Alternativa: edita este script e coloca a chave em api_key = 'sk-...'")
        return

    duracoes = {"short": "60 segundos", "reels": "30 segundos", "tiktok": "45 segundos", "youtube": "10 minutos"}
    duracao = duracoes.get(tipo, "60 segundos")

    prompt = f"""Cria um roteiro para {tipo} de {duracao} sobre: {tema}

Formato:
🎬 GANCHO (primeiros 3 segundos): [texto impactante]
📝 DESENVOLVIMENTO: [conteúdo principal com marcações de tempo]
🎯 CTA: [chamada para ação final]
#️⃣ HASHTAGS: [10 hashtags relevantes]

Estilo: dinâmico, direto, linguagem portuguesa de Portugal."""

    resp = requests.post("https://api.anthropic.com/v1/messages",
        headers={"x-api-key": api_key, "anthropic-version": "2023-06-01", "content-type": "application/json"},
        json={"model": "claude-haiku-4-5-20251001", "max_tokens": 1024,
              "messages": [{"role": "user", "content": prompt}]})

    if resp.status_code == 200:
        roteiro = resp.json()["content"][0]["text"]
        nome = f"roteiro_{tipo}_{datetime.now().strftime('%Y%m%d_%H%M')}.txt"
        pasta = os.path.join(os.path.dirname(__file__), "..", "roteiros")
        os.makedirs(pasta, exist_ok=True)
        caminho = os.path.join(pasta, nome)
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(f"TEMA: {tema}\nTIPO: {tipo}\n\n{roteiro}")
        print(f"Roteiro guardado: {caminho}")
        print("\n" + roteiro)
    else:
        print(f"Erro API: {resp.status_code} - {resp.text}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python 7_gerar_roteiro.py \"tema\" [short|reels|tiktok|youtube]")
    else:
        tipo = sys.argv[2] if len(sys.argv) > 2 else "short"
        gerar_roteiro(sys.argv[1], tipo)
