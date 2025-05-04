"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"
import { jwtDecode } from "jwt-decode"

interface UserData {
  userId: string
  name: string
  email: string
}

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const cookies = document.cookie.split(";")
      const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth_token="))

      if (authCookie) {
        const token = authCookie.split("=")[1]
        try {
          const decoded = jwtDecode<UserData>(token)
          setUserData(decoded)
          setIsLoggedIn(true)
        } catch (error) {
          console.error("Invalid token:", error)
          setIsLoggedIn(false)
          setUserData(null)
        }
      } else {
        setIsLoggedIn(false)
        setUserData(null)
      }
    }

    checkAuth()

    // Listen for storage events (for when user logs in/out in another tab)
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setIsLoggedIn(false)
      setUserData(null)

      // Trigger storage event for other tabs
      window.localStorage.setItem("logout", Date.now().toString())

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isLoggedIn && userData) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="gap-2">
            <User className="h-4 w-4" />
            {userData.name || "My Account"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/bookings")}>My Bookings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="text-red-500">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={() => router.push("/auth")} className="bg-blue-500 hover:bg-blue-600">
      Sign in
    </Button>
  )
}
