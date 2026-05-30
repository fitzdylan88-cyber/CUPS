import { Rating, User } from '@/lib/types'
import Card from './Card'

interface RatingCardProps {
  rating: Rating
  user: User
  itemName: string
}

export default function RatingCard({
  rating,
  user,
  itemName,
}: RatingCardProps) {
  const createdAtDate = new Date(rating.createdAt)
  const formattedDate = new Intl.DateTimeFormat('en-IE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(createdAtDate)

  return (
    <Card className="mb-4">
      <div className="flex gap-4">
        <div
          className="w-11 h-11 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg shrink-0"
          aria-hidden="true"
        >
          {user.name[0].toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <div className="min-w-0">
              <h4 className="font-semibold text-primary truncate">{user.name}</h4>
              <p className="text-sm text-primary-light truncate">{itemName}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <span className="text-lg font-bold text-accent tabular-nums" aria-label={`${rating.score} out of 10`}>
                {rating.score}
              </span>
              <span className="text-accent" aria-hidden="true">★</span>
            </div>
          </div>

          {rating.photo && (
            <div className="mb-3 rounded-lg overflow-hidden w-full h-40">
              <img
                src={rating.photo}
                alt={`Photo of ${itemName}`}
                width={400}
                height={160}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {rating.notes && (
            <p className="text-sm text-primary-light mb-2 break-words">{rating.notes}</p>
          )}

          <time className="text-xs text-primary-light" dateTime={createdAtDate.toISOString()}>
            {formattedDate}
          </time>
        </div>
      </div>
    </Card>
  )
}
