import { Cafe } from '@/lib/types'
import Card from './Card'

interface CafeCardProps {
  cafe: Cafe
  onClick?: () => void
}

export default function CafeCard({ cafe, onClick }: CafeCardProps) {
  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
      aria-label={`${cafe.name} — rated ${cafe.rating.toFixed(1)} out of 10`}
    >
      {cafe.photoUrl && (
        <div className="w-full h-40 bg-neutral rounded-lg mb-4 overflow-hidden">
          <img
            src={cafe.photoUrl}
            alt={`${cafe.name} cafe`}
            width={400}
            height={160}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <h3 className="text-xl font-semibold text-primary mb-1 text-wrap-balance">{cafe.name}</h3>
      <p className="text-sm text-primary-light mb-3 truncate">{cafe.address}</p>

      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-accent tabular-nums">
          {cafe.rating.toFixed(1)}
        </span>
        <span className="text-accent text-base" aria-hidden="true">★</span>
        <span className="text-sm text-primary-light">
          ({cafe.reviewCount} {cafe.reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      </div>
    </Card>
  )
}
