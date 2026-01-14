import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") || "active"

    const jobs: any[] = await query(
      `SELECT j.*, 
              CONCAT(up.first_name, ' ', up.last_name) as teacher_name,
              u.id as teacher_id
       FROM jobs j
       JOIN users u ON j.teacher_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       WHERE j.status = ?
       ORDER BY j.created_at DESC`,
      [status],
    )

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, requirements, salaryRange, jobType, teacherId } = body

    if (!title || !description || !teacherId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result: any = await query(
      `INSERT INTO jobs (teacher_id, title, description, requirements, salary_range, job_type, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [teacherId, title, description, requirements, salaryRange, jobType],
    )

    return NextResponse.json({ jobId: result.insertId, message: "Job posted successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
