'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LogIn, Store } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(email, password)
    
    if (result.success) {
      router.push('/')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const demoAccounts = [
    { email: 'admin@pos.com', password: 'admin123', role: 'Admin', branch: 'Savory - ATS' },
    { email: 'head@pos.com', password: 'head123', role: 'Branch Head', branch: 'Butwal' },
    { email: 'head2@pos.com', password: 'head123', role: 'Branch Head', branch: 'Bhairahawa' },
    { email: 'cashier@pos.com', password: 'cashier123', role: 'Cashier', branch: 'Savory - ATS' },
    { email: 'cashier1@pos.com', password: 'cashier123', role: 'Cashier', branch: 'Butwal' },
    { email: 'cashier2@pos.com', password: 'cashier123', role: 'Cashier', branch: 'Bhairahawa' },
    { email: 'worker@pos.com', password: 'worker123', role: 'Worker', branch: 'Butwal' },
    { email: 'worker2@pos.com', password: 'worker123', role: 'Worker', branch: 'Bhairahawa' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6 relative">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-900 rounded-xl mb-4 shadow-lg">
            <Store className="w-7 h-7 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Savory POS</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to continue</p>
        </div>

        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl p-8">
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent text-gray-900 placeholder:text-gray-400 transition-colors"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent text-gray-900 placeholder:text-gray-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 mt-8 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-4 text-center font-medium">Quick Access</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setEmail(account.email)
                    setPassword(account.password)
                  }}
                  className="p-3 text-left bg-gray-50 border border-gray-200 hover:border-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <div className="font-medium text-gray-900 text-xs">{account.role}</div>
                  <div className="text-gray-500 text-[11px] mt-1 truncate">{account.branch}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 Savory POS. All rights reserved.
        </p>
      </div>
    </div>
  )
}
