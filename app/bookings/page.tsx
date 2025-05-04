"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plane, Hotel, Car, Calendar, Clock, MapPin, Search, Filter } from "lucide-react"
import FlightHeader from "@/components/flight-header"
import { jwtDecode } from "jwt-decode"

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

export default function BookingsPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchQuery, setSearchQuery] = useState("")
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
          fetchBookings()
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
  }, [router])

  const fetchBookings = async () => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const mockBookings: Booking[] = [
      {
        id: "booking1",
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
        },
      },
      {
        id: "booking2",
        type: "hotel",
        status: "upcoming",
        destination: "Paris, France",
        date: "2024-12-15",
        price: 780,
        details: {
          hotel: "Grand Hotel Paris",
          checkIn: "2024-12-15",
          checkOut: "2024-12-20",
          roomType: "Deluxe Double",
          nights: 5,
        },
      },
      {
        id: "booking3",
        type: "flight",
        status: "completed",
        destination: "London, UK",
        date: "2024-05-10",
        price: 320,
        details: {
          airline: "British Airways",
          flightNumber: "BA789",
          departureTime: "14:15",
          arrivalTime: "16:30",
          origin: "New York",
        },
      },
      {
        id: "booking4",
        type: "car",
        status: "upcoming",
        destination: "Paris, France",
        date: "2024-12-15",
        price: 210,
        details: {
          company: "Hertz",
          carType: "Economy",
          pickupDate: "2024-12-15",
          returnDate: "2024-12-20",
          pickupLocation: "Paris Charles de Gaulle Airport",
        },
      },
      {
        id: "booking5",
        type: "flight",
        status: "cancelled",
        destination: "Rome, Italy",
        date: "2024-07-22",
        price: 380,
        details: {
          airline: "Alitalia",
          flightNumber: "AZ456",
          departureTime: "08:45",
          arrivalTime: "11:20",
          origin: "New York",
        },
      },
    ]

    setBookings(mockBookings)
  }

  const filteredBookings = (status: string) => {
    return bookings
      .filter((booking) => booking.status === status)
      .filter(
        (booking) =>
          searchQuery === "" ||
          booking.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.details.airline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.details.hotel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.details.company?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FlightHeader />
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold">My Bookings</h1>
              <p className="text-gray-600">View and manage your travel bookings</p>
            </div>
            <Button onClick={() => router.push("/flights")} className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Book a Trip
            </Button>
          </div>

          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming ({filteredBookings("upcoming").length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({filteredBookings("completed").length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({filteredBookings("cancelled").length})</TabsTrigger>
              <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {filteredBookings("upcoming").length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings("upcoming").map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">No upcoming bookings found</p>
                    <Button onClick={() => router.push("/flights")}>Book a Trip</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {filteredBookings("completed").length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings("completed").map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">No completed bookings found</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cancelled">
              {filteredBookings("cancelled").length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings("cancelled").map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">No cancelled bookings found</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="all">
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings
                    .filter(
                      (booking) =>
                        searchQuery === "" ||
                        booking.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        booking.details.airline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        booking.details.hotel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        booking.details.company?.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">No bookings found</p>
                    <Button onClick={() => router.push("/flights")}>Book a Trip</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] border-b">
          <div className="p-4 md:p-6 flex items-center justify-center bg-gray-50 border-r">
            {booking.type === "flight" ? (
              <Plane className="h-8 w-8 text-blue-500" />
            ) : booking.type === "hotel" ? (
              <Hotel className="h-8 w-8 text-green-500" />
            ) : (
              <Car className="h-8 w-8 text-orange-500" />
            )}
          </div>
          <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg capitalize">{booking.type} Booking</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{booking.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{new Date(booking.date).toLocaleDateString()}</span>
              </div>
              {booking.type === "flight" && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>
                    {booking.details.departureTime} - {booking.details.arrivalTime}
                  </span>
                </div>
              )}
            </div>
            {booking.type === "flight" && (
              <div className="mt-4 text-sm text-gray-600">
                {booking.details.airline} · Flight {booking.details.flightNumber} · From {booking.details.origin}
              </div>
            )}
            {booking.type === "hotel" && (
              <div className="mt-4 text-sm text-gray-600">
                {booking.details.hotel} · {booking.details.roomType} · {booking.details.nights} nights
              </div>
            )}
            {booking.type === "car" && (
              <div className="mt-4 text-sm text-gray-600">
                {booking.details.company} · {booking.details.carType} · Pickup: {booking.details.pickupLocation}
              </div>
            )}
          </div>
          <div className="p-4 md:p-6 flex flex-col items-end justify-center bg-gray-50 border-l">
            <div className="text-xl font-bold">${booking.price.toFixed(2)}</div>
            <div className="flex gap-2 mt-2">
              {booking.status === "upcoming" && (
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                  Cancel
                </Button>
              )}
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
