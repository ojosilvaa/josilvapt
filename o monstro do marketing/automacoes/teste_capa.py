import asyncio, base64
from pathlib import Path
from playwright.async_api import async_playwright

foto = Path("C:/Users/mousa/josilvapt/o monstro do marketing/imagens/geradas/trainer_foto.jpg")
foto_b64 = base64.b64encode(foto.read_bytes()).decode()

css_raw = open("C:/Users/mousa/josilvapt/o monstro do marketing/automacoes/slide_template.html").read()
css_only = css_raw.split("<body")[0] + '<body id="slide">'

body = f"""
<div class="capa">
  <div class="foto-bg" style="background-image:url('data:image/jpeg;base64,{foto_b64}')"></div>
  <div class="foto-overlay"></div>
  <div class="content">
    <div class="marca">JO SILVA &nbsp;&middot;&nbsp; PERSONAL TRAINER</div>
    <div class="titulo">3 ERROS QUE TE<br>IMPEDEM DE<br><span class="gold">EMAGRECER</span></div>
    <div class="linha-gold"></div>
    <div class="subtitulo">O que ninguém te conta sobre perda de gordura de verdade.</div>
    <div class="btn-arrasta">&#8594;&nbsp; ARRASTA PRA VER</div>
  </div>
  <div class="assinatura">@ojo.silva</div>
</div>
"""

html = css_only + body + "</body></html>"

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1080, "height": 1080})
        await page.set_content(html, wait_until="networkidle")
        await page.wait_for_timeout(1500)
        out = "C:/Users/mousa/josilvapt/o monstro do marketing/imagens/geradas/TESTE_capa.jpg"
        await page.screenshot(path=out, type="jpeg", quality=95,
                               clip={"x": 0, "y": 0, "width": 1080, "height": 1080})
        await browser.close()
        print("Slide guardado:", out)

asyncio.run(run())
