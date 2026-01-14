"use client"

import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
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
  }, [user, isLoading, router])

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-muted-foreground">Redirecting...</div>
    </div>
  )
}
