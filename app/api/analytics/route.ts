import { type NextRequest, NextResponse } from "next/server"
import { verifyJwtToken, hasRole } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

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

    // Check if user has the right role
    if (!hasRole(["admin", "airline_staff"], payload.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db()

    // Get booking stats
    const bookingStats = await db
      .collection("bookings")
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "completed"] }, "$totalPrice", 0],
              },
            },
          },
        },
      ])
      .toArray()

    // Get flight stats
    const flightStats = await db
      .collection("flights")
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    // Get popular routes
    const popularRoutes = await db
      .collection("bookings")
      .aggregate([
        {
          $lookup: {
            from: "flights",
            localField: "flightId",
            foreignField: "_id",
            as: "flight",
          },
        },
        { $unwind: "$flight" },
        {
          $group: {
            _id: {
              departureAirport: "$flight.departureAirport",
              arrivalAirport: "$flight.arrivalAirport",
            },
            count: { $sum: 1 },
            revenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .toArray()

    return NextResponse.json({
      success: true,
      data: {
        bookingStats,
        flightStats,
        popularRoutes,
      },
    })
  } catch (error) {
    console.error("Error getting analytics:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get analytics", details: (error as Error).message },
      { status: 500 },
    )
  }
}
