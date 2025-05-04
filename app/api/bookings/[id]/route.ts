import { type NextRequest, NextResponse } from "next/server"
import { verifyJwtToken } from "@/lib/auth"
import { getBookingById, updateBookingStatus, cancelBooking, checkInPassengers } from "@/lib/booking"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingId = params.id

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

    // Get the booking
    const booking = await getBookingById(bookingId)

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
    }

    // Check if the booking belongs to the user (unless admin)
    if (payload.role !== "admin" && booking.userId.toString() !== payload.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ success: true, data: booking })
  } catch (error) {
    console.error("Error getting booking:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get booking", details: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingId = params.id

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

    // Get the booking to check ownership
    const booking = await getBookingById(bookingId)

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
    }

    // Check if the booking belongs to the user (unless admin)
    if (payload.role !== "admin" && booking.userId.toString() !== payload.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    // Get the request body
    const body = await request.json()

    // Handle different types of updates
    if (body.action === "cancel") {
      // Cancel the booking
      const success = await cancelBooking(bookingId)

      if (!success) {
        return NextResponse.json({ success: false, error: "Failed to cancel booking" }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Booking cancelled successfully" })
    } else if (body.action === "check-in") {
      // Check in passengers
      if (!body.passengerSeats || !Array.isArray(body.passengerSeats)) {
        return NextResponse.json({ success: false, error: "Passenger seats are required" }, { status: 400 })
      }

      const success = await checkInPassengers(bookingId, body.passengerSeats)

      if (!success) {
        return NextResponse.json({ success: false, error: "Failed to check in passengers" }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Passengers checked in successfully" })
    } else if (body.status) {
      // Update booking status
      const success = await updateBookingStatus(bookingId, body.status, body.paymentStatus)

      if (!success) {
        return NextResponse.json({ success: false, error: "Failed to update booking status" }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Booking status updated successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update booking", details: (error as Error).message },
      { status: 500 },
    )
  }
}
