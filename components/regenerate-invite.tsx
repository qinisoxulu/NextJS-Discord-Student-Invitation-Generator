"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Check } from "lucide-react"

export function RegenerateInvite({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [discordUsername, setDiscordUsername] = useState("")
  const [requestSent, setRequestSent] = useState(
    // Check localStorage to see if the request has already been sent
    typeof window !== "undefined" ? localStorage.getItem("requestSent") === "true" : false
  )

  async function handleRequestAccess() {
    if (!email || requestSent) return // Prevent multiple requests

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, discordUsername }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send request")
      }

      setSuccess(true)
      setRequestSent(true)
      // Store the request status in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("requestSent", "true")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200 mt-4">
        <AlertDescription>
          <p className="font-medium">Student Community Team has been notified.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            A Student Community Member will review your request and contact you shortly.
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="mt-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="discordUsername" className="block text-sm font-medium text-gray-700">
            Discord Username
          </label>
          <input
            id="discordUsername"
            type="text"
            value={discordUsername}
            onChange={(e) => setDiscordUsername(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter your Discord username"
            required
          />
        </div>

        <Button
          onClick={handleRequestAccess}
          variant="outline"
          className="w-full"
          disabled={isLoading || requestSent} // Disable the button after the request is sent
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : requestSent ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Request Sent
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Request Access
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-2 text-center">
        {requestSent
          ? "Your request has been sent. A Student Community Member will contact you shortly."
          : "Click the button to request access to the Discord server."}
      </p>
    </div>
  )
}