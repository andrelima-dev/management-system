#!/bin/bash
# QUICK_REFERENCE.sh - Comandos úteis para referência rápida

cat << 'EOF'

╔════════════════════════════════════════════════════════════════════╗
║         SISTEMA DE GERENCIAMENTO DE TAREFAS - JUNGLE GAMING        ║
║                    REFERÊNCIA RÁPIDA DE COMANDOS                   ║
╚════════════════════════════════════════════════════════════════════╝

📋 DOCUMENTAÇÃO
───────────────────────────────────────────────────────────────────
  📖 SETUP.md                    Guia passo-a-passo (COMECE AQUI)
  🔍 AUDITORIA_DESAFIO.md        Análise vs Requisitos
  📊 EXECUTIVE_SUMMARY.md        Resumo para decisores
  📑 ÍNDICE.md                   Navegação de documentação
  ✅ FINAL_SUMMARY.md            Resumo final de correções

🚀 INÍCIO RÁPIDO (3 MINUTOS)
───────────────────────────────────────────────────────────────────
  bash VALIDATION.sh             Validar pré-requisitos
  bash setup-env.sh              Copiar .env.example para .env
  docker-compose up -d           Iniciar todos os serviços
  pnpm run migration:run         Criar tabelas no banco
  pnpm run dev                   Iniciar desenvolvimento

🌐 ACESSO AO APP
───────────────────────────────────────────────────────────────────
  Frontend:       http://localhost:5174
  API Gateway:    http://localhost:3000
  RabbitMQ Admin: http://localhost:15672 (admin/admin)
  Swagger Docs:   http://localhost:3000/api/docs
  PostgreSQL:     localhost:5432

🔐 CREDENCIAIS DE TESTE
───────────────────────────────────────────────────────────────────
  Email:    andre@teste.com
  Senha:    12345678

💾 COMANDOS DO BANCO DE DADOS
───────────────────────────────────────────────────────────────────
  pnpm run migration:run         Executar migrations (Auth + Tasks)
  pnpm run migration:revert      Reverter última migration
  
  # Auth Service individual
  pnpm --filter @jungle/auth-service run migration:run
  pnpm --filter @jungle/auth-service run migration:revert
  
  # Tasks Service individual
  pnpm --filter @jungle/tasks-service run migration:run
  pnpm --filter @jungle/tasks-service run migration:revert

🏗️ DESENVOLVIMENTO
───────────────────────────────────────────────────────────────────
  pnpm run dev              Iniciar todos os serviços (paralelo)
  pnpm run build            Build de todos os packages
  pnpm run lint             Executar ESLint
  pnpm run format           Formatar com Prettier
  
  # Serviços individuais
  pnpm --filter @jungle/web run dev
  pnpm --filter @jungle/api-gateway run dev
  pnpm --filter @jungle/auth-service run dev
  pnpm --filter @jungle/tasks-service run dev
  pnpm --filter @jungle/notifications-service run dev

🐳 DOCKER COMPOSE
───────────────────────────────────────────────────────────────────
  docker-compose up -d       Iniciar tudo em background
  docker-compose up          Iniciar vendo logs
  docker-compose down        Parar tudo
  docker-compose ps          Ver status dos containers
  docker-compose logs -f     Ver logs em tempo real
  docker-compose logs <svc>  Logs de serviço específico
  
  # Serviços individuais
  docker-compose start db
  docker-compose stop db
  docker-compose restart rabbitmq

🧪 TESTES MANUAIS
───────────────────────────────────────────────────────────────────
  # Registrar usuário
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"Test123456","displayName":"Test"}'
  
  # Login
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"Test123456"}'
  
  # Listar tarefas (substitua TOKEN)
  curl -X GET "http://localhost:3000/api/tasks?page=1&size=20" \
    -H "Authorization: Bearer YOUR_TOKEN_HERE"
  
  # Criar tarefa
  curl -X POST http://localhost:3000/api/tasks \
    -H "Authorization: Bearer YOUR_TOKEN_HERE" \
    -H "Content-Type: application/json" \
    -d '{"title":"Teste","description":"Desc","priority":"HIGH"}'

🔍 TROUBLESHOOTING
───────────────────────────────────────────────────────────────────
  # Validar setup
  bash VALIDATION.sh
  
  # Limpar node_modules e reinstalar
  rm -rf node_modules
  pnpm install
  
  # Limpar Docker e começar do zero
  docker-compose down -v
  docker-compose up -d
  
  # Ver logs de um serviço
  docker logs -f <container_name>
  
  # Conectar ao PostgreSQL
  psql -U postgres -h localhost -d challenge_db
  
  # Acessar RabbitMQ Management
  Abrir: http://localhost:15672
  User:  admin
  Pass:  admin

📂 VARIÁVEIS DE AMBIENTE
───────────────────────────────────────────────────────────────────
  Copie .env.example para .env em cada serviço:
  
  apps/web/.env
  apps/api-gateway/.env
  apps/auth-service/.env
  apps/tasks-service/.env
  apps/notifications-service/.env

📊 ARQUITETURA VISUAL
───────────────────────────────────────────────────────────────────
           Cliente (React)
                │
                │ HTTP
                ▼
     ┌──────────────────────┐
     │    API Gateway       │
     │  (Port 3000)         │
     └────────┬─────────────┘
              │ AMQP/RabbitMQ
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
  Auth    Tasks    Notifications
  :3001   :3002      :3003
    │         │         │
    └─────────┼─────────┘
              │ SQL
              ▼
         PostgreSQL
         :5432

✅ CHECKLIST PRÉ-SUBMISSÃO
───────────────────────────────────────────────────────────────────
  [ ] bash VALIDATION.sh passa sem erros
  [ ] docker-compose up -d funciona
  [ ] pnpm run migration:run sem erros
  [ ] pnpm run dev inicia sem crashes
  [ ] Frontend carrega em localhost:5174
  [ ] Login funciona (andre@teste.com / 12345678)
  [ ] Consegue criar tarefa
  [ ] Consegue comentar
  [ ] Recebe notificação em tempo real
  [ ] RabbitMQ Admin acessível

🎯 FLUXO TÍPICO DE TRABALHO
───────────────────────────────────────────────────────────────────
  1. Abrir 4 terminais para cada serviço (ou usar tmux)
  2. T1: pnpm --filter @jungle/auth-service run dev
  3. T2: pnpm --filter @jungle/tasks-service run dev
  4. T3: pnpm --filter @jungle/api-gateway run dev
  5. T4: pnpm --filter @jungle/web run dev
  6. Abrir browser: http://localhost:5174
  7. Fazer alterações no código
  8. Hot reload automático

💡 DICAS PRODUTIVIDADE
───────────────────────────────────────────────────────────────────
  • Use tmux para terminal multiplexado
  • Abra VSCode com: code .
  • Use Postman/Insomnia para testar APIs
  • Acompanhe logs com: docker-compose logs -f
  • Sqlite3 client: psql -U jungle -d challenge_db

📞 RECURSOS
───────────────────────────────────────────────────────────────────
  README.md                Main documentation
  SETUP.md                 Setup guide (LEIA PRIMEIRO)
  AUDITORIA_DESAFIO.md     Full audit against requirements
  CORRECTION_REPORT.md     Technical details of fixes
  ÍNDICE.md                Documentation index
  EXECUTIVE_SUMMARY.md     Executive summary
  FINAL_SUMMARY.md         Summary of all corrections

═══════════════════════════════════════════════════════════════════

Dúvidas? Consulte SETUP.md ou ÍNDICE.md

Última atualização: 29 de outubro de 2025
Status: ✅ PRONTO PARA SUBMISSÃO

═══════════════════════════════════════════════════════════════════

EOF
