@echo off
title Portfolio Lokal - Gideon
cd /d "%~dp0"

echo ================================================
echo   PORTFOLIO GIDEON - server lokal
echo.
echo   Alamat  : http://localhost:8090
echo   Folder  : %CD%
echo.
echo   Tutup jendela ini (atau Ctrl+C) untuk berhenti.
echo ================================================
echo.

start "" http://localhost:8090/
python -m http.server 8090 --bind 127.0.0.1

echo.
echo Server berhenti.
pause >nul
