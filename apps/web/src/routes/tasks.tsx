import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"
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
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/tasks")
      setTasks(response.data.data || response.data)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar tarefas"
      toast.error(message)
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tarefas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas tarefas e acompanhe o progresso</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Nova Tarefa
        </Button>
      </div>

      <CreateTaskModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} onTaskCreated={fetchTasks} />

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 py-8">
              Nenhuma tarefa encontrada. Crie uma nova tarefa para começar!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate({ to: `/tasks/${task.id}` })}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription>{task.description}</CardDescription>
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === "urgent"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "high"
                        ? "bg-orange-100 text-orange-800"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {task.priority === "urgent" ? "Urgente" :
                       task.priority === "high" ? "Alta" :
                       task.priority === "medium" ? "Média" : "Baixa"}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
