import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword, createToken } from "@/lib/auth"
import { validateEmail, validatePassword, validateNameFormat } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, confirmPassword, role, firstName, middleName, lastName } = body

    // Validation
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters with uppercase, lowercase, and number" },
        { status: 400 },
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    if (!validateNameFormat(firstName, middleName, lastName)) {
      return NextResponse.json(
        { error: "Invalid name format. Please use Last Name First Name Middle format" },
        { status: 400 },
      )
    }

    // Check if user exists
    const existingUser: any[] = await query("SELECT id FROM users WHERE email = ?", [email])
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Insert user
    const userStatus = role === "student" ? "approved" : "pending"
    const result: any = await query("INSERT INTO users (email, password, role, status) VALUES (?, ?, ?, ?)", [
      email,
      hashedPassword,
      role,
      userStatus,
    ])

    const userId = result.insertId

    // Insert user profile
    await query("INSERT INTO user_profiles (user_id, first_name, middle_name, last_name) VALUES (?, ?, ?, ?)", [
      userId,
      firstName,
      middleName || null,
      lastName,
    ])

    // Create JWT token
    const token = await createToken(userId, email, role)

    return NextResponse.json(
      {
        message:
          role === "teacher" ? "Registration successful. Awaiting admin verification." : "Registration successful",
        token,
        userId,
        role,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
