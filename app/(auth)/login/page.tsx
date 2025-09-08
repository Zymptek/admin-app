import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      {/* Visual / Marketing side */}
      <div className="relative hidden md:block overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_20%,_theme(colors.primary/10),_transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_80%_0%,_theme(colors.secondary/50),_transparent)]" />
        <div className="relative h-full w-full p-10 flex flex-col">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="size-8 rounded-md bg-foreground/10 grid place-items-center font-semibold">∞</div>
            <span className="font-medium text-foreground">Your Company</span>
          </div>
          <div className="mt-auto" />
          <div className="max-w-lg">
            <h1 className="text-3xl/tight md:text-4xl/tight font-semibold tracking-tight text-foreground">
              Crafting delightful experiences for modern teams
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Join thousands of companies using our platform to ship faster, collaborate better, and build products users love.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6 opacity-80">
            <div className="h-24 rounded-xl border bg-card" />
            <div className="h-24 rounded-xl border bg-card" />
            <div className="h-24 rounded-xl border bg-card" />
          </div>
          <div className="mt-6 text-xs text-muted-foreground">Trusted by teams worldwide</div>
        </div>
      </div>

      {/* Auth side */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="md:hidden size-8 rounded-md bg-foreground/10 grid place-items-center font-semibold">∞</div>
            <span className="sr-only">Brand</span>
          </div>

          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>Sign in to continue to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 size-5" aria-hidden>
                    <path fill="currentColor" d="M21.35 11.1h-9.18v2.98h5.27a4.51 4.51 0 0 1-1.96 2.96l3.17 2.46c1.85-1.71 2.92-4.23 2.92-7.4 0-.62-.06-1.22-.22-1.8z"/>
                    <path fill="currentColor" d="M12.17 22c2.64 0 4.86-.88 6.48-2.38l-3.17-2.46c-.88.6-2 .98-3.31.98-2.55 0-4.72-1.73-5.49-4.07H3.38v2.56A9.99 9.99 0 0 0 12.17 22z"/>
                    <path fill="currentColor" d="M6.68 14.07a5.98 5.98 0 0 1 0-4.14V7.37H3.38a10.01 10.01 0 0 0 0 9.26l3.3-2.56z"/>
                    <path fill="currentColor" d="M12.17 5.5c1.44 0 2.74.5 3.76 1.47l2.8-2.8A9.6 9.6 0 0 0 12.17 2 9.99 9.99 0 0 0 3.38 7.37l3.3 2.56c.77-2.34 2.94-4.07 5.49-4.07z"/>
                  </svg>
                  Continue with Google
                </Button>
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 size-5" aria-hidden>
                    <path fill="currentColor" d="M19.665 3H4.335A1.34 1.34 0 0 0 3 4.335v15.33C3 20.4 3.6 21 4.335 21h8.262v-6.667H9.846V11h2.751V9.095c0-2.72 1.661-4.205 4.087-4.205 1.162 0 2.415.207 2.415.207v2.653h-1.36c-1.34 0-1.757.83-1.757 1.68V11h2.988l-.478 3.333h-2.51V21h4.163A1.34 1.34 0 0 0 21 19.665V4.335C21 3.6 20.4 3 19.665 3"/>
                  </svg>
                  Continue with Facebook
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden>
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="name@company.com" autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Forgot?</Link>
                  </div>
                  <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" />
                </div>
                <Button className="w-full">Sign in</Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/\(auth\)/register" className="text-foreground underline underline-offset-4">Create one</Link>
              </p>
            </CardContent>
          </Card>

          <div className="mt-6 text-xs text-muted-foreground text-center">
            Protected by reCAPTCHA • Terms • Privacy
          </div>
        </div>
      </div>
    </div>
  )
}
