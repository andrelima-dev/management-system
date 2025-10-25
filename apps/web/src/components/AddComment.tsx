import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { createCommentSchema, type CreateCommentInput } from "@/lib/schemas"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface AddCommentProps {
  taskId: string
  onCommentAdded?: () => void
}

export function AddComment({ taskId, onCommentAdded }: AddCommentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: "",
    },
  })

  const onSubmit = async (data: CreateCommentInput) => {
    try {
      setIsSubmitting(true)
      await api.post(`/tasks/${taskId}/comments`, data)
      toast.success("Comentário adicionado!")
      reset()
      onCommentAdded?.()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao adicionar comentário"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <Input
        placeholder="Adicionar um comentário..."
        disabled={isSubmitting}
        {...register("content")}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar"}
      </Button>
      {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
    </form>
  )
}
