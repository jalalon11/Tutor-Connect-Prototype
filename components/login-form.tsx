"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, GraduationCap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (role: "admin" | "teacher" | "student") => {
    const demos = {
      admin: { email: "admin@teachconnect.com", password: "admin123" },
      teacher: { email: "john@example.com", password: "teacher123" },
      student: { email: "student1@example.com", password: "student123" },
    }
    const creds = demos[role]
    setEmail(creds.email)
    setPassword(creds.password)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
        <Link href="/" className="block hover:opacity-90 transition-opacity">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-semibold text-primary-foreground">Tutor Connect</span>
          </div>
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground leading-tight">
            Connect with the best tutors and students
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Teachers offer their expertise. Students find the perfect match for learning.
          </p>
        </div>

        <div className="text-sm text-primary-foreground/60">
          © 2026 Tutor Connect. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Tutor Connect</span>
          </div>

          <Card className="border-0 shadow-none lg:shadow-sm lg:border">
            <CardHeader className="space-y-1 px-0 lg:px-6">
              <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent className="px-0 lg:px-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-muted-foreground text-center mb-3">Quick demo access:</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    onClick={() => handleDemoLogin("admin")}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Admin
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleDemoLogin("teacher")}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Teacher
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleDemoLogin("student")}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Student
                  </Button>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
