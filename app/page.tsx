import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plane } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-indigo-600 to-indigo-400 text-white py-20 px-4 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/placeholder.svg?height=800&width=1600"
            alt="Airplane flying through clouds"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
            priority
          />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Your Flight
            <br />
            with Confidence
          </h1>
          <p className="mb-8 text-lg">Find the best deals on flights to destinations worldwide</p>
          <div className="max-w-md mx-auto">
            <Link href="/flights">
              <Button size="lg" className="w-full md:w-auto">
                Search Flights
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkyBooker</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
            <p className="text-gray-600">Book your flights in just a few clicks with our user-friendly interface.</p>
          </div>
          <div className="p-6 border rounded-lg text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Best Prices</h3>
            <p className="text-gray-600">Find the best deals on flights with our price comparison tool.</p>
          </div>
          <div className="p-6 border rounded-lg text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Booking</h3>
            <p className="text-gray-600">
              Book with confidence knowing your payment and personal information is secure.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Next Flight?</h2>
          <p className="mb-8">Sign up now and get exclusive deals on flights worldwide.</p>
          <Link href="/auth">
            <Button size="lg" variant="secondary">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">SkyBooker</h3>
            <p className="text-sm text-gray-300">Your trusted partner for booking flights to destinations worldwide.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="/flights" className="hover:text-white">
                  Search Flights
                </Link>
              </li>
              <li>
                <Link href="/check-in" className="hover:text-white">
                  Check-in
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="hover:text-white">
                  Manage Booking
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-300 text-sm">
          <p>&copy; {new Date().getFullYear()} SkyBooker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
