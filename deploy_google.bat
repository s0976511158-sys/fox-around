@echo off
title Google Firebase Deployer - fox-around
cd /d "C:\Users\asus\.gemini\antigravity\scratch\responsive-cms-web"
echo ========================================================
echo   發布至 Google Firebase 專案: fox-around
echo ========================================================
echo.
echo [1/2] 正在進行 Google 帳號驗證 (若瀏覽器彈出請點擊允許)...
call npx firebase login
echo.
echo [2/2] 正在將網頁發布上傳至 Google 伺服器 (fox-around)...
call npx firebase deploy --project fox-around
echo.
echo ========================================================
echo   發布作業完成！請查看上方產出的 Google 官方網址。
echo ========================================================
pause
