interface PromoCardProps {
  title: string
  subtitle: string
  color: string
}

export default function PromoCard({ title, subtitle, color }: PromoCardProps) {
  return (
    <div className={`${color} rounded-lg p-4 flex flex-col items-center justify-center h-32`}>
      <div className="text-3xl font-bold">{title}</div>
      <div className="text-sm text-center">{subtitle}</div>
    </div>
  )
}
