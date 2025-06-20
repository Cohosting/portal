// src/components/ForgotPassword.jsx
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Layout } from './Layout'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success') // "success" or "error"
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessageType("error");
      setMessage("Please enter your email.");
      return;
    }

    if (!navigator.onLine) {
      setMessageType("error");
      setMessage("You appear to be offline. Please check your internet connection.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/set-password`,
      });

      if (error) {
        setMessageType("error");
        setMessage(error.message);
      } else {
        setMessageType("success");
        setMessage(
          "If that account exists, you’ll receive an email with a link to reset your password."
        );
      }
    } catch (err) {
      setMessageType("error");
      if (err instanceof TypeError && err.message.toLowerCase().includes("fetch")) {
        setMessage("Network error. Please check your internet connection.");
      } else {
        setMessage(err.message || "An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={cn("flex flex-col gap-6")}>
        <Card className="border bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-black focus:ring-0"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>

          {message && (
            <div className="px-8 pb-0">
              <p
                className={cn(
                  "text-center text-sm",
                  messageType === "error" ? "text-red-600" : "text-green-600"
                )}
              >
                {message}
              </p>
            </div>
          )}

          <CardFooter className="px-8 flex-col pb-8 text-center">
            <p className="text-sm text-gray-700">
              Remembered your password?{' '}
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className="font-medium px-0 text-black underline hover:text-gray-800"
              >
                Sign in
              </Button>
            </p>
            <p className="mt-4 text-xs text-gray-500">
              By resetting, you agree to our{' '}
              <a href="/terms" className="underline hover:text-gray-700">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </a>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  )
}
