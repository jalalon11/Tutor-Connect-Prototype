import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    // Update user status to approved
    await query("UPDATE users SET status = 'approved' WHERE id = ?", [userId])

    // Update documents to approved
    await query("UPDATE teacher_documents SET verification_status = 'approved' WHERE user_id = ?", [userId])

    // Log activity
    const adminId = 1 // Should come from auth
    await query(
      "INSERT INTO activity_logs (admin_id, action, target_type, target_id) VALUES (?, 'teacher_approved', 'user', ?)",
      [adminId, userId],
    )

    return NextResponse.json({ message: "Teacher approved successfully" })
  } catch (error) {
    console.error("Error approving teacher:", error)
    return NextResponse.json({ error: "Failed to approve teacher" }, { status: 500 })
  }
}
