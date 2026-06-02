"""
leads_gratis.py — Scraping gratuito do Páginas Amarelas (paginasamarelas.pt)
Sem API key, sem custo. Filtra negócios SEM website linkado.
"""
import requests, csv, json, re, time, os, sys, io
from bs4 import BeautifulSoup
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

CSV_OUT = "porto_leads.csv"

# ─── Mapeamento slug PA → nossa categoria ───────────────────────────────────
PA_NICHOS = [
    ("cabeleireiros",                    "Cabeleireiro"),
    ("estetica-e-beleza",                "Estetica"),
    ("clinicas-dentarias",               "Dentaria"),
    ("oficinas-mecanicas",               "Oficina"),
    ("fisioterapia",                     "Fisioterapia"),
    ("restaurantes",                     "Restaurante"),
    ("pastelarias",                      "Pastelaria"),
    ("advogados",                        "Advocacia"),
    ("escolas-de-conducao",              "Escola Conducao"),
    ("veterinarios",                     "Veterinario"),
    ("psicologos",                       "Psicologo"),
    ("creches-e-jardins-de-infancia",    "Creche ATL"),
    ("ginasios",                         "Personal Trainer"),
    ("empresas-de-limpeza",              "Limpeza"),
    ("contabilistas",                    "Contabilidade"),
    ("eletricistas",                     "Eletricista"),
    ("opticas",                          "Optica"),
    ("artes-marciais",                   "ArtesMarc"),
    ("yoga-e-pilates",                   "Yoga Pilates"),
    ("canalizadores",                    "Canalizador"),
    ("explicadores",                     "Explicacoes"),
    ("agencias-de-viagens",              "Agencia Viagens"),
    ("fotografos",                       "Fotografo Studio"),
]

# Slug de cidade no PA → nome normalizado
PA_CIDADES = [
    ("porto",               "Porto"),
    ("vila-nova-de-gaia",   "Vila Nova de Gaia"),
    ("matosinhos",          "Matosinhos"),
    ("maia",                "Maia"),
    ("gondomar",            "Gondomar"),
    ("valongo",             "Valongo"),
    ("espinho",             "Espinho"),
]

# ─── Carregar existentes ─────────────────────────────────────────────────────
nomes_existentes = set()
if os.path.exists(CSV_OUT):
    with open(CSV_OUT, encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            nomes_existentes.add(row["nome"].strip().lower())
print(f"Leads existentes: {len(nomes_existentes)}")

# ─── Sessão HTTP ─────────────────────────────────────────────────────────────
S = requests.Session()
S.verify = False
S.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "pt-PT,pt;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Referer": "https://www.paginasamarelas.pt/",
})

SKIP_DOMAINS = {"paginasamarelas.pt", "pai.pt", "google.com", "google.pt",
                "facebook.com", "instagram.com", "youtube.com", "tripadvisor",
                "foursquare.com", "yelp.com", "zomato.com", "storage.googleapis.com"}

def tem_website(card):
    """True se o card tiver link para website externo."""
    for a in card.select("a[href]"):
        href = a.get("href","")
        if not href.startswith("http"):
            continue
        domain = re.sub(r"https?://(www\.)?","",href).split("/")[0]
        if not any(sk in domain for sk in SKIP_DOMAINS):
            return True
    return False

def limpar_morada(txt):
    """Limpa a morada do card."""
    txt = re.sub(r'\s+', ' ', txt).strip()
    # insere espaço entre código postal e cidade se colados
    txt = re.sub(r'(\d{4}-\d{3})([A-Z])', r'\1 \2', txt)
    return txt

def scrape_pagina(slug_nicho, cat, slug_cidade, cidade_nome, pagina):
    """Scrapa uma página de resultados. Devolve (leads, tem_mais_paginas)."""
    url = f"https://www.paginasamarelas.pt/{slug_nicho}/{slug_cidade}?page={pagina}"
    try:
        r = S.get(url, timeout=15)
        if r.status_code != 200:
            return [], False
    except Exception as e:
        print(f"    ERRO GET: {e}")
        return [], False

    soup = BeautifulSoup(r.text, "html.parser")
    cards = soup.select(".card--result")

    has_next = bool(soup.select("a[rel='next']"))
    leads = []

    for card in cards:
        # Nome
        nome_el = card.select_one(".card-title a, .card-link, h6 a")
        if not nome_el:
            continue
        nome = nome_el.get_text(strip=True)
        if not nome or len(nome) < 3:
            continue

        # Dedup
        nk = nome.lower()
        if nk in nomes_existentes:
            continue

        # Tem website? — se sim, skip
        if tem_website(card):
            continue

        # Morada
        adr_el = card.select_one(".card-address, [class*='address']")
        if not adr_el:
            # Tenta extrair do texto do card
            txt = card.get_text(" ", strip=True)
            m = re.search(r'(\d{4}-\d{3}\s*[A-Z][^\n]+)', txt)
            morada = limpar_morada(m.group(1)) if m else cidade_nome
        else:
            morada = limpar_morada(adr_el.get_text(strip=True))

        # Telefone (raramente disponível sem JS, mas tentamos)
        tel_el = card.select_one("a[href^='tel:']")
        tel = tel_el["href"].replace("tel:","").strip() if tel_el else ""

        nomes_existentes.add(nk)
        leads.append({
            "nome": nome, "categoria": cat, "cidade": cidade_nome,
            "morada": morada, "telefone": tel, "rating": "", "avaliacoes": "",
            "tem_website": "Nao", "website_url": ""
        })

    return leads, has_next

# ─── Scraping principal ───────────────────────────────────────────────────────
ALVO = 300         # parar ao atingir este número
MAX_PAGINAS = 8    # máximo de páginas por nicho×cidade

novos = []
f_out = open(CSV_OUT, "a", encoding="utf-8-sig", newline="")
writer = csv.DictWriter(f_out, fieldnames=[
    "nome","categoria","cidade","morada","telefone","rating","avaliacoes","tem_website","website_url"])

print(f"\nA recolher leads (alvo: {ALVO})...\n")

for slug_nicho, cat in PA_NICHOS:
    if len(novos) >= ALVO:
        break
    nicho_count = 0
    for slug_cidade, cidade_nome in PA_CIDADES:
        if len(novos) >= ALVO:
            break
        for pag in range(1, MAX_PAGINAS + 1):
            leads, has_next = scrape_pagina(slug_nicho, cat, slug_cidade, cidade_nome, pag)
            if leads:
                for row in leads:
                    writer.writerow(row)
                f_out.flush()
                novos.extend(leads)
                nicho_count += len(leads)
            if not leads or not has_next:
                break
            time.sleep(0.6)
        time.sleep(0.4)
    if nicho_count > 0:
        print(f"  [{cat}] +{nicho_count} (total: {len(novos)})")

f_out.close()
print(f"\nTotal novos: {len(novos)}")

if novos:
    print("A regenerar CRM...")
    os.system("python fix_crm_v3.py")
