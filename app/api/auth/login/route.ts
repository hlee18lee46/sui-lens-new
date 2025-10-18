import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Mock login - integrate with Auth0
    // In production, verify credentials with Auth0 and return JWT

    const mockUser = {
      id: "1",
      email,
      name: email.split("@")[0],
      picture: "/abstract-geometric-shapes.png",
      role: "viewer" as const,
    }

    // Log to Snowflake for analytics
    console.log("[v0] Login event:", { email, timestamp: new Date().toISOString() })

    return NextResponse.json({ user: mockUser })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 401 })
  }
}
