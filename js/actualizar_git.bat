@echo off
cd /d "C:\Users\Andy\Desktop\tramicuba"

echo ================================
echo   INICIANDO ACTUALIZACIÓN GIT
echo ================================

git add -A

REM Verifica si hay cambios antes de hacer commit
git diff --cached --quiet
IF ERRORLEVEL 1 (
    git commit -m "Actualización automática"
    git push origin main
    echo.
    echo ✅ Cambios confirmados y enviados al repositorio remoto.
) ELSE (
    echo ⚠️ No hay cambios nuevos para confirmar.
)

echo ================================
echo      PROCESO COMPLETADO
echo ================================
pause
