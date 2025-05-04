import { type NextRequest, NextResponse } from "next/server"
import { verifyJwtToken, hasRole } from "@/lib/auth"
import { createFlight, getFlights, searchFlights } from "@/lib/flight"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Check if this is a search query
    if (searchParams.has("departure") && searchParams.has("arrival") && searchParams.has("date")) {
      const departureAirport = searchParams.get("departure")!
      const arrivalAirport = searchParams.get("arrival")!
      const departureDate = new Date(searchParams.get("date")!)

      const flights = await searchFlights(departureAirport, arrivalAirport, departureDate)

      return NextResponse.json({ success: true, data: flights })
    }

    // Otherwise, return all flights (with optional filtering)
    const status = searchParams.get("status")
    const airline = searchParams.get("airline")

    const query: any = {}

    if (status) {
      query.status = status
    }

    if (airline) {
      query.airline = airline
    }

    const flights = await getFlights(query)

    return NextResponse.json({ success: true, data: flights })
  } catch (error) {
    console.error("Error getting flights:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get flights", details: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Get the request body
    const body = await request.json()
    const {
      flightNumber,
      airline,
      departureAirport,
      arrivalAirport,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
      totalSeats,
      aircraft,
      status = "scheduled",
    } = body

    // Validate required fields
    if (
      !flightNumber ||
      !airline ||
      !departureAirport ||
      !arrivalAirport ||
      !departureCity ||
      !arrivalCity ||
      !departureTime ||
      !arrivalTime ||
      !price ||
      !availableSeats ||
      !totalSeats ||
      !aircraft
    ) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create the flight
    const flight = await createFlight({
      flightNumber,
      airline,
      departureAirport,
      arrivalAirport,
      departureCity,
      arrivalCity,
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
      price: Number(price),
      availableSeats: Number(availableSeats),
      totalSeats: Number(totalSeats),
      aircraft,
      status,
      createdBy: payload.userId,
    })

    return NextResponse.json({ success: true, data: flight })
  } catch (error) {
    console.error("Error creating flight:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create flight", details: (error as Error).message },
      { status: 500 },
    )
  }
}
