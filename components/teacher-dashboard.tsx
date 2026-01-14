"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Briefcase, Users, TrendingUp, AlertCircle, MoreHorizontal, MapPin, Clock, PlusCircle, Phone, Mail, GraduationCap, Award, Save, X, Plus } from "lucide-react"
import { mockJobs, mockApplications, mockTutorRequests, mockUsers } from "@/lib/mock-data"
import { useAuth } from "./auth-context"

interface TeacherDashboardProps {
    activeView?: string
}

export function TeacherDashboard({ activeView = "dashboard" }: TeacherDashboardProps) {
    const { user } = useAuth()
    const [jobs, setJobs] = useState<any[]>([])
    const [applications, setApplications] = useState<any[]>([])
    const [tutorRequests, setTutorRequests] = useState<any[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requirements: "",
        salaryRange: "",
        location: "",
        jobType: "full-time",
    })
    const [formError, setFormError] = useState("")
    const [formLoading, setFormLoading] = useState(false)
    const [formSuccess, setFormSuccess] = useState(false)

    // Profile editing state
    const [profileData, setProfileData] = useState({
        phone: "",
        address: "",
        bio: "",
        subjects: [] as string[],
        experience: "",
        education: "",
        certifications: [] as string[],
    })
    const [newSubject, setNewSubject] = useState("")
    const [newCertification, setNewCertification] = useState("")
    const [profileLoading, setProfileLoading] = useState(false)
    const [profileSuccess, setProfileSuccess] = useState(false)

    useEffect(() => {
        if (user?.id) {
            const teacherJobs = Object.values(mockJobs).filter((job: any) => job.teacherId === user.id)
            setJobs(teacherJobs)

            const allApplications = Object.values(mockApplications).filter((app: any) =>
                teacherJobs.some((job: any) => job.id === app.jobId)
            )
            setApplications(allApplications)

            const activeRequests = Object.values(mockTutorRequests).filter((req: any) => req.status === "active")
            setTutorRequests(activeRequests)

            // Load profile data
            const userKey = Object.keys(mockUsers).find((k) => mockUsers[k].id === user.id)
            if (userKey) {
                const userData = mockUsers[userKey]
                setProfileData({
                    phone: userData.phone || "",
                    address: userData.address || "",
                    bio: userData.bio || "",
                    subjects: userData.subjects || [],
                    experience: userData.experience || "",
                    education: userData.education || "",
                    certifications: userData.certifications || [],
                })
            }
        }
    }, [user])

    const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants || 0), 0)
    const activeJobs = jobs.filter((job) => job.status === "active").length

    // Profile handlers
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProfileData((prev) => ({ ...prev, [name]: value }))
    }

    const addSubject = () => {
        if (newSubject.trim() && !profileData.subjects.includes(newSubject.trim())) {
            setProfileData((prev) => ({
                ...prev,
                subjects: [...prev.subjects, newSubject.trim()],
            }))
            setNewSubject("")
        }
    }

    const removeSubject = (subject: string) => {
        setProfileData((prev) => ({
            ...prev,
            subjects: prev.subjects.filter((s) => s !== subject),
        }))
    }

    const addCertification = () => {
        if (newCertification.trim() && !profileData.certifications.includes(newCertification.trim())) {
            setProfileData((prev) => ({
                ...prev,
                certifications: [...prev.certifications, newCertification.trim()],
            }))
            setNewCertification("")
        }
    }

    const removeCertification = (cert: string) => {
        setProfileData((prev) => ({
            ...prev,
            certifications: prev.certifications.filter((c) => c !== cert),
        }))
    }

    const saveProfile = () => {
        setProfileLoading(true)
        // Simulate API call
        setTimeout(() => {
            const userKey = Object.keys(mockUsers).find((k) => mockUsers[k].id === user?.id)
            if (userKey) {
                mockUsers[userKey] = {
                    ...mockUsers[userKey],
                    ...profileData,
                }
            }
            setProfileLoading(false)
            setProfileSuccess(true)
            setTimeout(() => setProfileSuccess(false), 2000)
        }, 500)
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            requirements: "",
            salaryRange: "",
            location: "",
            jobType: "full-time",
        })
        setFormError("")
        setFormSuccess(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError("")
        setFormLoading(true)
        setFormSuccess(false)

        try {
            const response = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, teacherId: user?.id }),
            })

            if (!response.ok) {
                const data = await response.json()
                setFormError(data.error || "Failed to post service")
                return
            }

            resetForm()
            setFormSuccess(true)
            setTimeout(() => {
                setIsDialogOpen(false)
                setFormSuccess(false)
            }, 1500)
        } catch {
            setFormError("Failed to post service. Please try again.")
        } finally {
            setFormLoading(false)
        }
    }

    // Post Service Dialog
    const PostServiceDialog = () => (
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Post New Service
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Post a New Service</DialogTitle>
                    <DialogDescription>
                        Create a new tutoring service for students to book.
                    </DialogDescription>
                </DialogHeader>

                {formError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                )}

                {formSuccess && (
                    <Alert>
                        <AlertDescription>Service posted successfully!</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Service Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            placeholder="e.g., Mathematics Tutoring - Grade 10-12"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            placeholder="Describe your tutoring service..."
                            className="min-h-[100px]"
                            required
                        />
                    </div>

                    <div className="grid gap-4 grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleFormChange}
                                placeholder="e.g., Remote, Manila"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="salaryRange">Rate</Label>
                            <Input
                                id="salaryRange"
                                name="salaryRange"
                                value={formData.salaryRange}
                                onChange={handleFormChange}
                                placeholder="e.g., 500-800 PHP/hour"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Service Type</Label>
                        <Select
                            value={formData.jobType}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, jobType: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full-time">Full-time</SelectItem>
                                <SelectItem value="part-time">Part-time</SelectItem>
                                <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={formLoading}>
                            {formLoading ? "Posting..." : "Post Service"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )

    // Dashboard Overview
    const renderDashboard = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Welcome back, {user?.firstName}. Here's your overview.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{jobs.length}</div>
                        <p className="text-xs text-muted-foreground">{activeJobs} active</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalApplicants}</div>
                        <p className="text-xs text-muted-foreground">Across all services</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Student Requests</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tutorRequests.length}</div>
                        <p className="text-xs text-muted-foreground">Students seeking help</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Services</CardTitle>
                    <CardDescription>Your recently posted tutoring services</CardDescription>
                </CardHeader>
                <CardContent>
                    {jobs.length > 0 ? (
                        <div className="space-y-4">
                            {jobs.slice(0, 3).map((job) => (
                                <div key={job.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="font-medium">{job.title}</p>
                                        <p className="text-sm text-muted-foreground">{job.location}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant={job.status === "active" ? "default" : "secondary"}>
                                            {job.status}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">{job.applicants} bookings</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No services posted yet</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )

    // My Services List (with Post Dialog)
    const renderMyJobs = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">My Services</h2>
                    <p className="text-muted-foreground">Manage your tutoring services.</p>
                </div>
                <PostServiceDialog />
            </div>

            {jobs.length > 0 ? (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <Card key={job.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg">{job.title}</h3>
                                            <Badge variant={job.status === "active" ? "default" : "secondary"}>
                                                {job.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{job.location}</p>
                                        <p className="text-sm">{job.description}</p>
                                        <div className="flex items-center gap-4 pt-2">
                                            <span className="text-sm font-medium">{job.salary}</span>
                                            <span className="text-sm text-muted-foreground">•</span>
                                            <span className="text-sm text-muted-foreground">{job.applicants} bookings</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground mb-4">You haven't posted any services yet.</p>
                        <PostServiceDialog />
                    </CardContent>
                </Card>
            )}
        </div>
    )

    // Student Bookings View
    const renderApplicants = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Student Bookings</h2>
                <p className="text-muted-foreground">Review students who want to be tutored by you.</p>
            </div>

            {applications.length > 0 ? (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <Card key={app.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>{app.studentName?.charAt(0) || "S"}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h3 className="font-semibold">{app.studentName || "Student"}</h3>
                                            <p className="text-sm text-muted-foreground">Requested: {app.jobTitle}</p>
                                            <p className="text-sm mt-2">{app.coverLetter}</p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Requested on {app.createdAt?.toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            app.status === "accepted"
                                                ? "default"
                                                : app.status === "rejected"
                                                    ? "destructive"
                                                    : "secondary"
                                        }
                                    >
                                        {app.status}
                                    </Badge>
                                </div>
                                <div className="flex gap-2 mt-4 pt-4 border-t">
                                    <Button size="sm">Accept</Button>
                                    <Button size="sm" variant="outline">Reject</Button>
                                    <Button size="sm" variant="ghost">Message</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No booking requests received yet.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )

    // Student Requests View
    const renderTutorRequests = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Student Requests</h2>
                <p className="text-muted-foreground">Browse students looking for tutors in your subjects.</p>
            </div>

            {tutorRequests.length > 0 ? (
                <div className="space-y-4">
                    {tutorRequests.map((request) => (
                        <Card key={request.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>{request.studentName?.charAt(0) || "S"}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-lg">{request.subject} Tutor Needed</h3>
                                                <Badge variant="secondary">{request.gradeLevel}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Posted by {request.studentName}</p>
                                            <p className="text-sm">{request.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {request.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {request.schedule}
                                                </span>
                                                <span className="font-medium text-foreground">{request.budget}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button>Offer to Tutor</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No student requests at the moment.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )

    // My Profile section
    const renderMyProfile = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">My Profile</h2>
                    <p className="text-muted-foreground">Update your professional information.</p>
                </div>
                <Button onClick={saveProfile} disabled={profileLoading} className="gap-2">
                    <Save className="h-4 w-4" />
                    {profileLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            {profileSuccess && (
                <Alert>
                    <AlertDescription>Profile updated successfully!</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6">
                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            Contact Information
                        </CardTitle>
                        <CardDescription>Your contact details visible to students</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    placeholder="+63 9XX XXX XXXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                value={profileData.address}
                                onChange={handleProfileChange}
                                placeholder="City, Region"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* About */}
                <Card>
                    <CardHeader>
                        <CardTitle>About Me</CardTitle>
                        <CardDescription>Tell students about yourself and your teaching style</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            name="bio"
                            value={profileData.bio}
                            onChange={handleProfileChange}
                            placeholder="Write a brief introduction about yourself, your teaching experience, and what makes you a great tutor..."
                            className="min-h-[120px]"
                        />
                    </CardContent>
                </Card>

                {/* Education & Experience */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            Education & Experience
                        </CardTitle>
                        <CardDescription>Your qualifications and teaching experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="education">Education</Label>
                            <Input
                                id="education"
                                name="education"
                                value={profileData.education}
                                onChange={handleProfileChange}
                                placeholder="e.g., Bachelor of Science in Mathematics, University Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input
                                id="experience"
                                name="experience"
                                value={profileData.experience}
                                onChange={handleProfileChange}
                                placeholder="e.g., 5 years"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Subjects */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            Subjects I Teach
                        </CardTitle>
                        <CardDescription>Add the subjects you specialize in</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                                placeholder="Add a subject..."
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubject())}
                            />
                            <Button type="button" onClick={addSubject} variant="outline">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profileData.subjects.map((subject, index) => (
                                <Badge key={index} variant="secondary" className="gap-1 pr-1">
                                    {subject}
                                    <button
                                        onClick={() => removeSubject(subject)}
                                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            {profileData.subjects.length === 0 && (
                                <p className="text-sm text-muted-foreground">No subjects added yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Certifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Certifications
                        </CardTitle>
                        <CardDescription>Add your teaching certifications and licenses</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                value={newCertification}
                                onChange={(e) => setNewCertification(e.target.value)}
                                placeholder="Add a certification..."
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                            />
                            <Button type="button" onClick={addCertification} variant="outline">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profileData.certifications.map((cert, index) => (
                                <Badge key={index} variant="outline" className="gap-1 pr-1">
                                    {cert}
                                    <button
                                        onClick={() => removeCertification(cert)}
                                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            {profileData.certifications.length === 0 && (
                                <p className="text-sm text-muted-foreground">No certifications added yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )

    // Render based on active view
    switch (activeView) {
        case "my-profile":
            return renderMyProfile()
        case "my-jobs":
            return renderMyJobs()
        case "applicants":
            return renderApplicants()
        case "tutor-requests":
            return renderTutorRequests()
        case "dashboard":
        default:
            return renderDashboard()
    }
}
