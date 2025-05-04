"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FlightHeader from "@/components/flight-header"

export default function PaymentPage() {
    const [name, setName] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [cvv, setCvv] = useState("")
    const [expiry, setExpiry] = useState("")
    const router = useRouter()

    const handlePayment = () => {
        // Simulate saving the booking (you can store in localStorage or backend in real use)
        const booking = {
            id: `booking_${Date.now()}`,
            type: "flight",
            status: "upcoming",
            destination: "Tokyo, Japan",
            date: "2025-06-15",
            price: 599,
            details: {
                airline: "Japan Airlines",
                flightNumber: "JL746",
                departureTime: "09:00",
                arrivalTime: "18:30",
                origin: "Los Angeles",
            },
        }

        // Save it to localStorage (for now)
        const existing = JSON.parse(localStorage.getItem("bookings") || "[]")
        localStorage.setItem("bookings", JSON.stringify([...existing, booking]))

        // Navigate to bookings page
        router.push("/bookings")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <FlightHeader />
            <main className="max-w-xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Payment Details</h1>
                <div className="space-y-4">
                    <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                    <div className="flex gap-4">
                        <Input placeholder="Expiry (MM/YY)" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                        <Input placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                    </div>
                    <Button className="w-full bg-green-600" onClick={handlePayment}>
                        Pay $599 & Book Flight
                    </Button>
                </div>
            </main>
        </div>
    )
}