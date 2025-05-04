"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface RoleBasedViewProps {
  allowedRoles: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleBasedView({ allowedRoles, children, fallback }: RoleBasedViewProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/user/profile")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
        } else {
          // User is not authenticated
          router.push("/auth")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router, toast])

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading...</div>
  }

  if (!user) {
    return null
  }

  if (allowedRoles.includes(user.role)) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <p className="text-yellow-700">You don't have permission to view this content.</p>
    </div>
  )
}
