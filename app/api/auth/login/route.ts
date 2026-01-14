import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { comparePassword, createToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Find user
    const users: any[] = await query("SELECT * FROM users WHERE email = ?", [email])
    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check status
    if (user.status === "pending") {
      return NextResponse.json({ error: "Your account is pending admin verification" }, { status: 403 })
    }

    if (user.status === "suspended") {
      return NextResponse.json({ error: "Your account has been suspended" }, { status: 403 })
    }

    // Create token
    const token = await createToken(user.id, user.email, user.role)

    return NextResponse.json({
      token,
      userId: user.id,
      role: user.role,
      email: user.email,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
