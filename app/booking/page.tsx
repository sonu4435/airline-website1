"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format, parseISO } from "date-fns"
import { ArrowRight, Clock, Luggage, AlertCircle } from "lucide-react"
import Header from "@/components/header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

interface PassengerForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  passportNumber: string
}

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const flightId = searchParams.get("flightId") || ""
  const passengersCount = Number.parseInt(searchParams.get("passengers") || "1")
  const flightClass = searchParams.get("class") || "ECONOMY"

  const [flight, setFlight] = useState<Flight | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passengers, setPassengers] = useState<PassengerForm[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        setLoading(true)
        setError(null)

        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

        // Mock flight data
        const mockFlight: Flight = {
          _id: flightId,
          flightNumber: "AF1234",
          airline: "Air France",
          departureAirport: "JFK",
          arrivalAirport: "CDG",
          departureCity: "New York",
          arrivalCity: "Paris",
          departureTime: "2023-12-15T08:30:00",
          arrivalTime: "2023-12-15T20:45:00",
          price: 43550,
          availableSeats: 45,
          aircraft: "Boeing 777",
          status: "scheduled",
        }

        setFlight(mockFlight)

        // Initialize passenger forms
        const initialPassengers = Array(passengersCount)
          .fill(null)
          .map(() => ({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            passportNumber: "",
          }))

        setPassengers(initialPassengers)
      } catch (err) {
        console.error("Error fetching flight:", err)
        setError((err as Error).message || "Failed to fetch flight")
      } finally {
        setLoading(false)
      }
    }

    fetchFlight()
  }, [flightId, passengersCount])

  // Calculate duration between departure and arrival
  const calculateDuration = (departure: string, arrival: string) => {
    const departureTime = new Date(departure).getTime()
    const arrivalTime = new Date(arrival).getTime()
    const durationMs = arrivalTime - departureTime
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const handlePassengerChange = (index: number, field: keyof PassengerForm, value: string) => {
    const updatedPassengers = [...passengers]
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value }
    setPassengers(updatedPassengers)
  }

  const validateForm = () => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i]
      if (!p.firstName || !p.lastName || !p.email) {
        setFormError(`Please fill in all required fields for Passenger ${i + 1}`)
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Instead of confirming booking here, show payment modal
      setShowPayment(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePayment = async () => {
    setPaymentLoading(true)
    setPaymentError(null)
    try {
      // Prepare booking data
      const bookingData = {
        flightId: flight?._id,
        passengers,
        totalPrice: flight!.price * passengersCount,
        flightClass,
      }

      // Send booking to API
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const data = await response.json()
        setPaymentError(data.error || "Failed to confirm booking. Please try again.")
        setPaymentLoading(false)
        return
      }

      setPaymentLoading(false)
      setShowPayment(false)
      router.push("/bookings")
    } catch (err) {
      setPaymentError("An error occurred while confirming your booking.")
      setPaymentLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </main>
      </div>
    )
  }

  if (error || !flight) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex justify-center items-center p-4">
          <Card className="w-full max-w-lg text-center">
            <CardContent className="pt-6">Let's create our check-in page:</CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-4">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Booking Confirmation</CardTitle>
          </CardHeader>
          <CardContent>
            {flight ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Flight Details</h3>
                    <p>
                      <Clock className="inline-block mr-1 h-4 w-4" />
                      {format(parseISO(flight.departureTime), "EEE, d MMM yyyy HH:mm")} -{" "}
                      {format(parseISO(flight.arrivalTime), "HH:mm")}
                    </p>
                    <p>
                      <ArrowRight className="inline-block mr-1 h-4 w-4" />
                      {flight.departureCity} to {flight.arrivalCity}
                    </p>
                    <p>
                      <Clock className="inline-block mr-1 h-4 w-4" />
                      Duration: {calculateDuration(flight.departureTime, flight.arrivalTime)}
                    </p>
                    <p>
                      <Luggage className="inline-block mr-1 h-4 w-4" />
                      Airline: {flight.airline} - Flight Number: {flight.flightNumber}
                    </p>
                    <p>Status: {flight.status}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Passenger Information</h3>
                    <p>Number of Passengers: {passengersCount}</p>
                    <p>Class: {flightClass}</p>
                    <p>Price per passenger: ₹{flight.price}</p>
                    <p className="font-semibold">Total Price: ₹{flight.price * passengersCount}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-4">
                  {formError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}
                  <h3 className="text-lg font-semibold mt-4">Passenger Details</h3>
                  {passengers.map((passenger, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                      <h4 className="text-md font-semibold">Passenger {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`firstName-${index}`}>First Name</Label>
                          <Input
                            type="text"
                            id={`firstName-${index}`}
                            value={passenger.firstName}
                            onChange={(e) => handlePassengerChange(index, "firstName", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                          <Input
                            type="text"
                            id={`lastName-${index}`}
                            value={passenger.lastName}
                            onChange={(e) => handlePassengerChange(index, "lastName", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`email-${index}`}>Email</Label>
                          <Input
                            type="email"
                            id={`email-${index}`}
                            value={passenger.email}
                            onChange={(e) => handlePassengerChange(index, "email", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`phone-${index}`}>Phone</Label>
                          <Input
                            type="tel"
                            id={`phone-${index}`}
                            value={passenger.phone}
                            onChange={(e) => handlePassengerChange(index, "phone", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`dateOfBirth-${index}`}>Date of Birth</Label>
                          <Input
                            type="date"
                            id={`dateOfBirth-${index}`}
                            value={passenger.dateOfBirth}
                            onChange={(e) => handlePassengerChange(index, "dateOfBirth", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`passportNumber-${index}`}>Passport Number</Label>
                          <Input
                            type="text"
                            id={`passportNumber-${index}`}
                            value={passenger.passportNumber}
                            onChange={(e) => handlePassengerChange(index, "passportNumber", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <CardFooter className="justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Confirm Booking"}
                    </Button>
                  </CardFooter>
                </form>
              </>
            ) : (
              <p>No flight details found.</p>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Dummy Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Card Number" />
            <Input placeholder="Expiry (MM/YY)" />
            <Input placeholder="CVV" />
            {paymentError && <div className="text-red-500">{paymentError}</div>}
            <Button className="w-full bg-green-600" onClick={handlePayment} disabled={paymentLoading}>
              {paymentLoading ? "Processing..." : "Pay & Confirm Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
