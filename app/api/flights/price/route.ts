import { type NextRequest, NextResponse } from "next/server"
import { amadeus } from "@/lib/amadeus"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { flightOffers } = body

    if (!flightOffers || !Array.isArray(flightOffers) || flightOffers.length === 0) {
      return NextResponse.json({ success: false, error: "Valid flight offers are required" }, { status: 400 })
    }

    const priceResponse = await amadeus.getFlightPrice(flightOffers)

    return NextResponse.json({ success: true, data: priceResponse })
  } catch (error) {
    console.error("Error getting flight price:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get flight price", details: (error as Error).message },
      { status: 500 },
    )
  }
}
