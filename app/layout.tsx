import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WeThinkCode Student Discord Access",
  description: "Verify your student email to get access to the WeThinkCode Discord channel",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">{children}</div>
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'