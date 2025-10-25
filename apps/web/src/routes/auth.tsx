import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import toast from "react-hot-toast"
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/schemas"
import { api } from "@/lib/api"
import { useAuth } from "@/stores/authStore"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"

export function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuth()

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
    },
  })

  const onLoginSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true)
      const response = await api.post("/auth/login", data)
      setAuth({
        user: response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      })
      toast.success("Login realizado com sucesso!")
      navigate({ to: "/tasks" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao fazer login"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const onRegisterSubmit = async (data: RegisterInput) => {
    try {
      setIsLoading(true)
      const response = await api.post("/auth/register", data)
      setAuth({
        user: response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      })
      toast.success("Registro realizado com sucesso!")
      navigate({ to: "/tasks" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao registrar"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      
      <Card className="w-full max-w-md shadow-2xl bg-white/95 border-blue-100 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-4 text-center pb-8 pt-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Tasks
          </CardTitle>
          <CardDescription className="text-gray-600 text-base font-medium">
            {tab === "login" ? "Bem-vindo! Acesse sua conta" : "Crie sua conta e organize suas tarefas"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Tab Buttons */}
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
            <Button
              type="button"
              variant={tab === "login" ? "default" : "ghost"}
              className={`flex-1 font-semibold transition-all duration-200 ${
                tab === "login" 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
              onClick={() => setTab("login")}
              disabled={isLoading}
            >
              Login
            </Button>
            <Button
              type="button"
              variant={tab === "register" ? "default" : "ghost"}
              className={`flex-1 font-semibold transition-all duration-200 ${
                tab === "register" 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
              onClick={() => setTab("register")}
              disabled={isLoading}
            >
              Registrar
            </Button>
          </div>

          {/* Login Form */}
          {tab === "login" && (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5" autoComplete="off">
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/30 h-11"
                  disabled={isLoading}
                  autoComplete="off"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-500 font-medium">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-700">Senha</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/30 h-11"
                  disabled={isLoading}
                  autoComplete="current-password"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-500 font-medium">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 mt-6" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </span>
                ) : "Entrar"}
              </Button>
            </form>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5" autoComplete="off">
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-700">Nome Completo</label>
                <Input
                  type="text"
                  placeholder="Seu nome aqui"
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/30 h-11"
                  disabled={isLoading}
                  autoComplete="off"
                  {...registerForm.register("displayName")}
                />
                {registerForm.formState.errors.displayName && (
                  <p className="text-sm text-red-500 font-medium">{registerForm.formState.errors.displayName.message}</p>
                )}
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/30 h-11"
                  disabled={isLoading}
                  autoComplete="off"
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-500 font-medium">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-700">Senha (mínimo 8 caracteres)</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/30 h-11"
                  disabled={isLoading}
                  autoComplete="new-password"
                  {...registerForm.register("password")}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-500 font-medium">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 mt-6" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </span>
                ) : "Criar Conta"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
