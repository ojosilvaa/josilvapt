"""
EXTRAIR ÁUDIO DE UM VÍDEO
Uso: python 4_extrair_audio.py video.mp4 [mp3|wav]
"""
import subprocess, sys, os

def extrair_audio(video_path, formato="mp3"):
    base = os.path.splitext(video_path)[0]
    output = base + "." + formato
    codec = "libmp3lame" if formato == "mp3" else "pcm_s16le"
    subprocess.run(["ffmpeg", "-i", video_path, "-vn", "-acodec", codec, "-q:a", "2", output, "-y"], check=True)
    print(f"Áudio extraído: {output}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python 4_extrair_audio.py <video.mp4> [mp3|wav]")
    else:
        fmt = sys.argv[2] if len(sys.argv) > 2 else "mp3"
        extrair_audio(sys.argv[1], fmt)
