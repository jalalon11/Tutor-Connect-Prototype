import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const totalUsersResult: any[] = await query("SELECT COUNT(*) as count FROM users")
    const totalJobsResult: any[] = await query("SELECT COUNT(*) as count FROM jobs WHERE status = 'active'")
    const pendingTeachersResult: any[] = await query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'teacher' AND status = 'pending'",
    )

    return NextResponse.json({
      totalUsers: totalUsersResult[0].count,
      totalJobs: totalJobsResult[0].count,
      pendingTeachers: pendingTeachersResult[0].count,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
