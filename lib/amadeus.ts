// Replace the entire file with this implementation that uses the actual Amadeus API

export interface FlightOffer {
  id: string
  source: string
  instantTicketingRequired: boolean
  nonHomogeneous: boolean
  oneWay: boolean
  lastTicketingDate: string
  numberOfBookableSeats: number
  itineraries: Itinerary[]
  price: Price
  pricingOptions: PricingOptions
  validatingAirlineCodes: string[]
  travelerPricings: TravelerPricing[]
}

interface Itinerary {
  duration: string
  segments: Segment[]
}

interface Segment {
  departure: {
    iataCode: string
    terminal?: string
    at: string
  }
  arrival: {
    iataCode: string
    terminal?: string
    at: string
  }
  carrierCode: string
  number: string
  aircraft: {
    code: string
  }
  operating: {
    carrierCode: string
  }
  duration: string
  id: string
  numberOfStops: number
  blacklistedInEU: boolean
}

interface Price {
  currency: string
  total: string
  base: string
  fees: {
    amount: string
    type: string
  }[]
  grandTotal: string
}

interface PricingOptions {
  fareType: string[]
  includedCheckedBagsOnly: boolean
}

interface TravelerPricing {
  travelerId: string
  fareOption: string
  travelerType: string
  price: {
    currency: string
    total: string
    base: string
  }
  fareDetailsBySegment: {
    segmentId: string
    cabin: string
    fareBasis: string
    class: string
    includedCheckedBags: {
      quantity: number
    }
  }[]
}

export interface FlightSearchParams {
  originLocationCode: string
  destinationLocationCode: string
  departureDate: string
  returnDate?: string
  adults: number
  children?: number
  infants?: number
  travelClass?: string
  currencyCode?: string
  maxPrice?: number
  max?: number
}

class AmadeusAPI {
  private apiKey: string
  private apiSecret: string
  private baseURL = "https://test.api.amadeus.com/v2"
  private token: string | null = null
  private tokenExpiry = 0

  constructor() {
    this.apiKey = process.env.AMADEUS_API_KEY || ""
    this.apiSecret = process.env.AMADEUS_API_SECRET || ""

    if (!this.apiKey || !this.apiSecret) {
      console.warn("Amadeus API key or secret is missing. API calls will fail.")
    }
  }

  private async getToken(): Promise<string> {
    // Check if we have a valid token
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token
    }

    // Get a new token
    const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.apiKey,
        client_secret: this.apiSecret,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get Amadeus token: ${response.statusText}`)
    }

    const data = await response.json()
    this.token = data.access_token
    // Set expiry time (convert seconds to milliseconds and subtract a buffer)
    this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000

    return this.token
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
    try {
      const token = await this.getToken()

      // Build query parameters
      const queryParams = new URLSearchParams()
      queryParams.append("originLocationCode", params.originLocationCode)
      queryParams.append("destinationLocationCode", params.destinationLocationCode)
      queryParams.append("departureDate", params.departureDate)
      queryParams.append("adults", params.adults.toString())

      if (params.returnDate) {
        queryParams.append("returnDate", params.returnDate)
      }

      if (params.children) {
        queryParams.append("children", params.children.toString())
      }

      if (params.infants) {
        queryParams.append("infants", params.infants.toString())
      }

      if (params.travelClass) {
        queryParams.append("travelClass", params.travelClass)
      }

      if (params.currencyCode) {
        queryParams.append("currencyCode", params.currencyCode)
      }

      if (params.maxPrice) {
        queryParams.append("maxPrice", params.maxPrice.toString())
      }

      if (params.max) {
        queryParams.append("max", params.max.toString())
      }

      const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Amadeus API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error("Error searching flights:", error)
      throw error
    }
  }

  async getFlightPrice(flightOffers: FlightOffer[]): Promise<any> {
    try {
      const token = await this.getToken()

      const response = await fetch("https://test.api.amadeus.com/v1/shopping/flight-offers/pricing", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            type: "flight-offers-pricing",
            flightOffers: flightOffers,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Amadeus API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error getting flight price:", error)
      throw error
    }
  }

  // Method to search for airport/city codes
  async searchLocations(keyword: string): Promise<any> {
    try {
      const token = await this.getToken()

      const response = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations?keyword=${encodeURIComponent(keyword)}&subType=CITY,AIRPORT`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Amadeus API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error("Error searching locations:", error)
      throw error
    }
  }
}

export const amadeus = new AmadeusAPI()
