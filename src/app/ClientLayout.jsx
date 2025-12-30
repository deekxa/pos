'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import Sidebar from '@/components/Layout/Sidebar'
import { Bell, Settings } from 'lucide-react'

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !user && pathname !== '/login' && pathname !== '/unauthorized') {
      router.push('/login')
    }
  }, [user, loading, pathname, router])
  
  const isAuthPage = pathname === '/login' || pathname === '/unauthorized'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  if (isAuthPage) {
    return <>{children}</>
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-50 rounded-lg">
              <Bell size={20} className="text-slate-600" />
            </button>
            <button className="p-2 hover:bg-slate-50 rounded-lg">
              <Settings size={20} className="text-slate-600" />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="p-8 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
