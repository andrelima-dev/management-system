# setup-env.ps1 - Setup de variaveis de ambiente para PowerShell

Write-Host "CONFIGURANDO VARIAVEIS DE AMBIENTE" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$dirs = @(
    "apps/web",
    "apps/api-gateway",
    "apps/auth-service",
    "apps/tasks-service",
    "apps/notifications-service"
)

foreach ($dir in $dirs) {
    $exampleFile = "$dir/.env.example"
    $envFile = "$dir/.env"
    
    if (Test-Path $exampleFile) {
        if (Test-Path $envFile) {
            Write-Host "WARN $envFile ja existe, mantendo existente" -ForegroundColor Yellow
        }
        else {
            Copy-Item $exampleFile $envFile
            Write-Host "OK Copiado $envFile" -ForegroundColor Green
        }
    }
    else {
        Write-Host "FAIL $exampleFile nao encontrado" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "OK Variaveis de ambiente configuradas!" -ForegroundColor Green
Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Green
Write-Host "1. Review dos arquivos .env (ajuste URLs/secretos se necessario)" -ForegroundColor Cyan
Write-Host "2. docker-compose up -d" -ForegroundColor Cyan
Write-Host "3. pnpm run migration:run" -ForegroundColor Cyan
Write-Host "4. pnpm run dev" -ForegroundColor Cyan
Write-Host ""
