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
  email: z
    .string()
    .email("Please enter a valid email address")
    .refine((email) => email.endsWith("@student.wethinkcode.co.za"), {
      message: "Email must be a WeThinkCode student email (@student.wethinkcode.co.za)",
    }),
})

export function EmailForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackInvite, setFallbackInvite] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setFallbackInvite(null)

    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify email")
      }

      // Store the verified email in session storage for the next step
      sessionStorage.setItem("verifiedEmail", values.email)

      // If email sending failed but we got a fallback invite link
      if (data.invite) {
        setFallbackInvite(data.invite)
        // Don't redirect yet, show the fallback invite first
      } else {
        // Redirect to the success page
        router.push("/success")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // If we have a fallback invite, show it and provide a button to continue
  if (fallbackInvite) {
    return (
      <div className="space-y-6">
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription>
            <p className="mb-2">We couldn't send the email, but your verification was successful.</p>
            <p className="font-medium">Here's your Discord invite link:</p>
            <p className="mt-2 p-2 bg-gray-100 rounded break-all">
              <a
                href={fallbackInvite}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {fallbackInvite}
              </a>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Please save this link as it won't be shown again.</p>
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/success")} className="w-full">
          Continue
        </Button>
      </div>
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Email</FormLabel>
              <FormControl>
                <Input placeholder="your.name@student.wethinkcode.co.za" {...field} />
              </FormControl>
              <FormDescription>
                Enter your WeThinkCode student email to get access to the Discord channel.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Get Discord Invite"
          )}
        </Button>
      </form>
    </Form>
  )
}

