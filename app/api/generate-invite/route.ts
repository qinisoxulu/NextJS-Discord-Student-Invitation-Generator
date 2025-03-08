import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { email, discordUsername } = await request.json()

    // Validate email format
    if (!email || !email.endsWith("@student.wethinkcode.co.za")) {
      return NextResponse.json(
        { error: "Invalid email. Must be a WeThinkCode student email." },
        { status: 400 }
      )
    }

    // Validate Discord username
    if (!discordUsername) {
      return NextResponse.json(
        { error: "Discord username is required." },
        { status: 400 }
      )
    }

    // Notify the Student Community Member
    const communityMemberEmail = "qixulujhb024@student.wethinkcode.co.za"

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: "qixulujhb024@student.wethinkcode.co.za",
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Email content for the Student Community Member
    const memberMailOptions = {
      from: '"WeThinkCode Student Community" <qixulujhb024@student.wethinkcode.co.za>',
      to: communityMemberEmail,
      subject: "New Access Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #3b82f6; text-align: center;">WeThinkCode Student Community</h1>
          <p>Hello Student Community Member,</p>
          <p>A student has requested access to the Discord server:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Discord Username:</strong> ${discordUsername}</p>
          <p>Please review the request and take appropriate action.</p>
          <p>Best regards,<br>WeThinkCode Student Community Team</p>
        </div>
      `,
      text: `Hello Student Community Member,\n\nA student has requested access to the Discord server:\n\nEmail: ${email}\nDiscord Username: ${discordUsername}\n\nPlease review the request and take appropriate action.\n\nBest regards,\nWeThinkCode Student Community Team`,
    }

    // Send the email to the Student Community Member
    await transporter.sendMail(memberMailOptions)

    return NextResponse.json({
      success: true,
      message: "Student Community Team has been notified.",
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}