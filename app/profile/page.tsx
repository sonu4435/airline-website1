"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import FlightHeader from "@/components/flight-header"
import { jwtDecode } from "jwt-decode"

interface UserData {
  userId: string
  name: string
  email: string
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

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
          setName(decoded.name)
          setEmail(decoded.email)
          setIsLoading(false)
        } catch (error) {
          console.error("Invalid token:", error)
          setError("Authentication failed. Please log in again.")
          setIsLoading(false)
          router.push("/auth")
        }
      } else {
        setError("Not authenticated")
        setIsLoading(false)
        router.push("/auth")
      }
    }

    checkAuth()
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setError(null)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })

      // Update the user data in state
      if (userData) {
        setUserData({
          ...userData,
          name,
        })
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred while updating your profile")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setError(null)

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      setIsChangingPassword(false)
      return
    }

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password")
      }

      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      })

      // Clear password fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError((err as Error).message || "An error occurred while changing your password")
    } finally {
      setIsChangingPassword(false)
    }
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
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={email} disabled className="bg-gray-100" />
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? "Changing Password..." : "Change Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Travel Preferences</CardTitle>
                  <CardDescription>Set your travel preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferred-airline">Preferred Airline</Label>
                      <Input id="preferred-airline" placeholder="Any" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seat-preference">Seat Preference</Label>
                      <Input id="seat-preference" placeholder="No preference" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meal-preference">Meal Preference</Label>
                      <Input id="meal-preference" placeholder="Regular" />
                    </div>
                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
