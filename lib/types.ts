export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

export interface Cafe {
  id: string
  placeId: string // Google Places ID
  name: string
  address: string
  latitude: number
  longitude: number
  rating: number
  reviewCount: number
  photoUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Rating {
  id: string
  userId: string
  cafeId: string
  itemName: string
  score: number
  photo: string // URL to photo
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CafeReview {
  rating: Rating
  user: User
  cafe: Cafe
}

export interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}
