@echo off
REM Instalar dependências em todos os workspaces

echo ========================================
echo Instalando dependências root...
echo ========================================
cd /d "c:\Users\andrehunter\Desktop\management-system"
call npm install

echo.
echo ========================================
echo Instalando dependências auth-service...
echo ========================================
cd /d "c:\Users\andrehunter\Desktop\management-system\apps\auth-service"
call npm install

echo.
echo ========================================
echo Instalando dependências tasks-service...
echo ========================================
cd /d "c:\Users\andrehunter\Desktop\management-system\apps\tasks-service"
call npm install

echo.
echo ========================================
echo Instalando dependências notifications-service...
echo ========================================
cd /d "c:\Users\andrehunter\Desktop\management-system\apps\notifications-service"
call npm install

echo.
echo ========================================
echo Instalando dependências api-gateway...
echo ========================================
cd /d "c:\Users\andrehunter\Desktop\management-system\apps\api-gateway"
call npm install

echo.
echo ========================================
echo Instalando dependências web...
echo ========================================
cd /d "c:\Users\andrehunter\Desktop\management-system\apps\web"
call npm install

echo.
echo ========================================
echo Instalando dependências packages/types...
echo ========================================
cd /d "c:\Users\andrehunter\Desktop\management-system\packages\types"
call npm install

echo.
echo ========================================
echo ✅ TODAS AS DEPENDÊNCIAS INSTALADAS!
echo ========================================
pause
