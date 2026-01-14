"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  Check,
  X,
  Users,
  User,
  UserCheck,
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
  MessageSquare,
  Pin,
  ThumbsUp,
  Reply,
  Tag,
  Send,
  Plus,
  Trash2,
  ArrowLeft,
  Heart,
} from "lucide-react"
import { mockUsers, mockJobs, mockLogs, mockApplications, systemPermissions, mockAnnouncements, mockForumThreads, mockThreadReplies } from "@/lib/mock-data"

interface AdminDashboardProps {
  activeView?: string
}

export function AdminDashboard({ activeView = "dashboard" }: AdminDashboardProps) {
  const router = useRouter()
  const [pendingTeachers, setPendingTeachers] = useState<any[]>([])
  const [approvedTeachers, setApprovedTeachers] = useState<any[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalJobs, setTotalJobs] = useState(0)
  const [activities, setActivities] = useState<any[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [teacherTab, setTeacherTab] = useState("pending")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false)
  const [userPermissions, setUserPermissions] = useState<string[]>([])
  const [isJobPostModalOpen, setIsJobPostModalOpen] = useState(false)
  const [isJobDetailModalOpen, setIsJobDetailModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [jobFormData, setJobFormData] = useState({
    title: "",
    school: "",
    subject: "",
    description: "",
    location: "",
    salary: "",
    type: "Full-time",
  })

  // Forum state
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("")
  const [newAnnouncementContent, setNewAnnouncementContent] = useState("")
  const [showNewAnnouncementForm, setShowNewAnnouncementForm] = useState(false)
  const [announcementSuccess, setAnnouncementSuccess] = useState(false)
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)
  const [newReply, setNewReply] = useState("")
  const [replySuccess, setReplySuccess] = useState(false)
  const threadListScrollPos = useRef<number>(0)

  // Scroll to top when thread detail opens
  useEffect(() => {
    if (selectedThread || selectedAnnouncement) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (activeView === 'forum') {
      // Restore scroll position when returning to list
      setTimeout(() => {
        window.scrollTo({ top: threadListScrollPos.current, behavior: 'smooth' })
      }, 0)
    }
  }, [selectedThread, selectedAnnouncement])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    const allUsers = Object.values(mockUsers)
    const pending = allUsers.filter((u: any) => u.role === "teacher" && u.status === "pending")
    const approved = allUsers.filter((u: any) => u.role === "teacher" && u.status === "approved")

    setPendingTeachers(pending)
    setApprovedTeachers(approved)
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

  const handleJobFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setJobFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock job posting
    const newJobId = `job-${Object.keys(mockJobs).length + 1}`
    mockJobs[newJobId] = {
      id: newJobId,
      ...jobFormData,
      status: "active",
      postedDate: new Date(),
      postedBy: "admin-1",
    }
    setIsJobPostModalOpen(false)
    setJobFormData({
      title: "",
      school: "",
      subject: "",
      description: "",
      location: "",
      salary: "",
      type: "Full-time",
    })
    loadDashboardData()
  }

  const openJobDetail = (job: any) => {
    setSelectedJob(job)
    setIsJobDetailModalOpen(true)
  }

  const getJobApplicants = (jobId: string) => {
    return Object.values(mockApplications).filter((app: any) => app.jobId === jobId)
  }

  const handleApproveApplication = (appId: string) => {
    const appKey = Object.keys(mockApplications).find((k) => mockApplications[k].id === appId)
    if (appKey) {
      mockApplications[appKey].status = 'accepted'
      // Refresh the selected job to show updated applicant status
      if (selectedJob) {
        setSelectedJob({ ...selectedJob })
      }
      // Show success notification
      alert('Application approved! The teacher will be notified.')
    }
  }

  const handleRejectApplication = (appId: string) => {
    const appKey = Object.keys(mockApplications).find((k) => mockApplications[k].id === appId)
    if (appKey) {
      mockApplications[appKey].status = 'rejected'
      // Refresh the selected job to show updated applicant status
      if (selectedJob) {
        setSelectedJob({ ...selectedJob })
      }
      // Show rejection notification
      alert('Application rejected.')
    }
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
              {approvedTeachers.length} approved teachers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Job Postings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">Available teaching positions</p>
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
                  <Badge variant="default">
                    Teacher
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
            {approvedTeachers.map((user) => (
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
                  <Badge variant="default">
                    Teacher
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
            {approvedTeachers.length === 0 && (
              <div className="p-6 text-center text-muted-foreground">No teachers found</div>
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

  // Dashboard Overview section
  const renderDashboard = () => {
    const totalTeachers = approvedTeachers.length
    const pendingApprovals = pendingTeachers.length
    const totalJobPostings = Object.values(mockJobs).length
    const activeJobs = Object.values(mockJobs).filter(job => job.status === 'open').length
    const recentActivities = activities.slice(0, 5)

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of platform analytics and activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTeachers}</div>
              <p className="text-xs text-muted-foreground">
                {pendingApprovals} pending approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Postings</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalJobPostings}</div>
              <p className="text-xs text-muted-foreground">
                {activeJobs} currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                All platform users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                Teacher applications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground">Latest system events and user actions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">No recent activity</div>
              ) : (
                recentActivities.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{log.userName}</p>
                      <p className="text-sm text-muted-foreground">{log.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {log.action}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp.toLocaleDateString()} at {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground">Common administrative tasks</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Button 
                variant="outline" 
                className="justify-start gap-2"
                onClick={() => setActiveView('verification')}
              >
                <UserCheck className="h-4 w-4" />
                Review Teachers
              </Button>
              <Button 
                variant="outline" 
                className="justify-start gap-2"
                onClick={() => setActiveView('job-postings')}
              >
                <Briefcase className="h-4 w-4" />
                Post New Job
              </Button>
              <Button 
                variant="outline" 
                className="justify-start gap-2"
                onClick={() => setActiveView('activity-logs')}
              >
                <Activity className="h-4 w-4" />
                View All Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Job Postings section
  const renderJobPostings = () => {
    const jobs = Object.values(mockJobs)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Job Postings</h2>
            <p className="text-muted-foreground">Manage teaching position opportunities.</p>
          </div>
          <Dialog open={isJobPostModalOpen} onOpenChange={setIsJobPostModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Briefcase className="h-4 w-4" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Job Posting</DialogTitle>
                <DialogDescription>
                  Post a new teaching position for qualified teachers to apply.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePostJob} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={jobFormData.title}
                      onChange={handleJobFormChange}
                      placeholder="e.g., High School Mathematics Teacher"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">School/Institution</Label>
                    <Input
                      id="school"
                      name="school"
                      value={jobFormData.school}
                      onChange={handleJobFormChange}
                      placeholder="e.g., Manila Science High School"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={jobFormData.subject}
                      onChange={handleJobFormChange}
                      placeholder="e.g., Mathematics"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={jobFormData.location}
                      onChange={handleJobFormChange}
                      placeholder="e.g., Quezon City, Metro Manila"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input
                      id="salary"
                      name="salary"
                      value={jobFormData.salary}
                      onChange={handleJobFormChange}
                      placeholder="e.g., ₱25,000 - ₱35,000/month"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type</Label>
                    <Input
                      id="type"
                      name="type"
                      value={jobFormData.type}
                      onChange={handleJobFormChange}
                      placeholder="e.g., Full-time, Part-time"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={jobFormData.description}
                    onChange={handleJobFormChange}
                    placeholder="Describe the position, requirements, and responsibilities..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsJobPostModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Post Job
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {jobs.map((job: any) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.school}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {job.jobType}
                      </Badge>
                      <Badge variant="secondary">{job.salary}</Badge>
                      <Badge variant={job.status === "active" ? "default" : "secondary"}>
                        {job.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Posted: {new Date(job.postedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Subject: {job.subject}</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => openJobDetail(job)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Job Detail Modal */}
        <Dialog open={isJobDetailModalOpen} onOpenChange={setIsJobDetailModalOpen}>
          <DialogContent className="max-w-[1400px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedJob?.title}</DialogTitle>
              <DialogDescription>{selectedJob?.school}</DialogDescription>
            </DialogHeader>
            {selectedJob && (
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Subject</p>
                    <p className="font-medium">{selectedJob.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedJob.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="font-medium">{selectedJob.salary}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{selectedJob.jobType}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{selectedJob.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Applicants ({getJobApplicants(selectedJob.id).length})</h3>
                  {getJobApplicants(selectedJob.id).length > 0 ? (
                    <div className="space-y-3">
                      {getJobApplicants(selectedJob.id).map((app: any) => (
                        <Card key={app.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div 
                                className="space-y-2 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => router.push(`/admin/teacher/${app.teacherId}`)}
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback>{app.teacherName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium hover:underline">{app.teacherName}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="bg-muted/50 p-3 rounded-lg">
                                  <p className="text-sm text-muted-foreground mb-1">Application Letter:</p>
                                  <p className="text-sm">{app.coverLetter}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge variant={app.status === 'accepted' ? 'default' : app.status === 'pending' ? 'secondary' : 'destructive'}>
                                  {app.status}
                                </Badge>
                                {app.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleApproveApplication(app.id)
                                      }}
                                      className="gap-1"
                                    >
                                      <Check className="h-3 w-3" />
                                      Approve
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleRejectApplication(app.id)
                                      }}
                                      className="gap-1"
                                    >
                                      <X className="h-3 w-3" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No applicants yet</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  const renderForum = () => {
    const handleCreateAnnouncement = () => {
      if (!newAnnouncementTitle.trim() || !newAnnouncementContent.trim()) {
        return
      }

      const newAnnouncement = {
        id: `announcement-${Date.now()}`,
        title: newAnnouncementTitle,
        content: newAnnouncementContent,
        authorId: "admin-1",
        authorName: "Admin User",
        authorRole: "admin",
        createdAt: new Date().toISOString(),
        isPinned: false,
        views: 0,
        reactions: 0,
      }

      mockAnnouncements.unshift(newAnnouncement)
      setAnnouncementSuccess(true)
      setNewAnnouncementTitle("")
      setNewAnnouncementContent("")
      setShowNewAnnouncementForm(false)

      setTimeout(() => setAnnouncementSuccess(false), 3000)
    }

    const handleTogglePin = (announcementId: string) => {
      const announcement = mockAnnouncements.find(a => a.id === announcementId)
      if (announcement) {
        announcement.isPinned = !announcement.isPinned
        // Re-render by updating state
        setAnnouncementSuccess(true)
        setTimeout(() => setAnnouncementSuccess(false), 100)
      }
    }

    const handleDeleteAnnouncement = (announcementId: string) => {
      const index = mockAnnouncements.findIndex(a => a.id === announcementId)
      if (index > -1) {
        mockAnnouncements.splice(index, 1)
        setAnnouncementSuccess(true)
        setTimeout(() => setAnnouncementSuccess(false), 100)
      }
    }

    const handleDeleteThread = (threadId: string) => {
      const index = mockForumThreads.findIndex(t => t.id === threadId)
      if (index > -1) {
        mockForumThreads.splice(index, 1)
        setAnnouncementSuccess(true)
        setTimeout(() => setAnnouncementSuccess(false), 100)
      }
    }

    const handleThreadClick = (thread: any) => {
      threadListScrollPos.current = window.scrollY
      thread.views += 1
      setSelectedThread(thread)
    }

    const handleAnnouncementClick = (announcement: any) => {
      threadListScrollPos.current = window.scrollY
      announcement.views += 1
      setSelectedAnnouncement(announcement)
    }

    const handleBackToList = () => {
      setSelectedThread(null)
      setSelectedAnnouncement(null)
      setNewReply("")
    }

    const handlePostReply = () => {
      if (!newReply.trim() || !selectedThread) {
        return
      }

      const reply = {
        id: `reply-${selectedThread.id}-${Date.now()}`,
        threadId: selectedThread.id,
        content: newReply,
        authorId: "admin-1",
        authorName: "Admin User",
        createdAt: new Date().toISOString(),
        likes: 0,
      }

      if (!mockThreadReplies[selectedThread.id]) {
        mockThreadReplies[selectedThread.id] = []
      }
      
      mockThreadReplies[selectedThread.id].push(reply)
      selectedThread.replies = mockThreadReplies[selectedThread.id].length
      selectedThread.lastActivity = new Date().toISOString()

      setReplySuccess(true)
      setNewReply("")

      setTimeout(() => setReplySuccess(false), 2000)
    }

    const handleLikeReply = (replyId: string) => {
      const replies = mockThreadReplies[selectedThread?.id] || []
      const reply = replies.find(r => r.id === replyId)
      if (reply) {
        reply.likes = (reply.likes || 0) + 1
        setReplySuccess(true)
        setTimeout(() => setReplySuccess(false), 100)
      }
    }

    const handleDeleteReply = (replyId: string) => {
      if (!selectedThread) return
      
      const replies = mockThreadReplies[selectedThread.id] || []
      const index = replies.findIndex(r => r.id === replyId)
      if (index > -1) {
        replies.splice(index, 1)
        selectedThread.replies = replies.length
        setAnnouncementSuccess(true)
        setTimeout(() => setAnnouncementSuccess(false), 100)
      }
    }

    // Announcement Detail View
    if (selectedAnnouncement) {
      return (
        <div className="p-8 max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={handleBackToList}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forum
          </Button>

          {/* Announcement Post */}
          <Card className={selectedAnnouncement.isPinned ? "border-primary/50 bg-primary/5" : ""}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                    A
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {selectedAnnouncement.isPinned && (
                      <Pin className="h-4 w-4 text-primary fill-primary" />
                    )}
                    <h3 className="font-semibold text-lg">{selectedAnnouncement.authorName}</h3>
                    <Badge className="bg-primary">Admin</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedAnnouncement.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTogglePin(selectedAnnouncement.id)
                      selectedAnnouncement.isPinned = !selectedAnnouncement.isPinned
                      setAnnouncementSuccess(true)
                      setTimeout(() => setAnnouncementSuccess(false), 100)
                    }}
                  >
                    <Pin className={`h-4 w-4 ${selectedAnnouncement.isPinned ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteAnnouncement(selectedAnnouncement.id)
                      handleBackToList()
                    }}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-4">{selectedAnnouncement.title}</h2>
              <p className="text-muted-foreground text-lg mb-6 whitespace-pre-wrap leading-relaxed">
                {selectedAnnouncement.content}
              </p>

              <div className="flex items-center gap-6 pt-4 border-t">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">{selectedAnnouncement.views} views</span>
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{selectedAnnouncement.reactions} reactions</span>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Thread Detail View (like Facebook post view)
    if (selectedThread) {
      const replies = mockThreadReplies[selectedThread.id] || []

      return (
        <div className="p-8 max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={handleBackToList}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forum
          </Button>

          {replySuccess && (
            <Alert className="mb-6 border-green-500 bg-green-50">
              <MessageSquare className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Reply posted successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Thread Post (Main Content) */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                    {selectedThread.authorName.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{selectedThread.authorName}</h3>
                    <Badge variant="outline" className="text-xs">
                      {selectedThread.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedThread.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-3">{selectedThread.title}</h2>
              <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{selectedThread.content}</p>

              {selectedThread.tags && selectedThread.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <Tag className="h-3 w-3 text-muted-foreground" />
                  <div className="flex flex-wrap gap-1">
                    {selectedThread.tags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {selectedThread.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Reply className="h-4 w-4" />
                  {selectedThread.replies} {selectedThread.replies === 1 ? 'reply' : 'replies'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Reply Input (Admin can moderate) */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    A
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Write a reply as admin..."
                    rows={3}
                    className="mb-2"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handlePostReply}
                      disabled={!newReply.trim()}
                      size="sm"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Replies List (like Facebook comments) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
            </h3>
            
            {replies.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                  <p className="text-muted-foreground">No replies yet.</p>
                </CardContent>
              </Card>
            ) : (
              replies.map((reply: any) => (
                <Card key={reply.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {reply.authorName.split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-lg p-3 mb-2">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-sm">{reply.authorName}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteReply(reply.id)
                              }}
                              className="h-auto p-1 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground px-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 hover:text-primary"
                            onClick={() => handleLikeReply(reply.id)}
                          >
                            <Heart className={`h-3 w-3 mr-1 ${reply.likes > 0 ? 'fill-primary text-primary' : ''}`} />
                            {reply.likes > 0 ? `${reply.likes} ${reply.likes === 1 ? 'Like' : 'Likes'}` : 'Like'}
                          </Button>
                          <span>{new Date(reply.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )
    }

    // Forum List View
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Forum Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage announcements and moderate teacher discussions
          </p>
        </div>

        {announcementSuccess && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <MessageSquare className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Action completed successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Announcements Management */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Pin className="h-5 w-5 text-primary" />
              Announcements
            </h2>
            <Button onClick={() => setShowNewAnnouncementForm(!showNewAnnouncementForm)}>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </div>

          {/* New Announcement Form */}
          {showNewAnnouncementForm && (
            <Card className="mb-6 border-primary/50">
              <CardHeader>
                <CardTitle>Create New Announcement</CardTitle>
                <CardDescription>Post an important announcement to all teachers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-title">Title</Label>
                  <Input
                    id="announcement-title"
                    value={newAnnouncementTitle}
                    onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                    placeholder="Announcement title"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="announcement-content">Content</Label>
                  <Textarea
                    id="announcement-content"
                    value={newAnnouncementContent}
                    onChange={(e) => setNewAnnouncementContent(e.target.value)}
                    placeholder="Announcement content..."
                    rows={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateAnnouncement} disabled={!newAnnouncementTitle.trim() || !newAnnouncementContent.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Post Announcement
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowNewAnnouncementForm(false)
                    setNewAnnouncementTitle("")
                    setNewAnnouncementContent("")
                  }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Announcement List */}
          <div className="space-y-3">
            {mockAnnouncements.map((announcement) => (
              <Card 
                key={announcement.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${announcement.isPinned ? "border-primary/50 bg-primary/5" : ""}`}
                onClick={() => handleAnnouncementClick(announcement)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {announcement.isPinned && (
                          <Pin className="h-4 w-4 text-primary fill-primary" />
                        )}
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">{announcement.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-3 line-clamp-2">{announcement.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                              A
                            </AvatarFallback>
                          </Avatar>
                          {announcement.authorName}
                        </span>
                        <span>•</span>
                        <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {announcement.views} views
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {announcement.reactions} reactions
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePin(announcement.id)}
                      >
                        <Pin className={`h-4 w-4 ${announcement.isPinned ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Teacher Threads Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Teacher Discussions ({mockForumThreads.length})
            </h2>
          </div>

          {/* Thread List */}
          <div className="space-y-3">
            {mockForumThreads.map((thread) => (
              <Card key={thread.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleThreadClick(thread)}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {thread.authorName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div onClick={(e) => e.stopPropagation()} className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">{thread.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span className="font-medium">{thread.authorName}</span>
                            <span>•</span>
                            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {thread.category}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteThread(thread.id)
                          }}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-muted-foreground mb-3 line-clamp-2">{thread.content}</p>
                      
                      {thread.tags && thread.tags.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {thread.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {thread.views} views
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Reply className="h-3 w-3" />
                          {thread.replies} replies
                        </span>
                        <span>•</span>
                        <span className="text-xs">
                          Last activity: {new Date(thread.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render based on active view
  switch (activeView) {
    case "dashboard":
      return renderDashboard()
    case "verification":
      return renderManageTeachers()
    case "activity-logs":
      return renderActivityLogs()
    case "forum":
      return renderForum()
    case "job-postings":
    default:
      return renderJobPostings()
  }
}
