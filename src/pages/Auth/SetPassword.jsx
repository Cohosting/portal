// src/components/SetPassword.jsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import { Layout } from './Layout'

// shadcn/ui imports:
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

export default function SetPassword() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState('loading') // 'loading' (initial check) | 'ready' | 'success' | 'error'
  const [isSubmitting, setIsSubmitting] = useState(false) // true while calling updateUser
  const [errorMsg, setErrorMsg] = useState(null)
  const [isAuthError, setIsAuthError] = useState(false)

  useEffect(() => {
    // 1) On mount, check session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus('ready')
      } else {
        setIsAuthError(true)
        setErrorMsg('You must be authenticated to reset your password.')
        setStatus('error')
        setTimeout(() => navigate('/login'), 3000)
      }
    })

    // 2) Listen for PASSWORD_RECOVERY in case redirect arrives late
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY' && session) {
          setIsAuthError(false)
          setErrorMsg(null)
          setStatus('ready')
        }
      }
    )

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsAuthError(false)

    if (!newPassword) {
      setErrorMsg('Please enter a new password.')
      setStatus('error')
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters.')
      setStatus('error')
      return
    }

    // Start submitting; keep status as 'ready' so form stays visible
    setIsSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setIsSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  return (
    <Layout>
      <div className={cn('flex flex-col gap-6')}>
        <Card className="border bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset Your Password</CardTitle>
            <CardDescription>
              Enter a new password below
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-0">
            {status === 'loading' && (
              <p className="text-center text-sm text-gray-600 mb-4">
                Verifying… Please wait…
              </p>
            )}

            {/* Show form whenever we are “ready” or there’s an error (except auth‐redirect) */}
            {(status === 'ready' || (status === 'error' && !isAuthError)) && (
              <>
                {errorMsg && !isAuthError && (
                  <p className="text-center text-sm text-red-600 mb-4">
                    {errorMsg}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid w-full items-center gap-1.5">
                    <Label
                      htmlFor="new-password"
                      className="text-sm font-medium text-gray-700"
                    >
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-black focus:ring-0"
                      // keep input enabled or disabled as you like; here we keep it enabled
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white hover:bg-gray-800"
                  >
                    {isSubmitting ? 'Updating…' : 'Update Password'}
                  </Button>
                </form>

                {isSubmitting && (
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Sending request… please wait.
                  </p>
                )}
              </>
            )}

            {status === 'error' && isAuthError && errorMsg && (
              <p className="text-center text-sm text-red-600 mt-4">
                {errorMsg} Redirecting to login…
              </p>
            )}

            {status === 'success' && (
              <p className="text-center text-sm text-green-600  ">
                Password updated successfully!
              </p>
            )}
          </CardContent>

          <CardFooter className="px-8 flex-col pb-8 text-center">
            {status === 'success' ? (
              <Button
                onClick={() => navigate('/')}
                className=" bg-black text-white hover:bg-gray-800"
              >
                Go to Dashboard
              </Button>
            ) : (
              <p className="text-sm text-gray-700">
                Remembered your password?{' '}
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    navigate('/login')
                  }}
                  className="font-medium px-0 text-black underline hover:text-gray-800"
                >
                  Sign in
                </Button>
              </p>
            )}

            <p className="mt-4 text-xs text-gray-500">
              By resetting, you agree to our{' '}
              <a href="/terms" className="underline hover:text-gray-700">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </a>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  )
}
