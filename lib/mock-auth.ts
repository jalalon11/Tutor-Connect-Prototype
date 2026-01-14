import { mockUsers } from "./mock-data"

interface LoginCredentials {
  email: string
  password: string
}

interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  middleName: string
  role: "admin" | "teacher" | "student"
  status: "approved" | "pending"
  createdAt: Date
  subjects?: string[]
  documents?: Array<{ id: string; type: string; url: string }>
}

// Simulate auth with mock data
export const mockLogin = (email: string, password: string): AuthUser | null => {
  const userKey = Object.keys(mockUsers).find((key) => mockUsers[key as keyof typeof mockUsers].email === email)

  if (!userKey) return null

  const user = mockUsers[userKey as keyof typeof mockUsers]
  if (user.password !== password) return null

  // Remove password from returned user
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword as AuthUser
}

export const mockRegisterTeacher = (data: {
  firstName: string
  lastName: string
  middleName: string
  email: string
  password: string
  subjects: string[]
  documents: Array<{ type: string; url: string }>
}) => {
  const newTeacher: AuthUser = {
    id: `teacher-${Date.now()}`,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    middleName: data.middleName,
    role: "teacher",
    status: "pending",
    createdAt: new Date(),
    subjects: data.subjects,
    documents: data.documents.map((doc, idx) => ({
      id: `doc-${Date.now()}-${idx}`,
      ...doc,
    })),
  }
  return newTeacher
}

export const mockRegisterStudent = (data: {
  firstName: string
  lastName: string
  middleName: string
  email: string
  password: string
}) => {
  const newStudent: AuthUser = {
    id: `student-${Date.now()}`,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    middleName: data.middleName,
    role: "student",
    status: "approved",
    createdAt: new Date(),
  }
  return newStudent
}
