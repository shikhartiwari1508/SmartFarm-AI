@echo off
echo ===================================================
echo     Starting SMARTFARM AI (Hackathon Edition)
echo ===================================================
echo.

:: Start Backend
echo [1/2] Starting Python FastAPI Backend...
start cmd /k "cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000"

:: Start Frontend
echo [2/2] Starting React Frontend...
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Servers are starting up! 
echo Backend API will be at: http://localhost:8000
echo Frontend UI will be at: http://localhost:5173
echo.
echo Press any key to open the app in your browser...
pause >nul
start http://localhost:5173
