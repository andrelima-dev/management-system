# 🚀 START HERE - Comece Por Aqui

**Bem-vindo ao Sistema de Gerenciamento de Tarefas!**  
**Este arquivo deve ser sua primeira leitura.**

---

## ⏱️ Tempo: 3 Minutos Para Rodar

Você precisa apenas seguir estes 4 passos:

### 1️⃣ Validar (1 minuto)

```bash
bash VALIDATION.sh
```

Se tudo passar com ✅, continue.  
Se falhar, leia: **[SETUP.md → Troubleshooting](./SETUP.md)**

### 2️⃣ Configurar (1 minuto)

```bash
bash setup-env.sh
```

Isto copia `.env.example` para `.env` em todos os serviços.

### 3️⃣ Iniciar (2-3 minutos)

```bash
docker-compose up -d
```

Aguarde os containers iniciarem (~30 segundos).

### 4️⃣ Migrar & Rodar (2 minutos)

```bash
pnpm run migration:run
pnpm run dev
```

### ✅ Pronto!

Abra: **http://localhost:5174**

Login:
- Email: `andre@teste.com`
- Senha: `12345678`

---

## 📚 Leitura Recomendada

### Novo dev (Comece aqui)
→ [**SETUP.md**](./SETUP.md) - Guia completo passo-a-passo

### Quer entender a arquitetura?
→ [**README.md**](./README.md) - Visão geral do projeto

### Quer saber o que foi corrigido?
→ [**EXECUTIVE_SUMMARY.md**](./EXECUTIVE_SUMMARY.md) - Resumo das correções

### Teve problema?
→ [**SETUP.md → Troubleshooting**](./SETUP.md#-troubleshooting)

### Quer todos os detalhes?
→ [**AUDITORIA_DESAFIO.md**](./AUDITORIA_DESAFIO.md) - Análise completa

### Quer referência rápida de comandos?
→ [**QUICK_REFERENCE.sh**](./QUICK_REFERENCE.sh) - Comandos úteis

---

## 🎯 Se Algo Quebrar

1. Execute: `bash VALIDATION.sh`
2. Leia: [**SETUP.md → Troubleshooting**](./SETUP.md#-troubleshooting)
3. Consulte: [**AUDITORIA_DESAFIO.md**](./AUDITORIA_DESAFIO.md)

---

## 🔗 Links Principais

```
Frontend:       http://localhost:5174
API Gateway:    http://localhost:3000
RabbitMQ Admin: http://localhost:15672 (admin/admin)
Swagger Docs:   http://localhost:3000/api/docs
```

---

## 🎯 Seu Próximo Passo

```bash
# EXECUTE AGORA:
bash VALIDATION.sh
```

Se passar ✅, então:

```bash
bash setup-env.sh
docker-compose up -d
pnpm run migration:run
pnpm run dev
```

E abra: **http://localhost:5174**

---

**Pronto?** Comece! 🚀

