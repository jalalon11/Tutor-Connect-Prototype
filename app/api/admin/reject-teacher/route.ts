import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, reason } = body

    // Update user status to rejected
    await query("UPDATE users SET status = 'rejected' WHERE id = ?", [userId])

    // Update documents to rejected
    await query(
      "UPDATE teacher_documents SET verification_status = 'rejected', rejection_reason = ? WHERE user_id = ?",
      [reason || "Documents did not meet requirements", userId],
    )

    // Log activity
    const adminId = 1
    await query(
      "INSERT INTO activity_logs (admin_id, action, target_type, target_id) VALUES (?, 'teacher_rejected', 'user', ?)",
      [adminId, userId],
    )

    return NextResponse.json({ message: "Teacher rejected successfully" })
  } catch (error) {
    console.error("Error rejecting teacher:", error)
    return NextResponse.json({ error: "Failed to reject teacher" }, { status: 500 })
  }
}
