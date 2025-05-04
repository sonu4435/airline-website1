"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plane, Hotel, Car, ArrowLeft, Download, Printer } from "lucide-react"
import FlightHeader from "@/components/flight-header"
import { jwtDecode } from "jwt-decode"
import { toast } from "@/components/ui/use-toast"

interface UserData {
  userId: string
  name: string
  email: string
}

interface Booking {
  id: string
  type: "flight" | "hotel" | "car"
  status: "upcoming" | "completed" | "cancelled"
  destination: string
  date: string
  price: number
  details: {
    [key: string]: any
  }
}

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(";")
      const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth_token="))

      if (authCookie) {
        const token = authCookie.split("=")[1]
        try {
          const decoded = jwtDecode<UserData>(token)
          setUserData(decoded)
          setIsLoading(false)
          fetchBooking(params.id)
        } catch (error) {
          console.error("Invalid token:", error)
          setIsLoading(false)
          router.push("/auth")
        }
      } else {
        setIsLoading(false)
        router.push("/auth")
      }
    }

    checkAuth()
  }, [router, params.id])

  const fetchBooking = async (id: string) => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const mockBooking: Booking = {
      id,
      type: "flight",
      status: "upcoming",
      destination: "Paris, France",
      date: "2024-12-15",
      price: 450,
      details: {
        airline: "Air France",
        flightNumber: "AF1234",
        departureTime: "10:30",
        arrivalTime: "12:45",
        origin: "New York",
        departureAirport: "JFK",
        arrivalAirport: "CDG",
        duration: 440, // in minutes
        passengers: [
          {
            name: "John Doe",
            type: "Adult",
            seat: "14A",
          },
        ],
        cabin: "Economy",
        baggage: "1 checked bag (23kg)",
      },
    }

    setBooking(mockBooking)
  }

  const handleCancelBooking = async () => {
    setIsCancelling(true)

    try {
      // In a real app, this would make an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update the booking status
      const response = await fetch(`/api/bookings/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel booking")
      }

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      })

      // Update the booking in state
      if (booking) {
        setBooking({
          ...booking,
          status: "cancelled",
        })
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        title: "Cancellation Failed",
        description: "There was an error cancelling your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <FlightHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </main>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <FlightHeader />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Bookings
            </Button>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 mb-4">Booking not found</p>
                <Button onClick={() => router.push("/bookings")}>View All Bookings</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FlightHeader />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Bookings
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Booking Details</h1>
              <p className="text-gray-600">Booking ID: {booking.id}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-full ${
                      booking.type === "flight"
                        ? "bg-blue-100"
                        : booking.type === "hotel"
                          ? "bg-green-100"
                          : "bg-orange-100"
                    }`}
                  >
                    {booking.type === "flight" ? (
                      <Plane
                        className={`h-6 w-6 ${
                          booking.type === "flight"
                            ? "text-blue-600"
                            : booking.type === "hotel"
                              ? "text-green-600"
                              : "text-orange-600"
                        }`}
                      />
                    ) : booking.type === "hotel" ? (
                      <Hotel className="h-6 w-6 text-green-600" />
                    ) : (
                      <Car className="h-6 w-6 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl capitalize">{booking.type} Booking</CardTitle>
                    <p className="text-gray-500">
                      {booking.type === "flight"
                        ? `${booking.details.origin} to ${booking.destination}`
                        : booking.destination}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    booking.status === "upcoming"
                      ? "bg-blue-100 text-blue-800"
                      : booking.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {booking.type === "flight" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Airline</p>
                      <p className="font-medium">{booking.details.airline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Flight Number</p>
                      <p className="font-medium">{booking.details.flightNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Date</p>
                      <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                    <div>
                      <div className="text-2xl font-semibold">{booking.details.departureTime}</div>
                      <div className="text-sm text-gray-500">{booking.details.departureAirport}</div>
                      <div className="text-sm">{booking.details.origin}</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-sm text-gray-500 mb-1">{formatDuration(booking.details.duration)}</div>
                      <div className="relative w-24 md:w-32">
                        <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
                        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                          <Plane className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-2xl font-semibold">{booking.details.arrivalTime}</div>
                      <div className="text-sm text-gray-500">{booking.details.arrivalAirport}</div>
                      <div className="text-sm">{booking.destination}</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Cabin</p>
                      <p className="font-medium">{booking.details.cabin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Baggage</p>
                      <p className="font-medium">{booking.details.baggage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Price</p>
                      <p className="font-medium">${booking.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Passenger Information</h3>
                    <div className="space-y-4">
                      {booking.details.passengers.map((passenger: any, index: number) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-3 bg-gray-50 rounded-md">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Passenger Name</p>
                            <p className="font-medium">{passenger.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Type</p>
                            <p className="font-medium">{passenger.type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Seat</p>
                            <p className="font-medium">{passenger.seat}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {booking.status === "upcoming" && (
                <div className="mt-6">
                  <Button
                    variant="destructive"
                    onClick={handleCancelBooking}
                    disabled={isCancelling}
                    className="w-full md:w-auto"
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Booking"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you need assistance with your booking, please contact our customer support team.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full">
                  FAQ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
