"""
CONVERTER VIDEO PARA VERTICAL (TikTok/Reels/Shorts)
Uso: python 1_converter_vertical.py video.mp4
Resultado: video_vertical.mp4 (1080x1920)
"""
import subprocess, sys, os

def converter_vertical(input_path):
    base = os.path.splitext(input_path)[0]
    output = base + "_vertical.mp4"
    # Corta e redimensiona para 9:16 com fundo preto
    cmd = [
        "ffmpeg", "-i", input_path,
        "-vf", "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black",
        "-c:v", "libx264", "-crf", "23", "-preset", "fast",
        "-c:a", "aac", "-b:a", "128k",
        output, "-y"
    ]
    print(f"Convertendo: {input_path} -> {output}")
    subprocess.run(cmd, check=True)
    print(f"Pronto! Ficheiro: {output}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python 1_converter_vertical.py <video.mp4>")
    else:
        converter_vertical(sys.argv[1])
