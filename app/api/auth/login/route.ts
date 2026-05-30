import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // TODO: Verify password against database
    // For now, just generate a token
    const userId = Math.random().toString(36).substr(2, 9)
    const token = generateToken(userId, email)

    return NextResponse.json(
      {
        user: {
          id: userId,
          email,
          name: 'User',
          avatar: null,
          bio: null,
        },
        token,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
