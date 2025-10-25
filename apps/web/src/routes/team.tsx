import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Plus, Trash2, Mail, User } from "lucide-react"
import toast from "react-hot-toast"
import { api } from "@/lib/api"
import { useAuth } from "@/stores/authStore"
import { TeamMember } from "@/types"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"

export function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/team/members")
      const membersData = response.data.data || response.data
      setMembers(Array.isArray(membersData) ? membersData : [])
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar equipe"
      toast.error(message)
      setMembers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" })
      return
    }

    fetchMembers()
  }, [isAuthenticated, navigate])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) {
      toast.error("Preencha o email")
      return
    }

    try {
      setIsInviting(true)
      await api.post("/team/invite", { email: inviteEmail })
      toast.success("Convite enviado com sucesso!")
      setInviteEmail("")
      setIsModalOpen(false)
      fetchMembers()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao enviar convite"
      toast.error(message)
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Tem certeza que deseja remover este membro?")) {
      return
    }

    try {
      await api.delete(`/team/members/${memberId}`)
      toast.success("Membro removido com sucesso!")
      fetchMembers()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao remover membro"
      toast.error(message)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Equipe</h1>
          <p className="text-gray-600 mt-2 text-lg">Gerenciando {members.length} membro{members.length !== 1 ? 's' : ''}</p>
        </div>
        <Button 
          className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200" 
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
          Convidar Membro
        </Button>
      </div>

      {/* Convite Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Convidar Membro</DialogTitle>
            <DialogDescription className="text-gray-600">
              Convide alguém para fazer parte da sua equipe
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInvite} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                disabled={isInviting}
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/30 h-10"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isInviting}
                onClick={() => setIsModalOpen(false)}
                className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isInviting}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isInviting ? "Enviando..." : "Convidar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Members Grid */}
      {members.length === 0 ? (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                Nenhum membro na equipe ainda
              </p>
              <p className="text-gray-500 text-sm">
                Convide pessoas para fazer parte da sua equipe
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card
              key={member.id}
              className="bg-white border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white font-bold text-sm">
                        {member.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {member.displayName}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <Mail size={14} />
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>
                  </div>

                  {user?.id !== member.id && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg flex-shrink-0"
                      title="Remover membro"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    member.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : member.role === 'manager'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {member.role === 'admin' ? 'Administrador' : member.role === 'manager' ? 'Gerenciador' : 'Membro'}
                  </span>
                  {user?.id === member.id && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Você
                    </span>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
