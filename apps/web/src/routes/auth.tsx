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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Jungle Tasks</CardTitle>
          <CardDescription>
            {tab === "login" ? "Faça login na sua conta" : "Crie uma nova conta"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Tab Buttons */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={tab === "login" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTab("login")}
              disabled={isLoading}
            >
              Login
            </Button>
            <Button
              variant={tab === "register" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTab("register")}
              disabled={isLoading}
            >
              Registrar
            </Button>
          </div>

          {/* Login Form */}
          {tab === "login" && (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <Input
                  type="text"
                  placeholder="Seu Nome"
                  disabled={isLoading}
                  {...registerForm.register("displayName")}
                />
                {registerForm.formState.errors.displayName && (
                  <p className="text-sm text-red-500">{registerForm.formState.errors.displayName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  {...registerForm.register("password")}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
