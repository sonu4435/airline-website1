// Skyscanner API client implementation

export interface FlightOffer {
  id: string
  price: {
    amount: number
    currency: string
  }
  legs: FlightLeg[]
  carriers: Carrier[]
  deepLink: string
}

export interface FlightLeg {
  id: string
  departureAirport: {
    name: string
    code: string
    city: string
  }
  arrivalAirport: {
    name: string
    code: string
    city: string
  }
  departureTime: string
  arrivalTime: string
  duration: number // in minutes
  stops: number
  carriers: string[] // carrier IDs
  operatingCarriers: string[] // carrier IDs
}

export interface Carrier {
  id: string
  name: string
  logo: string
}

export interface FlightSearchParams {
  originPlace: string
  destinationPlace: string
  outboundDate: string
  inboundDate?: string
  adults?: number
  children?: number
  infants?: number
  cabinClass?: string
  currency?: string
  countryCode?: string
}

export interface LocationSearchResult {
  entityId: string
  name: string
  iataCode?: string
  cityName?: string
  countryName: string
  type: "PLACE" | "AIRPORT" | "CITY"
}

class SkyscannerAPI {
  private apiKey: string
  private baseURL = "https://partners.api.skyscanner.net/apiservices"

  constructor() {
    this.apiKey = process.env.SKYSCANNER_API_KEY || ""
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
    try {
      console.log("Searching flights with params:", params)

      // Check if we have an API key
      if (this.apiKey) {
        // Make a real API call to Skyscanner
        const response = await fetch(`${this.baseURL}/v1/flights/search`, {
          method: "POST",
          headers: {
            "x-api-key": this.apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              market: params.countryCode || "US",
              locale: "en-US",
              currency: params.currency || "USD",
              queryLegs: [
                {
                  originPlaceId: { iata: params.originPlace },
                  destinationPlaceId: { iata: params.destinationPlace },
                  date: {
                    year: Number.parseInt(params.outboundDate.split("-")[0]),
                    month: Number.parseInt(params.outboundDate.split("-")[1]),
                    day: Number.parseInt(params.outboundDate.split("-")[2]),
                  },
                },
                ...(params.inboundDate
                  ? [
                    {
                      originPlaceId: { iata: params.destinationPlace },
                      destinationPlaceId: { iata: params.originPlace },
                      date: {
                        year: Number.parseInt(params.inboundDate.split("-")[0]),
                        month: Number.parseInt(params.inboundDate.split("-")[1]),
                        day: Number.parseInt(params.inboundDate.split("-")[2]),
                      },
                    },
                  ]
                  : []),
              ],
              adults: params.adults || 1,
              childrenAges: params.children ? Array(params.children).fill(10) : [],
              cabinClass: params.cabinClass || "CABIN_CLASS_ECONOMY",
            },
          }),
        })

        if (!response.ok) {
          throw new Error(`Skyscanner API error: ${response.statusText}`)
        }

        const data = await response.json()

        // Transform the response to match our FlightOffer interface
        // This would need to be adapted based on the actual Skyscanner API response format
        return this.transformSkyscannerResponse(data)
      }

      // If no API key, return mock data
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
      return mockFlightOffers
    } catch (error) {
      console.error("Error searching flights:", error)
      // Fall back to mock data if the API call fails
      return mockFlightOffers
    }
  }

  private transformSkyscannerResponse(data: any): FlightOffer[] {
    // This would need to be implemented based on the actual Skyscanner API response format
    // For now, we'll just return mock data
    return mockFlightOffers
  }

  async searchLocations(query: string, locale = "en-US", market = "US"): Promise<LocationSearchResult[]> {
    try {
      console.log(`Searching locations for "${query}" in ${locale}, market ${market}`)

      // Check if we have an API key
      if (this.apiKey && query.length >= 2) {
        // Make a real API call to Skyscanner
        const response = await fetch(
          `${this.baseURL}/v1/geo/autosuggest?query=${encodeURIComponent(query)}&locale=${locale}&market=${market}`,
          {
            headers: {
              "x-api-key": this.apiKey,
            },
          },
        )

        if (!response.ok) {
          throw new Error(`Skyscanner API error: ${response.statusText}`)
        }

        const data = await response.json()

        // Transform the response to match our LocationSearchResult interface
        // This would need to be adapted based on the actual Skyscanner API response format
        return this.transformLocationResponse(data)
      }

      // If no API key or query is too short, filter mock locations
      await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API delay

      // Filter mock locations based on the query
      return mockLocations.filter(
        (location) =>
          location.name.toLowerCase().includes(query.toLowerCase()) ||
          (location.iataCode && location.iataCode.toLowerCase().includes(query.toLowerCase())) ||
          (location.cityName && location.cityName.toLowerCase().includes(query.toLowerCase())) ||
          location.countryName.toLowerCase().includes(query.toLowerCase()),
      )
    } catch (error) {
      console.error("Error searching locations:", error)
      // Fall back to mock data if the API call fails
      return mockLocations.filter(
        (location) =>
          location.name.toLowerCase().includes(query.toLowerCase()) ||
          (location.iataCode && location.iataCode.toLowerCase().includes(query.toLowerCase())) ||
          (location.cityName && location.cityName.toLowerCase().includes(query.toLowerCase())) ||
          location.countryName.toLowerCase().includes(query.toLowerCase()),
      )
    }
  }

  private transformLocationResponse(data: any): LocationSearchResult[] {
    // This would need to be implemented based on the actual Skyscanner API response format
    // For now, we'll just return mock data
    return mockLocations
  }
}

// Mock flight offers data in Skyscanner format
const mockFlightOffers: FlightOffer[] = [
  {
    id: "flight_offer_1",
    price: {
      amount: 94,
      currency: "USD",
    },
    legs: [
      {
        id: "leg_1",
        departureAirport: {
          name: "Paris Charles de Gaulle",
          code: "CDG",
          city: "Paris",
        },
        arrivalAirport: {
          name: "Madrid Barajas",
          code: "MAD",
          city: "Madrid",
        },
        departureTime: "2024-12-20T10:15:00",
        arrivalTime: "2024-12-20T12:20:00",
        duration: 125, // 2h 5m
        stops: 0,
        carriers: ["IB"],
        operatingCarriers: ["IB"],
      },
    ],
    carriers: [
      {
        id: "IB",
        name: "Iberia",
        logo: "/placeholder.svg?height=40&width=40",
      },
    ],
    deepLink: "https://www.skyscanner.com/transport/flights/cdg/mad/241220/",
  },
  {
    id: "flight_offer_2",
    price: {
      amount: 120,
      currency: "USD",
    },
    legs: [
      {
        id: "leg_2",
        departureAirport: {
          name: "Paris Orly",
          code: "ORY",
          city: "Paris",
        },
        arrivalAirport: {
          name: "Madrid Barajas",
          code: "MAD",
          city: "Madrid",
        },
        departureTime: "2024-12-20T13:50:00",
        arrivalTime: "2024-12-20T15:55:00",
        duration: 130, // 2h 10m
        stops: 0,
        carriers: ["VY"],
        operatingCarriers: ["VY"],
      },
    ],
    carriers: [
      {
        id: "VY",
        name: "Vueling",
        logo: "/placeholder.svg?height=40&width=40",
      },
    ],
    deepLink: "https://www.skyscanner.com/transport/flights/ory/mad/241220/",
  },
  {
    id: "flight_offer_3",
    price: {
      amount: 170,
      currency: "USD",
    },
    legs: [
      {
        id: "leg_3",
        departureAirport: {
          name: "Paris Charles de Gaulle",
          code: "CDG",
          city: "Paris",
        },
        arrivalAirport: {
          name: "Madrid Barajas",
          code: "MAD",
          city: "Madrid",
        },
        departureTime: "2024-12-20T07:25:00",
        arrivalTime: "2024-12-20T09:30:00",
        duration: 125, // 2h 5m
        stops: 0,
        carriers: ["UX"],
        operatingCarriers: ["UX"],
      },
    ],
    carriers: [
      {
        id: "UX",
        name: "Air Europa",
        logo: "/placeholder.svg?height=40&width=40",
      },
    ],
    deepLink: "https://www.skyscanner.com/transport/flights/cdg/mad/241220/",
  },
  {
    id: "flight_offer_4",
    price: {
      amount: 210,
      currency: "USD",
    },
    legs: [
      {
        id: "leg_4",
        departureAirport: {
          name: "Paris Charles de Gaulle",
          code: "CDG",
          city: "Paris",
        },
        arrivalAirport: {
          name: "Madrid Barajas",
          code: "MAD",
          city: "Madrid",
        },
        departureTime: "2024-12-20T07:00:00",
        arrivalTime: "2024-12-20T09:10:00",
        duration: 130, // 2h 10m
        stops: 0,
        carriers: ["AF"],
        operatingCarriers: ["AF"],
      },
    ],
    carriers: [
      {
        id: "AF",
        name: "Air France",
        logo: "/placeholder.svg?height=40&width=40",
      },
    ],
    deepLink: "https://www.skyscanner.com/transport/flights/cdg/mad/241220/",
  },
  {
    id: "flight_offer_5",
    price: {
      amount: 230,
      currency: "USD",
    },
    legs: [
      {
        id: "leg_5",
        departureAirport: {
          name: "Paris Charles de Gaulle",
          code: "CDG",
          city: "Paris",
        },
        arrivalAirport: {
          name: "Madrid Barajas",
          code: "MAD",
          city: "Madrid",
        },
        departureTime: "2024-12-20T09:05:00",
        arrivalTime: "2024-12-20T16:05:00",
        duration: 420, // 7h 0m
        stops: 1,
        carriers: ["KL"],
        operatingCarriers: ["KL"],
      },
    ],
    carriers: [
      {
        id: "KL",
        name: "KLM Royal Dutch Airlines",
        logo: "/placeholder.svg?height=40&width=40",
      },
    ],
    deepLink: "https://www.skyscanner.com/transport/flights/cdg/mad/241220/",
  },
  {
    id: "flight_offer_6",
    price: {
      amount: 150,
      currency: "USD",
    },
    legs: [
      {
        id: "leg_6",
        departureAirport: {
          name: "Paris Orly",
          code: "ORY",
          city: "Paris",
        },
        arrivalAirport: {
          name: "Madrid Barajas",
          code: "MAD",
          city: "Madrid",
        },
        departureTime: "2024-12-20T11:45:00",
        arrivalTime: "2024-12-20T13:55:00",
        duration: 130,
        stops: 0,
        carriers: ["TP"],
        operatingCarriers: ["TP"],
      },
    ],
    carriers: [
      {
        id: "TP",
        name: "TAP Air Portugal",
        logo: "/placeholder.svg?height=40&width=40",
      },
    ],
    deepLink: "https://www.skyscanner.com/transport/flights/ory/mad/241220/",
  },
  {
    id: "flight_offer_7",
    price: {
      amount: 200,
      currency: "USD",
    },
    legs: [
      {
        id: "leg_7",
        departureAirport: {
          name: "Paris Charles de Gaulle",
          code: "CDG",
          city: "Paris",
        },
        arrivalAirport: {
          name: "Madrid Barajas",
          code: "MAD",
          city: "Madrid",
        },
        departureTime: "2024-12-20T08:30:00",
        arrivalTime: "2024-12-20T12:30:00",
        duration: 240, // 4h
        stops: 1,
        carriers: ["LH"],
        operatingCarriers: ["LH"],
      },
    ],
    carriers: [
      {
        id: "LH",
        name: "Lufthansa",
        logo: "/placeholder.svg?height=40&width=40",
      },
    ],
    deepLink: "https://www.skyscanner.com/transport/flights/cdg/mad/241220/",
  },
  {
    id: "flight_offer_8",
    price: {
      amount: 180,
      currency: "USD",
    },
    legs: [
      {
        id: "leg_8",
        departureAirport: {
          name: "Paris Orly",
          code: "ORY",
          city: "Paris",
        },
        arrivalAirport: {
          name: "Madrid Barajas",
          code: "MAD",
          city: "Madrid",
        },
        departureTime: "2024-12-20T18:10:00",
        arrivalTime: "2024-12-20T20:15:00",
        duration: 125,
        stops: 0,
        carriers: ["U2"],
        operatingCarriers: ["U2"],
      },
    ],
    carriers: [
      {
        id: "U2",
        name: "easyJet",
        logo: "/placeholder.svg?height=40&width=40",
      },
    ],
    deepLink: "https://www.skyscanner.com/transport/flights/ory/mad/241220/",
  },
  {
    id: "flight_offer_9",
    price: {
      amount: 260,
      currency: "USD",
    },
    legs: [
      {
        id: "leg_9",
        departureAirport: {
          name: "Paris Charles de Gaulle",
          code: "CDG",
          city: "Paris",
        },
        arrivalAirport: {
          name: "Madrid Barajas",
          code: "MAD",
          city: "Madrid",
        },
        departureTime: "2024-12-20T06:10:00",
        arrivalTime: "2024-12-20T08:20:00",
        duration: 130,
        stops: 0,
        carriers: ["BA"],
        operatingCarriers: ["BA"],
      },
    ],
    carriers: [
      {
        id: "BA",
        name: "British Airways",
        logo: "/placeholder.svg?height=40&width=40",
      },
    ],
    deepLink: "https://www.skyscanner.com/transport/flights/cdg/mad/241220/",
  },
  {
    id: "flight_offer_10",
    price: {
      amount: 195,
      currency: "USD",
    },
    legs: [
      {
        id: "leg_10",
        departureAirport: {
          name: "Paris Charles de Gaulle",
          code: "CDG",
          city: "Paris",
        },
        arrivalAirport: {
          name: "Madrid Barajas",
          code: "MAD",
          city: "Madrid",
        },
        departureTime: "2024-12-20T19:00:00",
        arrivalTime: "2024-12-20T21:10:00",
        duration: 130,
        stops: 0,
        carriers: ["AZ"],
        operatingCarriers: ["AZ"],
      },
    ],
    carriers: [
      {
        id: "AZ",
        name: "ITA Airways",
        logo: "/placeholder.svg?height=40&width=40",
      },
    ],
    deepLink: "https://www.skyscanner.com/transport/flights/cdg/mad/241220/",
  },
]

// Mock locations data in Skyscanner format
const mockLocations: LocationSearchResult[] = [
  {
    entityId: "27539733",
    name: "Paris",
    iataCode: "PAR",
    cityName: "Paris",
    countryName: "France",
    type: "CITY",
  },
  {
    entityId: "27539734",
    name: "Charles de Gaulle Airport",
    iataCode: "CDG",
    cityName: "Paris",
    countryName: "France",
    type: "AIRPORT",
  },
  {
    entityId: "27539735",
    name: "Orly Airport",
    iataCode: "ORY",
    cityName: "Paris",
    countryName: "France",
    type: "AIRPORT",
  },
  {
    entityId: "27544850",
    name: "Madrid",
    iataCode: "MAD",
    cityName: "Madrid",
    countryName: "Spain",
    type: "CITY",
  },
  {
    entityId: "27544851",
    name: "Madrid Barajas Airport",
    iataCode: "MAD",
    cityName: "Madrid",
    countryName: "Spain",
    type: "AIRPORT",
  },
  {
    entityId: "27539800",
    name: "Barcelona",
    iataCode: "BCN",
    cityName: "Barcelona",
    countryName: "Spain",
    type: "CITY",
  },
  {
    entityId: "27539801",
    name: "Barcelona El Prat Airport",
    iataCode: "BCN",
    cityName: "Barcelona",
    countryName: "Spain",
    type: "AIRPORT",
  },
  {
    entityId: "27544123",
    name: "London",
    iataCode: "LON",
    cityName: "London",
    countryName: "United Kingdom",
    type: "CITY",
  },
  {
    entityId: "27544124",
    name: "Heathrow Airport",
    iataCode: "LHR",
    cityName: "London",
    countryName: "United Kingdom",
    type: "AIRPORT",
  },
  {
    entityId: "27544125",
    name: "Gatwick Airport",
    iataCode: "LGW",
    cityName: "London",
    countryName: "United Kingdom",
    type: "AIRPORT",
  },
  {
    entityId: "27550001",
    name: "Bhubaneswar",
    iataCode: "BBI",
    cityName: "Bhubaneswar",
    countryName: "India",
    type: "CITY",
  },
  {
    entityId: "27550002",
    name: "Biju Patnaik International Airport",
    iataCode: "BBI",
    cityName: "Bhubaneswar",
    countryName: "India",
    type: "AIRPORT",
  },
  {
    entityId: "27550003",
    name: "New Delhi",
    iataCode: "DEL",
    cityName: "New Delhi",
    countryName: "India",
    type: "CITY",
  },
  {
    entityId: "27550004",
    name: "Indira Gandhi International Airport",
    iataCode: "DEL",
    cityName: "New Delhi",
    countryName: "India",
    type: "AIRPORT",
  },
  {
    entityId: "27550005",
    name: "Mumbai",
    iataCode: "BOM",
    cityName: "Mumbai",
    countryName: "India",
    type: "CITY",
  },
  {
    entityId: "27550006",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    iataCode: "BOM",
    cityName: "Mumbai",
    countryName: "India",
    type: "AIRPORT",
  },
  {
    entityId: "27550007",
    name: "Bangalore",
    iataCode: "BLR",
    cityName: "Bangalore",
    countryName: "India",
    type: "CITY",
  },
  {
    entityId: "27550008",
    name: "Kempegowda International Airport",
    iataCode: "BLR",
    cityName: "Bangalore",
    countryName: "India",
    type: "AIRPORT",
  },
  {
    entityId: "27550009",
    name: "Hyderabad",
    iataCode: "HYD",
    cityName: "Hyderabad",
    countryName: "India",
    type: "CITY",
  },
  {
    entityId: "27550010",
    name: "Rajiv Gandhi International Airport",
    iataCode: "HYD",
    cityName: "Hyderabad",
    countryName: "India",
    type: "AIRPORT",
  },
  {
    entityId: "27550011",
    name: "Kolkata",
    iataCode: "CCU",
    cityName: "Kolkata",
    countryName: "India",
    type: "CITY",
  },
  {
    entityId: "27550012",
    name: "Netaji Subhash Chandra Bose International Airport",
    iataCode: "CCU",
    cityName: "Kolkata",
    countryName: "India",
    type: "AIRPORT",
  },
]

export const skyscanner = new SkyscannerAPI()
