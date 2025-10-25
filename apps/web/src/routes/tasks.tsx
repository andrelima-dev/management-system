import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Plus, CheckCircle2, Trash2, Clock } from "lucide-react"
import toast from "react-hot-toast"
import { api } from "@/lib/api"
import { useAuth } from "@/stores/authStore"
import { Task } from "@/types"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { SkeletonCard } from "@/components/Skeleton"
import { CreateTaskModal } from "@/components/CreateTaskModal"

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      console.log("🔄 Recarregando tarefas...")
      const response = await api.get("/tasks")
      console.log("📥 Resposta completa:", response)
      
      // Tentar extrair o array de tarefas de diferentes estruturas possíveis
      let tasksArray: Task[] = []
      
      if (response.data?.items && Array.isArray(response.data.items)) {
        tasksArray = response.data.items
      } else if (Array.isArray(response.data)) {
        tasksArray = response.data
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        tasksArray = response.data.data
      }
      
      console.log("✅ Total de tarefas carregadas:", tasksArray.length)
      setTasks(tasksArray)
    } catch (error) {
      console.error("❌ Erro ao carregar tarefas:", error)
      const message = error instanceof Error ? error.message : "Erro ao carregar tarefas"
      toast.error(message)
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" })
      return
    }

    fetchTasks()
  }, [isAuthenticated, navigate])

  const handleCompleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setActionInProgress(taskId)
      console.log("✅ Marcando como concluída:", taskId)
      const response = await api.patch(`/tasks/${taskId}`, { status: "done" })
      console.log("✅ Resposta da conclusão:", response)
      toast.success("Tarefa marcada como concluída!")
      await fetchTasks()
    } catch (error) {
      console.error("❌ Erro ao marcar tarefa:", error)
      const message = error instanceof Error ? error.message : "Erro ao marcar tarefa"
      toast.error(message)
    } finally {
      setActionInProgress(null)
    }
  }

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Tem certeza que deseja remover esta tarefa?")) {
      return
    }
    try {
      setActionInProgress(taskId)
      console.log("🗑️ Removendo tarefa:", taskId)
      
      // Remover do estado local imediatamente para feedback visual
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
      
      const response = await api.delete(`/tasks/${taskId}`)
      console.log("✅ Resposta da exclusão:", response)
      toast.success("Tarefa removida com sucesso!")
    } catch (error) {
      console.error("❌ Erro ao remover tarefa:", error)
      const message = error instanceof Error ? error.message : "Erro ao remover tarefa"
      toast.error(message)
      // Recarregar tarefas em caso de erro
      await fetchTasks()
    } finally {
      setActionInProgress(null)
    }
  }

  const handleMarkInProgress = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setActionInProgress(taskId)
      console.log("⏳ Marcando como em progresso:", taskId)
      const response = await api.patch(`/tasks/${taskId}`, { status: "in_progress" })
      console.log("✅ Resposta do progresso:", response)
      toast.success("Tarefa marcada como em progresso!")
      await fetchTasks()
    } catch (error) {
      console.error("❌ Erro ao atualizar tarefa:", error)
      const message = error instanceof Error ? error.message : "Erro ao atualizar tarefa"
      toast.error(message)
    } finally {
      setActionInProgress(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Tarefas</h1>
          <p className="text-gray-600 mt-2 text-lg">Gerencie suas tarefas e acompanhe o progresso</p>
        </div>
        <Button 
          className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200" 
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
          Nova Tarefa
        </Button>
      </div>

      <CreateTaskModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} onTaskCreated={fetchTasks} />

      {tasks.length === 0 ? (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium">
                Nenhuma tarefa encontrada
              </p>
              <p className="text-gray-500 text-sm">
                Crie uma nova tarefa para começar a organizar seu trabalho
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={`transition-all duration-200 border-gray-100 hover:border-blue-200 ${
                task.status === "done" 
                  ? "bg-gray-50" 
                  : "bg-white hover:shadow-lg cursor-pointer"
              }`}
              onClick={() => task.status !== "done" && navigate({ to: `/tasks/${task.id}` })}
            >
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className={`text-xl font-bold ${
                      task.status === "done" 
                        ? "text-gray-500 line-through" 
                        : "text-gray-900"
                    }`}>
                      {task.title}
                    </CardTitle>
                    <CardDescription className={`text-base mt-2 ${
                      task.status === "done" 
                        ? "text-gray-400" 
                        : "text-gray-600"
                    }`}>
                      {task.description}
                    </CardDescription>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                      task.status === "done" 
                        ? "bg-green-100 text-green-700"
                        : task.status === "in_progress"
                        ? "bg-blue-100 text-blue-700"
                        : task.status === "review"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {task.status === "in_progress" ? "Em Progresso" : 
                       task.status === "review" ? "Em Revisão" :
                       task.status === "done" ? "Concluído" : "Pendente"}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                      task.priority === "urgent"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "high"
                        ? "bg-orange-100 text-orange-700"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {task.priority === "urgent" ? "Urgente" :
                       task.priority === "high" ? "Alta" :
                       task.priority === "medium" ? "Média" : "Baixa"}
                    </span>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 flex-wrap">
                  {task.status !== "done" && (
                    <>
                      <Button
                        size="sm"
                        onClick={(e) => handleMarkInProgress(task.id, e)}
                        disabled={actionInProgress === task.id}
                        className="gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs"
                        variant="outline"
                      >
                        {actionInProgress === task.id ? (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <Clock size={16} />
                        )}
                        {actionInProgress === task.id ? "Atualizando..." : "Em Progresso"}
                      </Button>

                      <Button
                        size="sm"
                        onClick={(e) => handleCompleteTask(task.id, e)}
                        disabled={actionInProgress === task.id}
                        className="gap-2 bg-green-100 text-green-700 hover:bg-green-200 text-xs"
                        variant="outline"
                      >
                        {actionInProgress === task.id ? (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <CheckCircle2 size={16} />
                        )}
                        {actionInProgress === task.id ? "Concluindo..." : "Concluir"}
                      </Button>
                    </>
                  )}

                  <Button
                    size="sm"
                    onClick={(e) => handleDeleteTask(task.id, e)}
                    disabled={actionInProgress === task.id}
                    className="gap-2 bg-red-100 text-red-700 hover:bg-red-200 text-xs ml-auto"
                    variant="outline"
                  >
                    {actionInProgress === task.id ? (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Trash2 size={16} />
                    )}
                    {actionInProgress === task.id ? "Removendo..." : "Remover"}
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
