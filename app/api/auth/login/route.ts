import { type NextRequest, NextResponse } from "next/server"
import { validateUser } from "@/lib/user"
import { createJwtToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    const user = await validateUser(email, password)

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

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
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Failed to login" }, { status: 500 })
  }
}
