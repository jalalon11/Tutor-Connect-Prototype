"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload, X, GraduationCap, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

interface UploadedDocument {
  type: "id" | "certification"
  url: string
  fileName: string
}

export function TeacherRegistrationForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    middleName: "",
    lastName: "",
  })

  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: "id" | "certification") => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    setError("")

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
        setError(data.error || "Upload failed")
        return
      }

      setDocuments((prev) => [...prev, { type: docType, url: data.url, fileName: file.name }])
    } catch (err) {
      setError("Upload failed. Please try again.")
    } finally {
      setUploadingFile(false)
    }
  }

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, documents }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
        return
      }

      alert("Registration successful! Please await admin verification.")
      window.location.href = "/login"
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
            Share your expertise with students
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Register as an educator to offer tutoring services. Once verified, you can connect with students looking for help.
          </p>

          {/* Steps Indicator */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-primary-foreground text-primary" : "bg-primary-foreground/30 text-primary-foreground"}`}>
                {step > 1 ? <CheckCircle className="h-4 w-4" /> : "1"}
              </div>
              <span className="text-primary-foreground">Personal Information</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-primary-foreground text-primary" : "bg-primary-foreground/30 text-primary-foreground"}`}>
                2
              </div>
              <span className="text-primary-foreground">Upload Documents</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-primary-foreground/60">
          © 2024 Tutor Connect. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-auto">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Tutor Connect</span>
          </div>

          <Card className="border-0 shadow-none lg:shadow-sm lg:border">
            <CardHeader className="px-0 lg:px-6">
              <CardTitle className="text-2xl font-semibold">
                {step === 1 ? "Personal Information" : "Upload Documents"}
              </CardTitle>
              <CardDescription>
                {step === 1
                  ? "Tell us about yourself to get started"
                  : "Upload your ID and teaching certification for verification"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 lg:px-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {step === 1 ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setStep(2)
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
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="teacher@example.com"
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

                  <Button type="submit" className="w-full">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* ID Upload */}
                  <div className="space-y-2">
                    <Label>Government ID / Passport</Label>
                    <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/30">
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
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
                    <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/30">
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
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
                    <Button type="button" onClick={() => setStep(1)} variant="outline" className="flex-1">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || documents.length === 0 || uploadingFile}
                      className="flex-1"
                    >
                      {loading ? "Creating..." : "Complete"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}

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
