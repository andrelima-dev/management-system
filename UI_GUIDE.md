# 🎨 Guia Visual - Jungle Tasks Frontend

## 📺 Interface Overview

### 🔐 Página de Autenticação (/)

```
┌──────────────────────────────────────────┐
│                Jungle Tasks              │
│         Faça login na sua conta           │
│                                          │
│  ┌────────────┬──────────────┐          │
│  │   Login    │   Registrar  │          │
│  └────────────┴──────────────┘          │
│                                          │
│  Email input       [seu@email.com    ]  │
│  Senha input       [••••••••         ]  │
│                                          │
│  [     Entrar     ]                     │
│                                          │
└──────────────────────────────────────────┘
```

**Features:**
- Tabs alternáveis (Login | Registrar)
- Validação em tempo real (email, senha)
- Error messages customizadas
- Loading state durante requisição

---

### 📋 Página de Tarefas (/tasks)

```
┌──────────────────────────────────────────┐
│  👤 John Doe                   [Logout]  │  ← Header
├──────────────────────────────────────────┤
│                                          │
│  Tarefas                   [+ Nova]      │
│  Gerencie suas tarefas                   │
│                                          │
│  ┌──────────────────────────────────────┐│
│  │ Tarefa 1                             ││
│  │ Implementar login                    ││
│  │ [A Fazer]    [Alta]                  ││
│  └──────────────────────────────────────┘│
│                                          │
│  ┌──────────────────────────────────────┐│
│  │ Tarefa 2                             ││
│  │ Criar dashboard                      ││
│  │ [Em Progresso]  [Média]              ││
│  └──────────────────────────────────────┘│
│                                          │
│  ┌──────────────────────────────────────┐│
│  │ Tarefa 3                             ││
│  │ Deploy produção                      ││
│  │ [Concluído]  [Urgente]               ││
│  └──────────────────────────────────────┘│
│                                          │
└──────────────────────────────────────────┘
```

**Features:**
- Lista de todas as tarefas
- Badges coloridos para status
- Badges coloridos para prioridade
- Botão "Nova Tarefa" no topo
- Click para abrir detalhe
- Skeleton loaders durante loading

**Status Badges:**
- 🟡 A Fazer (gray)
- 🔵 Em Progresso (blue)
- 🟠 Em Revisão (yellow)
- 🟢 Concluído (green)

**Priority Badges:**
- 🟢 Baixa (green)
- 🟡 Média (yellow)
- 🟠 Alta (orange)
- 🔴 Urgente (red)

---

### 📄 Página de Detalhe (/tasks/:id)

```
┌──────────────────────────────────────────┐
│  [← Voltar]                              │
│                                          │
│  Implementar Login                       │
│  Adicionar autenticação com JWT          │
│                                          │
│  [A Fazer]              [🔴 Urgente]     │
│                                          │
│  ┌──────────────────────────────────────┐│
│  │ Prioridade: 🔴 Urgente               ││
│  │ Criada em: 24/10/2025                ││
│  │                                      ││
│  │ [  Editar  ]  [  Deletar  ]          ││
│  └──────────────────────────────────────┘│
│                                          │
│  📝 Comentários                          │
│  ┌──────────────────────────────────────┐│
│  │ Adicionar um comentário...  [Enviar] ││
│  └──────────────────────────────────────┘│
│                                          │
│  João Doe - 24/10 14:30                  │
│  Ótima tarefa! Vamos começar?            │
│                                          │
│  Maria Silva - 24/10 14:45               │
│  Já comecei a implementar                │
│                                          │
│  📊 Histórico                            │
│  ├─ 24/10 14:00 - Created (John)        │
│  ├─ 24/10 14:15 - Status changed (Maria)│
│  └─ 24/10 14:30 - Comment added (João)  │
│                                          │
└──────────────────────────────────────────┘
```

**Features:**
- Volta para lista
- Editar button → EditTaskModal
- Deletar button com confirmação
- Seção de comentários com form
- Lista de comentários com autor e data
- Timeline de histórico

---

## 🎯 Componentes UI

### Button Component

```
Variantes:

[    Default    ]    [   Destructive   ]    [    Outline    ]
[  Secondary    ]    [      Ghost      ]    [      Link     ]

Sizes: default | sm | lg | icon
```

### Input Component

```
[       Text Input       ]
[       Email Input      ]
[       Date Input       ]
[  Date + Time Input     ]

Validação em tempo real:
Email: ✅ valid@email.com
Email: ❌ invalid_email
```

### Dialog Component (Modal)

```
┌────────────────────────────────┐
│ Título do Modal          [X]   │
├────────────────────────────────┤
│                                │
│  Descrição do modal             │
│                                │
│  [Conteúdo]                    │
│                                │
│                                │
├────────────────────────────────┤
│              [Cancelar] [OK]    │
└────────────────────────────────┘
```

### Card Component

```
┌──────────────────────┐
│ Card Title           │
│ Card Description     │
├──────────────────────┤
│                      │
│  Card Content        │
│  More content here   │
│                      │
├──────────────────────┤
│   [Footer Content]   │
└──────────────────────┘
```

### Skeleton Component

```
████████████████████
████████████████████
████████████████████

(shimmer animation)

Carregando...
```

---

## 🔄 Modais

### Modal: Criar Tarefa

```
┌──────────────────────────────────────┐
│ Nova Tarefa                    [X]   │
│ Crie uma nova tarefa para sua equipe │
├──────────────────────────────────────┤
│                                      │
│ Título                               │
│ [  Ex: Implementar login      ]     │
│                                      │
│ Descrição                            │
│ [  Ex: Adicionar autenticação ]     │
│                                      │
│ Prioridade       Data Limite         │
│ [Média]          [2025-10-31]       │
│                                      │
├──────────────────────────────────────┤
│                 [Cancelar] [Criar]   │
└──────────────────────────────────────┘
```

### Modal: Editar Tarefa

```
┌──────────────────────────────────────┐
│ Editar Tarefa                  [X]   │
│ Atualize as informações da tarefa    │
├──────────────────────────────────────┤
│                                      │
│ Título                               │
│ [  Implementar Login (editável)  ]  │
│                                      │
│ Descrição                            │
│ [  Adicionar JWT (editável)      ]  │
│                                      │
│ Status          Prioridade           │
│ [Em Progresso]  [Alta]              │
│                                      │
│ Data Limite                          │
│ [2025-10-31]                        │
│                                      │
├──────────────────────────────────────┤
│              [Cancelar] [Atualizar]  │
└──────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### Status Colors
```
🟢 Todo:           #EAF5EA (fundo) + #059669 (texto)
🔵 In Progress:    #EBF8FF (fundo) + #0284C7 (texto)
🟠 Review:         #FFFBEB (fundo) + #B45309 (texto)
🟢 Done:           #DCFCE7 (fundo) + #16A34A (texto)
```

### Priority Colors
```
🟢 Low:            #F0FDF4 (fundo) + #166534 (texto)
🟡 Medium:         #FFFBEB (fundo) + #92400E (texto)
🟠 High:           #FEF3C7 (fundo) + #B45309 (texto)
🔴 Urgent:         #FEE2E2 (fundo) + #7F1D1D (texto)
```

### Tailwind Theme
```
Primary:           #1F2937 (slate-800)
Secondary:         #3B82F6 (blue-500)
Accent:            #EC4899 (pink-500)
Background:        #FFFFFF (white)
Surface:           #F3F4F6 (slate-100)
```

---

## 🚀 Interações Principais

### Criar Tarefa
```
1. Click [+ Nova Tarefa]
   ↓ CreateTaskModal abre
   
2. Preencher formulário
   - Título (obrigatório)
   - Descrição (opcional)
   - Prioridade (default: Média)
   - Data limite (opcional)
   ↓ Validação Zod em tempo real
   
3. Click [Criar Tarefa]
   ↓ POST /tasks
   ↓ Toast: "Tarefa criada com sucesso!"
   ↓ Modal fecha
   ↓ Lista atualiza
   ↓ WebSocket notifica outros usuários
```

### Editar Tarefa
```
1. Click em uma tarefa
   ↓ Navega para /tasks/:id
   
2. Click [Editar]
   ↓ EditTaskModal abre com dados
   
3. Modificar campos
   - Status (todo → in_progress → review → done)
   - Prioridade (low → medium → high → urgent)
   - Título e descrição
   ↓ Validação em tempo real
   
4. Click [Atualizar]
   ↓ PUT /tasks/:id
   ↓ Toast: "Tarefa atualizada com sucesso!"
   ↓ Página recarrega dados
```

### Deletar Tarefa
```
1. Na página de detalhe
   
2. Click [Deletar]
   ↓ Confirmação: "Tem certeza?"
   
3. Confirmar
   ↓ DELETE /tasks/:id
   ↓ Toast: "Tarefa deletada com sucesso!"
   ↓ Redireciona para /tasks
```

### Adicionar Comentário
```
1. Na página de detalhe
   
2. Digitar no campo: "Adicionar um comentário..."
   ↓ Validação: mín 1 caractere
   
3. Click [Enviar]
   ↓ POST /tasks/:id/comments
   ↓ Toast: "Comentário adicionado!"
   ↓ Campo limpa
   ↓ Comentário aparece na lista
   ↓ WebSocket notifica outros usuários
```

---

## 🔔 Notificações

### Toast Notifications

```
✅ Sucesso:
   "Tarefa criada com sucesso!"
   "Comentário adicionado!"
   "Tarefa atualizada!"

❌ Erro:
   "Erro ao criar tarefa"
   "Email já cadastrado"
   "Credenciais inválidas"

⚠️ Aviso:
   "Sessão expirada"
   "Conexão perdida"
```

### WebSocket Events

```
🔔 task:created
   Mostra: "✨ Nova tarefa: [Título]"
   
🔔 task:updated
   Mostra: "📝 Tarefa atualizada: [Título]"
   
🔔 task:deleted
   Mostra: "🗑️ Tarefa removida: [Título]"
   
🔔 comment:added
   Mostra: "💬 Novo comentário: [Autor]"
   
🔔 notification:new
   Mostra: "[Mensagem customizada]"
```

---

## 📱 Responsividade

### Desktop (1920px+)
```
┌─────────────────────────────────┐
│  Header                         │
├─────────────────────────────────┤
│                                 │
│  Main Content (max-width: 7xl)  │
│                                 │
└─────────────────────────────────┘
```

### Tablet (768px+)
```
┌──────────────────┐
│  Header (flex)   │
├──────────────────┤
│  Content         │
└──────────────────┘
```

### Mobile (mobile-first)
```
┌─────────────┐
│  Header     │
├─────────────┤
│ Content     │
└─────────────┘
```

---

## 🎓 Padrões de Design

### Skeleton Loading Pattern
```
Component.loading?
  ├─ Yes → Show <Skeleton />
  └─ No  → Show <Component />
```

### Error Boundary Pattern
```
Try {
  Fetch data
} Catch {
  Show toast.error()
  Log error
}
```

### Form Validation Pattern
```
1. On field change → Validate with Zod
2. Show error message if invalid
3. Disable submit if form invalid
4. On submit → Final validation
5. Show toast on success/error
```

### Auth Pattern
```
On app load:
  ├─ Check localStorage for token
  ├─ If token exists → setAuth
  └─ Restore session

On unauthorized (401):
  ├─ Clear auth
  ├─ Redirect to login
  └─ Show toast
```

---

## ✨ Próximas Melhorias Visuais

- [ ] Dark mode toggle
- [ ] Animated transitions
- [ ] Drag & drop para reordenar
- [ ] Kanban board view
- [ ] Calendar view
- [ ] Gantt chart
- [ ] Team avatars
- [ ] Real-time cursor collaboration
- [ ] Undo/Redo
- [ ] Keyboard shortcuts

---

**Desenvolvido com ❤️ - Jungle Tasks UI v1.0.0**
