@echo off
chcp 65001 >nul
:menu
cls
echo ============================================
echo   O MONSTRO DO MARKETING - MENU PRINCIPAL
echo ============================================
echo.
echo  [1] Converter video para VERTICAL (TikTok/Reels)
echo  [2] Gerar LEGENDAS automaticas (Whisper IA)
echo  [3] Criar SHORT de video longo
echo  [4] Extrair AUDIO de video
echo  [5] DOWNLOAD de video (YouTube/Instagram)
echo  [6] ORGANIZAR ficheiros por tipo
echo  [7] Gerar ROTEIRO com IA
echo  [0] Sair
echo.
set /p op="Escolhe uma opcao: "

if "%op%"=="1" (
    set /p vid="Caminho do video: "
    python "%~dp0\1_converter_vertical.py" "%vid%"
    pause
    goto menu
)
if "%op%"=="2" (
    set /p vid="Caminho do video: "
    python "%~dp0\2_gerar_legendas.py" "%vid%"
    pause
    goto menu
)
if "%op%"=="3" (
    set /p vid="Caminho do video: "
    set /p ini="Inicio em segundos (ex: 30): "
    set /p dur="Duracao em segundos (ex: 60): "
    python "%~dp0\3_criar_short.py" "%vid%" %ini% %dur%
    pause
    goto menu
)
if "%op%"=="4" (
    set /p vid="Caminho do video: "
    python "%~dp0\4_extrair_audio.py" "%vid%"
    pause
    goto menu
)
if "%op%"=="5" (
    set /p url="URL do video: "
    python "%~dp0\5_download_video.py" "%url%"
    pause
    goto menu
)
if "%op%"=="6" (
    python "%~dp0\6_organizar_ficheiros.py"
    pause
    goto menu
)
if "%op%"=="7" (
    set /p tema="Tema do video: "
    set /p tipo="Tipo (short/reels/tiktok/youtube): "
    python "%~dp0\7_gerar_roteiro.py" "%tema%" %tipo%
    pause
    goto menu
)
if "%op%"=="0" exit
goto menu
