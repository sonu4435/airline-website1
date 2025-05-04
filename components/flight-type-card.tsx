interface FlightTypeCardProps {
  title: string
  description: string
}

export default function FlightTypeCard({ title, description }: FlightTypeCardProps) {
  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
