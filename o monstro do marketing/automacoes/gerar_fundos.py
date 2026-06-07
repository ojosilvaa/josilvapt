"""Gera 3 fundos IA para as capas — sem pessoas"""
import requests, os, io, time
from PIL import Image

TOKEN = os.environ.get("HF_TOKEN", "")
URL   = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell"
DEST  = "C:/Users/mousa/josilvapt/o monstro do marketing/imagens/geradas/fundos"
os.makedirs(DEST, exist_ok=True)

FUNDOS = [
    ("fundo_c1.jpg", "dark dramatic gym interior, heavy dumbbells on rack, moody cinematic lighting, deep shadows, gold accent light, no people, ultra realistic, 4k"),
    ("fundo_c2.jpg", "dark home gym floor, gym mat, resistance bands, water bottle, dramatic side lighting, cinematic mood, no people, photorealistic"),
    ("fundo_c3.jpg", "dark kitchen counter with healthy food, salmon avocado vegetables protein shake, moody cinematic lighting, gold tones, no people, ultra realistic"),
]

def gerar(nome, prompt):
    print(f"  Gerando {nome}...")
    r = requests.post(URL,
        headers={"Authorization": f"Bearer {TOKEN}"},
        json={"inputs": prompt, "parameters": {"width": 768, "height": 1080}},
        timeout=120)
    if r.status_code == 200:
        img = Image.open(io.BytesIO(r.content))
        img.save(os.path.join(DEST, nome), "JPEG", quality=92)
        print(f"  OK: {nome}")
    else:
        print(f"  ERRO {r.status_code}: {r.text[:100]}")
    time.sleep(3)

for nome, prompt in FUNDOS:
    gerar(nome, prompt)
print("Fundos prontos em:", DEST)
