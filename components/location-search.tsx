"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

interface LocationSearchProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

interface Location {
  entityId: string
  name: string
  iataCode?: string
  cityName?: string
  countryName: string
  type: "PLACE" | "AIRPORT" | "CITY"
}

export default function LocationSearch({ id, label, value, onChange, placeholder }: LocationSearchProps) {
  const [query, setQuery] = useState(value)
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchLocations = async () => {
      if (debouncedQuery.length < 2) {
        setLocations([])
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`/api/locations?query=${encodeURIComponent(debouncedQuery)}`)

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success && data.data) {
          setLocations(data.data)
        } else {
          setLocations([])
        }
      } catch (error) {
        console.error("Error fetching locations:", error)
        setLocations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [debouncedQuery])

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

  const handleLocationSelect = (location: Location) => {
    const formattedLocation = `${location.iataCode || ""}, ${location.name} ${location.countryName}`.trim()
    setQuery(formattedLocation)
    onChange(formattedLocation)
    setShowResults(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
          ) : locations.length > 0 ? (
            <ul>
              {locations.map((location) => (
                <li
                  key={location.entityId}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="font-medium">
                    {location.name} {location.iataCode && `(${location.iataCode})`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {location.type === "AIRPORT" && location.cityName ? `${location.cityName}, ` : ""}
                    {location.countryName}
                  </div>
                </li>
              ))}
            </ul>
          ) : debouncedQuery.length >= 2 ? (
            <div className="p-2 text-center text-sm text-gray-500">No locations found</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
