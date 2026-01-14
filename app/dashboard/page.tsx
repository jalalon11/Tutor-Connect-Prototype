"use client"

import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [minLoadComplete, setMinLoadComplete] = useState(false)

  // Ensure minimum 4 second loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadComplete(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Wait for both auth loading and minimum load time
    if (!minLoadComplete) return

    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (!isLoading && user) {
      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else if (user.role === "teacher") {
        router.push("/dashboard/teacher")
      } else if (user.role === "student") {
        router.push("/dashboard/student")
      }
    }
  }, [user, isLoading, router, minLoadComplete])

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <span className="book-loader"></span>
        <p className="text-muted-foreground text-sm animate-pulse">
          Preparing your dashboard...
        </p>
      </div>
    </div>
  )
}
