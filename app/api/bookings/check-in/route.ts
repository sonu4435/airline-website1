import { type NextRequest, NextResponse } from "next/server"
import { getBookingByReference } from "@/lib/booking"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reference = searchParams.get("reference")
    const lastName = searchParams.get("lastName")

    if (!reference || !lastName) {
      return NextResponse.json(
        { success: false, error: "Booking reference and last name are required" },
        { status: 400 },
      )
    }

    // Get the booking by reference
    const booking = await getBookingByReference(reference)

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
    }

    // Check if any passenger has the provided last name
    const passengerMatch = booking.passengers.some(
      (passenger) => passenger.lastName.toLowerCase() === lastName.toLowerCase(),
    )

    if (!passengerMatch) {
      return NextResponse.json({ success: false, error: "Passenger not found for this booking" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: booking })
  } catch (error) {
    console.error("Error checking in:", error)
    return NextResponse.json(
      { success: false, error: "Failed to check in", details: (error as Error).message },
      { status: 500 },
    )
  }
}
