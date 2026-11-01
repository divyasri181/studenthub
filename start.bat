@echo off
title Smart Student Expense & Task Manager
echo ==============================================================
echo        Starting Smart Student Expense & Task Manager
echo ==============================================================
echo.
cd /d "%~dp0"
echo Seeding initial demo data (if needed)...
call npm run seed
echo.
echo Launching Backend Server and Frontend React Client...
echo App will be available at: http://localhost:3000
echo.
npm run dev
pause
