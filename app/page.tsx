"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-context"
import { mockJobs, mockTutorRequests } from "@/lib/mock-data"
import {
  GraduationCap,
  Briefcase,
  Users,
  BookOpen,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("jobs")

  const jobs = Object.values(mockJobs).filter((job: any) => job.status === "active")
  const tutorRequests = Object.values(mockTutorRequests).filter((req: any) => req.status === "active")

  // Smooth scroll function for navigation
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80 // Account for sticky header height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  const handleApply = (type: "job" | "request", id: string) => {
    if (user) {
      // Redirect to appropriate dashboard
      if (type === "job" && user.role === "student") {
        router.push("/dashboard/student")
      } else if (type === "request" && user.role === "teacher") {
        router.push("/dashboard/teacher")
      } else {
        router.push("/dashboard")
      }
    } else {
      // Redirect to login with return URL
      router.push(`/login?redirect=${type === "job" ? "student" : "teacher"}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Tutor Connect</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#jobs"
                onClick={(e) => {
                  scrollToSection(e, "jobs")
                  setActiveTab("jobs")
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Browse Jobs
              </a>
              <a
                href="#requests"
                onClick={(e) => {
                  scrollToSection(e, "jobs")
                  setActiveTab("requests")
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Tutor Requests
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, "how-it-works")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                How It Works
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Connecting Educators & Learners
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Find the Perfect Match for Teaching & Learning
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Teachers post tutoring opportunities. Students find tutors or request help.
            A seamless platform for educational connections.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register/teacher">
              <Button size="lg" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Post a Teaching Job
              </Button>
            </Link>
            <Link href="/register/student">
              <Button size="lg" variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Request a Tutor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Separator />

      {/* Job & Request Listings */}
      <section id="jobs" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Browse Opportunities</h2>
                <p className="text-muted-foreground">Find teaching jobs or students needing tutors</p>
              </div>
              <TabsList>
                <TabsTrigger value="jobs" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  Teaching Jobs ({jobs.length})
                </TabsTrigger>
                <TabsTrigger value="requests" className="gap-2">
                  <Users className="h-4 w-4" />
                  Tutor Requests ({tutorRequests.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Teaching Jobs */}
            <TabsContent value="jobs" className="space-y-4">
              {jobs.length > 0 ? (
                jobs.map((job: any) => (
                  <Card key={job.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">Posted by {job.teacherName}</p>
                            </div>
                            <Badge>Active</Badge>
                          </div>
                          <p className="text-sm">{job.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="font-medium text-foreground">{job.salary}</span>
                          </div>
                        </div>
                        <Button onClick={() => handleApply("job", job.id)} className="shrink-0">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No teaching jobs available at the moment.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tutor Requests */}
            <TabsContent value="requests" id="requests" className="space-y-4">
              {tutorRequests.length > 0 ? (
                tutorRequests.map((request: any) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {request.subject} Tutor Needed
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {request.studentName} • {request.gradeLevel}
                              </p>
                            </div>
                            <Badge variant="secondary">Looking for Tutor</Badge>
                          </div>
                          <p className="text-sm">{request.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        <Button onClick={() => handleApply("request", request.id)} variant="outline" className="shrink-0">
                          Offer to Tutor
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No tutor requests at the moment.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Separator />

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold tracking-tight mb-2">How It Works</h2>
            <p className="text-muted-foreground">Simple steps to connect educators and learners</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Teachers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  For Teachers
                </CardTitle>
                <CardDescription>Share your expertise and find students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Post Teaching Jobs</p>
                    <p className="text-sm text-muted-foreground">Create listings for tutoring opportunities</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Browse Tutor Requests</p>
                    <p className="text-sm text-muted-foreground">Find students looking for help in your subject</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Manage Applications</p>
                    <p className="text-sm text-muted-foreground">Review and accept student applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Students */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  For Students
                </CardTitle>
                <CardDescription>Find the perfect tutor for your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Browse Teaching Jobs</p>
                    <p className="text-sm text-muted-foreground">Apply to tutoring opportunities from verified teachers</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Post Tutor Requests</p>
                    <p className="text-sm text-muted-foreground">Let teachers know you need help with a subject</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Track Applications</p>
                    <p className="text-sm text-muted-foreground">Monitor your application status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Try the Demo</CardTitle>
              <CardDescription>Use these credentials to explore the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Admin</p>
                  <p className="text-xs">admin@teachconnect.com</p>
                  <p className="text-xs text-muted-foreground">admin123</p>
                </div>
                <div className="p-4 rounded-lg bg-muted text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Teacher</p>
                  <p className="text-xs">john@example.com</p>
                  <p className="text-xs text-muted-foreground">teacher123</p>
                </div>
                <div className="p-4 rounded-lg bg-muted text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Student</p>
                  <p className="text-xs">student1@example.com</p>
                  <p className="text-xs text-muted-foreground">student123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            <span className="font-semibold">Tutor Connect</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Tutor Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
