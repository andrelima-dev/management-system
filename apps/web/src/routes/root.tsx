import { Outlet } from "@tanstack/react-router"
import { Header } from "@/components/Header"
import { Skeleton } from "@/components/Skeleton"
import { useAuth } from "@/stores/authStore"

export function RootLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Skeleton />
  }

  if (!isAuthenticated) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto py-6">
        <Outlet />
      </main>
    </div>
  )
}
