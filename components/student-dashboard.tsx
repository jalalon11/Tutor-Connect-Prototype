"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, FileText, Clock, BookmarkIcon, AlertCircle, PlusCircle } from "lucide-react"
import { mockJobs, mockApplications, mockTutorRequests } from "@/lib/mock-data"
import { useAuth } from "./auth-context"

interface StudentDashboardProps {
    activeView?: string
}

export function StudentDashboard({ activeView = "dashboard" }: StudentDashboardProps) {
    const { user } = useAuth()
    const [jobs, setJobs] = useState<any[]>([])
    const [applications, setApplications] = useState<any[]>([])
    const [savedJobs, setSavedJobs] = useState<string[]>([])
    const [myRequests, setMyRequests] = useState<any[]>([])
    const [requestForm, setRequestForm] = useState({
        subject: "",
        gradeLevel: "",
        description: "",
        budget: "",
        schedule: "",
        location: "",
    })
    const [formSuccess, setFormSuccess] = useState(false)

    useEffect(() => {
        if (user?.id) {
            setJobs(Object.values(mockJobs).filter((job: any) => job.status === "active"))
            const studentApps = Object.values(mockApplications).filter((app: any) => app.studentId === user.id)
            setApplications(studentApps)
            const studentRequests = Object.values(mockTutorRequests).filter((req: any) => req.studentId === user.id)
            setMyRequests(studentRequests)
        }
    }, [user])

    const pendingApps = applications.filter((app) => app.status === "pending").length
    const acceptedApps = applications.filter((app) => app.status === "accepted").length

    const toggleSaveJob = (jobId: string) => {
        setSavedJobs((prev) =>
            prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
        )
    }

    const handleRequestSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock submission - just show success
        setFormSuccess(true)
        setRequestForm({
            subject: "",
            gradeLevel: "",
            description: "",
            budget: "",
            schedule: "",
            location: "",
        })
        setTimeout(() => setFormSuccess(false), 3000)
    }

    // Dashboard Overview
    const renderDashboard = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Welcome back, {user?.firstName}. Find your next opportunity.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{jobs.length}</div>
                        <p className="text-xs text-muted-foreground">Open positions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Applications</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{applications.length}</div>
                        <p className="text-xs text-muted-foreground">Submitted</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingApps}</div>
                        <p className="text-xs text-muted-foreground">Awaiting response</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{acceptedApps}</div>
                        <p className="text-xs text-muted-foreground">Offers received</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Jobs */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Opportunities</CardTitle>
                    <CardDescription>Latest job postings from educators</CardDescription>
                </CardHeader>
                <CardContent>
                    {jobs.length > 0 ? (
                        <div className="space-y-4">
                            {jobs.slice(0, 3).map((job) => (
                                <div key={job.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="font-medium">{job.title}</p>
                                        <p className="text-sm text-muted-foreground">{job.teacherName} • {job.location}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{job.salary}</span>
                                        <Button size="sm">Apply</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No jobs available</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )

    // Browse Jobs
    const renderBrowseJobs = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Browse Jobs</h2>
                <p className="text-muted-foreground">Explore available opportunities from educators.</p>
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
                                            <Badge>Active</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Posted by {job.teacherName}</p>
                                        <p className="text-sm text-muted-foreground">{job.location}</p>
                                        <p className="text-sm mt-2">{job.description}</p>
                                        <p className="text-sm font-medium mt-2">{job.salary}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button>Apply Now</Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => toggleSaveJob(job.id)}
                                        >
                                            <BookmarkIcon
                                                className={`h-4 w-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`}
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No jobs available at the moment.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )

    // My Applications
    const renderApplications = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">My Applications</h2>
                <p className="text-muted-foreground">Track your job applications.</p>
            </div>

            {applications.length > 0 ? (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <Card key={app.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>{app.jobTitle?.charAt(0) || "J"}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h3 className="font-semibold">{app.jobTitle}</h3>
                                            <p className="text-sm text-muted-foreground">{app.coverLetter}</p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Applied on {app.createdAt?.toLocaleDateString()}
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
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">You haven't applied to any jobs yet.</p>
                        <Button className="mt-4">Browse Jobs</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )

    // Saved Jobs
    const renderSavedJobs = () => {
        const saved = jobs.filter((job) => savedJobs.includes(job.id))

        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Saved Jobs</h2>
                    <p className="text-muted-foreground">Jobs you've bookmarked for later.</p>
                </div>

                {saved.length > 0 ? (
                    <div className="space-y-4">
                        {saved.map((job) => (
                            <Card key={job.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg">{job.title}</h3>
                                            <p className="text-sm text-muted-foreground">{job.teacherName} • {job.location}</p>
                                            <p className="text-sm font-medium">{job.salary}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button>Apply</Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => toggleSaveJob(job.id)}
                                            >
                                                <BookmarkIcon className="h-4 w-4 fill-current" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p className="text-muted-foreground">No saved jobs yet. Browse jobs to save some for later.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        )
    }

    // Post Tutor Request Form
    const renderPostRequest = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Post Tutor Request</h2>
                <p className="text-muted-foreground">Let teachers know you need help with a subject.</p>
            </div>

            <Card>
                <CardContent className="p-6">
                    {formSuccess && (
                        <Alert className="mb-6">
                            <AlertDescription>Your tutor request has been posted successfully!</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleRequestSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={requestForm.subject}
                                    onChange={(e) => setRequestForm((prev) => ({ ...prev, subject: e.target.value }))}
                                    placeholder="e.g., Mathematics, Physics, English"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Grade Level</Label>
                                <Select
                                    value={requestForm.gradeLevel}
                                    onValueChange={(value) => setRequestForm((prev) => ({ ...prev, gradeLevel: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select grade level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="elementary">Elementary</SelectItem>
                                        <SelectItem value="high-school">High School</SelectItem>
                                        <SelectItem value="grade-10">Grade 10</SelectItem>
                                        <SelectItem value="grade-11">Grade 11</SelectItem>
                                        <SelectItem value="grade-12">Grade 12</SelectItem>
                                        <SelectItem value="college">College</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">What do you need help with?</Label>
                            <Textarea
                                id="description"
                                value={requestForm.description}
                                onChange={(e) => setRequestForm((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe what topics or areas you need help with..."
                                className="min-h-[100px]"
                                required
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Budget</Label>
                                <Input
                                    id="budget"
                                    value={requestForm.budget}
                                    onChange={(e) => setRequestForm((prev) => ({ ...prev, budget: e.target.value }))}
                                    placeholder="e.g., 300-500 PHP/hour"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="schedule">Preferred Schedule</Label>
                                <Input
                                    id="schedule"
                                    value={requestForm.schedule}
                                    onChange={(e) => setRequestForm((prev) => ({ ...prev, schedule: e.target.value }))}
                                    placeholder="e.g., Weekends, 2-4 PM"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={requestForm.location}
                                    onChange={(e) => setRequestForm((prev) => ({ ...prev, location: e.target.value }))}
                                    placeholder="e.g., Online, Manila"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Post Tutor Request
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )

    // My Requests
    const renderMyRequests = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">My Tutor Requests</h2>
                <p className="text-muted-foreground">Track your posted tutor requests.</p>
            </div>

            {myRequests.length > 0 ? (
                <div className="space-y-4">
                    {myRequests.map((request) => (
                        <Card key={request.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg">{request.subject} Tutor</h3>
                                            <Badge variant={request.status === "active" ? "default" : "secondary"}>
                                                {request.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{request.gradeLevel}</p>
                                        <p className="text-sm">{request.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                                            <span>{request.location}</span>
                                            <span>•</span>
                                            <span>{request.schedule}</span>
                                            <span>•</span>
                                            <span className="font-medium text-foreground">{request.budget}</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Edit</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">You haven't posted any tutor requests yet.</p>
                        <Button className="mt-4">Post Your First Request</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )

    // Render based on active view
    switch (activeView) {
        case "browse-jobs":
            return renderBrowseJobs()
        case "applications":
            return renderApplications()
        case "saved-jobs":
            return renderSavedJobs()
        case "post-request":
            return renderPostRequest()
        case "my-requests":
            return renderMyRequests()
        case "dashboard":
        default:
            return renderDashboard()
    }
}

