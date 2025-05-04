import { jwtVerify, SignJWT } from "jose"
import type { UserRole } from "./user"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface JwtPayload {
  userId: string
  email: string
  name: string
  role: UserRole
  iat?: number
  exp?: number
}

export async function createJwtToken(payload: Omit<JwtPayload, "iat" | "exp">): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(JWT_SECRET))

  return token
}

export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return payload as JwtPayload
  } catch (error) {
    console.error("Error verifying JWT token:", error)
    return null
  }
}

export function hasRole(requiredRoles: UserRole[], userRole: UserRole): boolean {
  return requiredRoles.includes(userRole)
}
