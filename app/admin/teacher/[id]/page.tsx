"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Award, 
  Briefcase,
  User
} from "lucide-react"
import { mockUsers } from "@/lib/mock-data"

export default function TeacherProfilePage() {
  const params = useParams()
  const router = useRouter()
  const teacherId = params.id as string

  // Find teacher in mock data
  const teacherKey = Object.keys(mockUsers).find((key) => mockUsers[key].id === teacherId)
  const teacher = teacherKey ? mockUsers[teacherKey] : null

  if (!teacher) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Teacher Not Found</h2>
          <p className="text-muted-foreground mb-4">The teacher profile you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Teacher Profile</h1>
            <p className="text-muted-foreground">View detailed teacher information</p>
          </div>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">
                  {teacher.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-semibold">{teacher.name}</h2>
                    <Badge variant={teacher.status === "approved" ? "default" : "secondary"}>
                      {teacher.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{teacher.role === "teacher" ? "Professional Educator" : teacher.role}</p>
                </div>

                {/* Contact Information */}
                <div className="grid gap-3 md:grid-cols-2">
                  {teacher.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{teacher.email}</span>
                    </div>
                  )}
                  {teacher.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{teacher.phone}</span>
                    </div>
                  )}
                  {teacher.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{teacher.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        {teacher.bio && (
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                {teacher.bio}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Education & Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education & Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teacher.education && (
                <div>
                  <p className="text-sm font-medium mb-1">Education</p>
                  <p className="text-sm text-muted-foreground">{teacher.education}</p>
                </div>
              )}
              {teacher.experience && (
                <div>
                  <p className="text-sm font-medium mb-1">Experience</p>
                  <p className="text-sm text-muted-foreground">{teacher.experience}</p>
                </div>
              )}
              {!teacher.education && !teacher.experience && (
                <p className="text-sm text-muted-foreground">No education or experience information provided</p>
              )}
            </CardContent>
          </Card>

          {/* Subjects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teacher.subjects && teacher.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.map((subject: string, index: number) => (
                    <Badge key={index} variant="secondary">{subject}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No subjects listed</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Certifications */}
        {teacher.certifications && teacher.certifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {teacher.certifications.map((cert: string, index: number) => (
                  <Badge key={index} variant="outline">{cert}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
