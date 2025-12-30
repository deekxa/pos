'use client'

import { Bell, Settings } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
          <Bell size={20} className="text-slate-600" />
        </button>
        <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
          <Settings size={20} className="text-slate-600" />
        </button>
      </div>
    </header>
  )
}
