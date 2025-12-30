'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        router.push('/unauthorized')
      }
    }
  }, [user, loading, router, allowedRoles])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  if (!user) return null

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null
  }

  return children
}
