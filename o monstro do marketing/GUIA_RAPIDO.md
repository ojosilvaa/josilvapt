# O MONSTRO DO MARKETING — GUIA RÁPIDO

## COMO COMEÇAR (1 clique)
Abre a pasta `automacoes/` e faz duplo clique em **`menu.bat`**

---

## O QUE ESTÁ INSTALADO

| Ferramenta | Para que serve |
|---|---|
| **FFmpeg** | Motor de tudo: cortar, converter, juntar vídeos |
| **Whisper** | IA da OpenAI que gera legendas automáticas (grátis, funciona offline) |
| **yt-dlp** | Descarrega vídeos do YouTube, Instagram, TikTok |
| **MoviePy** | Editar vídeos com Python |
| **Pillow** | Criar e editar imagens |

---

## COMANDOS PRONTOS (copia e cola)

### Converter vídeo para vertical (TikTok/Reels/Shorts)
```
python automacoes\1_converter_vertical.py "C:\caminho\video.mp4"
```

### Gerar legendas automáticas
```
python automacoes\2_gerar_legendas.py "C:\caminho\video.mp4"
```
> Modelos: `tiny` (rápido), `base` (equilibrado), `small` (melhor)

### Criar short de 60 segundos (a partir dos 30s)
```
python automacoes\3_criar_short.py "video.mp4" 30 60
```

### Extrair áudio em MP3
```
python automacoes\4_extrair_audio.py "video.mp4" mp3
```

### Descarregar vídeo do YouTube
```
python automacoes\5_download_video.py "https://youtube.com/watch?v=..."
```

### Organizar downloads por tipo
```
python automacoes\6_organizar_ficheiros.py
```

### Gerar roteiro com IA (requer chave Anthropic)
```
python automacoes\7_gerar_roteiro.py "dicas de treino" short
```

---

## ESTRUTURA DE PASTAS

```
o monstro do marketing/
├── videos/
│   ├── originais/    ← coloca os teus vídeos aqui
│   ├── editados/     ← resultado dos editados
│   ├── shorts/       ← shorts criados
│   └── exports/      ← prontos para publicar
├── imagens/
│   ├── geradas/      ← imagens criadas por IA
│   └── thumbs/       ← miniaturas
├── roteiros/         ← roteiros gerados
├── campanhas/        ← campanhas organizadas
├── legendas/         ← ficheiros .srt
├── audio/            ← áudios extraídos
├── automacoes/       ← scripts Python
└── downloads/        ← downloads organizados
```

---

## GERAR IMAGENS (gratuito)
Usa estes sites sem instalar nada:
- **Leonardo.ai** — melhor qualidade gratuita
- **Adobe Firefly** — adobe.com/firefly (grátis)
- **Bing Image Creator** — bing.com/create (grátis, usa DALL-E)
- **Playground AI** — playgroundai.com (grátis)

---

## PRÓXIMOS PASSOS (quando quiseres mais)
1. **Ollama** — IA de texto local (precisa 16GB RAM ideal, tens 8GB)
2. **Stable Diffusion** — imagens IA local (precisa GPU dedicada)
3. **n8n** — automação visual tipo Zapier mas grátis e local

---

## CHAVE ANTHROPIC (para roteiros com IA)
1. Vai a console.anthropic.com
2. Cria conta grátis (tem créditos iniciais)
3. Vai a "API Keys" e cria uma chave
4. No Windows: Painel de Controlo → Sistema → Variáveis de Ambiente
5. Adiciona variável: `ANTHROPIC_API_KEY` = `sk-ant-...`
