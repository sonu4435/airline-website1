"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plane, User, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { jwtDecode } from "jwt-decode"
import type { JwtPayload } from "@/lib/auth"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<JwtPayload | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const cookies = document.cookie.split(";")
      const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth_token="))

      if (authCookie) {
        const token = authCookie.split("=")[1]
        try {
          const decoded = jwtDecode<JwtPayload>(token)
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
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setIsLoggedIn(false)
      setUserData(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getNavLinks = () => {
    const links = [
      { href: "/", label: "Home" },
      { href: "/flights", label: "Flights" },
    ]

    if (isLoggedIn) {
      links.push({ href: "/dashboard", label: "Dashboard" })
      links.push({ href: "/bookings", label: "My Bookings" })

      if (userData?.role === "admin") {
        links.push({ href: "/admin", label: "Admin" })
      }

      if (userData?.role === "airline_staff" || userData?.role === "admin") {
        links.push({ href: "/airline", label: "Airline Management" })
      }
    }

    return links
  }

  const navLinks = getNavLinks()

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">SkyBooker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-600 hover:text-indigo-600 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    {userData?.name || "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/bookings")}>My Bookings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => router.push("/auth")}>Sign in</Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t">
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block text-gray-600 hover:text-indigo-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      href="/profile"
                      className="block text-gray-600 hover:text-indigo-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="block text-red-500 hover:text-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/auth"
                    className="block text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
