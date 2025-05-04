"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Eye, CheckCircle, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export function BookingManagement() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    try {
      const response = await fetch("/api/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch bookings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function viewBookingDetails(booking) {
    setSelectedBooking(booking)
    setDialogOpen(true)
  }

  async function updateBookingStatus(id, status) {
    setLoading(true)
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Booking ${status === "confirmed" ? "confirmed" : "cancelled"} successfully`,
        })
        setDialogOpen(false)
        fetchBookings()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || `Failed to ${status === "confirmed" ? "confirm" : "cancel"} booking`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function getStatusBadge(status) {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Confirmed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No bookings found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Booking ID</th>
                    <th className="py-2 px-4 text-left">Flight</th>
                    <th className="py-2 px-4 text-left">Passenger</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">{booking.bookingReference}</td>
                      <td className="py-2 px-4">{booking.flight?.flightNumber || "N/A"}</td>
                      <td className="py-2 px-4">{booking.passengerName}</td>
                      <td className="py-2 px-4">{new Date(booking.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{getStatusBadge(booking.status)}</td>
                      <td className="py-2 px-4">
                        <Button variant="outline" size="sm" onClick={() => viewBookingDetails(booking)}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedBooking && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Booking Reference</p>
                  <p>{selectedBooking.bookingReference}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p>{getStatusBadge(selectedBooking.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Passenger</p>
                  <p>{selectedBooking.passengerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{selectedBooking.passengerEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Flight</p>
                  <p>{selectedBooking.flight?.flightNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Route</p>
                  <p>
                    {selectedBooking.flight?.departureAirport} → {selectedBooking.flight?.arrivalAirport}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Departure</p>
                  <p>
                    {selectedBooking.flight?.departureTime
                      ? new Date(selectedBooking.flight.departureTime).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Arrival</p>
                  <p>
                    {selectedBooking.flight?.arrivalTime
                      ? new Date(selectedBooking.flight.arrivalTime).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Seat</p>
                  <p>{selectedBooking.seatNumber || "Not assigned"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p>${selectedBooking.totalPrice}</p>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              {selectedBooking.status === "pending" && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => updateBookingStatus(selectedBooking._id, "cancelled")}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
                    Cancel Booking
                  </Button>
                  <Button onClick={() => updateBookingStatus(selectedBooking._id, "confirmed")} disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    )}
                    Confirm Booking
                  </Button>
                </>
              )}
              {selectedBooking.status !== "pending" && (
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
