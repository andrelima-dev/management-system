import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { createTaskSchema, type CreateTaskInput } from "@/lib/schemas"
import { api } from "@/lib/api"
import { useAuth } from "@/stores/authStore"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"

interface CreateTaskModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated?: () => void
}

export function CreateTaskModal({ isOpen, onOpenChange, onTaskCreated }: CreateTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assigneeIds: [],
    },
  })

  const onSubmit = async (data: CreateTaskInput) => {
    try {
      setIsSubmitting(true)
      // Sempre adicionar o usuário atual como assignee
      const payload = {
        ...data,
        assigneeIds: user?.id ? [user.id] : [],
      }
      console.log("📤 Enviando tarefa:", payload)
      const response = await api.post("/tasks", payload)
      console.log("✅ Tarefa criada com sucesso:", response.data)
      toast.success("Tarefa criada com sucesso!")
      reset()
      onOpenChange(false)
      onTaskCreated?.()
    } catch (error) {
      console.error("❌ Erro ao criar tarefa:", error)
      const message = error instanceof Error ? error.message : "Erro ao criar tarefa"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Nova Tarefa</DialogTitle>
          <DialogDescription className="text-gray-600">
            Crie uma nova tarefa para sua equipe
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Título */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Título</label>
            <Input
              placeholder="Ex: Implementar autenticação"
              disabled={isSubmitting}
              className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/30 h-10"
              {...register("title")}
            />
            {errors.title && <p className="text-sm text-red-500 font-medium">{errors.title.message}</p>}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Descrição</label>
            <Input
              placeholder="Ex: Implementar JWT authentication"
              disabled={isSubmitting}
              className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/30 h-10"
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-red-500 font-medium">{errors.description.message}</p>}
          </div>

          {/* Grid de Prioridade e Data */}
          <div className="grid grid-cols-2 gap-4">
            {/* Prioridade */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Prioridade</label>
              <select
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                disabled={isSubmitting}
                {...register("priority")}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
              {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
            </div>

            {/* Data Limite */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Data Limite</label>
              <Input 
                type="date" 
                disabled={isSubmitting} 
                className="bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/30 h-10"
                {...register("dueDate")} 
              />
              {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              ℹ️ Você será automaticamente atribuído como responsável por esta tarefa
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando...
                </span>
              ) : "Criar Tarefa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

