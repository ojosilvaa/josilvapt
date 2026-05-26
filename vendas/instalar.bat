@echo off
echo ========================================
echo  Instalacao Sistema de Vendas Jo Silva
echo ========================================
echo.

echo A instalar dependencias Python...
pip install requests schedule anthropic

echo.
echo ========================================
echo  INSTALACAO CONCLUIDA
echo ========================================
echo.
echo PROXIMOS PASSOS:
echo.
echo 1. Edita vendas\config.json com:
echo    - claude.api_key  (em console.anthropic.com)
echo    - negocio.telefone (o teu numero)
echo.
echo 2. Para instalar Evolution API (WhatsApp):
echo    docker run -d --name evolution-api -p 8080:8080 atendai/evolution-api:latest
echo    Depois abre http://localhost:8080
echo.
echo 3. Para gerar um preview de um lead:
echo    cd vendas
echo    python gerar_preview.py 0
echo.
echo 4. Para responder mensagens manualmente:
echo    cd vendas
echo    python agente_vendas.py
echo.
echo 5. Para o bot automatico (precisa Evolution API):
echo    cd vendas
echo    python whatsapp_bot.py
echo.
pause
