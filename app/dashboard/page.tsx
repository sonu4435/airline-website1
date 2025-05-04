"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plane, Hotel, Car, CreditCard, Calendar, Clock, MapPin } from "lucide-react"
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

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
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
    ]

    setBookings(mockBookings)
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

  const upcomingBookings = bookings.filter((booking) => booking.status === "upcoming")
  const completedBookings = bookings.filter((booking) => booking.status === "completed")

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FlightHeader />
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {userData?.name}</h1>
              <p className="text-gray-600">Manage your bookings and account</p>
            </div>
            <Button onClick={() => router.push("/flights")} className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Book a Trip
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Plane className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Upcoming Flights</p>
                    <p className="text-2xl font-bold">
                      {bookings.filter((b) => b.type === "flight" && b.status === "upcoming").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Hotel className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Flight Bookings</p>
                    <p className="text-2xl font-bold">
                      {bookings.filter((b) => b.type === "hotel" && b.status === "upcoming").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold">
                    ₹{bookings.reduce((total, booking) => total + booking.price, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
              <TabsTrigger value="completed">Past Trips</TabsTrigger>
              <TabsTrigger value="saved">Saved Trips</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id}>
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
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
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
                          </div>
                          <div className="p-4 md:p-6 flex flex-col items-end justify-center bg-gray-50 border-l">
                            <div className="text-xl font-bold">${booking.price.toFixed(2)}</div>
                            <Button variant="outline" size="sm" className="mt-2">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You don't have any upcoming trips</p>
                    <Button onClick={() => router.push("/flights")}>Book a Trip</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedBookings.length > 0 ? (
                <div className="space-y-4">
                  {completedBookings.map((booking) => (
                    <Card key={booking.id}>
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
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
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
                          </div>
                          <div className="p-4 md:p-6 flex flex-col items-end justify-center bg-gray-50 border-l">
                            <div className="text-xl font-bold">${booking.price.toFixed(2)}</div>
                            <Button variant="outline" size="sm" className="mt-2">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You don't have any past trips</p>
                    <Button onClick={() => router.push("/flights")}>Book a Trip</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="saved">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 mb-4">You don't have any saved trips</p>
                  <Button onClick={() => router.push("/flights")}>Search Flights</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
