#!/bin/bash
# setup-env.sh - Configurar variáveis de ambiente automaticamente

set -e

echo "📝 CONFIGURANDO VARIÁVEIS DE AMBIENTE"
echo "======================================"
echo ""

# Copiar .env.example para .env em cada serviço
ENV_FILES=(
    "apps/web"
    "apps/api-gateway"
    "apps/auth-service"
    "apps/tasks-service"
    "apps/notifications-service"
)

for dir in "${ENV_FILES[@]}"; do
    if [ -f "$dir/.env.example" ]; then
        if [ -f "$dir/.env" ]; then
            echo "⚠️  $dir/.env já existe, mantendo existente"
        else
            cp "$dir/.env.example" "$dir/.env"
            echo "✓  Copiado $dir/.env"
        fi
    else
        echo "✗  $dir/.env.example não encontrado"
    fi
done

echo ""
echo "✅ Variáveis de ambiente configuradas!"
echo ""
echo "PRÓXIMOS PASSOS:"
echo "1. Review dos arquivos .env (ajuste URLs/secretos se necessário)"
echo "2. docker-compose up -d"
echo "3. pnpm run migration:run"
echo "4. pnpm run dev"
echo ""
