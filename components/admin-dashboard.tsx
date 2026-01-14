"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Check, X, Users, Briefcase, Clock, Activity } from "lucide-react"
import { mockUsers, mockJobs, mockLogs } from "@/lib/mock-data"

interface AdminDashboardProps {
  activeView?: string
}

export function AdminDashboard({ activeView = "overview" }: AdminDashboardProps) {
  const [pendingTeachers, setPendingTeachers] = useState<any[]>([])
  const [approvedTeachers, setApprovedTeachers] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalJobs, setTotalJobs] = useState(0)
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    const allUsers = Object.values(mockUsers)
    const pending = allUsers.filter((u: any) => u.role === "teacher" && u.status === "pending")
    const approved = allUsers.filter((u: any) => u.role === "teacher" && u.status === "approved")
    const studentsList = allUsers.filter((u: any) => u.role === "student")

    setPendingTeachers(pending)
    setApprovedTeachers(approved)
    setStudents(studentsList)
    setTotalUsers(allUsers.length)
    setTotalJobs(Object.values(mockJobs).filter((j: any) => j.status === "active").length)
    setActivities(mockLogs)
  }

  const handleApproveTeacher = (userId: string) => {
    const user = mockUsers[Object.keys(mockUsers).find((key) => mockUsers[key].id === userId) as string]
    if (user) {
      user.status = "approved"
      loadDashboardData()
    }
  }

  const handleRejectTeacher = (userId: string) => {
    const key = Object.keys(mockUsers).find((k) => mockUsers[k].id === userId)
    if (key) {
      delete mockUsers[key]
      loadDashboardData()
    }
  }

  // Overview section with stats
  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Monitor your platform's key metrics and activities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {approvedTeachers.length} teachers, {students.length} students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">Posted by verified teachers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTeachers.length}</div>
            <p className="text-xs text-muted-foreground">Teacher registrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">System events</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{log.userName}</p>
                  <p className="text-sm text-muted-foreground">{log.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {log.timestamp.toLocaleDateString()}
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Pending Teachers section
  const renderPendingTeachers = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Pending Teachers</h2>
        <p className="text-muted-foreground">Review and approve teacher registration requests.</p>
      </div>

      {pendingTeachers.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>All teacher registrations have been reviewed.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {pendingTeachers.map((teacher) => (
            <Card key={teacher.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{teacher.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-semibold">
                        {teacher.lastName}, {teacher.firstName} {teacher.middleName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{teacher.email}</p>
                      <div className="flex gap-2 pt-2">
                        <Badge variant="outline">ID/Passport ✓</Badge>
                        <Badge variant="outline">Certification ✓</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproveTeacher(teacher.id)}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectTeacher(teacher.id)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // Approved Teachers section
  const renderApprovedTeachers = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Approved Teachers</h2>
        <p className="text-muted-foreground">Verified teachers on the platform.</p>
      </div>

      {approvedTeachers.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No approved teachers yet.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {approvedTeachers.map((teacher) => (
            <Card key={teacher.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{teacher.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {teacher.lastName}, {teacher.firstName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge>Verified</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Approved {teacher.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // User Management section
  const renderUserManagement = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">Manage all users on the platform.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {[...approvedTeachers, ...students].map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-sm">
                      {user.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {user.lastName}, {user.firstName}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.role === "teacher" ? "default" : "secondary"}>
                    {user.role === "teacher" ? "Teacher" : "Student"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
            {[...approvedTeachers, ...students].length === 0 && (
              <div className="p-6 text-center text-muted-foreground">No users found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Activity Logs section
  const renderActivityLogs = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Activity Logs</h2>
        <p className="text-muted-foreground">System events and user actions.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {activities.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">No activities yet</div>
            ) : (
              activities.map((log) => (
                <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{log.userName}</p>
                      <p className="text-sm text-muted-foreground">{log.description}</p>
                      <Badge variant="outline" className="mt-2">
                        {log.action}
                      </Badge>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{log.timestamp.toLocaleDateString()}</p>
                      <p>{log.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Render based on active view
  switch (activeView) {
    case "pending-teachers":
      return renderPendingTeachers()
    case "approved-teachers":
      return renderApprovedTeachers()
    case "user-management":
      return renderUserManagement()
    case "activity-logs":
      return renderActivityLogs()
    case "overview":
    default:
      return renderOverview()
  }
}
