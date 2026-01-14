import { type NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentType = formData.get("documentType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only PDF, JPEG, and PNG are allowed." }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const ext = path.extname(file.name)
    const filename = `${documentType}-${timestamp}${ext}`
    const filepath = path.join(uploadDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    fs.writeFileSync(filepath, Buffer.from(bytes))

    return NextResponse.json({
      success: true,
      filename: filename,
      url: `/uploads/${filename}`,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
