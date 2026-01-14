"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Briefcase,
    UserCheck,
    Activity,
    LogOut,
    GraduationCap,
    LayoutDashboard,
    MessageSquare,
} from "lucide-react"
import { useAuth } from "./auth-context"

interface AdminSidebarProps {
    activeView: string
    onViewChange: (view: string) => void
}

const navItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        value: "dashboard",
    },
    {
        title: "Job Postings",
        icon: Briefcase,
        value: "job-postings",
    },
    {
        title: "Teacher Verification",
        icon: UserCheck,
        value: "verification",
    },
    {
        title: "Forum",
        icon: MessageSquare,
        value: "forum",
    },
    {
        title: "Activity Logs",
        icon: Activity,
        value: "activity-logs",
    },
]

export function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
    const { user, logout } = useAuth()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <GraduationCap className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-semibold">TeachConnect</span>
                        <span className="text-xs text-muted-foreground">Admin Panel</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.value}>
                                    <SidebarMenuButton
                                        isActive={activeView === item.value}
                                        onClick={() => onViewChange(item.value)}
                                        tooltip={item.title}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4">
                <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {user?.firstName?.charAt(0) || "A"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-medium">
                            {user?.firstName || "Admin"}
                        </span>
                        <span className="text-xs text-muted-foreground">Administrator</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={logout}
                        className="h-8 w-8 group-data-[collapsible=icon]:hidden"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
