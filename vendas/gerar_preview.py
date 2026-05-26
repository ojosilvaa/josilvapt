"""
Gerador de websites de preview personalizados por lead.
Cria HTML + faz push para GitHub Pages.
URL final: https://ojosilvaa.github.io/josilvapt/crm/previews/{slug}/
"""
import json, os, re, subprocess, sys, csv
sys.stdout = __import__('io').TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_FILE = os.path.join(os.path.dirname(__file__), "config.json")

with open(CONFIG_FILE, encoding="utf-8") as f:
    CFG = json.load(f)

SERVICOS = {
    "Cabeleireiro":     ["Corte Feminino & Masculino","Coloração & Mechas","Tratamentos Capilares","Penteados & Festas","Alisamento & Permanente"],
    "Estetica":         ["Limpeza de Pele Profunda","Depilação a Laser & Cera","Massagens Relaxantes","Tratamentos Faciais","Drenagem Linfática"],
    "Dentaria":         ["Consultas & Check-up","Branqueamento Dentário","Ortodontia (Aparelho)","Implantes Dentários","Urgências 24h"],
    "Oficina":          ["Revisão Completa","Diagnóstico Computadorizado","Troca de Pneus","Bate-chapa & Pintura","Inspeção Periódica"],
    "Fisioterapia":     ["Fisioterapia Desportiva","Reabilitação Pós-Cirúrgica","Acupuntura","Osteopatia","Fisioterapia Respiratória"],
    "Restaurante":      ["Almoço & Jantar","Cozinha Tradicional Portuguesa","Petiscos & Tapas","Catering para Eventos","Menu do Dia €8,50"],
    "Explicacoes":      ["Matemática & Física","Inglês & Francês","Preparação para Exames","Apoio ao Estudo","Aulas Online & Presencial"],
    "Pastelaria":       ["Bolos Artesanais","Brunch & Pequeno-almoço","Catering & Encomendas","Bolos de Aniversário","Pastelaria Sem Glúten"],
    "Advocacia":        ["Direito Civil & Família","Direito do Trabalho","Contratos & Imobiliário","Heranças & Testamentos","Consulta Gratuita"],
    "Limpeza":          ["Limpeza Residencial","Limpeza Pós-Obra","Escritórios & Empresas","Limpeza de Estofos","Serviço Recorrente"],
    "ArtesMarc":        ["Muay Thai & Box","Judo & BJJ","Crossfit","Aulas para Crianças","Treino Livre & Personal"],
    "Veterinario":      ["Consultas & Vacinas","Cirurgias","Urgências Veterinárias","Internamento","Farmácia Veterinária"],
    "Psicologo":        ["Psicologia Clínica","Terapia de Casal","Apoio à Criança","Ansiedade & Depressão","Consultas Online"],
    "Escola Conducao":  ["Categoria B (Carro)","Categoria A (Moto)","Código da Estrada","Aulas Práticas","Marcação de Exame"],
    "Creche ATL":       ["Berçário (0-1 anos)","Creche (1-3 anos)","Pré-Escolar","ATL Escolar","Actividades Extracurriculares"],
    "Personal Trainer": ["Treino Personalizado","Perda de Peso","Ganho de Massa","Nutrição Desportiva","Treino Online"],
    "Contabilidade":    ["Contabilidade Organizada","IRS & IRC","Recursos Humanos","Criação de Empresas","Consultoria Fiscal"],
    "Informatica":      ["Reparação de PC & Mac","Vírus & Formatação","Redes & Wi-Fi","Recuperação de Dados","Assistência ao Domicílio"],
    "Farmacia":         ["Medicamentos","Dermofarmácia","Saúde & Bem-estar","Análises Rápidas","Entrega ao Domicílio"],
}

CORES = {
    "Cabeleireiro":     ("#E91E8C","#fff0f8","💇"),
    "Estetica":         ("#9C27B0","#fdf0ff","💅"),
    "Dentaria":         ("#1565C0","#f0f5ff","🦷"),
    "Oficina":          ("#E65100","#fff5f0","🔧"),
    "Fisioterapia":     ("#00796B","#f0fdf9","🏃"),
    "Restaurante":      ("#C62828","#fff5f0","🍽️"),
    "Explicacoes":      ("#1976D2","#f0f5ff","📚"),
    "Pastelaria":       ("#F57F17","#fffbf0","🥐"),
    "Advocacia":        ("#37474F","#f5f5f5","⚖️"),
    "Limpeza":          ("#0277BD","#f0f8ff","🧹"),
    "ArtesMarc":        ("#B71C1C","#fff0f0","🥊"),
    "Veterinario":      ("#2E7D32","#f0fff4","🐾"),
    "Psicologo":        ("#6A1B9A","#fdf0ff","🧠"),
    "Escola Conducao":  ("#F9A825","#fffbf0","🚗"),
    "Creche ATL":       ("#0288D1","#f0f8ff","🎈"),
    "Personal Trainer": ("#388E3C","#f0fff4","💪"),
    "Contabilidade":    ("#455A64","#f5f5f5","📊"),
    "Informatica":      ("#00838F","#f0fdfd","💻"),
    "Farmacia":         ("#2E7D32","#f0fff4","💊"),
}

def slug(nome, cat):
    n = re.sub(r'[^a-z0-9]', '-', nome.lower())
    n = re.sub(r'-+', '-', n).strip('-')[:30]
    c = re.sub(r'[^a-z]', '', cat.lower())[:12]
    return f"{c}-{n}"

def servicos_cat(cat):
    for k, v in SERVICOS.items():
        if k.lower() in cat.lower():
            return v
    return ["Serviço 1","Serviço 2","Serviço 3","Serviço 4","Serviço 5"]

def cores_cat(cat):
    for k, v in CORES.items():
        if k.lower() in cat.lower():
            return v
    return ("#1a73e8","#f0f5ff","🏢")

def gerar_html(lead):
    nome = lead["nome"]
    cat = lead.get("categoria","")
    cidade = lead.get("cidade","Porto")
    tel = lead.get("telefone","")
    morada = lead.get("morada","")
    rating = lead.get("rating","")
    av = lead.get("avaliacoes","")
    cor, bg, emoji = cores_cat(cat)
    servs = servicos_cat(cat)

    # WhatsApp do vendedor
    wa_vendedor = re.sub(r'\D','',CFG['negocio']['telefone']) if CFG['negocio']['telefone'] else ''
    wa_link = f"https://wa.me/351{wa_vendedor}?text=Olá, vi o website de demonstração da {nome}..." if wa_vendedor else "#"

    # Stars
    stars = ""
    if rating:
        try:
            r = float(rating)
            stars = "★"*int(r) + ("½" if r-int(r)>=0.5 else "") + "☆"*(5-int(r)-(1 if r-int(r)>=0.5 else 0))
        except: pass

    servs_html = "".join(f"""
        <div class="srv">
          <div class="srv-ic">✓</div>
          <div class="srv-txt">{s}</div>
        </div>""" for s in servs)

    return f"""<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{nome} — Website Demonstração</title>
<meta name="robots" content="noindex">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:'DM Sans',sans-serif;background:#f8f8f8;color:#1a1a1a}}

/* BANNER TOPO */
.demo-banner{{background:{cor};color:#fff;text-align:center;padding:10px 16px;font-size:.8rem;font-weight:600;letter-spacing:.05em;position:sticky;top:0;z-index:999}}
.demo-banner a{{color:#fff;text-decoration:underline}}

/* HERO */
.hero{{background:{cor};color:#fff;padding:60px 20px 50px;text-align:center;position:relative;overflow:hidden}}
.hero::before{{content:'';position:absolute;top:-50%;right:-20%;width:400px;height:400px;background:rgba(255,255,255,.07);border-radius:50%}}
.hero-emoji{{font-size:3rem;margin-bottom:12px;display:block}}
.hero h1{{font-family:'Bebas Neue',sans-serif;font-size:2.8rem;letter-spacing:.05em;margin-bottom:8px}}
.hero .sub{{font-size:1rem;opacity:.9;margin-bottom:20px}}
.hero .loc{{font-size:.85rem;opacity:.75;margin-bottom:24px}}
.badge-rating{{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.2);border-radius:20px;padding:6px 14px;font-size:.85rem;margin-bottom:24px}}
.hero .cta-hero{{background:#fff;color:{cor};border:none;border-radius:8px;padding:14px 28px;font-size:1rem;font-weight:700;cursor:pointer;text-decoration:none;display:inline-block;transition:.2s}}
.hero .cta-hero:hover{{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.2)}}

/* SERVIÇOS */
.sec{{padding:40px 20px;max-width:680px;margin:0 auto}}
.sec h2{{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:.05em;margin-bottom:6px;color:{cor}}}
.sec .desc{{color:#666;font-size:.9rem;margin-bottom:24px}}
.servicos{{display:grid;grid-template-columns:1fr 1fr;gap:10px}}
.srv{{background:#fff;border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 4px rgba(0,0,0,.06)}}
.srv-ic{{background:{cor};color:#fff;width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;flex-shrink:0}}
.srv-txt{{font-size:.85rem;font-weight:600}}

/* DEPOIMENTOS */
.dep{{background:{bg};border-radius:12px;padding:24px;margin-bottom:10px}}
.dep-stars{{color:#F9A825;font-size:1rem;margin-bottom:8px}}
.dep-txt{{font-size:.9rem;line-height:1.6;color:#333;margin-bottom:10px;font-style:italic}}
.dep-autor{{font-size:.78rem;font-weight:700;color:#666}}

/* CONTACTO */
.contacto{{background:{cor};color:#fff;padding:40px 20px;text-align:center}}
.contacto h2{{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:.05em;margin-bottom:6px}}
.contacto p{{opacity:.85;margin-bottom:24px;font-size:.9rem}}
.btns{{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}}
.btn-wa{{background:#25D366;color:#fff;border:none;border-radius:8px;padding:14px 22px;font-size:.9rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:7px}}
.btn-tel{{background:rgba(255,255,255,.2);color:#fff;border:2px solid rgba(255,255,255,.5);border-radius:8px;padding:13px 22px;font-size:.9rem;font-weight:700;text-decoration:none}}
.btn-tel:hover,.btn-wa:hover{{opacity:.9;transform:translateY(-1px)}}

/* MAPA PLACEHOLDER */
.mapa{{background:#e0e0e0;height:160px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#888;font-size:.9rem;margin-top:20px}}

/* FOOTER */
footer{{background:#1a1a1a;color:#666;text-align:center;padding:16px;font-size:.75rem}}
footer a{{color:{cor};text-decoration:none}}

@media(max-width:480px){{
  .hero h1{{font-size:2rem}}
  .servicos{{grid-template-columns:1fr}}
  .hero{{padding:40px 16px 36px}}
}}
</style>
</head>
<body>

<div class="demo-banner">
  ⚡ Website de demonstração criado por <a href="https://wa.me/351{wa_vendedor}" target="_blank">Jo Silva</a> — Especialista em Websites para negócios locais em Portugal
</div>

<section class="hero">
  <span class="hero-emoji">{emoji}</span>
  <h1>{nome}</h1>
  <p class="sub">{cat} em {cidade}</p>
  {f'<div class="badge-rating"><span style="color:#F9A825">{stars}</span> <span>{rating} estrelas ({av} avaliações)</span></div>' if stars else ''}
  <p class="loc">📍 {morada or cidade}</p>
  <a href="{f'tel:{tel}' if tel else '#'}" class="cta-hero">{'📞 ' + tel if tel else '📞 Ligar'}</a>
</section>

<section class="sec">
  <h2>Os Nossos Serviços</h2>
  <p class="desc">Qualidade e profissionalismo em cada serviço. Marque a sua consulta hoje.</p>
  <div class="servicos">{servs_html}</div>
</section>

<section class="sec" style="padding-top:0">
  <h2>O que dizem os clientes</h2>
  <p class="desc">A opinião dos nossos clientes é a nossa maior conquista.</p>
  <div class="dep">
    <div class="dep-stars">★★★★★</div>
    <p class="dep-txt">"Excelente profissionalismo e atendimento. Recomendo a toda a gente em {cidade}!"</p>
    <div class="dep-autor">— Cliente satisfeito, {cidade}</div>
  </div>
  <div class="dep">
    <div class="dep-stars">★★★★★</div>
    <p class="dep-txt">"Sempre muito atenciosos e com ótimos resultados. O melhor de {cidade} sem dúvida."</p>
    <div class="dep-autor">— Cliente fiel, {cidade}</div>
  </div>
  <div class="mapa">📍 Ver no Google Maps — {morada or cidade}</div>
</section>

<section class="contacto">
  <h2>Fale Connosco</h2>
  <p>{morada or cidade} · {tel}</p>
  <div class="btns">
    {'<a class="btn-wa" href="https://wa.me/351' + re.sub(r"\\D","",tel)[1:] + '" target="_blank">💬 WhatsApp</a>' if tel and len(re.sub(r"\\D","",tel))>=9 and re.sub(r"\\D","",tel)[0]=="9" else ''}
    {f'<a class="btn-tel" href="tel:{tel}">📞 {tel}</a>' if tel else ''}
  </div>
</section>

<footer>
  Website criado por <a href="{wa_link}" target="_blank">Jo Silva — Especialista em Websites Locais</a> ·
  Quer um website assim para o seu negócio? <a href="{wa_link}" target="_blank">Fale connosco</a>
</footer>

</body>
</html>"""

def gerar_e_publicar(lead, push=True):
    s = slug(lead["nome"], lead.get("categoria","geral"))
    caminho = os.path.join(ROOT, "crm", "previews", s)
    os.makedirs(caminho, exist_ok=True)
    html = gerar_html(lead)
    with open(os.path.join(caminho, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
    url = f"https://ojosilvaa.github.io/josilvapt/crm/previews/{s}/"
    if push:
        try:
            subprocess.run(["git", "-C", ROOT, "add", f"crm/previews/{s}/"], check=True, capture_output=True)
            subprocess.run(["git", "-C", ROOT, "commit", "-m", f"Preview: {lead['nome']}"], check=True, capture_output=True)
            subprocess.run(["git", "-C", ROOT, "push", "origin", "main"], check=True, capture_output=True)
            print(f"✅ Online: {url}")
        except Exception as e:
            print(f"⚠️  Ficheiro gerado mas push falhou: {e}")
            print(f"   Ficheiro: {caminho}/index.html")
    return url, s

def gerar_para_lead_csv(csv_file, idx):
    """Gera preview para o lead na linha idx do CSV."""
    with open(csv_file, encoding="utf-8-sig") as f:
        rows = list(__import__('csv').DictReader(f))
    if idx < 0 or idx >= len(rows):
        print(f"Índice inválido. CSV tem {len(rows)} leads (0 a {len(rows)-1})")
        return
    lead = rows[idx]
    print(f"A gerar preview para: {lead['nome']} ({lead.get('categoria','')}) — {lead.get('cidade','')}")
    url, s = gerar_e_publicar(lead, push=True)
    print(f"\n📱 Mensagem WhatsApp pronta para copiar:\n")
    print(f"Olá! Sou o Jo Silva, especialista em websites para negócios locais.")
    print(f"Criei uma demonstração gratuita para a {lead['nome']}:")
    print(f"👉 {url}")
    print(f"Em 2 semanas fico com o vosso website no ar por apenas €350.")
    print(f"Posso ligar para mostrar mais exemplos?")
    return url

if __name__ == "__main__":
    # Teste com o 1º lead do CSV
    csv_path = os.path.join(ROOT, "porto_leads.csv")
    if len(sys.argv) > 1:
        gerar_para_lead_csv(csv_path, int(sys.argv[1]))
    else:
        print("Uso: python gerar_preview.py <indice_do_lead>")
        print("Exemplo: python gerar_preview.py 0")
        print("\nLista dos primeiros 10 leads:")
        with open(csv_path, encoding="utf-8-sig") as f:
            for i, row in enumerate(__import__('csv').DictReader(f)):
                if i >= 10: break
                print(f"  [{i}] {row['nome']} — {row.get('categoria','')} — {row.get('cidade','')}")
