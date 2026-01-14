import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "teacher_job_board",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function query(sql: string, values?: any[]) {
  try {
    const connection = await pool.getConnection()
    const [results] = await connection.execute(sql, values)
    connection.release()
    return results
  } catch (error) {
    console.error("Database error:", error)
    throw error
  }
}

export async function getConnection() {
  return pool.getConnection()
}
