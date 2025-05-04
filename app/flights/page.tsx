"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import AirportSearch from "@/components/airport-search"
import FlightHeader from "@/components/flight-header"

export default function FlightsPage() {
  const searchParams = useSearchParams()
  const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date())
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [flightClass, setFlightClass] = useState("ECONOMY")
  const [isSearching, setIsSearching] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Validate form
    if (!from) {
      setFormError("Please enter a correct departure location")
      return
    }

    if (!to) {
      setFormError("Please enter a correct destination")
      return
    }

    if (!departureDate) {
      setFormError("Please select a departure date")
      return
    }

    setIsSearching(true)

    // Navigate to search results
    const formattedDate = format(departureDate, "yyyy-MM-dd")
    router.push(
      `/flights/search?from=${from}&to=${to}&date=${formattedDate}&passengers=${passengers}&class=${flightClass}`,
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FlightHeader />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-4">
          <Card className="mt-8">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-6">Search Flights</h1>
              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">{formError}</div>
              )}

              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <AirportSearch id="from" value={from} onChange={setFrom} placeholder="City or airport" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <AirportSearch id="to" value={to} onChange={setTo} placeholder="City or airport" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label>Departure Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {departureDate ? format(departureDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={departureDate}
                          onSelect={setDepartureDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Passengers</Label>
                    <Select value={passengers} onValueChange={setPassengers}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select passengers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Passenger</SelectItem>
                        <SelectItem value="2">2 Passengers</SelectItem>
                        <SelectItem value="3">3 Passengers</SelectItem>
                        <SelectItem value="4">4 Passengers</SelectItem>
                        <SelectItem value="5">5 Passengers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select value={flightClass} onValueChange={setFlightClass}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ECONOMY">Economy</SelectItem>
                        <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                        <SelectItem value="BUSINESS">Business</SelectItem>
                        <SelectItem value="FIRST">First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto" disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search Flights"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
