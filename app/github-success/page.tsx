"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function GithubSuccessPage() {
  const router = useRouter()
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null)
  const [githubUsername, setGithubUsername] = useState<string | null>(null)

  useEffect(() => {
    // Get the verified email and GitHub username from session storage
    const email = sessionStorage.getItem("verifiedEmail")
    const username = sessionStorage.getItem("githubUsername")

    setVerifiedEmail(email)
    setGithubUsername(username)

    // If no verified email or GitHub username is found, redirect to the home page
    if (!email || !username) {
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
          <CardTitle className="text-2xl font-bold">Verification Complete!</CardTitle>
          <CardDescription>You have successfully completed both verifications</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                <Github className="h-5 w-5" />
                <span className="font-medium">GitHub Username: @{githubUsername}</span>
              </div>
              <a
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View GitHub Profile
              </a>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Thank you for verifying your WeThinkCode student email and providing your GitHub username. You can now join
            the Discord community with your verified credentials.
          </p>

          <p className="text-sm font-medium">Check your email for the Discord invite link if you haven't already.</p>
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

