"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function CheckInForm() {
  const [bookingReference, setBookingReference] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  // Mock available seats
  const availableSeats = ['1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C'];

  async function handleLookup(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, this would be a fetch to your API
      const response = await fetch('/api/check-in/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingReference, lastName }),
      });

      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
        setStep(2);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Booking not found',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckIn(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, this would be a fetch to your API
      const response = await fetch('/api/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bookingId: booking._id, 
          seatNumber: selectedSeat 
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setStep(3);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Failed to check in',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Online Check-In</CardTitle>
        <CardDescription>
          {step === 1 && "Enter your booking details to check in for your flight."}
          {step === 2 && "Select your seat and complete check-in."}
          {step === 3 && "Check-in successful!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookingReference">Booking Reference</Label>
              <Input 
                id="bookingReference" 
                value={bookingReference} 
                onChange={(e) => setBookingReference(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Find Booking
            </Button>
          </form>
        )}

        {step === 2 && booking && (
          <form on\
