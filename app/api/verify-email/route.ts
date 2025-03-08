import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Function to generate a random Discord invite code (in a real app, you'd use Discord API)
export async function generateDiscordInvite(): Promise<string | null> {
  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // Store in .env
  const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID; // Store in .env

  if (!DISCORD_BOT_TOKEN || !DISCORD_CHANNEL_ID) {
    console.error("Missing Discord bot token or channel ID.");
    return null;
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/invites`, {
      method: "POST",
      headers: {
        "Authorization": `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        max_uses: 1, // One-time use
        max_age: 86400, // Expires in 24 hours (86400 seconds)
        temporary: false
      })
    });

    if (!response.ok) {
      console.error("Failed to create invite:", await response.text());
      return null;
    }

    const data = await response.json();
    return `https://discord.gg/${data.code}`;
  } catch (error) {
    console.error("Error generating Discord invite:", error);
    return null;
  }
}

// In-memory storage for demo purposes
const emailToInvite = new Map<string, string>();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email format
    if (!email || !email.endsWith("@student.wethinkcode.co.za")) {
      return NextResponse.json({ error: "Invalid email. Must be a WeThinkCode student email." }, { status: 400 });
    }

    // Check if we already generated an invite for this email
    let discordInvite = emailToInvite.get(email);

    // If not, generate a new one
    if (!discordInvite) {
      const generatedInvite = await generateDiscordInvite(); // Ensure this is awaited since it's async

      // Handle the case where the invite generation failed (null result)
      if (!generatedInvite) {
        return NextResponse.json({ error: "Failed to generate invite." }, { status: 500 });
      }

      // Store the invite link in the map
      discordInvite = generatedInvite;
      emailToInvite.set(email, discordInvite);
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
    });

    // Email content
    const mailOptions = {
      from: '"WeThinkCode Student Community" <qixulujhb024@student.wethinkcode.co.za>',
      to: email,
      subject: "Your WeThinkCode Discord Invite",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #3b82f6; text-align: center;">WeThinkCode Student Community</h1>
          <p>Hello WeThinkCode student,</p>
          <p>Thank you for verifying your student email. Here is your Discord invite link:</p>
          <p style="text-align: center;">
            <a href="${discordInvite}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Join Discord
            </a>
          </p>
          <p>This link will expire in 24 hours.</p>
          <p>After joining Discord, please complete your GitHub verification by returning to our website.</p>
          <p>Best regards,<br>WeThinkCode Student Community Team</p>
        </div>
      `,
      text: `Hello WeThinkCode student,\n\nThank you for verifying your student email. Here is your Discord invite link: ${discordInvite}\n\nThis link will expire in 24 hours.\n\nAfter joining Discord, please complete your GitHub verification by returning to our website.\n\nBest regards,\nWeThinkCode Team`,
    };

    // Send the email with better error handling
    try {
      console.log("Attempting to send email to:", email);
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);

      return NextResponse.json({
        success: true,
        message: "Verification successful! Check your email for the Discord invite.",
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);

      // For development/testing purposes, return the invite link even if email fails
      // In production, you would handle this differently
      return NextResponse.json({
        success: true,
        message: "Email sending failed, but verification was successful. Here's your invite link:",
        invite: discordInvite,
        emailError: emailError instanceof Error ? emailError.message : String(emailError),
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    );
  }
}