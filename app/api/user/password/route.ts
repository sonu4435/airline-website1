import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyJwtToken } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest) {
  try {
    // Get the token from the cookies
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    // Verify the token
    const payload = await verifyJwtToken(token)

    if (!payload || !payload.userId) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    // Get the request body
    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current password and new password are required" },
        { status: 400 },
      )
    }

    // Get the user from the database
    const client = await clientPromise
    const db = client.db()
    const user = await db.collection("users").findOne({ _id: new ObjectId(payload.userId) })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Verify the current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the password in the database
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(payload.userId) }, { $set: { password: hashedPassword } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update password", details: (error as Error).message },
      { status: 500 },
    )
  }
}
