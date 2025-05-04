import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function CommunitySection() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <blockquote className="text-lg italic mb-4">
            "Explore greater security when sharing money with Multi-Signature Vaults. A safe place to store funds long
            term."
          </blockquote>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image src="/placeholder.svg?height=48&width=48" alt="User avatar" fill className="object-cover" />
            </div>
            <div>
              <div className="font-bold">Mahady Hasan</div>
              <div className="text-sm text-gray-600">CEO, Travelside</div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-6">
            Connect with fellow travelers, share experiences, and get exclusive deals by joining our community.
          </p>
          <Button className="rounded-full">Join Community</Button>
          <div className="mt-6 grid grid-cols-3 gap-2">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Community member"
              width={80}
              height={80}
              className="rounded-full"
            />
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Community member"
              width={80}
              height={80}
              className="rounded-full"
            />
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Community member"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
