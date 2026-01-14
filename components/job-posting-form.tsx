"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Briefcase } from "lucide-react"

interface JobPostingFormProps {
  adminId: string
  onSuccess?: () => void
}

export function JobPostingForm({ adminId, onSuccess }: JobPostingFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "full-time" as const,
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleJobTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, jobType: value as typeof formData.jobType }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, adminId }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Failed to post job")
        return
      }

      setFormData({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "full-time",
      })

      alert("Job posted successfully!")
      onSuccess?.()
    } catch (err) {
      setError("Failed to post job. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Briefcase className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Post a New Teaching Position</h2>
          <p className="text-sm text-muted-foreground">Create a job posting for teachers to apply</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Job Title *</label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., High School Mathematics Teacher"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the position, responsibilities, and ideal candidate..."
            className="min-h-32"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Requirements</label>
          <Textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="List the requirements (e.g., Bachelor's degree, Licensed Professional Teacher, 3+ years experience)..."
            className="min-h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Type *</label>
            <Select value={formData.jobType} onValueChange={handleJobTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Salary Range</label>
            <Input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., ₱25,000 - ₱35,000/month"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location *</label>
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Quezon City, Metro Manila or Remote"
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Posting..." : "Post Job Position"}
        </Button>
      </form>
    </Card>
  )
}
