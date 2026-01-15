"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Briefcase, MapPin, Clock, BookmarkIcon } from "lucide-react"
import { mockJobs } from "@/lib/mock-data"
import { useAuth } from "./auth-context"

interface StudentDashboardProps {
    activeView?: string
}

export function StudentDashboard({ activeView = "dashboard" }: StudentDashboardProps) {
    const { user } = useAuth()
    const [jobs, setJobs] = useState<any[]>([])
    const [savedJobs, setSavedJobs] = useState<string[]>([])

    useEffect(() => {
        if (user?.id) {
            setJobs(Object.values(mockJobs).filter((job: any) => job.status === "active"))
        }
    }, [user])

    const toggleSaveJob = (jobId: string) => {
        setSavedJobs((prev) =>
            prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
        )
    }

    const renderDashboard = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Available Teaching Positions</h2>
                <p className="text-muted-foreground">Browse teaching jobs posted by administrators.</p>
            </div>

            <div className="grid gap-6">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <Card key={job.id}>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                                                <AvatarFallback>
                                                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-base sm:text-lg truncate">{job.title}</h3>
                                                <p className="text-sm text-muted-foreground truncate">{job.school}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                                <span>{job.type}</span>
                                            </div>
                                            <Badge variant="outline" className="text-xs">{job.subject}</Badge>
                                        </div>

                                        <p className="text-sm line-clamp-2 sm:line-clamp-none">{job.description}</p>

                                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                                            <Badge variant="secondary">{job.salary}</Badge>
                                            <span className="text-xs sm:text-sm text-muted-foreground">
                                                Posted {new Date(job.postedDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        variant={savedJobs.includes(job.id) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleSaveJob(job.id)}
                                        className="w-full sm:w-auto"
                                    >
                                        <BookmarkIcon className="h-4 w-4 mr-1" />
                                        {savedJobs.includes(job.id) ? "Saved" : "Save"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                    <Briefcase className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium">No jobs available</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Check back later for new teaching positions.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )

    const renderSavedJobs = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Saved Jobs</h2>
                <p className="text-muted-foreground">Jobs you've saved for later.</p>
            </div>

            <div className="grid gap-6">
                {jobs.filter(job => savedJobs.includes(job.id)).length > 0 ? (
                    jobs.filter(job => savedJobs.includes(job.id)).map((job) => (
                        <Card key={job.id}>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                                                <AvatarFallback>
                                                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-base sm:text-lg truncate">{job.title}</h3>
                                                <p className="text-sm text-muted-foreground truncate">{job.school}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                                <span>{job.type}</span>
                                            </div>
                                            <Badge variant="outline" className="text-xs">{job.subject}</Badge>
                                        </div>

                                        <p className="text-sm line-clamp-2 sm:line-clamp-none">{job.description}</p>

                                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                                            <Badge variant="secondary">{job.salary}</Badge>
                                            <span className="text-xs sm:text-sm text-muted-foreground">
                                                Posted {new Date(job.postedDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleSaveJob(job.id)}
                                        className="w-full sm:w-auto"
                                    >
                                        <BookmarkIcon className="h-4 w-4 mr-1" />
                                        Unsave
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                    <BookmarkIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium">No saved jobs</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Save jobs you're interested in to view them here.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )

    // Render based on active view
    switch (activeView) {
        case "browse-jobs":
            return renderDashboard()
        case "saved-jobs":
            return renderSavedJobs()
        case "dashboard":
        default:
            return renderDashboard()
    }
}

