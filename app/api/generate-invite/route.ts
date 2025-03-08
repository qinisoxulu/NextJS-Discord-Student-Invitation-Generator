import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Function to generate a valid Discord invite using the Discord API
async function generateDiscordInvite(): Promise<string | null> {
  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
  const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID

  if (!DISCORD_BOT_TOKEN || !DISCORD_CHANNEL_ID) {
    console.error("Missing Discord bot token or channel ID.")
    return null
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/invites`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        max_uses: 50000, // One-time use
        max_age: 86400, // Expires in 24 hours (86400 seconds)
        temporary: false,
      }),
    })

    if (!response.ok) {
      console.error("Failed to create invite:", await response.text())
      return null
    }

    const data = await response.json()
    return `https://discord.gg/${data.code}` // Return the valid invite link
  } catch (error) {
    console.error("Error generating Discord invite:", error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate email format
    if (!email || !email.endsWith("@student.wethinkcode.co.za")) {
      return NextResponse.json(
        { error: "Invalid email. Must be a WeThinkCode student email." },
        { status: 400 }
      )
    }

    // Generate a new invite
    const discordInvite = await generateDiscordInvite()

    // Handle the case where the invite generation failed (null result)
    if (!discordInvite) {
      return NextResponse.json(
        { error: "Failed to generate invite." },
        { status: 500 }
      )
    }

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "qixulujhb024@student.wethinkcode.co.za",
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Email content for the user
    const userMailOptions = {
      from: '"WeThinkCode Student Community" <qixulujhb024@student.wethinkcode.co.za>',
      to: email,
      subject: "Your New Discord Invite Link",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #3b82f6; text-align: center;">WeThinkCode Student Community</h1>
          <p>Hello WeThinkCode student,</p>
          <p>Here is your new Discord invite link:</p>
          <p><a href="${discordInvite}" style="color: #3b82f6; text-decoration: underline;">Join Discord</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards,<br>WeThinkCode Student Community Team</p>
        </div>
      `,
      text: `Hello WeThinkCode student,\n\nHere is your new Discord invite link: ${discordInvite}\n\nThis link will expire in 24 hours.\n\nBest regards,\nWeThinkCode Student Community Team`,
    }
    
    const myNotification = {
      from: '"WeThinkCode Student Community" <qixulujhb024@student.wethinkcode.co.za>',
      to: "qixulujhb024@student.wethinkcode.co.za",
      subject: "New Discord Member",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #3b82f6; text-align: center;">WeThinkCode Student Community</h1>
          <p>Hello WeThinkCode Qiniso Xulu,</p>
          <p>A new member has joined the channel:</p>
          <p><a href="mailto:${email}" style="color: #3b82f6; text-decoration: underline;">Join Discord</a></p>
          <p>Best regards,<br>Your Mailer</p>
        </div>
      `,
      text: `Hello Qiniso Xulu,\n\nA new member has joined the channel: ${email}\n\n\nBest regards,\nYour Mailer`,
    }

    // Send the email to the user
    await transporter.sendMail(userMailOptions)
    await transporter.sendMail(myNotification)

    return NextResponse.json({
      success: true,
      message: "A new invite link has been sent to your email.",
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}