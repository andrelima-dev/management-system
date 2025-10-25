import { RootRoute, Route, Router } from "@tanstack/react-router"
import App from "@/App"
import { AuthPage } from "@/routes/auth"
import { TasksPage } from "@/routes/tasks"
import { TaskDetailPage } from "@/routes/task-detail"
import { TeamPage } from "@/routes/team"

const rootRoute = new RootRoute({
  component: App,
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: AuthPage,
})

const tasksRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/tasks",
  component: TasksPage,
})

const taskDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/tasks/$id",
  component: TaskDetailPage,
})

const teamRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/team",
  component: TeamPage,
})

const routeTree = rootRoute.addChildren([indexRoute, tasksRoute, taskDetailRoute, teamRoute])

export const router = new Router({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
