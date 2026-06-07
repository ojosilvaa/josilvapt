"""
CRIAR SHORT AUTOMÁTICO A PARTIR DE UM VÍDEO LONGO
Pega no melhor trecho (ou escolhido) e converte para vertical 9:16
Uso: python 3_criar_short.py video.mp4 [inicio_segundos] [duracao_segundos]
Exemplo: python 3_criar_short.py video.mp4 30 60   (pega de 30s a 90s)
Padrão: pega os primeiros 60 segundos
"""
import subprocess, sys, os

def criar_short(input_path, inicio=0, duracao=60):
    base = os.path.splitext(input_path)[0]
    output = base + f"_short_{inicio}s.mp4"

    cmd = [
        "ffmpeg", "-ss", str(inicio), "-i", input_path, "-t", str(duracao),
        "-vf", "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black",
        "-c:v", "libx264", "-crf", "23", "-preset", "fast",
        "-c:a", "aac", "-b:a", "128k",
        output, "-y"
    ]
    print(f"Criando short: {inicio}s -> {inicio+duracao}s")
    subprocess.run(cmd, check=True)
    print(f"Short criado: {output}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python 3_criar_short.py <video.mp4> [inicio] [duracao]")
    else:
        inicio = int(sys.argv[2]) if len(sys.argv) > 2 else 0
        duracao = int(sys.argv[3]) if len(sys.argv) > 3 else 60
        criar_short(sys.argv[1], inicio, duracao)
