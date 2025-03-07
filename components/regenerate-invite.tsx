"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, RefreshCw } from "lucide-react"

export function RegenerateInvite({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [invite, setInvite] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleRegenerate() {
    if (!email) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate invite")
      }

      setInvite(data.invite)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (invite) {
    return (
      <Alert className="bg-green-50 border-green-200 mt-4">
        <AlertDescription>
          <p className="font-medium mb-2">Your Discord invite link:</p>
          <p className="p-2 bg-white rounded break-all">
            <a href={invite} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              {invite}
            </a>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Please save this link as it won't be shown again.</p>
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

      <Button onClick={handleRegenerate} variant="outline" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Discord Invite
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        If you didn't receive the email, you can generate a new invite link here.
      </p>
    </div>
  )
}

