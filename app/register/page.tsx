import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Briefcase, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function RegisterChoicePage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-semibold text-primary-foreground">Tutor Connect</span>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground leading-tight">
            Join our community of educators and learners
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Whether you're a teacher offering expertise or a student seeking help, we've got you covered.
          </p>
        </div>

        <div className="text-sm text-primary-foreground/60">
          © 2024 Tutor Connect. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Role Selection */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Tutor Connect</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Create an account</h2>
            <p className="text-muted-foreground mt-1">Choose how you want to use Tutor Connect</p>
          </div>

          <div className="space-y-4">
            {/* Teacher Option */}
            <Link href="/register/teacher" className="block">
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">I'm an Educator</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Offer tutoring services and connect with students seeking help
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground mt-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Student Option */}
            <Link href="/register/student" className="block">
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">I'm a Student</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Find tutors or post requests for subjects you need help with
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground mt-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
