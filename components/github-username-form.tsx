"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  username: z
    .string()
    .min(1, "GitHub username is required")
    .max(39, "GitHub username cannot be longer than 39 characters")
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/, "Invalid GitHub username format"),
})

export function GithubUsernameForm({ email }: { email: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/submit-github-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          githubUsername: values.username,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit GitHub username")
      }

      setSuccess(true)
      // Store the GitHub username in session storage
      sessionStorage.setItem("githubUsername", values.username)

      // Redirect to the final success page after a short delay
      setTimeout(() => {
        router.push("/github-success")
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <AlertDescription>
          <p className="font-medium">GitHub username submitted successfully!</p>
          <p className="text-sm text-muted-foreground mt-2">Redirecting to success page...</p>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub Username</FormLabel>
              <FormControl>
                <Input placeholder="yourusername" {...field} />
              </FormControl>
              <FormDescription>
                Enter your GitHub username (not your email).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit GitHub Username"
          )}
        </Button>
      </form>
    </Form>
  )
}

