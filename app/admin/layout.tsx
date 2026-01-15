"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Separator } from "@/components/ui/separator"
import { AdminDashboard } from "@/components/admin-dashboard"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const viewTitles: Record<string, string> = {
    dashboard: "Dashboard",
    "job-postings": "Job Postings",
    verification: "Teacher Verification",
    "activity-logs": "Activity Logs",
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [activeView, setActiveView] = useState("dashboard")

    useEffect(() => {
        if (!isLoading && user?.role !== "admin") {
            router.push("/login")
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    if (user?.role !== "admin") {
        return null
    }

    return (
        <SidebarProvider>
            <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <h1 className="text-sm font-medium">{viewTitles[activeView] || "Admin Dashboard"}</h1>
                </header>
                <main className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6">
                    <AdminDashboard activeView={activeView} />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
