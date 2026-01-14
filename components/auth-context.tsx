"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { mockUsers } from "@/lib/mock-data"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "admin" | "teacher"
  status: "approved" | "pending"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const userEntry = Object.values(mockUsers).find((u: any) => u.email === email && u.password === password)

    if (!userEntry) {
      throw new Error("Invalid email or password")
    }

    const userData: User = {
      id: userEntry.id,
      email: userEntry.email,
      firstName: userEntry.firstName,
      lastName: userEntry.lastName,
      role: userEntry.role,
      status: userEntry.status,
    }

    setUser(userData)
    sessionStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("user")
    window.location.href = "/"
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
