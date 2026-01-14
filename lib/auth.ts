import bcrypt from "bcryptjs"
import { jwtVerify, SignJWT } from "jose"

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(userId: number, email: string, role: string) {
  return new SignJWT({
    userId,
    email,
    role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET)
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, SECRET)
    return verified.payload
  } catch (err) {
    return null
  }
}
