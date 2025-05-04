"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Plane } from "lucide-react"

interface AirportSearchProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

interface Airport {
  code: string
  name: string
  city: string
  country: string
}

// Mock airports data
const mockAirports: Airport[] = [
  { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA" },
  { code: "LHR", name: "Heathrow Airport", city: "London", country: "UK" },
  { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
  { code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "USA" },
  { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "UAE" },
  { code: "HND", name: "Haneda Airport", city: "Tokyo", country: "Japan" },
  { code: "SIN", name: "Changi Airport", city: "Singapore", country: "Singapore" },
  { code: "AMS", name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "Netherlands" },
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey" },

  // Added Indian airports
  { code: "DEL", name: "Indira Gandhi International Airport", city: "Delhi", country: "India" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India" },
  { code: "BLR", name: "Kempegowda International Airport", city: "Bengaluru", country: "India" },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", country: "India" },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai", country: "India" },
  { code: "GOI", name: "Goa International Airport", city: "Goa", country: "India" },
  { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", country: "India" },
  { code: "PNQ", name: "Pune Airport", city: "Pune", country: "India" },
  { code: "COK", name: "Cochin International Airport", city: "Kochi", country: "India" },
  { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", country: "India" },
  { code: "JAI", name: "Jaipur International Airport", city: "Jaipur", country: "India" }
]


export default function AirportSearch({ id, value, onChange, placeholder }: AirportSearchProps) {
  const [query, setQuery] = useState(value)
  const [airports, setAirports] = useState<Airport[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchAirports = async () => {
      if (query.length < 2) {
        setAirports([])
        return
      }

      try {
        setIsLoading(true)

        // In a real app, this would be an API call
        // For now, we'll filter the mock data
        const results = mockAirports.filter(
          (airport) =>
            airport.code.toLowerCase().includes(query.toLowerCase()) ||
            airport.name.toLowerCase().includes(query.toLowerCase()) ||
            airport.city.toLowerCase().includes(query.toLowerCase()) ||
            airport.country.toLowerCase().includes(query.toLowerCase()),
        )

        setAirports(results)
      } catch (error) {
        console.error("Error fetching airports:", error)
        setAirports([])
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce the search
    const timer = setTimeout(() => {
      fetchAirports()
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleAirportSelect = (airport: Airport) => {
    const formattedAirport = `${airport.code} - ${airport.city}, ${airport.country}`
    setQuery(formattedAirport)
    onChange(airport.code)
    setShowResults(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Plane className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id={id}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>

      {showResults && (
        <div
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div className="p-2 text-center text-sm text-gray-500">Loading...</div>
          ) : airports.length > 0 ? (
            <ul>
              {airports.map((airport) => (
                <li
                  key={airport.code}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAirportSelect(airport)}
                >
                  <div className="font-medium">
                    {airport.code} - {airport.city}
                  </div>
                  <div className="text-xs text-gray-500">
                    {airport.name}, {airport.country}
                  </div>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-2 text-center text-sm text-gray-500">No airports found</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
