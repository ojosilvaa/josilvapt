"""
DOWNLOAD DE VÍDEOS DO YOUTUBE, INSTAGRAM, TIKTOK (yt-dlp)
Uso: python 5_download_video.py <URL> [mp4|mp3]
"""
import subprocess, sys

def download(url, formato="mp4"):
    if formato == "mp3":
        cmd = ["yt-dlp", "-x", "--audio-format", "mp3", "-o", "%(title)s.%(ext)s", url]
    else:
        cmd = ["yt-dlp", "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4", "-o", "%(title)s.%(ext)s", url]
    print(f"A fazer download: {url}")
    subprocess.run(cmd, check=True)
    print("Download concluído!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python 5_download_video.py <URL> [mp4|mp3]")
    else:
        fmt = sys.argv[2] if len(sys.argv) > 2 else "mp4"
        download(sys.argv[1], fmt)
