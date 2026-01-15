"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, GraduationCap, ArrowRight, ArrowLeft, Upload, X, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UploadedDocument {
  type: "id" | "certification"
  url: string
  fileName: string
}

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  // Registration states
  const [regStep, setRegStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    middleName: "",
    lastName: "",
  })
  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const [uploadingFile, setUploadingFile] = useState(false)
  const [regError, setRegError] = useState("")
  const [regLoading, setRegLoading] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: "id" | "certification") => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    setRegError("")

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)
      uploadFormData.append("documentType", docType)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      const data = await response.json()

      if (!response.ok) {
        setRegError(data.error || "Upload failed")
        return
      }

      setDocuments((prev) => [...prev, { type: docType, url: data.url, fileName: file.name }])
    } catch (err) {
      setRegError("Upload failed. Please try again.")
    } finally {
      setUploadingFile(false)
    }
  }

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError("")
    setRegLoading(true)

    // Simulate API call for presentation
    setTimeout(() => {
      // Show success message
      setRegSuccess(true)
      setRegLoading(false)

      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          middleName: "",
          lastName: "",
        })
        setDocuments([])
        setRegStep(1)
        setRegSuccess(false)
      }, 5000)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/95 to-primary/80 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>

        <Link href="/" className="block hover:opacity-90 transition-opacity relative z-10">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">TeachConnect</span>
          </div>
        </Link>

        <div className="space-y-6 relative z-10">
          <h1 className="text-5xl font-bold text-primary-foreground leading-tight">
            Your Teaching Career Starts Here
          </h1>
          <p className="text-xl text-primary-foreground/90 leading-relaxed">
            Join our community of professional educators. Browse opportunities, submit applications, and advance your teaching career.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-primary-foreground">Verified Institutions</p>
                <p className="text-sm text-primary-foreground/70">All job postings are from verified schools</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-primary-foreground">Easy Application</p>
                <p className="text-sm text-primary-foreground/70">Apply to multiple positions with one profile</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-primary-foreground/60 relative z-10">
          © 2026 TeachConnect. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">TeachConnect</span>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account or register as a teacher</p>
          </div>

          <Card className="border-0 shadow-lg sm:shadow-xl lg:shadow-2xl">
            <CardContent className="p-4 sm:p-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 h-11">
                  <TabsTrigger value="login" className="font-medium">Sign In</TabsTrigger>
                  <TabsTrigger value="register" className="font-medium">Register</TabsTrigger>
                </TabsList>

                {/* LOGIN TAB */}
                <TabsContent value="login" className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 duration-300">
                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="h-11"
                        required
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-11 font-medium">
                      {loading ? "Signing in..." : "Sign In"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>

                  {/* Demo Credentials */}
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-xs text-center text-muted-foreground mb-3 font-medium">Quick Demo Access</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        onClick={() => handleDemoLogin("admin")}
                        variant="outline"
                        size="sm"
                        className="text-xs h-9 px-2"
                      >
                        Admin
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleDemoLogin("teacher")}
                        variant="outline"
                        size="sm"
                        className="text-xs h-9 px-2"
                      >
                        Teacher
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* REGISTER TAB */}
                <TabsContent value="register" className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 duration-300">
                  {regSuccess && (
                    <Alert className="mb-6 border-green-500 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <p className="font-semibold mb-1">Application Submitted Successfully!</p>
                        <p className="text-sm">Your registration is now pending verification by our administration team. Please check your email regularly for updates on your application status.</p>
                        <p className="text-sm mt-2">Thank you for your interest in joining TeachConnect!</p>
                      </AlertDescription>
                    </Alert>
                  )}

                  {regError && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{regError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Step Indicator */}
                  {!regSuccess && (
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${regStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          {regStep > 1 ? <CheckCircle className="h-4 w-4" /> : "1"}
                        </div>
                        <span className="text-sm font-medium">Info</span>
                      </div>
                      <div className="w-12 h-[2px] bg-muted"></div>
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${regStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          2
                        </div>
                        <span className="text-sm font-medium">Documents</span>
                      </div>
                    </div>
                  )}

                  {!regSuccess && regStep === 1 ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (formData.password !== formData.confirmPassword) {
                          setRegError("Passwords do not match")
                          return
                        }
                        setRegError("")
                        setRegStep(2)
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
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
                            placeholder="Smith"
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
                          placeholder="Michael"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="regEmail">Email Address</Label>
                        <Input
                          id="regEmail"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="teacher@example.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="regPassword">Password</Label>
                        <Input
                          id="regPassword"
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

                      <Button type="submit" className="w-full">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  ) : !regSuccess ? (
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                      {/* ID Upload */}
                      <div className="space-y-2">
                        <Label>Government ID / Passport</Label>
                        <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/30">
                          <div className="flex flex-col items-center">
                            <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Click to upload ID</span>
                            <span className="text-xs text-muted-foreground mt-1">PDF, JPEG, PNG (Max 5MB)</span>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, "id")}
                            disabled={uploadingFile}
                          />
                        </label>
                      </div>

                      {/* Certification Upload */}
                      <div className="space-y-2">
                        <Label>Teaching Certification</Label>
                        <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/30">
                          <div className="flex flex-col items-center">
                            <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Click to upload certification</span>
                            <span className="text-xs text-muted-foreground mt-1">PDF, JPEG, PNG (Max 5MB)</span>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, "certification")}
                            disabled={uploadingFile}
                          />
                        </label>
                      </div>

                      {/* Uploaded Documents */}
                      {documents.length > 0 && (
                        <div className="space-y-2">
                          <Label>Uploaded Documents</Label>
                          {documents.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <p className="text-sm font-medium capitalize">{doc.type}</p>
                                <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeDocument(idx)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button type="button" onClick={() => setRegStep(1)} variant="outline" className="flex-1">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={regLoading || documents.length === 0 || uploadingFile}
                          className="flex-1"
                        >
                          {regLoading ? "Creating..." : "Complete"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  ) : null}
                </TabsContent>
              </Tabs>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Need help? <Link href="/" className="text-primary hover:underline font-medium">Contact support</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
