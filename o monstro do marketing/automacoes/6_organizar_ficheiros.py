"""
ORGANIZAR AUTOMATICAMENTE OS DOWNLOADS POR TIPO
Usa: python 6_organizar_ficheiros.py [pasta]
Padrão: organiza a pasta Downloads do utilizador
"""
import os, shutil, sys
from pathlib import Path

TIPOS = {
    "videos": [".mp4",".mov",".avi",".mkv",".webm",".flv"],
    "imagens": [".jpg",".jpeg",".png",".gif",".webp",".svg"],
    "audio": [".mp3",".wav",".aac",".ogg",".flac"],
    "documentos": [".pdf",".docx",".doc",".xlsx",".pptx",".txt"],
    "roteiros": [],  # ficheiros .txt com "roteiro" no nome
    "zips": [".zip",".rar",".7z",".tar",".gz"],
}

def organizar(pasta):
    pasta = Path(pasta)
    movidos = 0
    for f in pasta.iterdir():
        if not f.is_file(): continue
        ext = f.suffix.lower()
        destino = None
        if "roteiro" in f.name.lower() and ext == ".txt":
            destino = pasta / "roteiros"
        else:
            for tipo, exts in TIPOS.items():
                if ext in exts:
                    destino = pasta / tipo
                    break
        if destino:
            destino.mkdir(exist_ok=True)
            shutil.move(str(f), str(destino / f.name))
            print(f"  {f.name} -> {destino.name}/")
            movidos += 1
    print(f"\nOrganizados: {movidos} ficheiros")

if __name__ == "__main__":
    pasta = sys.argv[1] if len(sys.argv) > 1 else str(Path.home() / "Downloads")
    print(f"Organizando: {pasta}")
    organizar(pasta)
