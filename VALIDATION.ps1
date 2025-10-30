# =============================================================================
# VALIDATION SCRIPT - Management System Setup Verification
# =============================================================================

$GREEN = "Green"
$RED = "Red"
$YELLOW = "Yellow"
$CYAN = "Cyan"

Write-Host "========================================" -ForegroundColor $CYAN
Write-Host "VERIFICACAO DE SETUP - Management System" -ForegroundColor $CYAN
Write-Host "========================================" -ForegroundColor $CYAN
Write-Host ""

# 1. Node.js
Write-Host "1. VERIFICANDO NODE.JS" -ForegroundColor $CYAN
Write-Host "---"
try {
    $nodeVersion = node --version
    Write-Host "OK Node.js: $nodeVersion" -ForegroundColor $GREEN
} catch {
    Write-Host "FAIL Node.js nao encontrado" -ForegroundColor $RED
}

# 2. npm
Write-Host ""
Write-Host "2. VERIFICANDO NPM" -ForegroundColor $CYAN
Write-Host "---"
try {
    $npmVersion = npm --version
    Write-Host "OK npm: $npmVersion" -ForegroundColor $GREEN
} catch {
    Write-Host "FAIL npm nao encontrado" -ForegroundColor $RED
}

# 3. pnpm
Write-Host ""
Write-Host "3. VERIFICANDO PNPM" -ForegroundColor $CYAN
Write-Host "---"
try {
    $pnpmVersion = pnpm --version
    Write-Host "OK pnpm: $pnpmVersion" -ForegroundColor $GREEN
} catch {
    Write-Host "FAIL pnpm nao encontrado" -ForegroundColor $RED
}

# 4. Docker
Write-Host ""
Write-Host "4. VERIFICANDO DOCKER" -ForegroundColor $CYAN
Write-Host "---"
try {
    $dockerVersion = docker --version
    Write-Host "OK Docker: $dockerVersion" -ForegroundColor $GREEN
} catch {
    Write-Host "FAIL Docker nao encontrado" -ForegroundColor $RED
}

# 5. Docker Compose
Write-Host ""
Write-Host "5. VERIFICANDO DOCKER COMPOSE" -ForegroundColor $CYAN
Write-Host "---"
try {
    $composeVersion = docker-compose --version
    Write-Host "OK Docker Compose: $composeVersion" -ForegroundColor $GREEN
} catch {
    Write-Host "FAIL Docker Compose nao encontrado" -ForegroundColor $RED
}

# 6. Diretorios de apps
Write-Host ""
Write-Host "6. VERIFICANDO DIRETORIOS DE APPS" -ForegroundColor $CYAN
Write-Host "---"

$dirs = @(
    "apps/api-gateway",
    "apps/auth-service",
    "apps/tasks-service",
    "apps/notifications-service",
    "apps/web"
)

$dirsOk = $true
foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Write-Host "OK $dir" -ForegroundColor $GREEN
    }
    else {
        Write-Host "FAIL $dir NAO ENCONTRADO" -ForegroundColor $RED
        $dirsOk = $false
    }
}

# 7. node_modules
Write-Host ""
Write-Host "7. VERIFICANDO DEPENDENCIAS" -ForegroundColor $CYAN
Write-Host "---"

if (Test-Path "node_modules") {
    Write-Host "OK node_modules encontrado" -ForegroundColor $GREEN
}
else {
    Write-Host "FAIL node_modules nao encontrado" -ForegroundColor $RED
    Write-Host "Execute: pnpm install" -ForegroundColor $YELLOW
}

# 8. .env files
Write-Host ""
Write-Host "8. VERIFICANDO ARQUIVOS .env" -ForegroundColor $CYAN
Write-Host "---"

$envFiles = @(
    "apps/api-gateway/.env",
    "apps/auth-service/.env",
    "apps/tasks-service/.env",
    "apps/notifications-service/.env",
    "apps/web/.env"
)

$envOk = $true
foreach ($env in $envFiles) {
    if (Test-Path $env) {
        Write-Host "OK $env" -ForegroundColor $GREEN
    }
    else {
        Write-Host "FAIL $env NAO ENCONTRADO" -ForegroundColor $RED
        $envOk = $false
    }
}

# 9. docker-compose.yml
Write-Host ""
Write-Host "9. VERIFICANDO DOCKER COMPOSE YML" -ForegroundColor $CYAN
Write-Host "---"

if (Test-Path "docker-compose.yml") {
    Write-Host "OK docker-compose.yml encontrado" -ForegroundColor $GREEN
}
else {
    Write-Host "FAIL docker-compose.yml nao encontrado" -ForegroundColor $RED
}

# 10. Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor $CYAN
Write-Host "RESUMO" -ForegroundColor $CYAN
Write-Host "========================================" -ForegroundColor $CYAN

if ($dirsOk -and $envOk) {
    Write-Host "SETUP VALIDACAO: OK" -ForegroundColor $GREEN
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor $YELLOW
    Write-Host "1. Execute: docker-compose up -d" -ForegroundColor $YELLOW
    Write-Host "2. Execute: pnpm run migration:run" -ForegroundColor $YELLOW
    Write-Host "3. Execute: pnpm run dev" -ForegroundColor $YELLOW
    Write-Host ""
}
else {
    Write-Host "SETUP VALIDACAO: FALHA" -ForegroundColor $RED
    Write-Host "Verifique os erros acima e execute: .\setup-env.ps1" -ForegroundColor $YELLOW
}

Write-Host ""
