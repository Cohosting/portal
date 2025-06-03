// src/components/SetPassword.jsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useNavigate, useLocation } from 'react-router-dom'

export default function SetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    // Listen for auth state changes (PASSWORD_RECOVERY event)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setStatus('ready')
        }
      }
    )

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Parse query params from URL (e.g. ?access_token=…&type=recovery)
    const params = new URLSearchParams(location.search)
    const type = params.get('type')
    const accessToken = params.get('access_token')

    if (type !== 'recovery' || !accessToken) {
      setErrorMsg('Invalid or expired password recovery link.')
      setStatus('error')
    }
  }, [location.search])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newPassword) {
      setErrorMsg('Please enter a new password.')
      return
    }

    setStatus('loading')
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem' }}>
      <h2>Reset Your Password</h2>

      {status === 'loading' && <p>Verifying link…</p>}

      {status === 'ready' && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
          <button
            type="submit"
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
            }}
          >
            Update Password
          </button>
          {errorMsg && (
            <p style={{ marginTop: '1rem', color: 'crimson' }}>
              {errorMsg}
            </p>
          )}
        </form>
      )}

      {status === 'success' && (
        <>
          <p style={{ color: 'green' }}>Password updated successfully!</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
            }}
          >
            Go to Login
          </button>
        </>
      )}

      {status === 'error' && errorMsg && (
        <p style={{ color: 'crimson' }}>{errorMsg}</p>
      )}
    </div>
  )
}
