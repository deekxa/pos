'use client'

import { Bell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0">
      
      
      <div className="flex-1">
      </div>

    
      <div className="flex items-center gap-3">
        <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.branch || 'Branch'}</p>
          </div>
          <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
