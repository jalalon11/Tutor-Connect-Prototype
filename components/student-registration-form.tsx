"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, GraduationCap, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export function StudentRegistrationForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    middleName: "",
    lastName: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
        return
      }

      setSuccessMessage(data.message)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify({ id: data.userId, role: data.role }))
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000)
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
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
            Find the perfect tutor for your learning goals
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Browse tutoring services from verified educators or post requests for subjects you need help with.
          </p>

          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary-foreground" />
              <span className="text-primary-foreground">Browse verified tutors</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary-foreground" />
              <span className="text-primary-foreground">Post tutor requests</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary-foreground" />
              <span className="text-primary-foreground">Track your applications</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-primary-foreground/60">
          © 2026 Tutor Connect. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
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
            <CardHeader className="px-0 lg:px-6">
              <CardTitle className="text-2xl font-semibold">Create your account</CardTitle>
              <CardDescription>Start your learning journey today</CardDescription>
            </CardHeader>
            <CardContent className="px-0 lg:px-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="mb-6 border-primary/20 bg-primary/5">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name (Optional)</Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating account..." : "Create Account"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
