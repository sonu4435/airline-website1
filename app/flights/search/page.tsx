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
        const mockFlights: Flight[] = [
          {
            _id: "flight1",
            flightNumber: "AF1234",
            airline: "Air France",
            departureAirport: from,
            arrivalAirport: to,
            departureCity: "Paris",
            arrivalCity: "New York",
            departureTime: "2023-12-15T08:30:00",
            arrivalTime: "2023-12-15T11:45:00",
            price: 45099,
            availableSeats: 45,
            aircraft: "Boeing 777",
            status: "scheduled",
          },
          {
            _id: "flight2",
            flightNumber: "BA2345",
            airline: "British Airways",
            departureAirport: from,
            arrivalAirport: to,
            departureCity: "Paris",
            arrivalCity: "New York",
            departureTime: "2023-12-15T10:15:00",
            arrivalTime: "2023-12-15T13:30:00",
            price: 52120,
            availableSeats: 32,
            aircraft: "Airbus A330",
            status: "scheduled",
          },
          {
            _id: "flight3",
            flightNumber: "LH5678",
            airline: "lufficus",
            departureAirport: from,
            arrivalAirport: to,
            departureCity: "Paris",
            arrivalCity: "New York",
            departureTime: "2023-12-15T14:45:00",
            arrivalTime: "2023-12-15T19:15:00",
            price: 37500,
            availableSeats: 18,
            aircraft: "Airbus A340",
            status: "scheduled",
          },
          {
            _id: "flight4",
            flightNumber: "EK7890",
            airline: "Emirates",
            departureAirport: from,
            arrivalAirport: to,
            departureCity: "Paris",
            arrivalCity: "New York",
            departureTime: "2023-12-15T16:20:00",
            arrivalTime: "2023-12-15T20:45:00",
            price: 62000,
            availableSeats: 52,
            aircraft: "Boeing 787",
            status: "scheduled",
          },
          {
            _id: "flight5",
            flightNumber: "DL4567",
            airline: "Delta",
            departureAirport: from,
            arrivalAirport: to,
            departureCity: "Paris",
            arrivalCity: "New York",
            departureTime: "2023-12-15T07:10:00",
            arrivalTime: "2023-12-15T12:25:00",
            price: 49900,
            availableSeats: 27,
            aircraft: "Airbus A350",
            status: "scheduled",
          },
        ]

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
      router.push(
          `/booking?flightId=${flight._id}&passengers=${passengers}&class=${flightClass}&price=${flight.price}&departureAirport=${flight.departureAirport}&arrivalAirport=${flight.arrivalAirport}&departureTime=${flight.departureTime}&arrivalTime=${flight.arrivalTime}&airline=${flight.airline}&flightNumber=${flight.flightNumber}&status=${flight.status}`
            )
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
                        <div className="text-2xl font-bold">₹{flight.price * passengers}</div>
                        <div className="text-sm text-gray-500">
                          {passengers} {passengers === 1 ? "passenger" : "passengers"}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-center">
                      <div>
                        <div className="text-2xl font-semibold">{format(parseISO(flight.departureTime), "HH:mm")}</div>
                        <div className="text-sm text-gray-500">{flight.departureAirport}</div>
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
  )}