@echo off
title CoBuild PropTech REST API Server
echo ===================================================
echo  Starting CoBuild PropTech REST API Server...
echo  Database: SQLite (backend/cobuild.db)
echo  Port: 5000
echo ===================================================

cd /d "%~dp0"

where python >nul 2>&1
if %errorlevel% equ 0 (
    python app.py
) else (
    if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
        "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" app.py
    ) else (
        py app.py
    )
)
pause
