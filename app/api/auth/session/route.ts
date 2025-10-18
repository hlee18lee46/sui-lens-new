import { NextResponse } from "next/server"

export async function GET() {
  // Mock session check - integrate with Auth0
  // In production, verify JWT token from Auth0

  const mockUser = {
    id: "1",
    email: "developer@example.com",
    name: "Dev User",
    picture: "/abstract-geometric-shapes.png",
    role: "viewer" as const,
  }

  // Return null if no session, or user data if authenticated
  return NextResponse.json({ user: mockUser })
}
