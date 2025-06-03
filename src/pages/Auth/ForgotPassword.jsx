// src/components/ForgotPassword.jsx
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
 
export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return setMessage('Please enter your email.')

    setLoading(true)
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      // Make sure this matches one of your “Redirect URLs” in Supabase
      redirectTo:  `${window.location.origin}/set-password`,
    })
    setLoading(false)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage(
        'If that account exists, you’ll receive an email with a link to reset your password.'
      )
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem' }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '1rem', color: '#4a5568' }}>{message}</p>
      )}
    </div>
  )
}
