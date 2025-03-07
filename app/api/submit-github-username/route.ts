import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { email, githubUsername } = await request.json()

    // Validate email format
    if (!email || !email.endsWith("@student.wethinkcode.co.za")) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate GitHub username
    if (!githubUsername || githubUsername.length > 39) {
      return NextResponse.json({ error: "Invalid GitHub username" }, { status: 400 })
    }

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

    // Email content with GitHub username information
    const mailOptions = {
      from: '"WeThinkCode Student Community" <qixulujhb024@student.wethinkcode.co.za>',
      to: "qixulujhb024@student.wethinkcode.co.za", // Send to the admin email
      subject: "New GitHub Username Submission",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #3b82f6; text-align: center;">GitHub Username Submission</h1>
          <p>A user has submitted their GitHub username:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Student Email:</strong> ${email}</p>
            <p><strong>GitHub Username:</strong> ${githubUsername}</p>
            <p><strong>GitHub Profile:</strong> <a href="https://github.com/${githubUsername}" target="_blank">https://github.com/${githubUsername}</a></p>
          </div>
          <p>This user has successfully completed the verification process.</p>
        </div>
      `,
    }

    // Send the email
    try {
      await transporter.sendMail(mailOptions)
      return NextResponse.json({ success: true })
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError)
      return NextResponse.json({ error: "Failed to send notification email. Please try again later." }, { status: 500 })
    }
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}

