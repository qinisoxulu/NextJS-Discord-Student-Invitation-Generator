"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, Mail, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RegenerateInvite } from "@/components/regenerate-invite"
import { GithubUsernameForm } from "@/components/github-username-form"

export default function SuccessPage() {
  const router = useRouter()
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null)
  const [githubUsername, setGithubUsername] = useState<string | null>(null)

  useEffect(() => {
    // Get the verified email from session storage
    const email = sessionStorage.getItem("verifiedEmail")
    setVerifiedEmail(email)

    // Get the GitHub username if it exists
    const username = sessionStorage.getItem("githubUsername")
    setGithubUsername(username)

    // If no verified email is found, redirect to the home page
    if (!email) {
      router.push("/")
    }
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full border-2 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
          <CardDescription>Your WeThinkCode student email has been verified</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-green-500" />
            <span>Discord invite sent to: {verifiedEmail || "your email"}</span>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
              <span>
                If you don't receive the email within a few minutes, please check your spam folder or use the button
                below to generate a new invite.
              </span>
            </AlertDescription>
          </Alert>

          {verifiedEmail && <RegenerateInvite email={verifiedEmail} />}

          <div className="border-t border-b py-4 my-4">
            <h3 className="font-medium mb-2">Complete Your Setup</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide your GitHub username to complete your Discord profile setup
            </p>

            {githubUsername ? (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription>
                  <p className="font-medium">GitHub username submitted: @{githubUsername}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Thank you for completing the verification process!
                  </p>
                </AlertDescription>
              </Alert>
            ) : (
              verifiedEmail && <GithubUsernameForm email={verifiedEmail} />
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Check your email for the Discord invite link and join our community
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

