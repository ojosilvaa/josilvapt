"""
Monitor de tokens Claude — controla uso diário para nunca ficar sem resposta.
Guarda histórico em token_usage.json.
"""
import json, os, datetime

FICHEIRO = os.path.join(os.path.dirname(__file__), "token_usage.json")
CONFIG_FILE = os.path.join(os.path.dirname(__file__), "config.json")

def _cfg():
    with open(CONFIG_FILE, encoding="utf-8") as f:
        return json.load(f)["claude"]

def _load():
    if not os.path.exists(FICHEIRO):
        return {}
    with open(FICHEIRO, encoding="utf-8") as f:
        return json.load(f)

def _save(data):
    with open(FICHEIRO, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def hoje():
    return datetime.date.today().isoformat()

def registar(tokens_entrada, tokens_saida, contexto=""):
    """Regista uso e devolve True se ainda está dentro do limite."""
    cfg = _cfg()
    data = _load()
    d = hoje()
    if d not in data:
        data[d] = {"entrada": 0, "saida": 0, "chamadas": 0, "historico": []}
    total = tokens_entrada + tokens_saida
    data[d]["entrada"] += tokens_entrada
    data[d]["saida"] += tokens_saida
    data[d]["chamadas"] += 1
    data[d]["historico"].append({
        "hora": datetime.datetime.now().strftime("%H:%M"),
        "entrada": tokens_entrada,
        "saida": tokens_saida,
        "contexto": contexto[:60]
    })
    _save(data)
    total_hoje = data[d]["entrada"] + data[d]["saida"]
    return total_hoje < cfg["tokens_diarios_max"]

def pode_chamar(tokens_estimados=2000):
    """Verifica se há margem antes de fazer uma chamada."""
    cfg = _cfg()
    data = _load()
    d = hoje()
    if d not in data:
        return True, cfg["tokens_diarios_max"]
    total = data[d]["entrada"] + data[d]["saida"]
    restantes = cfg["tokens_diarios_max"] - total
    alerta = total > cfg["tokens_alerta"]
    pode = restantes > tokens_estimados
    return pode, restantes

def relatorio():
    """Imprime resumo de uso."""
    cfg = _cfg()
    data = _load()
    d = hoje()
    info = data.get(d, {"entrada": 0, "saida": 0, "chamadas": 0})
    total = info["entrada"] + info["saida"]
    pct = (total / cfg["tokens_diarios_max"]) * 100
    restantes = cfg["tokens_diarios_max"] - total
    print(f"\n{'='*45}")
    print(f" TOKENS HOJE ({d})")
    print(f"{'='*45}")
    print(f" Usados:    {total:>8,}  ({pct:.1f}%)")
    print(f" Restantes: {restantes:>8,}")
    print(f" Limite:    {cfg['tokens_diarios_max']:>8,}")
    print(f" Chamadas:  {info['chamadas']:>8}")
    if pct > 75:
        print(f"\n ⚠️  ATENÇÃO: {pct:.0f}% do limite diário usado!")
    elif pct > 50:
        print(f"\n 💛 Mais de metade do limite usado.")
    else:
        print(f"\n ✅ Uso normal.")
    print(f"{'='*45}\n")

if __name__ == "__main__":
    relatorio()
