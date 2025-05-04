import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import bcrypt from "bcryptjs"

export type UserRole = "passenger" | "airline_staff" | "admin"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
}

export async function createUser(userData: Omit<User, "_id" | "createdAt">): Promise<User> {
  const client = await clientPromise
  const db = client.db()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(userData.password, 10)

  // Create the user with default role as passenger if not specified
  const newUser = {
    ...userData,
    role: userData.role || "passenger",
    password: hashedPassword,
    createdAt: new Date(),
  }

  const result = await db.collection("users").insertOne(newUser)

  return {
    ...newUser,
    _id: result.insertedId,
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const client = await clientPromise
  const db = client.db()

  return db.collection("users").findOne({ email }) as Promise<User | null>
}

export async function findUserById(id: string | ObjectId): Promise<User | null> {
  const client = await clientPromise
  const db = client.db()

  const objectId = typeof id === "string" ? new ObjectId(id) : id

  return db.collection("users").findOne({ _id: objectId }) as Promise<User | null>
}

export async function validateUser(email: string, password: string): Promise<Omit<User, "password"> | null> {
  const user = await findUserByEmail(email)

  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return null
  }

  // Don't return the password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function updateUserRole(userId: string | ObjectId, role: UserRole): Promise<boolean> {
  const client = await clientPromise
  const db = client.db()

  const objectId = typeof userId === "string" ? new ObjectId(userId) : userId

  const result = await db.collection("users").updateOne({ _id: objectId }, { $set: { role } })

  return result.modifiedCount > 0
}
