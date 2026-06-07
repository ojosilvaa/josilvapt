"""Gera os 16 slides completos com fundos IA sem pessoas"""
import asyncio, base64
from pathlib import Path
from playwright.async_api import async_playwright

BASE   = Path("C:/Users/mousa/josilvapt/o monstro do marketing")
FUNDOS = BASE / "imagens/geradas/fundos"
DEST   = BASE / "imagens/geradas/carrossel_final"
TMPL   = BASE / "automacoes/slide_template.html"

def b64(path):
    return base64.b64encode(Path(path).read_bytes()).decode()

CSS = TMPL.read_text(encoding="utf-8").split("<body")[0] + '<body id="slide">'

ICO = {
    "warn":  '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#C8A96E" fill="none" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    "x":     '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#e05555" fill="none" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    "check": '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#5DCA9A" fill="none" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>',
    "arrow": '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#C8A96E" fill="none" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    "fire":  '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#C8A96E" fill="none" stroke-width="2" stroke-linecap="round"><path d="M12 2c0 6-6 8-6 13a6 6 0 0012 0c0-5-6-7-6-13z"/></svg>',
    "zap":   '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#C8A96E" fill="none" stroke-width="2" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    "num1":  '<span style="font-family:Oswald;font-weight:700;font-size:22px;color:#C8A96E">1</span>',
    "num2":  '<span style="font-family:Oswald;font-weight:700;font-size:22px;color:#C8A96E">2</span>',
    "num3":  '<span style="font-family:Oswald;font-weight:700;font-size:22px;color:#C8A96E">3</span>',
}

def titulo_html(linhas, gold):
    out = ""
    for l in linhas:
        if gold and gold.upper() in l.upper():
            partes = l.upper().split(gold.upper())
            out += f'<span class="gold">{gold.upper()}</span>'.join(partes) + "<br>"
        else:
            out += l.upper() + "<br>"
    return out

def capa(fundo_path, linhas, gold, subtitulo):
    img = b64(fundo_path)
    return f"""
<div class="capa">
  <div class="foto-bg" style="background-image:url('data:image/jpeg;base64,{img}')"></div>
  <div class="foto-overlay"></div>
  <div class="content">
    <div class="marca">JO SILVA &nbsp;&middot;&nbsp; PERSONAL TRAINER</div>
    <div class="titulo">{titulo_html(linhas, gold)}</div>
    <div class="linha-gold"></div>
    <div class="subtitulo">{subtitulo}</div>
    <div class="btn-arrasta">&#8594;&nbsp; ARRASTA PRA VER</div>
  </div>
  <div class="assinatura">@ojo.silva</div>
</div>"""

def interno(num, total, linhas, gold, bullets):
    bl = ""
    for ico_key, tit, desc in bullets:
        ico = ICO.get(ico_key, ICO["arrow"])
        bl += f"""<div class="bullet">
      <div class="icon-box"><div class="icon-inner">{ico}</div></div>
      <div class="text-box">
        <div class="b-titulo">{tit.upper()}</div>
        <div class="b-desc">{desc}</div>
      </div></div>"""
    return f"""
<div class="interno">
  <div class="deco-bar"></div>
  <div class="deco-ring"></div>
  <div class="deco-ring2"></div>
  <div class="deco-num">0{num}</div>
  <div class="num-slide">0{num} / 0{total}</div>
  <div class="titulo">{titulo_html(linhas, gold)}</div>
  <div class="linha-gold"></div>
  <div class="bullets">{bl}</div>
  <div class="assinatura">@ojo.silva</div>
</div>"""

def cta(top, main, sub):
    return f"""
<div class="cta">
  <div class="circulo3"></div><div class="circulo1"></div><div class="circulo2"></div>
  <div class="content">
    <div class="titulo-top">{top.upper()}</div>
    <div class="titulo-main">{main.upper()}</div>
    <div class="linha-gold"></div>
    <div class="cta-sub">{sub}</div>
    <div class="marca-cta">JO SILVA PT</div>
  </div>
  <div class="assinatura">@ojo.silva</div>
</div>"""

SLIDES = [
  ("carrossel1_3erros", [
    ("01_capa",   capa(FUNDOS/"fundo_c1.jpg", ["3 ERROS QUE TE","IMPEDEM DE","EMAGRECER"], "EMAGRECER", "O que ninguém te conta sobre perda de gordura de verdade.")),
    ("02_erros",  interno(2,6,["OS 3 ERROS","MAIS COMUNS"],"ERROS",[
        ("warn","SALTAR O PEQUENO-ALMOÇO","O corpo entra em modo poupança e guarda tudo como gordura"),
        ("x",   "FAZER SÓ CARDIO","Sem músculo o metabolismo não acelera — precisas de força"),
        ("warn","DORMIR POUCO","Menos de 7h = mais cortisol = mais gordura abdominal")])),
    ("03_erro1",  interno(3,6,["ERRO 1:","SALTAR O","PEQUENO-ALMOÇO"],"PEQUENO-ALMOÇO",[
        ("warn", "MODO POUPANÇA","O corpo pensa que está em jejum e guarda tudo"),
        ("x",    "QUEIMA MÚSCULO","Não gordura — perdes o que te ajuda a emagrecer"),
        ("arrow","COME MAIS TARDE","Compensa com excesso nas refeições seguintes")])),
    ("04_erro2",  interno(4,6,["ERRO 2:","FAZER SÓ","CARDIO"],"CARDIO",[
        ("x",    "PERDE MÚSCULO","Cardio excessivo consome massa muscular"),
        ("warn", "METABOLISMO LENTO","Menos músculo = menos calorias queimadas em repouso"),
        ("arrow","EFEITO SANFONA","Paras o exercício e recuperas tudo rapidamente")])),
    ("05_erro3",  interno(5,6,["ERRO 3:","SONO","INSUFICIENTE"],"SONO",[
        ("warn", "CORTISOL ALTO","Hormônio do stress que promove acumulação de gordura"),
        ("x",    "FOME AUMENTA","Grelina sobe — tens mais fome no dia seguinte"),
        ("arrow","TREINAS PIOR","Menos energia = menos calorias queimadas no treino")])),
    ("06_cta",    cta("QUER O PLANO","CERTO PARA TI?","Consulta gratuita — link na bio")),
  ]),
  ("carrossel2_treino_casa", [
    ("01_capa",  capa(FUNDOS/"fundo_c2.jpg",["TREINO DE 20 MIN","SEM GINÁSIO QUE","REALMENTE EMAGRECE"],"EMAGRECE","Sem equipamento. Mais resultado do que 1h na passadeira.")),
    ("02_cardio",interno(2,5,["A MAIORIA FAZ","CARDIO E NÃO","VÊ RESULTADO"],"CARDIO",[
        ("x",   "PERDE PESO, MAS NÃO GORDURA","Cardio excessivo queima músculo — e é o músculo que acelera o metabolismo"),
        ("warn","O METABOLISMO DESACELERA","Menos músculo = menos calorias. Resultado: efeito sanfona"),
        ("x",  "DESISTES PORQUE NÃO VÊS MUDANÇA","Horas na esteira, balança não muda. Faz sentido isso?")])),
    ("03_muscu", interno(3,5,["A MUSCULAÇÃO","QUEIMA GORDURA","24H POR DIA"],"GORDURA",[
        ("fire", "EFEITO PÓS-TREINO (EPOC)","Após musculação, o teu corpo continua a queimar calorias por até 48 horas"),
        ("zap",  "MÚSCULO QUEIMA EM REPOUSO","Cada kg de músculo queima calorias — dormindo, sentado, em qualquer lugar"),
        ("arrow","METABOLISMO ACELERADO","Quanto mais músculo tens, mais calorias queimas. Simples assim.")])),
    ("04_treino",interno(4,5,["O TREINO","COMPLETO","EM CASA"],"COMPLETO",[
        ("num1","AGACHAMENTO COM SALTO — 4×15","Activa as maiores massas musculares. Calorias a queimar ao máximo"),
        ("num2","BURPEE — 4×10","Cardio + força ao mesmo tempo. Coração a bombear, gordura a derreter"),
        ("num3","PRANCHA DINÂMICA — 4×30s","Core ativado, postura correcta, abdominais a trabalhar")])),
    ("05_cta",   cta("QUER RESULTADOS","EM 30 DIAS?","Plano personalizado — link na bio")),
  ]),
  ("carrossel3_comer_menos", [
    ("01_capa",  capa(FUNDOS/"fundo_c3.jpg",["COMER MENOS","NÃO É A","SOLUÇÃO"],"SOLUÇÃO","A verdade sobre perda de gordura que ninguém te conta.")),
    ("02_erro",  interno(2,5,["A MAIORIA","COMETE ESTE","ERRO"],"ERRO",[
        ("x",   "COME MUITO POUCO","O corpo entra em pânico e começa a queimar músculo, não gordura"),
        ("warn","PERDE MASSA MUSCULAR","Menos músculo = metabolismo mais lento = engordar mais fácil"),
        ("x",  "EFEITO REBOTE GARANTIDO","Assim que comes normal, recuperas tudo + 2kg extra")])),
    ("03_dif",   interno(3,5,["MUSCULAÇÃO","VS CARDIO:","ENTENDE A DIFERENÇA"],"DIFERENÇA",[
        ("zap",  "MUSCULAÇÃO 3× POR SEMANA","Preserva músculo · Acelera metabolismo · Queima gordura 24h · Muda o corpo"),
        ("arrow","CARDIO TODOS OS DIAS","Queima calorias só durante o exercício · Pode perder músculo · Metabolismo desacelera"),
        ("check","O IDEAL? OS DOIS JUNTOS","Musculação como base + cardio moderado = resultado máximo")])),
    ("04_plano", interno(4,5,["O PLANO QUE","REALMENTE","FUNCIONA"],"FUNCIONA",[
        ("num1","MUSCULAÇÃO 3× POR SEMANA","Treinos de 45 a 60 minutos. Sem precisar viver na academia"),
        ("num2","DÉFICE CALÓRICO MODERADO","Não precisas passar fome. Só comer um pouco menos do que gastas"),
        ("num3","CONSISTÊNCIA DE 90 DIAS","Não existe milagre. Mas com o plano certo, 3 meses mudam tudo")])),
    ("05_cta",   cta("QUER O GUIA","ALIMENTAR GRÁTIS?","Comenta QUERO — link na bio")),
  ]),
]

async def run():
    DEST.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width":1080,"height":1080})
        total = sum(len(s[1]) for s in SLIDES)
        feitos = 0
        for pasta_nome, slides in SLIDES:
            pasta = DEST / pasta_nome
            pasta.mkdir(exist_ok=True)
            print(f"\n[{pasta_nome.upper().replace('_',' ')}]")
            for nome, body in slides:
                html = CSS + body + "</body></html>"
                await page.set_content(html, wait_until="networkidle")
                await page.wait_for_timeout(1000)
                out = str(pasta / f"{nome}.jpg")
                await page.screenshot(path=out, type="jpeg", quality=95,
                                       clip={"x":0,"y":0,"width":1080,"height":1080})
                feitos += 1
                print(f"  OK: {nome}.jpg  ({feitos}/{total})")
        await browser.close()
        print(f"\nConcluido! {feitos} slides em:\n{DEST}")

asyncio.run(run())
