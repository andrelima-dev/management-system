import { useEffect, useState } from "react"
import { useParams, useNavigate } from "@tanstack/react-router"
import { ArrowLeft, Edit2, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { api } from "@/lib/api"
import { useAuth } from "@/stores/authStore"
import { Task, Comment, TaskHistory } from "@/types"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { SkeletonCard } from "@/components/Skeleton"
import { EditTaskModal } from "@/components/EditTaskModal"
import { AddComment } from "@/components/AddComment"

export function TaskDetailPage() {
  const { id } = useParams({ from: "/tasks/$id" })
  const [task, setTask] = useState<Task | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [history, setHistory] = useState<TaskHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" })
      return
    }

    fetchTaskDetail()
  }, [id, isAuthenticated, navigate])

  const fetchTaskDetail = async () => {
    try {
      setIsLoading(true)
      const [taskRes, commentsRes, historyRes] = await Promise.all([
        api.get(`/tasks/${id}`),
        api.get(`/tasks/${id}/comments`),
        api.get(`/tasks/${id}/history`),
      ])
      
      setTask(taskRes.data)
      setComments(commentsRes.data.data || [])
      setHistory(historyRes.data.data || [])
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar tarefa"
      toast.error(message)
      navigate({ to: "/tasks" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTask = async () => {
    if (!task) return
    
    if (!confirm("Tem certeza que deseja deletar esta tarefa?")) {
      return
    }

    try {
      await api.delete(`/tasks/${task.id}`)
      toast.success("Tarefa deletada com sucesso!")
      navigate({ to: "/tasks" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao deletar tarefa"
      toast.error(message)
    }
  }

  if (isLoading) {
    return <SkeletonCard />
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Tarefa não encontrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" className="gap-2" onClick={() => navigate({ to: "/tasks" })}>
        <ArrowLeft size={16} />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              <CardDescription className="mt-2">{task.description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status === "done" 
                  ? "bg-green-100 text-green-800"
                  : task.status === "in_progress"
                  ? "bg-blue-100 text-blue-800"
                  : task.status === "review"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {task.status === "in_progress" ? "Em Progresso" : 
                 task.status === "review" ? "Em Revisão" :
                 task.status === "done" ? "Concluído" : "A Fazer"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Prioridade</p>
              <p className="text-lg font-semibold">
                {task.priority === "urgent" ? "🔴 Urgente" :
                 task.priority === "high" ? "🟠 Alta" :
                 task.priority === "medium" ? "🟡 Média" : "🟢 Baixa"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Criada em</p>
              <p className="text-lg font-semibold">
                {new Date(task.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              className="gap-2 flex-1"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit2 size={16} />
              Editar
            </Button>
            <Button 
              variant="destructive" 
              className="gap-2 flex-1"
              onClick={handleDeleteTask}
            >
              <Trash2 size={16} />
              Deletar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Comentários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AddComment taskId={task.id} onCommentAdded={fetchTaskDetail} />
          
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhum comentário ainda</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-b-0">
                  <p className="font-semibold text-sm">{comment.createdBy.displayName}</p>
                  <p className="text-gray-600 mt-1">{comment.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(comment.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma alteração registrada</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry, idx) => (
                <div key={idx} className="border-l-2 border-gray-300 pl-4 py-2">
                  <p className="text-sm font-medium">{entry.action}</p>
                  <p className="text-sm text-gray-600">{JSON.stringify(entry.metadata)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(entry.createdAt).toLocaleString("pt-BR")} - {entry.performedBy.displayName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EditTaskModal 
        task={task}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onTaskUpdated={fetchTaskDetail}
      />
    </div>
  )
}
