"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { format, parseISO } from "date-fns"
import { ArrowRight, Clock, Luggage, AlertCircle } from "lucide-react"
import Header from "@/components/header"
import FlightHeader from "@/components/flight-header"

interface Flight {
  _id: string
  flightNumber: string
  airline: string
  departureAirport: string
  arrivalAirport: string
  departureCity: string
  arrivalCity: string
  departureTime: string
  arrivalTime: string
  price: number
  availableSeats: number
  aircraft: string
  status: string
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const dateStr = searchParams.get("date") || ""
  const passengers = Number.parseInt(searchParams.get("passengers") || "1")
  const flightClass = searchParams.get("class") || "ECONOMY"

  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("price")

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true)
        setError(null)

        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

        // Mock flights data
        const flightTemplates: Record<string, Flight[]> = {
          "delhi-bengaluru": [
            {
              _id: "delhi-blr-1",
              flightNumber: "AI202",
              airline: "Air India",
              departureAirport: "DEL",
              arrivalAirport: "BLR",
              departureCity: "Delhi",
              arrivalCity: "Bengaluru",
              departureTime: `${dateStr}T08:00:00`,
              arrivalTime: `${dateStr}T10:30:00`,
              price: 3200,
              availableSeats: 20,
              aircraft: "Airbus A320",
              status: "scheduled",
            },
          ],
          "mumbai-goa": [
            {
              _id: "bom-goa-1",
              flightNumber: "G8134",
              airline: "Go First",
              departureAirport: "BOM",
              arrivalAirport: "GOI",
              departureCity: "Mumbai",
              arrivalCity: "Goa",
              departureTime: `${dateStr}T09:15:00`,
              arrivalTime: `${dateStr}T10:30:00`,
              price: 2500,
              availableSeats: 15,
              aircraft: "ATR 72",
              status: "scheduled",
            },
          ],
          "kolkata-chennai": [
            {
              _id: "ccu-maa-1",
              flightNumber: "SG241",
              airline: "SpiceJet",
              departureAirport: "CCU",
              arrivalAirport: "MAA",
              departureCity: "Kolkata",
              arrivalCity: "Chennai",
              departureTime: `${dateStr}T06:45:00`,
              arrivalTime: `${dateStr}T09:10:00`,
              price: 4000,
              availableSeats: 10,
              aircraft: "Boeing 737",
              status: "scheduled",
            },
          ],
          "paris-new york": [
            {
              _id: "paris-ny-1",
              flightNumber: "AF1234",
              airline: "Air France",
              departureAirport: "CDG",
              arrivalAirport: "JFK",
              departureCity: "Paris",
              arrivalCity: "New York",
              departureTime: `${dateStr}T08:30:00`,
              arrivalTime: `${dateStr}T11:45:00`,
              price: 450,
              availableSeats: 45,
              aircraft: "Boeing 777",
              status: "scheduled",
            },
          ],
          "bangalore-hyderabad": [
            {
              _id: "blr-hyd-1",
              flightNumber: "6E301",
              airline: "IndiGo",
              departureAirport: "BLR",
              arrivalAirport: "HYD",
              departureCity: "Bangalore",
              arrivalCity: "Hyderabad",
              departureTime: `${dateStr}T07:45:00`,
              arrivalTime: `${dateStr}T08:55:00`,
              price: 2100,
              availableSeats: 12,
              aircraft: "ATR 72",
              status: "scheduled",
            },
          ],
          "pune-kochi": [
            {
              _id: "pnq-cok-1",
              flightNumber: "IX211",
              airline: "Air India Express",
              departureAirport: "PNQ",
              arrivalAirport: "COK",
              departureCity: "Pune",
              arrivalCity: "Kochi",
              departureTime: `${dateStr}T05:50:00`,
              arrivalTime: `${dateStr}T07:40:00`,
              price: 2900,
              availableSeats: 17,
              aircraft: "Boeing 737",
              status: "scheduled",
            },
          ],
          "ahmedabad-jaipur": [
            {
              _id: "amd-jai-1",
              flightNumber: "9W542",
              airline: "Jet Airways",
              departureAirport: "AMD",
              arrivalAirport: "JAI",
              departureCity: "Ahmedabad",
              arrivalCity: "Jaipur",
              departureTime: `${dateStr}T10:20:00`,
              arrivalTime: `${dateStr}T11:45:00`,
              price: 2400,
              availableSeats: 21,
              aircraft: "Bombardier Q400",
              status: "scheduled",
            },
          ],
          "new york-los angeles": [
            {
              _id: "ny-la-1",
              flightNumber: "DL405",
              airline: "Delta",
              departureAirport: "JFK",
              arrivalAirport: "LAX",
              departureCity: "New York",
              arrivalCity: "Los Angeles",
              departureTime: `${dateStr}T14:00:00`,
              arrivalTime: `${dateStr}T17:30:00`,
              price: 320,
              availableSeats: 30,
              aircraft: "Boeing 757",
              status: "scheduled",
            },
          ],
          "delhi-goa": [
            {
              _id: "delhi-goa-1",
              flightNumber: "6E812",
              airline: "IndiGo",
              departureAirport: "DEL",
              arrivalAirport: "GOI",
              departureCity: "Delhi",
              arrivalCity: "Goa",
              departureTime: `${dateStr}T11:20:00`,
              arrivalTime: `${dateStr}T13:50:00`,
              price: 3700,
              availableSeats: 18,
              aircraft: "Airbus A320",
              status: "scheduled",
            },
          ],
          "mumbai-kolkata": [
            {
              _id: "bom-ccu-1",
              flightNumber: "AI611",
              airline: "Air India",
              departureAirport: "BOM",
              arrivalAirport: "CCU",
              departureCity: "Mumbai",
              arrivalCity: "Kolkata",
              departureTime: `${dateStr}T06:30:00`,
              arrivalTime: `${dateStr}T09:20:00`,
              price: 4300,
              availableSeats: 22,
              aircraft: "Boeing 737",
              status: "scheduled",
            },
          ],
          "hyderabad-chennai": [
            {
              _id: "hyd-maa-1",
              flightNumber: "SG401",
              airline: "SpiceJet",
              departureAirport: "HYD",
              arrivalAirport: "MAA",
              departureCity: "Hyderabad",
              arrivalCity: "Chennai",
              departureTime: `${dateStr}T08:40:00`,
              arrivalTime: `${dateStr}T10:00:00`,
              price: 2100,
              availableSeats: 16,
              aircraft: "ATR 72",
              status: "scheduled",
            },
          ],
          "chennai-kochi": [
            {
              _id: "maa-cok-1",
              flightNumber: "6E321",
              airline: "IndiGo",
              departureAirport: "MAA",
              arrivalAirport: "COK",
              departureCity: "Chennai",
              arrivalCity: "Kochi",
              departureTime: `${dateStr}T17:00:00`,
              arrivalTime: `${dateStr}T18:10:00`,
              price: 1900,
              availableSeats: 20,
              aircraft: "ATR 72",
              status: "scheduled",
            },
          ],
          "goa-jaipur": [
            {
              _id: "goa-jai-1",
              flightNumber: "I5198",
              airline: "AirAsia India",
              departureAirport: "GOI",
              arrivalAirport: "JAI",
              departureCity: "Goa",
              arrivalCity: "Jaipur",
              departureTime: `${dateStr}T13:10:00`,
              arrivalTime: `${dateStr}T15:30:00`,
              price: 3500,
              availableSeats: 11,
              aircraft: "Airbus A320",
              status: "scheduled",
            },
          ],
        }

        const routeKey = `${from.toLowerCase()}-${to.toLowerCase()}`
        const mockFlights = flightTemplates[routeKey] || []

        setFlights(mockFlights)
      } catch (err) {
        console.error("Error fetching flights:", err)
        setError((err as Error).message || "Failed to fetch flights")
      } finally {
        setLoading(false)
      }
    }

    fetchFlights()
  }, [from, to, dateStr])

  // Sort flights based on selected criteria
  const getSortedFlights = () => {
    if (!flights.length) return []

    return [...flights].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "departure") return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
      if (sortBy === "arrival") return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime()
      return 0
    })
  }

  const sortedFlights = getSortedFlights()

  // Calculate duration between departure and arrival
  const calculateDuration = (departure: string, arrival: string) => {
    const departureTime = new Date(departure).getTime()
    const arrivalTime = new Date(arrival).getTime()
    const durationMs = arrivalTime - departureTime
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const handleSelectFlight = (flight: Flight) => {
    router.push(`/booking?flightId=${flight._id}&passengers=${passengers}&class=${flightClass}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FlightHeader />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Flight Results</h1>
              <div className="text-gray-600">
                {from} to {to} · {dateStr ? format(new Date(dateStr), "EEE, d MMM yyyy") : ""} ·{passengers}{" "}
                {passengers === 1 ? "Passenger" : "Passengers"} · {flightClass.replace("_", " ")}
              </div>
            </div>
            <Button onClick={() => router.push("/flights")} variant="outline">
              Modify Search
            </Button>
          </div>

          <div className="mb-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Button variant={sortBy === "price" ? "default" : "outline"} onClick={() => setSortBy("price")}>
                    Price
                  </Button>
                  <Button
                    variant={sortBy === "departure" ? "default" : "outline"}
                    onClick={() => setSortBy("departure")}
                  >
                    Departure Time
                  </Button>
                  <Button variant={sortBy === "arrival" ? "default" : "outline"} onClick={() => setSortBy("arrival")}>
                    Arrival Time
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <Card className="p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h3 className="text-xl font-semibold">Error Loading Flights</h3>
                <p className="text-gray-600">{error}</p>
                <Button onClick={() => router.push("/flights")}>Try Another Search</Button>
              </div>
            </Card>
          ) : sortedFlights.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <AlertCircle className="h-12 w-12 text-amber-500" />
                <h3 className="text-xl font-semibold">No Flights Found</h3>
                <p className="text-gray-600">We couldn't find any flights matching your search criteria.</p>
                <Button onClick={() => router.push("/flights")}>Try Another Search</Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedFlights.map((flight) => (
                <Card key={flight._id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] border-b">
                      <div className="p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{flight.airline}</h3>
                          <span className="text-sm text-gray-500">• {flight.flightNumber}</span>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">{flight.aircraft}</div>
                      </div>

                      <div className="bg-gray-50 p-4 md:p-6 flex flex-col justify-center items-end">
                        <div className="text-2xl font-bold">${flight.price * passengers}</div>
                        <div className="text-sm text-gray-500">
                          {passengers} {passengers === 1 ? "passenger" : "passengers"}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-center">
                      <div>
                        <div className="text-2xl font-semibold">{format(parseISO(flight.departureTime), "HH:mm")}</div>
                        <div className="text-sm text-gray-500">{flight.departureAirport}</div>
                        <div className="text-sm text-gray-500">{flight.departureCity}</div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="text-sm text-gray-500 mb-1">
                          {calculateDuration(flight.departureTime, flight.arrivalTime)}
                        </div>
                        <div className="relative w-24 md:w-32">
                          <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
                          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-2xl font-semibold">{format(parseISO(flight.arrivalTime), "HH:mm")}</div>
                        <div className="text-sm text-gray-500">{flight.arrivalAirport}</div>
                        <div className="text-sm text-gray-500">{flight.arrivalCity}</div>
                      </div>

                      <div>
                        <Button onClick={() => handleSelectFlight(flight)}>Select</Button>
                      </div>
                    </div>

                    <div className="px-4 pb-4 md:px-6 md:pb-6 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{calculateDuration(flight.departureTime, flight.arrivalTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Luggage className="h-4 w-4" />
                        <span>Cabin: 7 kg</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
