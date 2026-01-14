import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobId, studentId, coverLetter, resumeUrl } = body

    // Check if already applied
    const existing: any[] = await query("SELECT id FROM job_applications WHERE job_id = ? AND student_id = ?", [
      jobId,
      studentId,
    ])

    if (existing.length > 0) {
      return NextResponse.json({ error: "You have already applied to this job" }, { status: 400 })
    }

    const result: any = await query(
      "INSERT INTO job_applications (job_id, student_id, cover_letter, resume_url, status) VALUES (?, ?, ?, ?, 'pending')",
      [jobId, studentId, coverLetter, resumeUrl],
    )

    return NextResponse.json({ applicationId: result.insertId, message: "Application submitted" }, { status: 201 })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get("studentId")
    const teacherId = searchParams.get("teacherId")

    let sql = `SELECT ja.*, j.title, CONCAT(up.first_name, ' ', up.last_name) as applicant_name
               FROM job_applications ja
               JOIN jobs j ON ja.job_id = j.id
               JOIN users u ON ja.student_id = u.id
               JOIN user_profiles up ON u.id = up.user_id`
    const params: any[] = []

    if (studentId) {
      sql += " WHERE ja.student_id = ?"
      params.push(studentId)
    } else if (teacherId) {
      sql += " WHERE j.teacher_id = ?"
      params.push(teacherId)
    }

    sql += " ORDER BY ja.applied_at DESC"

    const applications: any[] = await query(sql, params)
    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
