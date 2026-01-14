"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function RegisterChoicePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect directly to teacher registration
    router.push("/register/teacher")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
        <p className="text-muted-foreground text-sm">Redirecting to registration...</p>
      </div>
    </div>
  )
}
