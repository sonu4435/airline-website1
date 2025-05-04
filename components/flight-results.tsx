"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface FlightResultsProps {
  from: string
  to: string
  departureDate?: Date
  passengers: number
  flightClass: string
  onNewSearch: () => void
}

interface Flight {
  id: string
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
  duration: number // in minutes
  stops: number
}

// Mock airline logos
const airlineLogos: Record<string, string> = {
  "Air France": "/placeholder.svg?height=40&width=40",
  "British Airways": "/placeholder.svg?height=40&width=40",
  Lufthansa: "/placeholder.svg?height=40&width=40",
  Emirates: "/placeholder.svg?height=40&width=40",
  Delta: "/placeholder.svg?height=40&width=40",
  United: "/placeholder.svg?height=40&width=40",
}

export default function FlightResults({ from, to, departureDate, passengers, flightClass, onNewSearch }: FlightResultsProps) {
  const [sortBy, setSortBy] = useState("price")
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedFlight, setExpandedFlight] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true)
        setError(null)

        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
        
        // Mock flights data
        const mockFlights: Flight[] = [
          {
            id: "flight1",
            flightNumber: "AF1234",
            airline: "Air France",
            departureAirport: from,
            arrivalAirport: to,
            departureCity: "Paris",
            arrivalCity: "New York",
            departureTime: "2023-12-15T08:30:00",
            arrivalTime: "2023-12-15T11:45:00",
            price: 450 * passengers,
            availableSeats: 45,
            aircraft: "Boeing 777",
            duration: 435, // 7h 15m
            stops: 0
          },
          {
            id: "flight2",
            flightNumber: "BA2345",
            airline: "British Airways",
            departureAirport: from,
            arrivalAirport: to,
            departureCity: "Paris",
            arrivalCity: "New York",
            departureTime: "2023-12-15T10:15:00",
            arrivalTime: "2023-12-15T13:30:00",
            price: 520 * passengers,
            availableSeats: 32,
            aircraft: "Airbus A330",
            duration: 435, // 7h 15m
            stops: 0
          },
          {
            id: "flight3",
            flightNumber: "LH5678",
            airline: "Lufthansa",
            departureAirport: from,
            arrivalAirport: to,
            departureCity: "Paris",
            arrivalCity: "New York",
            departureTime: "2023-12-15T14:45:00",
            arrivalTime: "2023-12-15T19:15:00",
            price: 380 * passengers,
            availableSeats: 18,
            aircraft: "Airbus A340",
            duration: 510, // 8h 30m
            stops: 1
          },
          {
            id: "flight4",
            flightNumber: "EK7890",
            airline: "Emirates",
            departureAirport: from,
            arrivalAirport: to,
            departureCity: "Paris",
            arrivalCity: "New York",
            departureTime: "2023-12-15T16:20:00",
            arrivalTime: "2023-12-15T20:45:00",
            price: 620 * passengers,
            availableSeats: 52,
            aircraft: "Boeing 787",
            duration: 505, // 8h 25m
            stops: 0
          },
          {
            id: "flight5",
            flightNumber: "DL4567",
            airline: "Delta",
            departureAirport: from,
            arrivalAirport: to,
            departureCity: "Paris",
            arrivalCity: "New York",
            departureTime: "2023-12-15T07:10:00",
            arrivalTime: "2023-12-15T12:25:00",
            price: 490 * passengers,
            availableSeats: 27,
            aircraft: "Airbus A350",
            duration: 555, // 9h 15m
            stops: 1
          }
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
  }, [from, to, departureDate, passengers])

  // Sort flights based on selected criteria
  const getSortedFlights = () => {
    if (!flights.length) return []

    return [...flights].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "duration") return a.duration - b.duration
      if (sortBy === "departure") return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
      if (sortBy === "arrival") return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime()
      return 0
    })
  }

  const sortedFlights = getSortedFlights()

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const handleSelectFlight = (flight: Flight) => {
    // In a real app, this would store the selected flight in state or context
    // and navigate to the booking page
    router.push(`/booking?flightId=${flight.id}&passengers=${passengers}&class=${flightClass}`)
  }

  const toggleFlightDetails = (flightId: string) => {
    if (expandedFlight === flightId) {
      setExpandedFlight(null)
    } else {
      setExpandedFlight(flightId)
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Flight Results</h1>
          <div className="text-gray-600">
            {from} to {to} · {departureDate ? format(departureDate, "EEE, d MMM yyyy") : ""} · 
            {passengers} {passengers === 1 ? "Passenger" : "Passengers"} · {flightClass.replace("_", " ")}
          </div>
        </div>
        <Button onClick={onNewSearch} variant="outline">
          Modify Search
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">\
