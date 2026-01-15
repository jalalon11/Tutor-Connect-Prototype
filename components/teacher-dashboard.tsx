"use client"

import { useState, useEffect, useRef } from "react"
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
import { Briefcase, Users, TrendingUp, AlertCircle, MoreHorizontal, MapPin, Clock, PlusCircle, Phone, Mail, GraduationCap, Award, Save, X, Plus, Send, MessageSquare, Pin, Eye, ThumbsUp, Reply, Tag, ArrowLeft, Heart } from "lucide-react"
import { mockJobs, mockApplications, mockUsers, mockAnnouncements, mockForumThreads, mockThreadReplies } from "@/lib/mock-data"
import { useAuth } from "./auth-context"

interface TeacherDashboardProps {
    activeView?: string
}

export function TeacherDashboard({ activeView = "dashboard" }: TeacherDashboardProps) {
    const { user } = useAuth()
    const [availableJobs, setAvailableJobs] = useState<any[]>([])
    const [myApplications, setMyApplications] = useState<any[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedJob, setSelectedJob] = useState<any>(null)
    const [coverLetter, setCoverLetter] = useState("")
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

    // Forum state
    const [newThreadTitle, setNewThreadTitle] = useState("")
    const [newThreadContent, setNewThreadContent] = useState("")
    const [newThreadCategory, setNewThreadCategory] = useState("Discussion")
    const [newThreadTags, setNewThreadTags] = useState("")
    const [showNewThreadForm, setShowNewThreadForm] = useState(false)
    const [threadSuccess, setThreadSuccess] = useState(false)
    const [selectedThread, setSelectedThread] = useState<any>(null)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)
    const [newReply, setNewReply] = useState("")
    const [replySuccess, setReplySuccess] = useState(false)
    const threadListScrollPos = useRef<number>(0)

    // Scroll to top when thread detail opens
    useEffect(() => {
        if (selectedThread || selectedAnnouncement) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            // Restore scroll position when returning to list
            setTimeout(() => {
                window.scrollTo({ top: threadListScrollPos.current, behavior: 'smooth' })
            }, 0)
        }
    }, [selectedThread, selectedAnnouncement])

    useEffect(() => {
        if (user?.id) {
            // Get all active jobs posted by admin
            const activeJobs = Object.values(mockJobs).filter((job: any) => job.status === "open")
            setAvailableJobs(activeJobs)

            // Get my applications
            const myApps = Object.values(mockApplications).filter((app: any) => app.teacherId === user.id)
            setMyApplications(myApps)

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

    const pendingApplications = myApplications.filter((app) => app.status === "pending").length
    const acceptedApplications = myApplications.filter((app) => app.status === "accepted").length

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

    const handleSaveProfile = () => {
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

    const handleApply = (job: any) => {
        setSelectedJob(job)
        setCoverLetter("")
        setFormError("")
        setFormSuccess(false)
        setIsDialogOpen(true)
    }

    const resetForm = () => {
        setCoverLetter("")
        setFormError("")
        setFormSuccess(false)
        setSelectedJob(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError("")
        setFormLoading(true)
        setFormSuccess(false)

        try {
            // Simulate API call
            setTimeout(() => {
                setFormSuccess(true)
                setFormLoading(false)
                setTimeout(() => {
                    setIsDialogOpen(false)
                    resetForm()
                }, 1500)
            }, 1000)
        } catch {
            setFormError("Failed to submit application. Please try again.")
            setFormLoading(false)
        }
    }

    // Apply to Job Dialog
    const ApplyToJobDialog = () => (
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Apply for Position</DialogTitle>
                    <DialogDescription>
                        {selectedJob?.title}
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
                        <AlertDescription>Application submitted successfully!</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="coverLetter">Cover Letter</Label>
                        <Textarea
                            id="coverLetter"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Tell us why you're a great fit for this position..."
                            className="min-h-[150px]"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={formLoading}>
                            {formLoading ? "Submitting..." : "Submit Application"}
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

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{availableJobs.length}</div>
                        <p className="text-xs text-muted-foreground">Active positions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Applications</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{myApplications.length}</div>
                        <p className="text-xs text-muted-foreground">{pendingApplications} pending</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{acceptedApplications}</div>
                        <p className="text-xs text-muted-foreground">Applications approved</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Job Postings</CardTitle>
                    <CardDescription>Latest teaching positions available</CardDescription>
                </CardHeader>
                <CardContent>
                    {availableJobs.length > 0 ? (
                        <div className="space-y-4">
                            {availableJobs.slice(0, 3).map((job) => (
                                <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <p className="font-medium truncate">{job.title}</p>
                                        <p className="text-sm text-muted-foreground truncate">{job.location}</p>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Badge variant="default" className="text-xs">
                                            {job.jobType}
                                        </Badge>
                                        <Button size="sm" onClick={() => handleApply(job)}>
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No job postings available</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )

    // Available Jobs List
    const renderMyJobs = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Available Positions</h2>
                    <p className="text-muted-foreground">Browse and apply to teaching positions.</p>
                </div>
            </div>

            {availableJobs.length > 0 ? (
                <div className="space-y-4">
                    {availableJobs.map((job) => (
                        <Card key={job.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg">{job.title}</h3>
                                            <Badge variant={job.status === "open" ? "default" : "secondary"}>
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

    // My Applications
    const renderApplicants = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">My Applications</h2>
                <p className="text-muted-foreground">Track your job applications and their status.</p>
            </div>

            {myApplications.length > 0 ? (
                <div className="space-y-4">
                    {myApplications.map((app) => (
                        <Card key={app.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg">{app.jobTitle}</h3>
                                            <Badge variant={
                                                app.status === "accepted" ? "default" :
                                                    app.status === "rejected" ? "destructive" :
                                                        "secondary"
                                            }>
                                                {app.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                        </p>
                                        {app.coverLetter && (
                                            <p className="text-sm mt-2 italic">
                                                "{app.coverLetter.substring(0, 150)}{app.coverLetter.length > 150 ? '...' : ''}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">You haven't applied to any jobs yet.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )

    // Remove Student Requests View - no longer needed
    const renderTutorRequests = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Explore More</h2>
                <p className="text-muted-foreground">Check the Available Positions tab to apply for jobs.</p>
            </div>
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">This feature is no longer available.</p>
                </CardContent>
            </Card>
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

    // Settings/Profile View
    const renderSettings = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Profile Settings</h2>
                    <p className="text-muted-foreground">Manage your profile information and preferences.</p>
                </div>
                <Button onClick={handleSaveProfile} disabled={profileLoading} className="gap-2">
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
                        <CardDescription>Your contact details visible to administrators</CardDescription>
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
                        <CardDescription>Tell administrators about yourself and your teaching experience</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            name="bio"
                            value={profileData.bio}
                            onChange={handleProfileChange}
                            placeholder="Write a brief introduction about yourself, your teaching experience, and what makes you a great teacher..."
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

    // Browse Jobs View
    const renderBrowseJobs = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Browse Job Opportunities</h2>
                <p className="text-muted-foreground">Explore teaching positions and apply with your application letter.</p>
            </div>

            <div className="space-y-4">
                {availableJobs.length > 0 ? (
                    availableJobs.map((job) => (
                        <Card key={job.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-3">
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
                                        </div>

                                        <div className="text-sm text-muted-foreground">
                                            Posted {new Date(job.postedAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <Button onClick={() => handleApply(job)} className="gap-2">
                                        <Send className="h-4 w-4" />
                                        Apply Now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="font-medium">No jobs available</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Check back later for new teaching positions
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )

    // My Applications View
    const renderMyApplications = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">My Applications</h2>
                <p className="text-muted-foreground">Track the status of your job applications.</p>
            </div>

            <div className="space-y-4">
                {myApplications.length > 0 ? (
                    myApplications.map((application) => {
                        const job = availableJobs.find(j => j.id === application.jobId) || {}
                        return (
                            <Card key={application.id}>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <Briefcase className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{job.title || 'Position'}</h3>
                                                    <p className="text-sm text-muted-foreground">{job.school || 'School'}</p>
                                                </div>
                                            </div>
                                            <Badge variant={
                                                application.status === 'accepted' ? 'default' :
                                                    application.status === 'pending' ? 'secondary' :
                                                        'destructive'
                                            }>
                                                {application.status}
                                            </Badge>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Application Letter:</p>
                                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                                {application.coverLetter}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                                            {job.location && (
                                                <>
                                                    <span>•</span>
                                                    <span>{job.location}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="font-medium">No applications yet</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Browse available jobs and submit your application
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )

    const renderForum = () => {
        const handleCreateThread = () => {
            if (!newThreadTitle.trim() || !newThreadContent.trim()) {
                return
            }

            const newThread = {
                id: `thread-${Date.now()}`,
                title: newThreadTitle,
                content: newThreadContent,
                authorId: user?.id || "",
                authorName: `${user?.firstName} ${user?.lastName}`,
                category: newThreadCategory,
                createdAt: new Date().toISOString(),
                views: 0,
                replies: 0,
                lastActivity: new Date().toISOString(),
                tags: newThreadTags.split(",").map(t => t.trim()).filter(t => t),
            }

            mockForumThreads.unshift(newThread)
            mockThreadReplies[newThread.id] = []
            setThreadSuccess(true)
            setNewThreadTitle("")
            setNewThreadContent("")
            setNewThreadTags("")
            setShowNewThreadForm(false)

            setTimeout(() => setThreadSuccess(false), 3000)
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
                authorId: user?.id || "",
                authorName: `${user?.firstName} ${user?.lastName}`,
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

        // Announcement Detail View
        if (selectedAnnouncement) {
            return (
                <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
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
                        <CardContent className="p-4 sm:p-6 md:p-8">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                                        A
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
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
                            </div>

                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">{selectedAnnouncement.title}</h2>
                            <p className="text-muted-foreground text-base sm:text-lg mb-4 sm:mb-6 whitespace-pre-wrap leading-relaxed">
                                {selectedAnnouncement.content}
                            </p>

                            <div className="flex items-center gap-4 sm:gap-6 pt-4 border-t flex-wrap">
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

                    {/* Info Note */}
                    <Alert className="mt-6">
                        <Pin className="h-4 w-4" />
                        <AlertDescription>
                            This is an official announcement from the administration team. Please read carefully and follow any instructions provided.
                        </AlertDescription>
                    </Alert>
                </div>
            )
        }

        // Thread Detail View (like Facebook post view)
        if (selectedThread) {
            const replies = mockThreadReplies[selectedThread.id] || []

            return (
                <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
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
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4">
                                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
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

                            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{selectedThread.title}</h2>
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

                    {/* Reply Input (like Facebook comment box) */}
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Textarea
                                        value={newReply}
                                        onChange={(e) => setNewReply(e.target.value)}
                                        placeholder="Write a reply..."
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
                                    <p className="text-muted-foreground">No replies yet. Be the first to reply!</p>
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
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-sm">{reply.authorName}</span>
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
            <div className="p-4 sm:p-6 md:p-8 w-full max-w-full overflow-hidden">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">Community Forum</h1>
                    <p className="text-muted-foreground mt-2">
                        Connect with fellow teachers, share experiences, and stay updated
                    </p>
                </div>

                {threadSuccess && (
                    <Alert className="mb-6 border-green-500 bg-green-50">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Your thread has been posted successfully!
                        </AlertDescription>
                    </Alert>
                )}

                {/* Announcements Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Pin className="h-5 w-5 text-primary" />
                            Announcements from Admin
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {mockAnnouncements.map((announcement) => (
                            <Card
                                key={announcement.id}
                                className={`cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${announcement.isPinned ? "border-primary/50 bg-primary/5" : ""}`}
                                onClick={() => handleAnnouncementClick(announcement)}
                            >
                                <CardContent className="p-4 sm:p-6 overflow-hidden">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <div className="flex items-center gap-2 mb-2">
                                                {announcement.isPinned && (
                                                    <Pin className="h-4 w-4 text-primary fill-primary" />
                                                )}
                                                <h3 className="font-semibold text-base sm:text-lg hover:text-primary transition-colors line-clamp-1">{announcement.title}</h3>
                                            </div>
                                            <p className="text-muted-foreground mb-3 line-clamp-2 break-words">{announcement.content}</p>
                                            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
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
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Teacher Threads Section */}
                <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Teacher Discussions
                        </h2>
                        <Button onClick={() => setShowNewThreadForm(!showNewThreadForm)} size="sm" className="w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            New Thread
                        </Button>
                    </div>

                    {/* New Thread Form */}
                    {showNewThreadForm && (
                        <Card className="mb-6 border-primary/50">
                            <CardHeader>
                                <CardTitle>Create New Thread</CardTitle>
                                <CardDescription>Start a discussion with fellow teachers</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="thread-title">Title</Label>
                                    <Input
                                        id="thread-title"
                                        value={newThreadTitle}
                                        onChange={(e) => setNewThreadTitle(e.target.value)}
                                        placeholder="What's your thread about?"
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="thread-category">Category</Label>
                                    <Select value={newThreadCategory} onValueChange={setNewThreadCategory}>
                                        <SelectTrigger className="h-11">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Discussion">Discussion</SelectItem>
                                            <SelectItem value="Question">Question</SelectItem>
                                            <SelectItem value="Resources">Resources</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="thread-content">Content</Label>
                                    <Textarea
                                        id="thread-content"
                                        value={newThreadContent}
                                        onChange={(e) => setNewThreadContent(e.target.value)}
                                        placeholder="Share your thoughts, questions, or resources..."
                                        rows={6}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="thread-tags">Tags (comma-separated)</Label>
                                    <Input
                                        id="thread-tags"
                                        value={newThreadTags}
                                        onChange={(e) => setNewThreadTags(e.target.value)}
                                        placeholder="e.g. mathematics, teaching-tips, resources"
                                        className="h-11"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={handleCreateThread} disabled={!newThreadTitle.trim() || !newThreadContent.trim()}>
                                        <Send className="h-4 w-4 mr-2" />
                                        Post Thread
                                    </Button>
                                    <Button variant="outline" onClick={() => {
                                        setShowNewThreadForm(false)
                                        setNewThreadTitle("")
                                        setNewThreadContent("")
                                        setNewThreadTags("")
                                    }}>
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Thread List */}
                    <div className="space-y-3">
                        {mockForumThreads.map((thread) => (
                            <Card
                                key={thread.id}
                                className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                                onClick={() => handleThreadClick(thread)}
                            >
                                <CardContent className="p-4 sm:p-6 overflow-hidden">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                {thread.authorName.split(" ").map(n => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-base sm:text-lg mb-1 hover:text-primary transition-colors line-clamp-1">{thread.title}</h3>
                                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2 flex-wrap">
                                                        <span className="font-medium">{thread.authorName}</span>
                                                        <span>•</span>
                                                        <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {thread.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground mb-3 line-clamp-2 break-words">{thread.content}</p>

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

                                            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
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
    const renderContent = () => {
        switch (activeView) {
            case "my-applications":
                return renderMyApplications()
            case "settings":
                return renderSettings()
            case "forum":
                return renderForum()
            case "browse-jobs":
            default:
                return renderBrowseJobs()
        }
    }

    return (
        <>
            {renderContent()}
            <ApplyToJobDialog />
        </>
    )
}
