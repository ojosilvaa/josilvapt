"""
GERADOR DE SLIDES CARROSSEL - HTML + PLAYWRIGHT
Cria slides identicos ao estilo @ojo.silva via HTML/CSS + screenshot
"""
import asyncio, os, json
from pathlib import Path
from playwright.async_api import async_playwright

PASTA = Path(__file__).parent.parent / "imagens" / "geradas" / "carrossel_v2"
PASTA.mkdir(parents=True, exist_ok=True)

# ── ÍCONES SVG ────────────────────────────────────────────────
ICO = {
    "warn": '<svg viewBox="0 0 24 24" class="ico-warn"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    "arrow": '<svg viewBox="0 0 24 24" class="ico-arrow"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    "check": '<svg viewBox="0 0 24 24" class="ico-check"><polyline points="20 6 9 17 4 12"/></svg>',
    "x":     '<svg viewBox="0 0 24 24" class="ico-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    "info":  '<svg viewBox="0 0 24 24" class="ico-info"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    "fire":  '<svg viewBox="0 0 24 24" class="ico-warn"><path d="M12 2c0 6-6 8-6 13a6 6 0 0012 0c0-5-6-7-6-13z"/><path d="M12 12c0 3-2 4-2 6a2 2 0 004 0c0-2-2-3-2-6z"/></svg>',
    "zap":   '<svg viewBox="0 0 24 24" class="ico-arrow"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    "num1":  '<span style="font-family:Oswald;font-weight:700;font-size:22px;color:#C8A96E">1</span>',
    "num2":  '<span style="font-family:Oswald;font-weight:700;font-size:22px;color:#C8A96E">2</span>',
    "num3":  '<span style="font-family:Oswald;font-weight:700;font-size:22px;color:#C8A96E">3</span>',
}

def html_capa(titulo_linhas, gold_word, subtitulo):
    """titulo_linhas: lista de strings, gold_word substitui no titulo"""
    titulo_html = ""
    for linha in titulo_linhas:
        if gold_word and gold_word.upper() in linha.upper():
            partes = linha.upper().split(gold_word.upper())
            linha_html = f'<span class="gold">{gold_word.upper()}</span>'.join(partes)
        else:
            linha_html = linha.upper()
        titulo_html += f"{linha_html}<br>"
    return f"""
<div class="capa">
  <div class="foto-bg"></div>
  <div class="foto-overlay"></div>
  <div class="content">
    <div class="marca">JO SILVA &nbsp;·&nbsp; PERSONAL TRAINER</div>
    <div class="titulo">{titulo_html}</div>
    <div class="linha-gold"></div>
    <div class="subtitulo">{subtitulo}</div>
    <div class="btn-arrasta">&#8594;&nbsp; ARRASTA PRA VER</div>
  </div>
  <div class="assinatura">@ojo.silva</div>
</div>"""

def html_interno(num, total, titulo_linhas, gold_word, bullets):
    """bullets: lista de (icone, titulo, descricao)"""
    titulo_html = ""
    for linha in titulo_linhas:
        if gold_word and gold_word.upper() in linha.upper():
            partes = linha.upper().split(gold_word.upper())
            linha_html = f'<span class="gold">{gold_word.upper()}</span>'.join(partes)
        else:
            linha_html = linha.upper()
        titulo_html += f"{linha_html}<br>"

    bullets_html = ""
    for ico_key, b_titulo, b_desc in bullets:
        ico = ICO.get(ico_key, ICO["arrow"])
        bullets_html += f"""
    <div class="bullet">
      <div class="icon-box"><div class="icon-inner">{ico}</div></div>
      <div class="text-box">
        <div class="b-titulo">{b_titulo.upper()}</div>
        <div class="b-desc">{b_desc}</div>
      </div>
    </div>"""

    return f"""
<div class="interno">
  <div class="num-slide">0{num} / 0{total}</div>
  <div class="titulo">{titulo_html}</div>
  <div class="linha-gold"></div>
  <div class="bullets">{bullets_html}</div>
  <div class="assinatura">@ojo.silva</div>
</div>"""

def html_cta(titulo_top, titulo_main, cta_sub):
    return f"""
<div class="cta">
  <div class="circulo1"></div>
  <div class="circulo2"></div>
  <div class="content">
    <div class="titulo-top">{titulo_top.upper()}</div>
    <div class="titulo-main">{titulo_main.upper()}</div>
    <div class="linha-gold"></div>
    <div class="cta-sub">{cta_sub}</div>
    <div class="marca-cta">JO SILVA PT</div>
  </div>
  <div class="assinatura">@ojo.silva</div>
</div>"""

# ── CONTEÚDO DOS 3 CARROSSÉIS ────────────────────────────────
CARROSSEIS = [
    {
        "nome": "carrossel1_3erros",
        "slides": [
            ("capa", html_capa(
                ["3 ERROS QUE TE", "IMPEDEM DE", "EMAGRECER"],
                "EMAGRECER",
                "O que ninguém te conta sobre perda de gordura de verdade."
            )),
            ("s2", html_interno(2, 6, ["OS 3 ERROS", "MAIS COMUNS"], "ERROS", [
                ("warn", "SALTAR O PEQUENO-ALMOÇO", "O corpo entra em modo poupança e guarda tudo como gordura"),
                ("x",    "FAZER SÓ CARDIO", "Sem músculo o metabolismo não acelera – precisas de força"),
                ("warn", "DORMIR POUCO", "Menos de 7h = mais cortisol = mais gordura abdominal"),
            ])),
            ("s3", html_interno(3, 6, ["ERRO 1:", "SALTAR O", "PEQUENO-ALMOÇO"], "PEQUENO-ALMOÇO", [
                ("warn",  "MODO POUPANÇA", "O corpo pensa que está em jejum e guarda tudo"),
                ("x",     "QUEIMA MÚSCULO", "Não gordura — perde o que te ajuda a emagrecer"),
                ("arrow", "COME MAIS TARDE", "Compensa com excesso nas refeições seguintes"),
            ])),
            ("s4", html_interno(4, 6, ["ERRO 2:", "FAZER SÓ", "CARDIO"], "CARDIO", [
                ("x",     "PERDE MÚSCULO", "Cardio excessivo consome massa muscular"),
                ("warn",  "METABOLISMO LENTO", "Menos músculo = menos calorias queimadas em repouso"),
                ("arrow", "EFEITO SANFONA", "Paras o exercício e recuperas tudo rapidamente"),
            ])),
            ("s5", html_interno(5, 6, ["ERRO 3:", "SONO", "INSUFICIENTE"], "SONO", [
                ("warn",  "CORTISOL ALTO", "Hormônio do stress que promove acumulação de gordura"),
                ("x",     "FOME AUMENTA", "Grelina sobe — tens mais fome no dia seguinte"),
                ("arrow", "TREINAS PIOR", "Menos energia = menos calorias queimadas no treino"),
            ])),
            ("s6", html_cta("QUER O PLANO", "CERTO PARA TI?", "Consulta gratuita — link na bio")),
        ]
    },
    {
        "nome": "carrossel2_treino_casa",
        "slides": [
            ("capa", html_capa(
                ["TREINO DE 20 MIN", "EM CASA QUE", "REALMENTE EMAGRECE"],
                "EMAGRECE",
                "Sem ginásio. Sem equipamento. Mais resultado do que 1h na passadeira."
            )),
            ("s2", html_interno(2, 5, ["A MAIORIA FAZ", "CARDIO E NÃO", "VÊ RESULTADO"], "CARDIO", [
                ("x",    "PERDE PESO, MAS NÃO GORDURA", "Cardio excessivo queima músculo — e é o músculo que acelera o metabolismo"),
                ("warn", "O METABOLISMO DESACELERA", "Menos músculo = menos calorias queimadas. Resultado: efeito sanfona"),
                ("x",   "DESISTES PORQUE NÃO VÊS MUDANÇA", "Horas na esteira, balança não muda. Faz sentido isso?"),
            ])),
            ("s3", html_interno(3, 5, ["A MUSCULAÇÃO", "QUEIMA GORDURA", "24H POR DIA"], "GORDURA", [
                ("fire", "EFEITO PÓS-TREINO (EPOC)", "Após musculação, o teu corpo continua a queimar calorias por até 48 horas"),
                ("zap",  "MÚSCULO QUEIMA GORDURA EM REPOUSO", "Cada kg de músculo queima calorias — dormindo, sentado, em qualquer lugar"),
                ("arrow","METABOLISMO ACELERADO PARA SEMPRE", "Quanto mais músculo tens, mais calorias queimas. Simples assim."),
            ])),
            ("s4", html_interno(4, 5, ["O TREINO", "COMPLETO", "EM CASA"], "COMPLETO", [
                ("num1", "AGACHAMENTO COM SALTO — 4×15", "Activa as maiores massas musculares. Calorias a queimar ao máximo"),
                ("num2", "BURPEE — 4×10", "Cardio + força ao mesmo tempo. Coração a bombear, gordura a derreter"),
                ("num3", "PRANCHA DINÂMICA — 4×30s", "Core ativado, postura correcta, abdominais a trabalhar"),
            ])),
            ("s5", html_cta("QUER RESULTADOS", "EM 30 DIAS?", "Plano personalizado — link na bio")),
        ]
    },
    {
        "nome": "carrossel3_comer_menos",
        "slides": [
            ("capa", html_capa(
                ["COMER MENOS", "NÃO É A", "SOLUÇÃO"],
                "SOLUÇÃO",
                "A verdade sobre perda de gordura que ninguém te conta."
            )),
            ("s2", html_interno(2, 5, ["A MAIORIA", "COMETE ESTE", "ERRO"], "ERRO", [
                ("x",    "COME MUITO POUCO", "O corpo entra em pânico e começa a queimar músculo, não gordura"),
                ("warn", "PERDE MASSA MUSCULAR", "Menos músculo = metabolismo mais lento = engordar mais fácil"),
                ("x",   "EFEITO REBOTE GARANTIDO", "Assim que comes normal, recuperas tudo + 2kg extra"),
            ])),
            ("s3", html_interno(3, 5, ["MUSCULAÇÃO", "VS CARDIO:", "ENTENDE A DIFERENÇA"], "DIFERENÇA", [
                ("zap",   "MUSCULAÇÃO 3× POR SEMANA", "Preserva músculo · Acelera metabolismo · Queima gordura 24h · Muda o corpo"),
                ("arrow", "CARDIO TODOS OS DIAS", "Queima calorias só durante o exercício · Pode perder músculo · Metabolismo pode desacelerar"),
                ("check", "O IDEAL? OS DOIS JUNTOS", "Musculação como base + cardio moderado = resultado máximo"),
            ])),
            ("s4", html_interno(4, 5, ["O PLANO QUE", "REALMENTE", "FUNCIONA"], "FUNCIONA", [
                ("num1", "MUSCULAÇÃO 3× POR SEMANA", "Treinos de 45 a 60 minutos. Sem precisar viver na academia"),
                ("num2", "DÉFICE CALÓRICO MODERADO", "Não precisas passar fome. Só comer um pouco menos do que gastas"),
                ("num3", "CONSISTÊNCIA DE 90 DIAS", "Não existe milagre. Mas com o plano certo, 3 meses mudam tudo"),
            ])),
            ("s5", html_cta("QUER O GUIA", "ALIMENTAR GRÁTIS?", "Comenta QUERO — link na bio")),
        ]
    },
]

# ── RENDERIZAÇÃO ─────────────────────────────────────────────
CSS = open(Path(__file__).parent / "slide_template.html").read()
CSS_ONLY = CSS.split("<body")[0] + "<body id='slide'>"

async def gerar_screenshots():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1080, "height": 1080})

        total = sum(len(c["slides"]) for c in CARROSSEIS)
        feitos = 0

        for carrossel in CARROSSEIS:
            pasta_c = PASTA / carrossel["nome"]
            pasta_c.mkdir(exist_ok=True)
            print(f"\n[{carrossel['nome'].upper().replace('_',' ')}]")

            for i, (nome_slide, html_body) in enumerate(carrossel["slides"], 1):
                html_completo = CSS_ONLY + html_body + "</body></html>"
                await page.set_content(html_completo, wait_until="networkidle")
                await page.wait_for_timeout(800)  # fontes carregarem

                caminho = str(pasta_c / f"{i:02d}_{nome_slide}.jpg")
                await page.screenshot(path=caminho, type="jpeg", quality=95,
                                       clip={"x":0,"y":0,"width":1080,"height":1080})
                feitos += 1
                print(f"  OK: {i:02d}_{nome_slide}.jpg  ({feitos}/{total})")

        await browser.close()
        print(f"\nConcluido! {feitos} slides em:\n{PASTA}")

if __name__ == "__main__":
    asyncio.run(gerar_screenshots())
