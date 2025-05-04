import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyJwtToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
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

    // Get the user from the database
    const client = await clientPromise
    const db = client.db()
    const user = await db.collection("users").findOne(
      { _id: payload.userId },
      { projection: { password: 0 } }, // Exclude password
    )

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error("Error getting user profile:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get user profile", details: (error as Error).message },
      { status: 500 },
    )
  }
}

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
    const { name } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
    }

    // Update the user in the database
    const client = await clientPromise
    const db = client.db()
    const result = await db.collection("users").updateOne({ _id: payload.userId }, { $set: { name } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update user profile", details: (error as Error).message },
      { status: 500 },
    )
  }
}
