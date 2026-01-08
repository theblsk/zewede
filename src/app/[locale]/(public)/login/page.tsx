import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from '@heroui/react'
import { Lock, Mail } from 'lucide-react'

import { authenticate } from './actions'

export default function LoginPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-[#fef8ee] via-white to-[#f4d9a4]/30 px-6 py-16">
      <form action={authenticate} className="w-full max-w-md">
        <Card className="border border-default-100/60 shadow-large">
          <CardHeader className="flex flex-col items-center gap-2 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-default-400">
              Welcome back
            </span>
            <h1 className="text-2xl font-semibold text-foreground">Access your dashboard</h1>
            <p className="text-sm text-default-500">
              Sign in to manage orders, track status, and explore the latest treats.
            </p>
          </CardHeader>

          <Divider className="mx-auto w-6" />

          <CardBody>
            <div className="space-y-5">
              <Input
                required
                label="Email"
                name="email"
                type="email"
                variant="bordered"
                size="lg"
                autoComplete="email"
                placeholder="you@example.com"
                startContent={<Mail className="size-4 text-default-400" />}
              />
              <Input
                required
                label="Password"
                name="password"
                type="password"
                variant="bordered"
                size="lg"
                autoComplete="current-password"
                placeholder="••••••••"
                startContent={<Lock className="size-4 text-default-400" />}
              />
            </div>
          </CardBody>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              name="intent"
              value="login"
              color="primary"
              size="lg"
              className="w-full"
            >
              Log in
            </Button>
            <div aria-hidden className="w-full border-t border-default-100/60" />
            <Button
              type="submit"
              name="intent"
              value="signup"
              variant="bordered"
              size="lg"
              className="w-full"
            >
              Create an account
            </Button>
            <p className="text-center text-sm text-default-500">
              New around here? Your account is set up instantly when you sign up.
            </p>
          </CardFooter>
        </Card>
      </form>
    </section>
  )
}