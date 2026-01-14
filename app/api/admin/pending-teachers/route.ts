import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const teachers: any[] = await query(
      `SELECT u.id, u.email, up.first_name, up.last_name, u.status, u.created_at
       FROM users u
       JOIN user_profiles up ON u.id = up.user_id
       WHERE u.role = 'teacher' AND u.status = 'pending'
       ORDER BY u.created_at ASC`,
    )

    // Get documents for each teacher
    const teachersWithDocs = await Promise.all(
      teachers.map(async (teacher) => {
        const docs: any[] = await query("SELECT * FROM teacher_documents WHERE user_id = ? ORDER BY created_at DESC", [
          teacher.id,
        ])
        return { ...teacher, documents: docs }
      }),
    )

    return NextResponse.json({ teachers: teachersWithDocs })
  } catch (error) {
    console.error("Error fetching pending teachers:", error)
    return NextResponse.json({ error: "Failed to fetch pending teachers" }, { status: 500 })
  }
}
