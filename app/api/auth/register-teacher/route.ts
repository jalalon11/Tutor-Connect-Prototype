import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { validateEmail, validatePassword, validateNameFormat } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, confirmPassword, firstName, middleName, lastName, documents } = body

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

    // Verify documents are provided
    if (!documents || documents.length === 0) {
      return NextResponse.json({ error: "At least one document is required" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Insert user (status: pending for teacher)
    const result: any = await query(
      "INSERT INTO users (email, password, role, status) VALUES (?, ?, 'teacher', 'pending')",
      [email, hashedPassword],
    )

    const userId = result.insertId

    // Insert user profile
    await query("INSERT INTO user_profiles (user_id, first_name, middle_name, last_name) VALUES (?, ?, ?, ?)", [
      userId,
      firstName,
      middleName || null,
      lastName,
    ])

    // Insert documents
    for (const doc of documents) {
      await query(
        "INSERT INTO teacher_documents (user_id, document_type, file_url, file_name, verification_status) VALUES (?, ?, ?, ?, 'pending')",
        [userId, doc.type, doc.url, doc.fileName],
      )
    }

    // Log activity
    await query("INSERT INTO activity_logs (action, target_type, target_id) VALUES ('teacher_registered', 'user', ?)", [
      userId,
    ])

    return NextResponse.json(
      {
        message: "Registration successful. Your documents are pending admin verification.",
        userId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
