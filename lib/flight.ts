import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

export interface Flight {
  _id?: ObjectId
  flightNumber: string
  airline: string
  departureAirport: string
  arrivalAirport: string
  departureCity: string
  arrivalCity: string
  departureTime: Date
  arrivalTime: Date
  price: number
  availableSeats: number
  totalSeats: number
  aircraft: string
  status: "scheduled" | "delayed" | "cancelled" | "completed"
  createdBy: ObjectId | string
  createdAt: Date
}

export async function createFlight(flightData: Omit<Flight, "_id" | "createdAt">): Promise<Flight> {
  const client = await clientPromise
  const db = client.db()

  const newFlight = {
    ...flightData,
    createdBy: typeof flightData.createdBy === "string" ? new ObjectId(flightData.createdBy) : flightData.createdBy,
    createdAt: new Date(),
  }

  const result = await db.collection("flights").insertOne(newFlight)

  return {
    ...newFlight,
    _id: result.insertedId,
  }
}

export async function getFlights(query: any = {}): Promise<Flight[]> {
  const client = await clientPromise
  const db = client.db()

  return db.collection("flights").find(query).sort({ departureTime: 1 }).toArray() as Promise<Flight[]>
}

export async function getFlightById(id: string | ObjectId): Promise<Flight | null> {
  const client = await clientPromise
  const db = client.db()

  const objectId = typeof id === "string" ? new ObjectId(id) : id

  return db.collection("flights").findOne({ _id: objectId }) as Promise<Flight | null>
}

export async function updateFlight(id: string | ObjectId, updateData: Partial<Flight>): Promise<boolean> {
  const client = await clientPromise
  const db = client.db()

  const objectId = typeof id === "string" ? new ObjectId(id) : id

  const result = await db.collection("flights").updateOne({ _id: objectId }, { $set: updateData })

  return result.modifiedCount > 0
}

export async function deleteFlight(id: string | ObjectId): Promise<boolean> {
  const client = await clientPromise
  const db = client.db()

  const objectId = typeof id === "string" ? new ObjectId(id) : id

  const result = await db.collection("flights").deleteOne({ _id: objectId })

  return result.deletedCount > 0
}

export async function searchFlights(
  departureAirport: string,
  arrivalAirport: string,
  departureDate: Date,
): Promise<Flight[]> {
  const client = await clientPromise
  const db = client.db()

  // Create start and end of the day for the departure date
  const startDate = new Date(departureDate)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(departureDate)
  endDate.setHours(23, 59, 59, 999)

  return db
    .collection("flights")
    .find({
      departureAirport,
      arrivalAirport,
      departureTime: { $gte: startDate, $lte: endDate },
      status: { $in: ["scheduled", "delayed"] },
      availableSeats: { $gt: 0 },
    })
    .sort({ departureTime: 1 })
    .toArray() as Promise<Flight[]>
}
