import { JWTPayload } from './types'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key'

export function generateToken(userId: string, email: string): string {
  // Simple JWT-like token for development
  // In production, use a proper JWT library
  const payload: JWTPayload = {
    userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  }

  // Base64 encode payload (simplified - use jsonwebtoken in production)
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodedPayload}.signature`
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
