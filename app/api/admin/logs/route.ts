import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const logs: any[] = await query(
      `SELECT * FROM activity_logs 
       ORDER BY created_at DESC 
       LIMIT 50`,
    )

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}
