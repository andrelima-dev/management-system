import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { Task } from "@/types"
import { updateTaskSchema, type UpdateTaskInput } from "@/lib/schemas"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"

interface EditTaskModalProps {
  task: Task | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onTaskUpdated?: () => void
}

export function EditTaskModal({ task, isOpen, onOpenChange, onTaskUpdated }: EditTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTaskInput>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "medium",
      status: task?.status || "todo",
      dueDate: task?.dueDate || "",
    },
  })

  const onSubmit = async (data: UpdateTaskInput) => {
    if (!task) return

    try {
      setIsSubmitting(true)
      await api.put(`/tasks/${task.id}`, data)
      toast.success("Tarefa atualizada com sucesso!")
      reset()
      onOpenChange(false)
      onTaskUpdated?.()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar tarefa"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>Atualize as informações da tarefa</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <Input
              placeholder="Ex: Implementar autenticação"
              disabled={isSubmitting}
              {...register("title")}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Input
              placeholder="Ex: Implementar JWT authentication"
              disabled={isSubmitting}
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                disabled={isSubmitting}
                {...register("status")}
              >
                <option value="todo">A Fazer</option>
                <option value="in_progress">Em Progresso</option>
                <option value="review">Em Revisão</option>
                <option value="done">Concluído</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Prioridade</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                disabled={isSubmitting}
                {...register("priority")}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data Limite</label>
            <Input type="date" disabled={isSubmitting} {...register("dueDate")} />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
