import { EmailForm } from "@/components/email-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">WeThinkCode Student Community</CardTitle>
            <CardDescription>Verify your student email to join our Discord community</CardDescription>
          </CardHeader>
          <CardContent>
            <EmailForm />
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Only emails ending with @student.wethinkcode.co.za are eligible.</p>
          <p className="mt-2">
            Having trouble? Contact{" "}
            <a href="mailto:qixulujhb024@student.wethinkcode.co.za" className="font-medium text-primary hover:underline">
              qixulujhb024@student.wethinkcode.co.za
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}

