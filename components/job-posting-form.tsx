"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface JobPostingFormProps {
  teacherId: number
  onSuccess?: () => void
}

export function JobPostingForm({ teacherId, onSuccess }: JobPostingFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    salaryRange: "",
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
        body: JSON.stringify({ ...formData, teacherId }),
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
        salaryRange: "",
        jobType: "full-time",
      })

      onSuccess?.()
    } catch (err) {
      setError("Failed to post job. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h2>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., English Teacher"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the job responsibilities..."
            className="min-h-32"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
          <Textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="List the requirements..."
            className="min-h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
            <Input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              placeholder="e.g., $50k-$70k"
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? "Posting..." : "Post Job"}
        </Button>
      </form>
    </Card>
  )
}
