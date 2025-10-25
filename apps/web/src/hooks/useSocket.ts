import { useEffect } from "react"
import { io, Socket } from "socket.io-client"
import { useAuth } from "@/stores/authStore"

let socket: Socket | null = null

export function useSocket() {
  const { accessToken } = useAuth()

  useEffect(() => {
    if (!accessToken) {
      if (socket) {
        socket.disconnect()
        socket = null
      }
      return
    }

    if (!socket) {
      socket = io("http://localhost:3000", {
        auth: {
          token: accessToken,
        },
        transports: ["websocket", "polling"],
      })

      socket.on("connect", () => {
        console.log("✅ WebSocket connected")
      })

      socket.on("disconnect", () => {
        console.log("❌ WebSocket disconnected")
      })

      socket.on("error", (error) => {
        console.error("⚠️ WebSocket error:", error)
      })
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
    }
  }, [accessToken])

  return socket
}

export function useSocketEvent(event: string, callback: (data: any) => void) {
  useEffect(() => {
    if (!socket) return

    socket.on(event, callback)

    return () => {
      if (socket) {
        socket.off(event, callback)
      }
    }
  }, [event, callback])
}

export function useSocketEmit() {
  return (event: string, data?: any) => {
    if (socket) {
      socket.emit(event, data)
    }
  }
}
