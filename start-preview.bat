@echo off
cd /d "%~dp0"
echo ============================================
echo  SCMU CS Wiki - Preview (built version)
echo  URL: http://localhost:4173/cs-wiki/
echo  Close this window to stop the server.
echo ============================================
call npm run docs:preview
pause
