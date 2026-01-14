export interface User {
  id: number
  email: string
  role: "admin" | "teacher"
  status: "pending" | "approved" | "rejected" | "suspended"
}

export interface UserProfile {
  id: number
  userId: number
  firstName: string
  middleName?: string
  lastName: string
  phone?: string
  bio?: string
  avatarUrl?: string
}

export interface TeacherDocument {
  id: number
  userId: number
  documentType: "id" | "certification"
  fileUrl: string
  fileName: string
  verificationStatus: "pending" | "approved" | "rejected"
  rejectionReason?: string
}

export interface AdminRole {
  id: number
  userId: number
  roleName: string
  permissions: Record<string, boolean>
  canApproveTeachers: boolean
  canManageJobs: boolean
  canViewLogs: boolean
  canSuspendUsers: boolean
  canManageAdmins: boolean
}

export interface Job {
  id: number
  adminId?: number
  title: string
  description: string
  requirements: string
  salaryRange?: string
  location?: string
  jobType: "full-time" | "part-time" | "contract"
  status: "active" | "closed" | "draft"
  postedAt?: Date
}

export interface JobApplication {
  id: number
  jobId: number
  teacherId: number
  status: "pending" | "accepted" | "rejected" | "withdrawn"
  coverLetter?: string
  resumeUrl?: string
  appliedAt?: Date
}
