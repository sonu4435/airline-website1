import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plane, Hotel, Car, LogOut } from "lucide-react"
import AuthButton from "@/components/auth-button"
import { useRouter } from "next/navigation"

export default function FlightHeader() {
  const router = useRouter()

  async function handleLogOut() {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    })

    if (res.ok) {
      router.push("/")
    }
  }
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">Travelside</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Flights
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="hidden md:flex items-center gap-2">
              Manage my booking
            </Button>
            <Button
              variant="default"
              className="flex items-center gap-2 bg-red-600"
              onClick={handleLogOut}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
