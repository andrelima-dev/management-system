#!/bin/bash
# VALIDATION.sh - Script para validar o setup

set -e

echo "🔍 VALIDANDO SISTEMA DE GERENCIAMENTO DE TAREFAS"
echo "================================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funções
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $2 encontrado: $(which $1)"
        return 0
    else
        echo -e "${RED}✗${NC} $2 NÃO encontrado"
        return 1
    fi
}

check_env_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 existe"
        return 0
    else
        echo -e "${RED}✗${NC} $1 NÃO existe"
        return 1
    fi
}

# 1. Verificar requisitos
echo "1️⃣  VERIFICANDO REQUISITOS"
echo "---"
check_command "node" "Node.js" || exit 1
check_command "pnpm" "pnpm" || exit 1
check_command "docker" "Docker" || exit 1
check_command "docker-compose" "Docker Compose" || exit 1
echo ""

# 2. Verificar arquivos .env.example
echo "2️⃣  VERIFICANDO ARQUIVOS .env.example"
echo "---"
ENV_FILES=(
    "apps/web/.env.example"
    "apps/api-gateway/.env.example"
    "apps/auth-service/.env.example"
    "apps/tasks-service/.env.example"
    "apps/notifications-service/.env.example"
)

for env_file in "${ENV_FILES[@]}"; do
    check_env_file "$env_file" || exit 1
done
echo ""

# 3. Verificar migrações
echo "3️⃣  VERIFICANDO ARQUIVOS DE MIGRAÇÃO"
echo "---"
MIGRATION_FILES=(
    "apps/auth-service/migrations/1700000001000-CreateUsersTable.ts"
    "apps/auth-service/migrations/1700000002000-CreateRefreshTokensTable.ts"
    "apps/tasks-service/migrations/1700000003000-CreateTasksTable.ts"
    "apps/tasks-service/migrations/1700000004000-CreateCommentsTable.ts"
    "apps/tasks-service/migrations/1700000005000-CreateTaskHistoryTable.ts"
    "apps/notifications-service/migrations/1700000006000-CreateNotificationsTable.ts"
)

for migration_file in "${MIGRATION_FILES[@]}"; do
    if [ -f "$migration_file" ]; then
        echo -e "${GREEN}✓${NC} $migration_file"
    else
        echo -e "${RED}✗${NC} $migration_file NÃO ENCONTRADO"
    fi
done
echo ""

# 4. Verificar estrutura de pastas
echo "4️⃣  VERIFICANDO ESTRUTURA DE PASTAS"
echo "---"

REQUIRED_DIRS=(
    "apps/web/src"
    "apps/api-gateway/src"
    "apps/auth-service/src"
    "apps/tasks-service/src"
    "apps/notifications-service/src"
    "packages/types"
    "packages/utils"
    "packages/ui-kit"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $dir"
    else
        echo -e "${RED}✗${NC} $dir NÃO ENCONTRADO"
    fi
done
echo ""

# 5. Verificar Docker images
echo "5️⃣  VERIFICANDO DOCKER COMPOSE"
echo "---"

if docker-compose config > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} docker-compose.yml válido"
    echo "Serviços definidos:"
    docker-compose config --services | sed 's/^/  - /'
else
    echo -e "${RED}✗${NC} docker-compose.yml inválido"
    exit 1
fi
echo ""

# 6. Verificar se node_modules existe
echo "6️⃣  VERIFICANDO DEPENDÊNCIAS"
echo "---"

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules encontrado"
else
    echo -e "${YELLOW}⚠${NC} node_modules não encontrado"
    echo "Execute: pnpm install"
fi
echo ""

# 7. Resumo
echo "================================================="
echo -e "${GREEN}✅ VALIDAÇÃO CONCLUÍDA COM SUCESSO${NC}"
echo "================================================="
echo ""
echo "Próximos passos:"
echo "1. Copiar arquivos .env.example para .env"
echo "2. docker-compose up -d"
echo "3. pnpm run migration:run"
echo "4. pnpm run dev"
echo ""
echo "Para mais informações, consulte SETUP.md"
