"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-context"
import { mockJobs } from "@/lib/mock-data"
import {
  GraduationCap,
  Briefcase,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  Search,
} from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const jobs = Object.values(mockJobs).filter((job: any) => job.status === "open")
  
  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job: any) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      job.title?.toLowerCase().includes(query) ||
      job.subject?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query) ||
      job.school?.toLowerCase().includes(query)
    )
  })

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  const handleApply = (id: string) => {
    if (user) {
      if (user.role === "teacher") {
        router.push("/dashboard/teacher")
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push(`/login?redirect=/dashboard`)
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
              <span className="text-xl font-semibold">TeachConnect</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#jobs"
                onClick={(e) => scrollToSection(e, "jobs")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Browse Jobs
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
              <Link href="/login">
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
            Teaching Opportunities Platform
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Find Your Next Teaching Opportunity
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse teaching job postings from verified institutions and apply with ease.
            Join our community of professional educators.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Join as Teacher
              </Button>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin/dashboard">
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Job Listings */}
      <section id="jobs" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight mb-2">Available Teaching Positions</h2>
            <p className="text-muted-foreground">Browse current job openings posted by our administrators</p>
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by job title, subject, location, or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-2">
                Found {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} matching "{searchQuery}"
              </p>
            )}
          </div>

          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job: any) => (
                <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">Posted by Admin</p>
                          </div>
                          <Badge className="bg-green-500">Active</Badge>
                        </div>
                        <p className="text-sm leading-relaxed">{job.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.jobType}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            {job.salary}
                          </span>
                        </div>
                      </div>
                      <Button onClick={() => handleApply(job.id)} className="shrink-0">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No jobs available</h3>
                  <p className="text-muted-foreground">Check back later for new teaching opportunities.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold tracking-tight mb-2">How It Works</h2>
            <p className="text-muted-foreground">Simple steps to join our teaching platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Teachers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  For Teachers
                </CardTitle>
                <CardDescription>Join our network of professional educators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Register & Get Verified</p>
                    <p className="text-sm text-muted-foreground">Submit your credentials for admin verification</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Browse Available Jobs</p>
                    <p className="text-sm text-muted-foreground">View teaching positions posted by administrators</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Apply with One Click</p>
                    <p className="text-sm text-muted-foreground">Submit your application through your dashboard</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Admin */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  For Administrators
                </CardTitle>
                <CardDescription>Manage your teaching staff efficiently</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Post Teaching Jobs</p>
                    <p className="text-sm text-muted-foreground">Create and publish job openings for teachers</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Verify Teachers</p>
                    <p className="text-sm text-muted-foreground">Review and approve teacher registrations</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Manage Applications</p>
                    <p className="text-sm text-muted-foreground">Track and review teacher applications</p>
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
              <div className="grid grid-cols-2 gap-4">
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
            <span className="font-semibold">TeachConnect</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 TeachConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
