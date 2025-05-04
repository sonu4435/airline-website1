import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/user"
import { createJwtToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const user = await createUser({ name, email, password, role: "passenger" })

    // Create a JWT token
    const token = await createJwtToken({
      userId: user._id!.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // Set the token as a cookie
    const response = NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)

    if ((error as Error).message === "User already exists") {
      return NextResponse.json({ success: false, error: "User already exists" }, { status: 409 })
    }

    return NextResponse.json({ success: false, error: "Failed to register user" }, { status: 500 })
  }
}
