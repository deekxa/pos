'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  LayoutDashboard, 
  Zap, 
  Package, 
  FileText, 
  TrendingUp, 
  ShoppingBag, 
  Building2,
  LogOut,
  ChevronRight,
  Store
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['admin', 'branch_head', 'cashier', 'worker'] },
    { icon: Zap, label: 'Point of Sale', path: '/pos', roles: ['admin', 'branch_head', 'cashier', 'worker'] },
    { icon: Package, label: 'Inventory', path: '/inventory', roles: ['admin', 'branch_head'] },
    { icon: FileText, label: 'Ledgers', path: '/ledgers', roles: ['admin', 'branch_head'] },
    { icon: TrendingUp, label: 'Reports', path: '/reports', roles: ['admin', 'branch_head'] },
    { icon: ShoppingBag, label: 'Purchase', path: '/purchase', roles: ['admin', 'branch_head'] },
    { icon: Building2, label: 'Branches', path: '/branches', roles: ['admin'] },
  ]

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role))

  const handleLogout = () => {
    logout()
    router.push('/login')
  }
  
  return (
    <aside className="w-[280px] bg-gradient-to-b from-[#0f0f0f] via-[#0a0a0a] to-black h-screen flex flex-col border-r border-white/[0.08] relative overflow-hidden">
      
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="flex flex-col h-full relative z-10">
        
        
        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-lg">
              <Store className="w-6 h-6 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Savory</h1>
              <p className="text-[10px] text-gray-600 font-semibold tracking-wider uppercase mt-0.5">POS System</p>
            </div>
          </div>
        </div>
        
        
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-none">
          <div className="space-y-1.5">
            {filteredMenu.map((item) => {
              const isActive = pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      size={20} 
                      strokeWidth={2.5}
                      className={isActive ? 'text-black' : 'text-gray-500 group-hover:text-white'}
                    />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  {isActive && (
                    <ChevronRight size={16} className="text-black" strokeWidth={3} />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
        
        
        <div className="p-4 border-t border-white/[0.06]">
          <div className="bg-white/[0.05] backdrop-blur-xl rounded-xl p-3.5 mb-3 border border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center text-black text-sm font-black shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0a0a0a] shadow-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-gray-500 truncate font-medium">{user?.branch}</span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 text-[9px] font-black rounded-md uppercase tracking-wider border border-blue-500/20">
                    {user?.role?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white rounded-xl transition-all duration-200 text-sm font-semibold border border-white/[0.08] hover:border-white/[0.15] group"
          >
            <LogOut size={16} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
