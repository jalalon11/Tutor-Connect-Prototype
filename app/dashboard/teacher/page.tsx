"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { TeacherSidebar } from "@/components/teacher-sidebar"
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const viewTitles: Record<string, string> = {
    dashboard: "Dashboard",
    "my-profile": "My Profile",
    "my-jobs": "My Services",
    applicants: "Student Bookings",
    "tutor-requests": "Student Requests",
}

export default function TeacherDashboardPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [activeView, setActiveView] = useState("dashboard")

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
    }, [user, isLoading, router])

    useEffect(() => {
        if (!isLoading && user?.role === "admin") {
            router.push("/admin/dashboard")
        }
        if (!isLoading && user?.role === "student") {
            router.push("/dashboard/student")
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    if (!user || user.role !== "teacher") {
        return null
    }

    return (
        <SidebarProvider>
            <TeacherSidebar activeView={activeView} onViewChange={setActiveView} />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <h1 className="text-sm font-medium">{viewTitles[activeView] || "Dashboard"}</h1>
                </header>
                <main className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6">
                    <TeacherDashboard activeView={activeView} />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
