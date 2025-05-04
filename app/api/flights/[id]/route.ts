import { type NextRequest, NextResponse } from "next/server"
import { verifyJwtToken, hasRole } from "@/lib/auth"
import { getFlightById, updateFlight, deleteFlight } from "@/lib/flight"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const flightId = params.id

    const flight = await getFlightById(flightId)

    if (!flight) {
      return NextResponse.json({ success: false, error: "Flight not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: flight })
  } catch (error) {
    console.error("Error getting flight:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get flight", details: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const flightId = params.id

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

    // Get the request body
    const body = await request.json()

    // Make sure dates are properly converted
    if (body.departureTime) {
      body.departureTime = new Date(body.departureTime)
    }

    if (body.arrivalTime) {
      body.arrivalTime = new Date(body.arrivalTime)
    }

    // Update the flight
    const success = await updateFlight(flightId, body)

    if (!success) {
      return NextResponse.json({ success: false, error: "Flight not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Flight updated successfully" })
  } catch (error) {
    console.error("Error updating flight:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update flight", details: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const flightId = params.id

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

    // Delete the flight
    const success = await deleteFlight(flightId)

    if (!success) {
      return NextResponse.json({ success: false, error: "Flight not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Flight deleted successfully" })
  } catch (error) {
    console.error("Error deleting flight:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete flight", details: (error as Error).message },
      { status: 500 },
    )
  }
}
