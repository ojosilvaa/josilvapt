"""
GERA IMAGENS IA PARA AS 3 PECAS DE CONTEUDO - JO SILVA PT
Gratis via Hugging Face Inference API (conta gratuita)
Uso: python gerar_imagens_conteudo.py
Precisas de criar conta gratis em huggingface.co e colocar o token abaixo.
"""
import requests, os, time, io
from PIL import Image

PASTA_BASE = os.path.join(os.path.dirname(__file__), "..", "imagens", "geradas")

# Cria conta GRATIS em huggingface.co -> Settings -> Access Tokens -> New token (Read)
HF_TOKEN = os.environ.get("HF_TOKEN", "")
HF_API = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell"

IMAGENS = {
    "peca1_erros_emagrecer": [
        ("capa", "fit athletic man personal trainer pointing at camera dark gym motivational portuguese fitness 9:16 vertical cinematic lighting", "1080", "1920"),
        ("slide1", "person skipping breakfast empty plate morning light fitness concept dark moody", "1080", "1080"),
        ("slide2", "woman doing weight training squats gym strong athletic body definition", "1080", "1080"),
        ("slide3", "person sleeping deeply alarm clock cortisol stress weight gain concept dark room", "1080", "1080"),
        ("stories", "Jo Silva PT personal trainer logo dark background gold text fitness brand vertical", "1080", "1920"),
    ],
    "peca2_treino_casa": [
        ("capa", "athletic person doing jump squat at home living room high energy fitness vertical 9:16", "1080", "1920"),
        ("slide1", "jump squat exercise demonstration athletic body home workout dark background", "1080", "1080"),
        ("slide2", "burpee exercise full body workout home fitness intense sweat", "1080", "1080"),
        ("slide3", "plank exercise core strength home floor fitness strong body", "1080", "1080"),
        ("stories", "20 minutes home workout results before after fitness transformation vertical", "1080", "1920"),
    ],
    "peca3_verdade_comer": [
        ("capa", "fit person eating healthy meal protein vegetables dark background lifestyle photography vertical 9:16", "1080", "1920"),
        ("slide1", "empty plate barely any food diet restriction unhealthy concept dark moody", "1080", "1080"),
        ("slide2", "muscle loss concept fitness body weak vs strong comparison", "1080", "1080"),
        ("slide3", "healthy balanced meal protein chicken rice vegetables colorful nutrition", "1080", "1080"),
        ("stories", "eat better not less healthy food nutrition fitness lifestyle vertical dark", "1080", "1920"),
    ],
}

def baixar_imagem(prompt, largura, altura, caminho):
    if not HF_TOKEN:
        print("  SEM TOKEN: Define HF_TOKEN nas variaveis de ambiente")
        print("  Ver instrucoes em baixo de como obter token gratis")
        return False
    print(f"  Gerando: {os.path.basename(caminho)}...")
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    payload = {"inputs": prompt + " professional photography high quality", "parameters": {"width": int(largura), "height": int(altura)}}
    tentativas = 3
    for t in range(tentativas):
        try:
            r = requests.post(HF_API, headers=headers, json=payload, timeout=120)
            if r.status_code == 200:
                img = Image.open(io.BytesIO(r.content))
                img = img.resize((int(largura), int(altura)), Image.LANCZOS)
                img.save(caminho, "JPEG", quality=90)
                print(f"  OK: {os.path.basename(caminho)}")
                return True
            elif r.status_code == 503:
                print(f"  Modelo a carregar, aguarda 20s... ({t+1}/{tentativas})")
                time.sleep(20)
            else:
                print(f"  ERRO {r.status_code}: {r.text[:100]}")
                return False
        except Exception as e:
            print(f"  FALHOU: {e}")
            if t < tentativas - 1:
                time.sleep(10)
    return False

def main():
    print("=" * 50)
    print("  GERADOR DE IMAGENS — JO SILVA PT")
    print("=" * 50)
    total = sum(len(v) for v in IMAGENS.values())
    geradas = 0

    for peca, imagens in IMAGENS.items():
        pasta = os.path.join(PASTA_BASE, peca)
        os.makedirs(pasta, exist_ok=True)
        print(f"\n[PASTA] {peca.upper().replace('_', ' ')}")

        for nome, prompt, w, h in imagens:
            caminho = os.path.join(pasta, f"{nome}.jpg")
            if os.path.exists(caminho):
                print(f"  JA EXISTE: {nome}.jpg")
                geradas += 1
                continue
            ok = baixar_imagem(prompt, w, h, caminho)
            if ok:
                geradas += 1
            time.sleep(2)  # respeitar rate limit

    print(f"\n{'=' * 50}")
    print(f"OK: {geradas}/{total} imagens geradas")
    print(f"Pasta: {PASTA_BASE}")
    print(f"{'=' * 50}")

if __name__ == "__main__":
    if not HF_TOKEN:
        print("=" * 50)
        print("COMO OBTER TOKEN GRATIS (2 minutos):")
        print("1. Vai a huggingface.co")
        print("2. Clica em 'Sign Up' (conta gratis)")
        print("3. Confirma email")
        print("4. Vai a: huggingface.co/settings/tokens")
        print("5. Clica 'New token' -> nome 'josilvapt' -> Read")
        print("6. Copia o token (hf_...)")
        print("7. No Windows: Painel Controlo -> Sistema ->")
        print("   Variaveis de Ambiente -> Nova:")
        print("   Nome: HF_TOKEN | Valor: hf_xxxxx")
        print("8. Fecha e reabre o terminal")
        print("=" * 50)
    else:
        main()
