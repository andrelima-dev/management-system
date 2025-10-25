import { useEffect } from "react"
import toast from "react-hot-toast"
import { useSocket, useSocketEvent } from "@/hooks/useSocket"

export function SocketListener() {
  useSocket()

  useSocketEvent("task:created", (data) => {
    toast.success(`✨ Nova tarefa: ${data.title}`)
  })

  useSocketEvent("task:updated", (data) => {
    toast.success(`📝 Tarefa atualizada: ${data.title}`)
  })

  useSocketEvent("task:deleted", (data) => {
    toast.error(`🗑️ Tarefa removida: ${data.title}`)
  })

  useSocketEvent("comment:added", (data) => {
    toast.success(`💬 Novo comentário: ${data.author}`)
  })

  useSocketEvent("notification:new", (data) => {
    toast.success(data.message)
  })

  return null
}
