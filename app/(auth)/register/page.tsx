import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Sign up for a new account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input type="text" placeholder="Full Name" />
          </div>
          <div>
            <Input type="email" placeholder="Email" />
          </div>
          <div>
            <Input type="password" placeholder="Password" />
          </div>
          <div>
            <Input type="password" placeholder="Confirm Password" />
          </div>
          <Button className="w-full">Create Account</Button>
        </CardContent>
      </Card>
    </div>
  )
}
