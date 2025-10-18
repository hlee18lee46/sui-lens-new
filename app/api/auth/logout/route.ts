import { NextResponse } from "next/server"

export async function POST() {
  // Mock logout - integrate with Auth0
  // In production, clear Auth0 session

  console.log("[v0] Logout event:", { timestamp: new Date().toISOString() })

  return NextResponse.json({ success: true })
}
