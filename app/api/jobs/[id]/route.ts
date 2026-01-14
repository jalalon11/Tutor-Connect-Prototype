import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobs: any[] = await query(
      `SELECT j.*, 
              CONCAT(up.first_name, ' ', up.last_name) as teacher_name
       FROM jobs j
       JOIN users u ON j.teacher_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       WHERE j.id = ?`,
      [params.id],
    )

    if (jobs.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ job: jobs[0] })
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}
