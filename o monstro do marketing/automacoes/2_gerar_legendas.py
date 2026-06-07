"""
GERAR LEGENDAS AUTOMÁTICAS COM WHISPER (IA GRATUITA)
Uso: python 2_gerar_legendas.py video.mp4
Resultado: video.srt (legenda) + video_legendado.mp4
Modelos: tiny (rápido), base (equilibrado), small (melhor qualidade)
"""
import subprocess, sys, os, whisper

def gerar_legendas(video_path, modelo="base"):
    base = os.path.splitext(video_path)[0]
    audio_path = base + "_audio.wav"
    srt_path = base + ".srt"
    output_path = base + "_legendado.mp4"

    # 1. Extrair áudio
    print("Extraindo áudio...")
    subprocess.run(["ffmpeg", "-i", video_path, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", audio_path, "-y"], check=True)

    # 2. Transcrever com Whisper
    print(f"Transcrevendo com Whisper ({modelo})... pode demorar alguns minutos.")
    model = whisper.load_model(modelo)
    result = model.transcribe(audio_path, language="pt")

    # 3. Gerar ficheiro SRT
    with open(srt_path, "w", encoding="utf-8") as f:
        for i, seg in enumerate(result["segments"], 1):
            def fmt(t):
                h, m, s = int(t//3600), int((t%3600)//60), t%60
                return f"{h:02}:{m:02}:{s:06.3f}".replace(".", ",")
            f.write(f"{i}\n{fmt(seg['start'])} --> {fmt(seg['end'])}\n{seg['text'].strip()}\n\n")
    print(f"Legendas geradas: {srt_path}")

    # 4. Gravar legendas no vídeo
    print("A adicionar legendas ao vídeo...")
    subprocess.run([
        "ffmpeg", "-i", video_path, "-vf", f"subtitles={srt_path}",
        "-c:a", "copy", output_path, "-y"
    ], check=True)
    print(f"Pronto! Vídeo legendado: {output_path}")
    os.remove(audio_path)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python 2_gerar_legendas.py <video.mp4> [tiny|base|small]")
    else:
        modelo = sys.argv[2] if len(sys.argv) > 2 else "base"
        gerar_legendas(sys.argv[1], modelo)
