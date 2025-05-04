import { type NextRequest, NextResponse } from "next/server"
import { skyscanner } from "@/lib/skyscanner"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")
    const locale = searchParams.get("locale") || "en-US"
    const market = searchParams.get("market") || "US"

    if (!query) {
      return NextResponse.json({ success: false, error: "Query parameter is required" }, { status: 400 })
    }

    const locations = await skyscanner.searchLocations(query, locale, market)

    return NextResponse.json({ success: true, data: locations })
  } catch (error) {
    console.error("Error searching locations:", error)
    return NextResponse.json(
      { success: false, error: "Failed to search locations", details: (error as Error).message },
      { status: 500 },
    )
  }
}
