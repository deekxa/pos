'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import Sidebar from '@/components/Layout/Sidebar'
import Navbar from '@/components/Layout/Navbar'

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* <Sidebar /> */}
      <Navbar />
      <main className="ml-64 pt-16 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default function AppContent({ children }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  
  if (pathname === '/login' || pathname === '/unauthorized') {
    return children
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return null
  }
  
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}
