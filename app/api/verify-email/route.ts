import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

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

    // Create a Nodemailer transporter with more detailed configuration
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: "qixulujhb024@student.wethinkcode.co.za",
        pass: process.env.EMAIL_PASSWORD,
      },
      debug: true, // Enable debugging for troubleshooting
    })

    // Email content
    const mailOptions = {
      from: '"WeThinkCode Discord" <qixulujhb024@student.wethinkcode.co.za>',
      to: email,
      subject: "Your WeThinkCode Discord Invite",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #3b82f6; text-align: center;">WeThinkCode Discord</h1>
          <p>Hello WeThinkCode student,</p>
          <p>Thank you for verifying your student email. Here is your Discord invite link:</p>
          <p style="text-align: center;">
            <a href="${discordInvite}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Join Discord
            </a>
          </p>
          <p>This link will expire in 24 hours.</p>
          <p>After joining Discord, please complete your GitHub verification by returning to our website.</p>
          <p>Best regards,<br>WeThinkCode Team</p>
        </div>
      `,
      text: `Hello WeThinkCode student,\n\nThank you for verifying your student email. Here is your Discord invite link: ${discordInvite}\n\nThis link will expire in 24 hours.\n\nAfter joining Discord, please complete your GitHub verification by returning to our website.\n\nBest regards,\nWeThinkCode Team`,
    }

    // Send the email with better error handling
    try {
      console.log("Attempting to send email to:", email)
      const info = await transporter.sendMail(mailOptions)
      console.log("Email sent successfully:", info.messageId)

      return NextResponse.json({
        success: true,
        message: "Verification successful! Check your email for the Discord invite.",
      })
    } catch (emailError) {
      console.error("Failed to send email:", emailError)

      // For development/testing purposes, return the invite link even if email fails
      // In production, you would handle this differently
      return NextResponse.json({
        success: true,
        message: "Email sending failed, but verification was successful. Here's your invite link:",
        invite: discordInvite,
        emailError: emailError instanceof Error ? emailError.message : String(emailError),
      })
    }
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}

