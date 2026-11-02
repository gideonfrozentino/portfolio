@echo off
title Portfolio Lokal - Gideon
cd /d "%~dp0"

echo ============================================
echo   Portfolio Gideon - server lokal
echo   Buka di browser: http://localhost:8080
echo.
echo   Tutup jendela ini untuk mematikan server.
echo ============================================
echo.

start "" "http://localhost:8080/"
python -m http.server 8080 --bind 127.0.0.1

echo.
echo Server berhenti. Tekan tombol apa saja untuk menutup.
pause >nul
