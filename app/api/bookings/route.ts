import { type NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/auth";
import { createBooking, getBookingsByUserId } from "@/lib/booking";
import { getFlightById } from "@/lib/flight";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    // Get the token from the cookies
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify the token
    const payload = await verifyJwtToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get bookings for the user
    const bookings = await getBookingsByUserId(payload.userId);

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error getting bookings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get bookings",
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = await verifyJwtToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { flightId, passengers, totalPrice, flightClass } = body;

    if (!flightId || !passengers || !Array.isArray(passengers)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid booking data" },
        { status: 400 }
      );
    }

    const flight = await getFlightById(flightId);

    if (!flight) {
      return NextResponse.json(
        { success: false, error: "Flight not found" },
        { status: 404 }
      );
    }

    if (flight.availableSeats < passengers.length) {
      return NextResponse.json(
        { success: false, error: "Not enough seats available" },
        { status: 409 }
      );
    }

    const booking = await createBooking({
      userId: new ObjectId(payload.userId),
      flightId: new ObjectId(flightId),
      passengers,
      totalPrice,
      status: "confirmed", // Example status
      paymentStatus: "completed", // Example payment status
      checkedIn: false // Default value
    });

    // Optionally update seat count here
    // await updateFlightSeats(flightId, -passengers.length);

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error while booking",
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}
