import { NextResponse } from "next/server"

// Function to generate a random Discord invite code (in a real app, you'd use Discord API)
function generateDiscordInvite(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return `https://discord.gg/${result}`
}

// In-memory storage for demo purposes
const emailToInvite = new Map<string, string>()

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate email format
    if (!email || !email.endsWith("@student.wethinkcode.co.za")) {
      return NextResponse.json({ error: "Invalid email. Must be a WeThinkCode student email." }, { status: 400 })
    }

    // Check if we already generated an invite for this email
    let discordInvite = emailToInvite.get(email)

    // If not, generate a new one
    if (!discordInvite) {
      discordInvite = generateDiscordInvite()
      emailToInvite.set(email, discordInvite)
    }

    // Return the invite directly
    return NextResponse.json({
      success: true,
      invite: discordInvite,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}

