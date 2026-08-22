@echo off
cd /d "%~dp0"
echo ============================================
echo  SCMU CS Wiki - Dev Server (hot reload)
echo  URL: http://localhost:5173/cs-wiki/
echo  Close this window to stop the server.
echo ============================================
call npm run docs:dev
pause
