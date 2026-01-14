import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword, createToken } from "@/lib/auth"
import { validateEmail, validatePassword, validateNameFormat } from "@/lib/validation"

export async function GET() {
  try {
    // Check if any admin exists
    const admins: any[] = await query("SELECT id FROM users WHERE role = 'admin' LIMIT 1")

    return NextResponse.json({
      adminExists: admins.length > 0,
    })
  } catch (error) {
    console.error("Error checking admin:", error)
    return NextResponse.json({ error: "Failed to check admin status" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if admin already exists
    const admins: any[] = await query("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
    if (admins.length > 0) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 })
    }

    const body = await request.json()
    const { email, password, confirmPassword, firstName, middleName, lastName } = body

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
      return NextResponse.json({ error: "Invalid name format" }, { status: 400 })
    }

    // Hash password and create admin user
    const hashedPassword = await hashPassword(password)

    const result: any = await query(
      "INSERT INTO users (email, password, role, status) VALUES (?, ?, 'admin', 'approved')",
      [email, hashedPassword],
    )

    const userId = result.insertId

    // Create user profile
    await query("INSERT INTO user_profiles (user_id, first_name, middle_name, last_name) VALUES (?, ?, ?, ?)", [
      userId,
      firstName,
      middleName || null,
      lastName,
    ])

    // Create admin role with full permissions
    await query(
      `INSERT INTO admin_roles 
       (user_id, role_name, can_approve_teachers, can_approve_students, can_manage_jobs, can_view_logs, can_suspend_users, can_manage_admins) 
       VALUES (?, ?, true, true, true, true, true, true)`,
      [userId, "Super Admin"],
    )

    // Create system settings - mark admin as initialized
    await query("INSERT INTO system_settings (key, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?", [
      "admin_initialized",
      JSON.stringify({ initialized: true, at: new Date().toISOString() }),
      JSON.stringify({ initialized: true, at: new Date().toISOString() }),
    ])

    const token = await createToken(userId, email, "admin")

    return NextResponse.json(
      {
        message: "Admin account created successfully",
        token,
        userId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Admin setup error:", error)
    return NextResponse.json({ error: "Admin setup failed" }, { status: 500 })
  }
}
