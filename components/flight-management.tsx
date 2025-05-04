"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Loader2, Edit, Trash } from "lucide-react"

export function FlightManagement() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    flightNumber: "",
    airline: "",
    departureAirport: "",
    arrivalAirport: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    availableSeats: "",
    aircraft: "",
  })
  const [editingId, setEditingId] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchFlights()
  }, [])

  async function fetchFlights() {
    try {
      const response = await fetch("/api/flights")
      if (response.ok) {
        const data = await response.json()
        setFlights(data.flights)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch flights",
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

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingId ? `/api/flights/${editingId}` : "/api/flights"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: editingId ? "Flight updated successfully" : "Flight added successfully",
        })
        setFormData({
          flightNumber: "",
          airline: "",
          departureAirport: "",
          arrivalAirport: "",
          departureTime: "",
          arrivalTime: "",
          price: "",
          availableSeats: "",
          aircraft: "",
        })
        setEditingId(null)
        fetchFlights()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to save flight",
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

  function handleEdit(flight) {
    setFormData({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      departureAirport: flight.departureAirport,
      arrivalAirport: flight.arrivalAirport,
      departureTime: new Date(flight.departureTime).toISOString().slice(0, 16),
      arrivalTime: new Date(flight.arrivalTime).toISOString().slice(0, 16),
      price: flight.price.toString(),
      availableSeats: flight.availableSeats.toString(),
      aircraft: flight.aircraft,
    })
    setEditingId(flight._id)
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this flight?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/flights/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Flight deleted successfully",
        })
        fetchFlights()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to delete flight",
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

  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="list">Flight List</TabsTrigger>
        <TabsTrigger value="add">Add/Edit Flight</TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <Card>
          <CardHeader>
            <CardTitle>Manage Flights</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : flights.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No flights found. Add your first flight!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left">Flight #</th>
                      <th className="py-2 px-4 text-left">Route</th>
                      <th className="py-2 px-4 text-left">Departure</th>
                      <th className="py-2 px-4 text-left">Arrival</th>
                      <th className="py-2 px-4 text-left">Price</th>
                      <th className="py-2 px-4 text-left">Seats</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map((flight) => (
                      <tr key={flight._id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">{flight.flightNumber}</td>
                        <td className="py-2 px-4">
                          {flight.departureAirport} → {flight.arrivalAirport}
                        </td>
                        <td className="py-2 px-4">{new Date(flight.departureTime).toLocaleString()}</td>
                        <td className="py-2 px-4">{new Date(flight.arrivalTime).toLocaleString()}</td>
                        <td className="py-2 px-4">${flight.price}</td>
                        <td className="py-2 px-4">{flight.availableSeats}</td>
                        <td className="py-2 px-4 flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(flight)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(flight._id)}>
                            <Trash className="h-4 w-4" />
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
      </TabsContent>

      <TabsContent value="add">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Flight" : "Add New Flight"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flightNumber">Flight Number</Label>
                  <Input
                    id="flightNumber"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="airline">Airline</Label>
                  <Input id="airline" name="airline" value={formData.airline} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departureAirport">Departure Airport</Label>
                  <Input
                    id="departureAirport"
                    name="departureAirport"
                    value={formData.departureAirport}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrivalAirport">Arrival Airport</Label>
                  <Input
                    id="arrivalAirport"
                    name="arrivalAirport"
                    value={formData.arrivalAirport}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departureTime">Departure Time</Label>
                  <Input
                    id="departureTime"
                    name="departureTime"
                    type="datetime-local"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">Arrival Time</Label>
                  <Input
                    id="arrivalTime"
                    name="arrivalTime"
                    type="datetime-local"
                    value={formData.arrivalTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availableSeats">Available Seats</Label>
                  <Input
                    id="availableSeats"
                    name="availableSeats"
                    type="number"
                    min="0"
                    value={formData.availableSeats}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="aircraft">Aircraft</Label>
                  <Input
                    id="aircraft"
                    name="aircraft"
                    value={formData.aircraft}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        flightNumber: "",
                        airline: "",
                        departureAirport: "",
                        arrivalAirport: "",
                        departureTime: "",
                        arrivalTime: "",
                        price: "",
                        availableSeats: "",
                        aircraft: "",
                      })
                      setEditingId(null)
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? "Update Flight" : "Add Flight"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
