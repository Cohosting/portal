import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

const SubscriptionSuccess = () => {
  const [paymentIntent, setPaymentIntent] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    setPaymentIntent(urlParams.get('payment_intent') || '')
    setClientSecret(urlParams.get('payment_intent_client_secret') || '')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500" />
            </motion.div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Subscription Successful!</h1>
          <p className="text-center text-gray-600 mb-6">
            Thank you for subscribing. Your account has been successfully activated.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Transaction Details:</h2>
            <p className="text-xs text-gray-600 mb-1">
              <span className="font-medium">Payment Intent:</span> {paymentIntent}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Client Secret:</span> {clientSecret.slice(0, 20)}...
            </p>
          </div>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center transition duration-200 ease-in-out"
            >
              Go to Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate('/settings/account')}
              className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg text-center transition duration-200 ease-in-out"
            >
              Account Settings
            </button>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-600">Need help?</p>
          <a href="/support" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
            Contact Support <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default SubscriptionSuccess;