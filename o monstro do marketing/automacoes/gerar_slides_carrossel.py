"""
GERADOR DE SLIDES CARROSSEL - ESTILO JO SILVA PT
Cria slides graficos identicos ao estilo do Instagram @ojo.silva
Fundo escuro + titulos bold + dourado + bullets + numeracao
"""
from PIL import Image, ImageDraw, ImageFont
import os, requests

# ── CORES ──────────────────────────────────────────
BG       = (13, 13, 13)
BG2      = (28, 28, 28)
BRANCO   = (240, 240, 240)
DOURADO  = (200, 169, 110)
CINZA    = (140, 140, 140)
CINZA2   = (80, 80, 80)

W, H = 1080, 1080
PASTA = os.path.join(os.path.dirname(__file__), "..", "imagens", "geradas", "carrossel")

# ── FONTES ─────────────────────────────────────────
def baixar_fontes():
    fontes_dir = os.path.join(os.path.dirname(__file__), "fontes")
    os.makedirs(fontes_dir, exist_ok=True)
    urls = {
        "oswald_bold.ttf": "https://github.com/google/fonts/raw/main/ofl/oswald/static/Oswald-Bold.ttf",
        "oswald_regular.ttf": "https://github.com/google/fonts/raw/main/ofl/oswald/static/Oswald-Regular.ttf",
        "oswald_light.ttf": "https://github.com/google/fonts/raw/main/ofl/oswald/static/Oswald-Light.ttf",
    }
    for nome, url in urls.items():
        caminho = os.path.join(fontes_dir, nome)
        if not os.path.exists(caminho):
            print(f"  Downloading font {nome}...")
            r = requests.get(url, timeout=30)
            with open(caminho, "wb") as f:
                f.write(r.content)
    return fontes_dir

def carregar_fontes(fontes_dir):
    def fonte(nome, tamanho):
        try:
            return ImageFont.truetype(os.path.join(fontes_dir, nome), tamanho)
        except:
            return ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", tamanho)
    return {
        "titulo_xl": fonte("oswald_bold.ttf", 108),
        "titulo_lg": fonte("oswald_bold.ttf", 88),
        "titulo_md": fonte("oswald_bold.ttf", 68),
        "subtitulo":  fonte("oswald_regular.ttf", 32),
        "marca":      fonte("oswald_regular.ttf", 26),
        "bullet_titulo": fonte("oswald_bold.ttf", 34),
        "bullet_desc":   fonte("oswald_light.ttf", 26),
        "numero":     fonte("oswald_light.ttf", 28),
        "cta":        fonte("oswald_bold.ttf", 42),
        "cta_sub":    fonte("oswald_regular.ttf", 30),
    }

# ── HELPERS ────────────────────────────────────────
def texto_multilinhas(draw, texto, x, y, fonte, cor, largura_max, espacamento=10):
    """Desenha texto com quebra de linha automatica"""
    palavras = texto.split()
    linha = ""
    linhas = []
    for p in palavras:
        teste = linha + (" " if linha else "") + p
        bb = draw.textbbox((0,0), teste, font=fonte)
        if bb[2] - bb[0] <= largura_max:
            linha = teste
        else:
            if linha: linhas.append(linha)
            linha = p
    if linha: linhas.append(linha)
    yy = y
    for l in linhas:
        draw.text((x, yy), l, font=fonte, fill=cor)
        bb = draw.textbbox((0,0), l, font=fonte)
        yy += bb[3] - bb[1] + espacamento
    return yy

def titulo_com_destaque(draw, linha1, linha2_branca, linha2_dourada, linha3, x, y, f_titulo, f_titulo2=None):
    """Titulo com uma palavra em dourado, resto branco"""
    if not f_titulo2: f_titulo2 = f_titulo
    cy = y
    if linha1:
        draw.text((x, cy), linha1, font=f_titulo, fill=BRANCO)
        bb = draw.textbbox((0,0), linha1, font=f_titulo)
        cy += bb[3] - bb[1] + 4
    if linha2_branca or linha2_dourada:
        # Medir largura para alinhar lado a lado
        xc = x
        if linha2_dourada:
            draw.text((xc, cy), linha2_dourada, font=f_titulo2, fill=DOURADO)
            bb = draw.textbbox((0,0), linha2_dourada, font=f_titulo2)
            xc += bb[2] - bb[0] + 12
        if linha2_branca:
            draw.text((xc, cy), linha2_branca, font=f_titulo2, fill=BRANCO)
            bb = draw.textbbox((0,0), linha2_branca, font=f_titulo2)
        bb = draw.textbbox((0,0), linha2_dourada or linha2_branca, font=f_titulo2)
        cy += bb[3] - bb[1] + 4
    if linha3:
        draw.text((x, cy), linha3, font=f_titulo, fill=BRANCO)
        bb = draw.textbbox((0,0), linha3, font=f_titulo)
        cy += bb[3] - bb[1]
    return cy

def linha_dourada(draw, x, y, largura=200):
    draw.rectangle([x, y, x + largura, y + 3], fill=DOURADO)

def bullet_item(draw, img, x, y, icone, titulo, descricao, fontes):
    """Desenha um item bullet com fundo escuro"""
    altura_box = 80
    draw.rectangle([x, y, W - 60, y + altura_box], fill=BG2)
    # Icone quadrado
    draw.rectangle([x + 8, y + 8, x + 64, y + 72], fill=(40, 40, 40))
    draw.text((x + 18, y + 18), icone, font=fontes["bullet_titulo"], fill=DOURADO)
    # Texto
    draw.text((x + 80, y + 10), titulo, font=fontes["bullet_titulo"], fill=BRANCO)
    draw.text((x + 80, y + 48), descricao, font=fontes["bullet_desc"], fill=CINZA)
    return y + altura_box + 14

def marca_topo(draw, fontes, num_slide=None, total=None):
    draw.text((60, 52), "JO SILVA  .  PERSONAL TRAINER", font=fontes["marca"], fill=CINZA2)
    if num_slide:
        num_txt = f"{num_slide:02d} / {total:02d}"
        draw.text((60, 52), num_txt, font=fontes["numero"], fill=CINZA2)

# ── SLIDES ─────────────────────────────────────────
def slide_capa(fontes, titulo_linha1, titulo_linha2_dourada, titulo_linha2_branca, titulo_linha3, subtitulo, nome_arquivo):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    # Gradiente lateral direito (decorativo)
    for i in range(300):
        alpha = int(18 * (1 - i/300))
        draw.rectangle([W-300+i, 0, W-300+i+1, H], fill=(200, 169, 110, alpha) if alpha > 0 else BG)
    # Marca
    draw.text((60, 60), "JO SILVA  .  PERSONAL TRAINER", font=fontes["marca"], fill=CINZA2)
    # Titulo
    cy = titulo_com_destaque(draw, titulo_linha1, titulo_linha2_branca, titulo_linha2_dourada, titulo_linha3, 60, 220, fontes["titulo_xl"])
    # Linha dourada
    linha_dourada(draw, 60, cy + 30, 180)
    # Subtitulo
    cy = texto_multilinhas(draw, subtitulo, 60, cy + 60, fontes["subtitulo"], CINZA, W - 120)
    # Botao arrasta
    by = H - 160
    draw.rectangle([60, by, 360, by + 58], outline=DOURADO, width=2)
    draw.text((80, by + 12), "ARRASTA PRA VER  ->", font=fontes["subtitulo"], fill=DOURADO)
    # Assinatura
    draw.text((60, H - 60), "@ojo.silva", font=fontes["numero"], fill=CINZA2)
    salvar(img, nome_arquivo)

def slide_interno(fontes, num, total, titulo_linha1, titulo_dourada, titulo_linha2, bullets, nome_arquivo):
    """Slide interno com titulo + 3 bullets"""
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    # Numero slide
    draw.text((60, 52), f"{num:02d} / {total:02d}", font=fontes["numero"], fill=CINZA2)
    # Titulo
    cy = titulo_com_destaque(draw, titulo_linha1, titulo_linha2, titulo_dourada, None, 60, 170, fontes["titulo_lg"])
    # Linha dourada
    linha_dourada(draw, 60, cy + 20, 160)
    # Bullets
    by = cy + 60
    icones = ["!", ">", "~"]
    for i, (tit, desc) in enumerate(bullets):
        by = bullet_item(draw, img, 60, by, icones[i % 3], tit, desc, fontes)
    # Assinatura
    draw.text((60, H - 60), "@ojo.silva", font=fontes["numero"], fill=CINZA2)
    salvar(img, nome_arquivo)

def slide_cta(fontes, titulo, subtitulo, cta_texto, nome_arquivo):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    # Circulo decorativo
    draw.ellipse([W//2 - 280, H//2 - 280, W//2 + 280, H//2 + 280], outline=(30, 30, 30), width=2)
    draw.ellipse([W//2 - 200, H//2 - 200, W//2 + 200, H//2 + 200], outline=(40, 40, 40), width=1)
    # Titulo
    bb = draw.textbbox((0,0), titulo, font=fontes["titulo_md"])
    tw = bb[2] - bb[0]
    draw.text(((W - tw)//2, H//2 - 200), titulo, font=fontes["titulo_md"], fill=DOURADO)
    # Subtitulo
    bb = draw.textbbox((0,0), subtitulo, font=fontes["titulo_lg"])
    tw = bb[2] - bb[0]
    draw.text(((W - tw)//2, H//2 - 100), subtitulo, font=fontes["titulo_lg"], fill=BRANCO)
    # Linha
    linha_dourada(draw, W//2 - 80, H//2 + 20, 160)
    # CTA
    bb = draw.textbbox((0,0), cta_texto, font=fontes["cta_sub"])
    tw = bb[2] - bb[0]
    draw.text(((W - tw)//2, H//2 + 60), cta_texto, font=fontes["cta_sub"], fill=CINZA)
    # Marca
    bb = draw.textbbox((0,0), "JO SILVA PT", font=fontes["cta"])
    tw = bb[2] - bb[0]
    draw.text(((W - tw)//2, H//2 + 140), "JO SILVA PT", font=fontes["cta"], fill=DOURADO)
    draw.text((60, H - 60), "@ojo.silva", font=fontes["numero"], fill=CINZA2)
    salvar(img, nome_arquivo)

def salvar(img, nome):
    os.makedirs(PASTA, exist_ok=True)
    caminho = os.path.join(PASTA, nome)
    img.save(caminho, "JPEG", quality=95)
    print(f"  OK: {nome}")

# ── CONTEUDO ───────────────────────────────────────
def gerar_peca1(fontes):
    print("\n[PECA 1] 3 erros que impedem de emagrecer")
    slide_capa(fontes,
        "3 ERROS QUE TE IMPEDEM",
        "EMAGRECER",
        "DE",
        "E COMO CORRIGIR AGORA",
        "O que ninguem te conta sobre perda de gordura de verdade.",
        "p1_01_capa.jpg")
    slide_interno(fontes, 2, 6,
        "O QUE ATRAPALHA",
        "O TEU PROGRESSO",
        "",
        [("SALTAS O PEQUENO-ALMOCO", "O corpo entra em modo poupanca e guarda gordura"),
         ("FAZES SO CARDIO", "Sem musculo, o metabolismo nao acelera"),
         ("DORMES POUCO", "Menos de 7h = mais cortisol = mais gordura abdominal")],
        "p1_02_erros.jpg")
    slide_interno(fontes, 3, 6,
        "ERRO 1: SALTAR",
        "O PEQUENO-ALMOCO",
        "",
        [("MODO POUPANCA", "O corpo pensa que esta em jejum e guarda tudo"),
         ("QUEIMA MUSCULO", "Nao gordura - perde o que te ajuda a emagrecer"),
         ("COME MAIS TARDE", "Compensa com excesso nas refeicoes seguintes")],
        "p1_03_erro1.jpg")
    slide_interno(fontes, 4, 6,
        "ERRO 2:",
        "SO CARDIO",
        "FAZER",
        [("PERDE MUSCULO", "Cardio excessivo consome massa muscular"),
         ("METABOLISMO LENTO", "Menos musculo = menos calorias queimadas em repouso"),
         ("EFEITO SANZONAL", "Para o exercicio e recuperas tudo rapidamente")],
        "p1_04_erro2.jpg")
    slide_interno(fontes, 5, 6,
        "ERRO 3:",
        "INSUFICIENTE",
        "SONO",
        [("CORTISOL ALTO", "Hormonio do stress que promove acumulacao de gordura"),
         ("FOME AUMENTA", "Grelina sobe - tens mais fome no dia seguinte"),
         ("MENOS ENERGIA", "Treinas pior e queimas menos calorias")],
        "p1_05_erro3.jpg")
    slide_cta(fontes, "QUER O PLANO", "CERTO PARA SI?", "Consulta gratuita - link na bio", "p1_06_cta.jpg")

def gerar_peca2(fontes):
    print("\n[PECA 2] Treino de 20 min em casa")
    slide_capa(fontes,
        "TREINO DE 20 MIN",
        "GINASIO",
        "SEM",
        "QUE REALMENTE EMAGRECE",
        "O metodo que queima mais gordura do que 1 hora na passadeira.",
        "p2_01_capa.jpg")
    slide_interno(fontes, 2, 5,
        "O TREINO",
        "COMPLETO",
        "",
        [("AGACHAMENTO COM SALTO", "4 series de 15 - activa todas as pernas e gluteos"),
         ("BURPEE", "4 series de 10 - cardio e forca ao mesmo tempo"),
         ("PRANCHA DINAMICA", "4 series de 30s - core ativado e postura correcta")],
        "p2_02_treino.jpg")
    slide_interno(fontes, 3, 5,
        "PORQUE",
        "FUNCIONA",
        "ISTO",
        [("EPOC", "O corpo continua a queimar calorias 24-48h depois"),
         ("MUSCULO ATIVO", "Cada kg de musculo queima calorias mesmo em repouso"),
         ("INTENSIDADE", "Menos tempo, mais resultado - treino eficiente")],
        "p2_03_porque.jpg")
    slide_interno(fontes, 4, 5,
        "O TEU",
        "SEMANAL",
        "PLANO",
        [("SEGUNDA, QUARTA, SEXTA", "3 sessoes de 20 minutos - consistencia e chave"),
         ("AQUECIMENTO 5 MIN", "Nunca saltes o aquecimento - protege as articulacoes"),
         ("PROGRESSAO", "Aumenta as repeticoes a cada semana - o corpo adapta-se")],
        "p2_04_plano.jpg")
    slide_cta(fontes, "QUER RESULTADOS", "EM 30 DIAS?", "Plano personalizado - link na bio", "p2_05_cta.jpg")

def gerar_peca3(fontes):
    print("\n[PECA 3] A verdade sobre comer menos")
    slide_capa(fontes,
        "COMER MENOS",
        "EMAGRECE",
        "NAO",
        "A VERDADE QUE NINGUEM CONTA",
        "Porque restricao calorica extrema sabota o teu progresso.",
        "p3_01_capa.jpg")
    slide_interno(fontes, 2, 5,
        "O QUE ACONTECE",
        "COMERES POUCO",
        "QUANDO",
        [("PERDE MUSCULO", "O corpo usa musculo como combustivel, nao gordura"),
         ("METABOLISMO ABRANDA", "Menos musculo = menos calorias queimadas por dia"),
         ("EFEITO REBOTE", "Assim que comes normal, recuperas tudo + mais 2kg")],
        "p3_02_problema.jpg")
    slide_interno(fontes, 3, 5,
        "A SOLUCAO",
        "NAO E COMER",
        "MENOS",
        [("PROTEINA", "1.8-2g por kg de peso corporal - preserva musculo"),
         ("HIDRATOS NOS MOMENTOS CERTOS", "Antes e depois do treino para energia e recuperacao"),
         ("DEFICIT MODERADO", "Maximo 300-400 kcal abaixo - sustentavel e eficaz")],
        "p3_03_solucao.jpg")
    slide_interno(fontes, 4, 5,
        "O QUE COMER",
        "EMAGRECER",
        "PARA",
        [("PEQUENO-ALMOCO", "Ovos, aveia, fruta - proteina + fibra + energia"),
         ("ALMOCO E JANTAR", "Proteina magra + vegetais + arroz ou batata-doce"),
         ("LANCHINHOS", "Iogurte grego, frutos secos - saciante e nutritivo")],
        "p3_04_oque_comer.jpg")
    slide_cta(fontes, "QUER O GUIA", "ALIMENTAR GRATIS?", "Comenta QUERO - link na bio", "p3_05_cta.jpg")

# ── MAIN ───────────────────────────────────────────
if __name__ == "__main__":
    print("Preparando fontes...")
    fontes_dir = baixar_fontes()
    fontes = carregar_fontes(fontes_dir)
    print(f"Gerando slides em: {PASTA}")
    gerar_peca1(fontes)
    gerar_peca2(fontes)
    gerar_peca3(fontes)
    total = len([f for f in os.listdir(PASTA) if f.endswith('.jpg')])
    print(f"\nConcluido! {total} slides gerados em:\n{PASTA}")
