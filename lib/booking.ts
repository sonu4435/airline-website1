import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

export interface Passenger {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  passportNumber?: string
  seatNumber?: string
}

export interface Booking {
  _id?: ObjectId
  flightId: ObjectId | string
  userId: ObjectId | string
  bookingReference: string
  status: "pending" | "confirmed" | "cancelled" | "completed" | "refunded"
  passengers: Passenger[]
  totalPrice: number
  paymentStatus: "pending" | "completed" | "failed" | "refunded"
  checkedIn: boolean
  createdAt: Date
}

// Generate a random booking reference
function generateBookingReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function createBooking(
  bookingData: Omit<Booking, "_id" | "bookingReference" | "createdAt">,
): Promise<Booking> {
  const client = await clientPromise
  const db = client.db()

  const newBooking = {
    ...bookingData,
    flightId: typeof bookingData.flightId === "string" ? new ObjectId(bookingData.flightId) : bookingData.flightId,
    userId: typeof bookingData.userId === "string" ? new ObjectId(bookingData.userId) : bookingData.userId,
    bookingReference: generateBookingReference(),
    createdAt: new Date(),
  }

  const result = await db.collection("bookings").insertOne(newBooking)

  // Update available seats in the flight
  await db
    .collection("flights")
    .updateOne({ _id: newBooking.flightId }, { $inc: { availableSeats: -bookingData.passengers.length } })

  return {
    ...newBooking,
    _id: result.insertedId,
  }
}

export async function getBookingsByUserId(userId: string | ObjectId): Promise<Booking[]> {
  const client = await clientPromise
  const db = client.db()

  const objectId = typeof userId === "string" ? new ObjectId(userId) : userId

  return db.collection("bookings").find({ userId: objectId }).sort({ createdAt: -1 }).toArray() as Promise<Booking[]>
}

export async function getBookingById(id: string | ObjectId): Promise<Booking | null> {
  const client = await clientPromise
  const db = client.db()

  const objectId = typeof id === "string" ? new ObjectId(id) : id

  return db.collection("bookings").findOne({ _id: objectId }) as Promise<Booking | null>
}

export async function getBookingByReference(reference: string): Promise<Booking | null> {
  const client = await clientPromise
  const db = client.db()

  return db.collection("bookings").findOne({ bookingReference: reference }) as Promise<Booking | null>
}

export async function updateBookingStatus(
  id: string | ObjectId,
  status: Booking["status"],
  paymentStatus?: Booking["paymentStatus"],
): Promise<boolean> {
  const client = await clientPromise
  const db = client.db()

  const objectId = typeof id === "string" ? new ObjectId(id) : id

  const updateData: any = { status }
  if (paymentStatus) {
    updateData.paymentStatus = paymentStatus
  }

  const result = await db.collection("bookings").updateOne({ _id: objectId }, { $set: updateData })

  return result.modifiedCount > 0
}

export async function cancelBooking(id: string | ObjectId): Promise<boolean> {
  const client = await clientPromise
  const db = client.db()

  const objectId = typeof id === "string" ? new ObjectId(id) : id

  // Get the booking to find out how many seats to return
  const booking = await getBookingById(objectId)

  if (!booking) {
    return false
  }

  // Update booking status
  const bookingResult = await db
    .collection("bookings")
    .updateOne({ _id: objectId }, { $set: { status: "cancelled", paymentStatus: "refunded" } })

  if (bookingResult.modifiedCount === 0) {
    return false
  }

  // Return seats to the flight
  await db
    .collection("flights")
    .updateOne(
      { _id: typeof booking.flightId === "string" ? new ObjectId(booking.flightId) : booking.flightId },
      { $inc: { availableSeats: booking.passengers.length } },
    )

  return true
}

export async function checkInPassengers(
  bookingId: string | ObjectId,
  passengerSeats: { index: number; seatNumber: string }[],
): Promise<boolean> {
  const client = await clientPromise
  const db = client.db()

  const objectId = typeof bookingId === "string" ? new ObjectId(bookingId) : bookingId

  // Get the booking
  const booking = await getBookingById(objectId)

  if (!booking) {
    return false
  }

  // Update passenger seat assignments
  const updatedPassengers = [...booking.passengers]

  for (const { index, seatNumber } of passengerSeats) {
    if (index >= 0 && index < updatedPassengers.length) {
      updatedPassengers[index].seatNumber = seatNumber
    }
  }

  // Update the booking
  const result = await db.collection("bookings").updateOne(
    { _id: objectId },
    {
      $set: {
        passengers: updatedPassengers,
        checkedIn: true,
      },
    },
  )

  return result.modifiedCount > 0
}
