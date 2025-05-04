import Link from "next/link"

interface DestinationCardProps {
  country: string
  flag: string
}

export default function DestinationCard({ country, flag }: DestinationCardProps) {
  return (
    <Link
      href={`/flights?destination=${country}`}
      className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="text-4xl mb-2">{flag}</div>
      <div className="text-sm text-center">
        <div className="font-medium">Flights to</div>
        <div>{country}</div>
      </div>
    </Link>
  )
}
