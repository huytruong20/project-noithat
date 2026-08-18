@echo off
chcp 65001 >nul
title Nội thất HT - Máy chủ website
cd /d "%~dp0"

echo.
echo   ================================================
echo    NOI THAT HT - DANG KHOI DONG WEBSITE
echo   ================================================
echo.

if not exist "node_modules" (
  echo   Lan dau chay - dang cai dat thu vien...
  echo   Buoc nay mat vai phut, vui long doi.
  echo.
  call npm install
  echo.
)

echo   Dang khoi dong may chu...
echo.
echo   Mo trinh duyet va vao dia chi:
echo.
echo        http://localhost:3000
echo.
echo   ------------------------------------------------
echo   GIU CUA SO NAY MO trong luc dung web.
echo   Dong cua so nay = website tat.
echo   Muon dung han: bam Ctrl + C
echo   ------------------------------------------------
echo.

call npm run dev

echo.
echo   May chu da dung.
pause
