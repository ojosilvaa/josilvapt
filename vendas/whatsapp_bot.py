"""
WhatsApp Bot — verifica mensagens a cada hora e responde automaticamente.

COMO FUNCIONA:
1. Usa Evolution API (gratuita, instala localmente ou num VPS)
2. A cada 1h busca mensagens não lidas
3. Claude gera resposta baseada no histórico
4. Envia automaticamente

INSTALAÇÃO EVOLUTION API (uma vez só):
  docker run -d --name evolution-api -p 8080:8080 atendai/evolution-api:latest

DEPOIS:
  1. Abre http://localhost:8080
  2. Cria instância "josilva"
  3. Liga o teu WhatsApp Business via QR Code
  4. Copia o API key para config.json

"""
import json, os, time, sys, threading, schedule
import requests as req
sys.stdout = __import__('io').TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(DIR, "config.json")

with open(CONFIG_FILE, encoding="utf-8") as f:
    CFG = json.load(f)

EVO = CFG["evolution_api"]
BASE = EVO["url"].rstrip("/")
HEADERS = {"apikey": EVO["api_key"], "Content-Type": "application/json"}
INST = EVO["instancia"]

# Leads do CRM para contexto
LEADS_FILE = os.path.join(os.path.dirname(DIR), "porto_leads.csv")
PROCESSADOS_FILE = os.path.join(DIR, "mensagens_processadas.json")

def carregar_leads():
    """Carrega leads do CSV para contextualizar respostas."""
    import csv
    if not os.path.exists(LEADS_FILE):
        return {}
    leads = {}
    with open(LEADS_FILE, encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            tel = __import__('re').sub(r'\D', '', row.get("telefone", ""))
            if tel:
                leads[tel] = row
                if tel.startswith("351"):
                    leads[tel[3:]] = row
                else:
                    leads["351" + tel] = row
    return leads

def carregar_processados():
    if not os.path.exists(PROCESSADOS_FILE):
        return set()
    with open(PROCESSADOS_FILE, encoding="utf-8") as f:
        return set(json.load(f))

def guardar_processados(ids):
    with open(PROCESSADOS_FILE, "w", encoding="utf-8") as f:
        json.dump(list(ids), f)

def verificar_conexao():
    try:
        r = req.get(f"{BASE}/instance/connectionState/{INST}", headers=HEADERS, timeout=5)
        if r.status_code == 200:
            estado = r.json().get("state", "")
            return estado == "open"
    except:
        pass
    return False

def buscar_mensagens_novas():
    """Busca mensagens não lidas da instância."""
    try:
        r = req.get(f"{BASE}/message/findMessages/{INST}",
                    params={"count": 50},
                    headers=HEADERS, timeout=10)
        if r.status_code == 200:
            return r.json().get("messages", {}).get("records", [])
    except Exception as e:
        print(f"Erro ao buscar mensagens: {e}")
    return []

def enviar_mensagem(numero, texto):
    """Envia mensagem via Evolution API."""
    # Normaliza número
    n = __import__('re').sub(r'\D', '', numero)
    if not n.startswith("351"):
        n = "351" + n
    jid = n + "@s.whatsapp.net"
    body = {"number": jid, "text": texto}
    try:
        r = req.post(f"{BASE}/message/sendText/{INST}",
                     json=body, headers=HEADERS, timeout=15)
        return r.status_code == 201
    except Exception as e:
        print(f"Erro ao enviar: {e}")
        return False

def processar_ciclo():
    """Ciclo principal: busca e responde mensagens."""
    from agente_vendas import responder
    from token_monitor import pode_chamar, relatorio

    pode, restantes = pode_chamar(5000)
    if not pode:
        print(f"[{_hora()}] ⛔ Tokens insuficientes ({restantes} restantes). A saltar ciclo.")
        return

    if not verificar_conexao():
        print(f"[{_hora()}] ⚠️  WhatsApp desligado. Conecta em http://localhost:8080")
        return

    mensagens = buscar_mensagens_novas()
    processados = carregar_processados()
    leads = carregar_leads()

    novas = 0
    respondidas = 0

    for msg in mensagens:
        mid = msg.get("key", {}).get("id", "")
        if not mid or mid in processados:
            continue
        # Só mensagens recebidas (não enviadas por nós)
        if msg.get("key", {}).get("fromMe", True):
            processados.add(mid)
            continue
        # Extrai info
        numero = msg.get("key", {}).get("remoteJid", "").replace("@s.whatsapp.net", "").replace("@g.us", "")
        if "@g.us" in msg.get("key", {}).get("remoteJid", ""):
            continue  # ignora grupos
        texto = msg.get("message", {}).get("conversation", "") or \
                msg.get("message", {}).get("extendedTextMessage", {}).get("text", "")
        if not texto:
            processados.add(mid)
            continue

        novas += 1
        # Contexto do lead
        lead_info = leads.get(numero, {})
        nome = lead_info.get("nome", "")
        cat = lead_info.get("categoria", "")
        cidade = lead_info.get("cidade", "Porto")

        print(f"[{_hora()}] 📩 Mensagem de {numero} ({nome or 'desconhecido'}): {texto[:60]}...")

        resp = responder(numero, texto, nome, cat, cidade)
        if resp:
            ok = enviar_mensagem(numero, resp)
            if ok:
                print(f"[{_hora()}] ✅ Respondido: {resp[:80]}...")
                respondidas += 1
            else:
                print(f"[{_hora()}] ❌ Falha ao enviar resposta")

        processados.add(mid)
        time.sleep(3)  # pausa entre respostas

    guardar_processados(processados)
    if novas > 0:
        print(f"[{_hora()}] Ciclo: {novas} novas | {respondidas} respondidas")
    else:
        print(f"[{_hora()}] Nenhuma mensagem nova.")
    relatorio()

def _hora():
    import datetime
    return datetime.datetime.now().strftime("%H:%M:%S")

def iniciar():
    print("""
╔══════════════════════════════════════════╗
║  WhatsApp Bot — Jo Silva Websites        ║
║  Verifica mensagens a cada 1 hora        ║
╚══════════════════════════════════════════╝
""")
    if not verificar_conexao():
        print("⚠️  WhatsApp não está ligado!")
        print("   1. Garante que a Evolution API está a correr:")
        print("      docker run -d --name evolution-api -p 8080:8080 atendai/evolution-api:latest")
        print("   2. Abre http://localhost:8080 e liga o WhatsApp por QR code")
        print("   3. Copia o API key para vendas/config.json → evolution_api.api_key")
        print()
    else:
        print(f"[{_hora()}] ✅ WhatsApp ligado!")

    # Corre imediatamente e depois a cada hora
    processar_ciclo()
    schedule.every(1).hours.do(processar_ciclo)
    print(f"\n[{_hora()}] Bot activo. Próxima verificação em 1 hora. Ctrl+C para parar.\n")
    while True:
        schedule.run_pending()
        time.sleep(30)

if __name__ == "__main__":
    iniciar()
