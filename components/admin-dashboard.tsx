"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  Check,
  X,
  Users,
  Briefcase,
  Clock,
  Activity,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  FileText,
  Calendar,
  Eye,
  Shield,
  Settings,
} from "lucide-react"
import { mockUsers, mockJobs, mockLogs, systemPermissions } from "@/lib/mock-data"

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
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [teacherTab, setTeacherTab] = useState("pending")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false)
  const [userPermissions, setUserPermissions] = useState<string[]>([])

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
      user.approvedAt = new Date()
      loadDashboardData()
      setIsDetailModalOpen(false)
    }
  }

  const handleRejectTeacher = (userId: string) => {
    const key = Object.keys(mockUsers).find((k) => mockUsers[k].id === userId)
    if (key) {
      delete mockUsers[key]
      loadDashboardData()
      setIsDetailModalOpen(false)
    }
  }

  const openTeacherDetail = (teacher: any) => {
    setSelectedTeacher(teacher)
    setIsDetailModalOpen(true)
  }

  const openPermissionsModal = (user: any) => {
    setSelectedUser(user)
    setUserPermissions(user.permissions || [])
    setIsPermissionsModalOpen(true)
  }

  const togglePermission = (permissionId: string) => {
    setUserPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    )
  }

  const savePermissions = () => {
    if (selectedUser) {
      const key = Object.keys(mockUsers).find((k) => mockUsers[k].id === selectedUser.id)
      if (key) {
        mockUsers[key].permissions = userPermissions
      }
      setIsPermissionsModalOpen(false)
      loadDashboardData()
    }
  }

  // Teacher Detail Modal Component
  const TeacherDetailModal = () => {
    if (!selectedTeacher) return null

    const isPending = selectedTeacher.status === "pending"

    return (
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0">
          {/* Fixed Header */}
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {selectedTeacher.firstName?.charAt(0)}{selectedTeacher.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl">
                  {selectedTeacher.lastName}, {selectedTeacher.firstName} {selectedTeacher.middleName}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Badge variant={isPending ? "secondary" : "default"}>
                    {isPending ? "Pending Approval" : "Verified Teacher"}
                  </Badge>
                  <span className="text-sm">
                    Registered {selectedTeacher.createdAt?.toLocaleDateString()}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Contact Information */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contact Information
              </h4>
              <div className="grid gap-3 text-sm bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedTeacher.email}</span>
                </div>
                {selectedTeacher.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedTeacher.phone}</span>
                  </div>
                )}
                {selectedTeacher.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedTeacher.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {selectedTeacher.bio && (
              <div>
                <h4 className="font-semibold mb-3">About</h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                  {selectedTeacher.bio}
                </p>
              </div>
            )}

            {/* Professional Details */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Education & Experience */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Education & Experience
                </h4>
                <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                  {selectedTeacher.education && (
                    <div>
                      <span className="font-medium">Education:</span>
                      <p className="text-muted-foreground">{selectedTeacher.education}</p>
                    </div>
                  )}
                  {selectedTeacher.experience && (
                    <div>
                      <span className="font-medium">Experience:</span>
                      <span className="ml-2 text-muted-foreground">{selectedTeacher.experience}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subjects */}
              {selectedTeacher.subjects && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Subjects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.subjects.map((subject: string, index: number) => (
                      <Badge key={index} variant="outline">{subject}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Certifications */}
            {selectedTeacher.certifications && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacher.certifications.map((cert: string, index: number) => (
                    <Badge key={index} variant="secondary">{cert}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Documents */}
            {selectedTeacher.uploadedIds && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Uploaded Documents
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {Object.entries(selectedTeacher.uploadedIds).map(([key, url]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approval Date for Approved Teachers */}
            {selectedTeacher.approvedAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Approved on {selectedTeacher.approvedAt.toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Fixed Footer - Action Buttons for Pending Teachers */}
          {isPending && (
            <div className="flex gap-3 p-6 border-t bg-background">
              <Button
                className="flex-1"
                onClick={() => handleApproveTeacher(selectedTeacher.id)}
              >
                <Check className="mr-2 h-4 w-4" />
                Approve Teacher
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleRejectTeacher(selectedTeacher.id)}
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
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
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
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

  // Combined Manage Teachers section with tabs
  const renderManageTeachers = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Manage Teachers</h2>
        <p className="text-muted-foreground">Review and manage teacher registrations.</p>
      </div>

      <Tabs value={teacherTab} onValueChange={setTeacherTab}>
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending ({pendingTeachers.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <Check className="h-4 w-4" />
            Approved ({approvedTeachers.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Teachers Tab */}
        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingTeachers.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>All teacher registrations have been reviewed.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {pendingTeachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openTeacherDetail(teacher)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="font-semibold">
                            {teacher.lastName}, {teacher.firstName} {teacher.middleName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{teacher.email}</p>
                          {teacher.subjects && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {teacher.subjects.slice(0, 3).map((subject: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">{subject}</Badge>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground pt-1">
                            Registered {teacher.createdAt?.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="secondary">Pending</Badge>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Approved Teachers Tab */}
        <TabsContent value="approved" className="space-y-4 mt-4">
          {approvedTeachers.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No approved teachers yet.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {approvedTeachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openTeacherDetail(teacher)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {teacher.lastName}, {teacher.firstName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{teacher.email}</p>
                          {teacher.subjects && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {teacher.subjects.slice(0, 3).map((subject: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">{subject}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge>Verified</Badge>
                        <p className="text-xs text-muted-foreground">
                          Approved {teacher.approvedAt?.toLocaleDateString() || teacher.createdAt?.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TeacherDetailModal />
    </div>
  )

  // User Permissions Modal Component
  const UserPermissionsModal = () => {
    if (!selectedUser) return null

    return (
      <Dialog open={isPermissionsModalOpen} onOpenChange={setIsPermissionsModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle>
                  {selectedUser.lastName}, {selectedUser.firstName}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Badge variant={selectedUser.role === "teacher" ? "default" : "secondary"}>
                    {selectedUser.role === "teacher" ? "Teacher" : "Student"}
                  </Badge>
                  <span className="text-sm">{selectedUser.email}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Access Permissions</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Configure what this user can do in the system.
            </p>

            <div className="space-y-4">
              {systemPermissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-start justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1 flex-1 pr-4">
                    <Label
                      htmlFor={permission.id}
                      className="font-medium cursor-pointer"
                    >
                      {permission.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {permission.description}
                    </p>
                  </div>
                  <Switch
                    id={permission.id}
                    checked={userPermissions.includes(permission.id)}
                    onCheckedChange={() => togglePermission(permission.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsPermissionsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={savePermissions}>
              <Check className="mr-2 h-4 w-4" />
              Save Permissions
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // User Management section
  const renderUserManagement = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">Manage all users and their access permissions.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {[...approvedTeachers, ...students].map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm">
                      {user.firstName.charAt(0)}{user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {user.lastName}, {user.firstName}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.permissions && user.permissions.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Shield className="h-3 w-3 text-primary" />
                        <span className="text-xs text-primary">
                          {user.permissions.length} permission{user.permissions.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.role === "teacher" ? "default" : "secondary"}>
                    {user.role === "teacher" ? "Teacher" : "Student"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => openPermissionsModal(user)}
                  >
                    <Settings className="h-3 w-3" />
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

      <UserPermissionsModal />
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
    case "manage-teachers":
      return renderManageTeachers()
    case "user-management":
      return renderUserManagement()
    case "activity-logs":
      return renderActivityLogs()
    case "overview":
    default:
      return renderOverview()
  }
}
