'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  ShoppingCart, Package, AlertTriangle, 
  TrendingUp, TrendingDown, 
  ArrowUpRight, Calendar, ChevronRight, Zap, MapPin, Target, Activity
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()

  const branchData = {
    'Savory - ATS': {
      revenue: 45800,
      revenueChange: 15.3,
      orders: 235,
      ordersChange: 12.8,
      products: 1234,
      productsChange: 25,
      lowStock: 23,
      lowStockChange: -5,
      transactions: [
        { id: 'TXN-5234', time: '2 mins ago', items: 8, total: 2450, customer: 'Walk-in', status: 'completed', paymentMethod: 'Cash' },
        { id: 'TXN-5233', time: '12 mins ago', items: 5, total: 1890, customer: 'Suman Rai', status: 'completed', paymentMethod: 'UPI' },
        { id: 'TXN-5232', time: '25 mins ago', items: 12, total: 4340, customer: 'Walk-in', status: 'completed', paymentMethod: 'Card' },
        { id: 'TXN-5231', time: '40 mins ago', items: 3, total: 960, customer: 'Anita Sharma', status: 'completed', paymentMethod: 'Cash' },
      ],
      lowStockItems: [
        { name: 'Coke 500ml', current: 15, min: 60, category: 'Beverages', sku: 'BEV-002' },
        { name: 'Kurkure', current: 10, min: 40, category: 'Snacks', sku: 'SNK-015' },
        { name: 'Biscuits', current: 8, min: 30, category: 'Bakery', sku: 'BAK-008' },
      ]
    },
    'Butwal Branch': {
      revenue: 24500,
      revenueChange: 12.5,
      orders: 145,
      ordersChange: 8.2,
      products: 856,
      productsChange: 15,
      lowStock: 18,
      lowStockChange: -3,
      transactions: [
        { id: 'TXN-3234', time: '5 mins ago', items: 5, total: 1250, customer: 'Walk-in', status: 'completed', paymentMethod: 'Cash' },
        { id: 'TXN-3233', time: '18 mins ago', items: 3, total: 890, customer: 'Raj Kumar', status: 'completed', paymentMethod: 'UPI' },
        { id: 'TXN-3232', time: '32 mins ago', items: 8, total: 2340, customer: 'Walk-in', status: 'completed', paymentMethod: 'Card' },
        { id: 'TXN-3231', time: '48 mins ago', items: 2, total: 560, customer: 'Priya Singh', status: 'completed', paymentMethod: 'Cash' },
      ],
      lowStockItems: [
        { name: 'Pepsi 500ml', current: 12, min: 50, category: 'Beverages', sku: 'BEV-001' },
        { name: 'Lay\'s Chips', current: 8, min: 30, category: 'Snacks', sku: 'SNK-024' },
        { name: 'Bread', current: 5, min: 20, category: 'Bakery', sku: 'BAK-012' },
      ]
    },
    'Bhairahawa Branch': {
      revenue: 18200,
      revenueChange: 9.8,
      orders: 98,
      ordersChange: 6.5,
      products: 645,
      productsChange: 12,
      lowStock: 15,
      lowStockChange: -2,
      transactions: [
        { id: 'TXN-7234', time: '3 mins ago', items: 4, total: 980, customer: 'Walk-in', status: 'completed', paymentMethod: 'Cash' },
        { id: 'TXN-7233', time: '20 mins ago', items: 6, total: 1450, customer: 'Krishna Thapa', status: 'completed', paymentMethod: 'UPI' },
        { id: 'TXN-7232', time: '35 mins ago', items: 3, total: 720, customer: 'Walk-in', status: 'completed', paymentMethod: 'Card' },
        { id: 'TXN-7231', time: '52 mins ago', items: 5, total: 1100, customer: 'Rita Gurung', status: 'completed', paymentMethod: 'Cash' },
      ],
      lowStockItems: [
        { name: 'Sprite 500ml', current: 10, min: 45, category: 'Beverages', sku: 'BEV-003' },
        { name: 'Wai Wai', current: 6, min: 35, category: 'Snacks', sku: 'SNK-030' },
        { name: 'Milk', current: 7, min: 25, category: 'Dairy', sku: 'DRY-005' },
      ]
    }
  }

  const currentBranch = branchData[user?.branch] || branchData['Butwal Branch']

  const quickActions = [
    { 
      icon: Zap, 
      title: 'Lightning Checkout', 
      subtitle: 'Process sales instantly',
      action: () => router.push('/pos'),
      roles: ['admin', 'branch_head', 'cashier', 'worker']
    },
    { 
      icon: Package, 
      title: 'Stock Control', 
      subtitle: 'Monitor inventory',
      action: () => router.push('/inventory'),
      roles: ['admin', 'branch_head']
    },
    { 
      icon: TrendingUp, 
      title: 'Business Insights', 
      subtitle: 'Analytics & trends',
      action: () => router.push('/reports'),
      roles: ['admin', 'branch_head']
    },
  ]

  const filteredQuickActions = quickActions.filter(action => action.roles.includes(user?.role))

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs">
            <div className="text-gray-500 mb-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Location
            </div>
            <div className="font-semibold text-gray-900">{user?.branch || 'Main'}</div>
          </div>
          <div className="px-3 py-2 bg-gray-900 text-white rounded-lg text-xs">
            <div className="opacity-80 mb-0.5 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Access Level
            </div>
            <div className="font-bold uppercase">{user?.role?.replace('_', ' ')}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {filteredQuickActions.map((action, idx) => {
          const Icon = action.icon
          return (
            <button
              key={idx}
              onClick={action.action}
              className="group bg-white hover:bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-all text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="font-semibold text-gray-900 text-sm mb-0.5">{action.title}</div>
              <div className="text-xs text-gray-500">{action.subtitle}</div>
            </button>
          )
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Revenue */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">रु</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs font-bold text-green-700">+{currentBranch.revenueChange}%</span>
            </div>
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Cash Flow</div>
          
                    <div className="text-2xl font-bold text-gray-900">रु{currentBranch.revenue.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-2">Since morning</div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs font-bold text-green-700">+{currentBranch.ordersChange}%</span>
            </div>
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Transactions</div>
          <div className="text-2xl font-bold text-gray-900">{currentBranch.orders}</div>
          <div className="text-xs text-gray-500 mt-2">Completed today</div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-700" />
            </div>
            <div className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-bold text-gray-700">
              +{currentBranch.productsChange}
            </div>
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Catalog Size</div>
          <div className="text-2xl font-bold text-gray-900">{currentBranch.products}</div>
          <div className="text-xs text-gray-500 mt-2">Active SKUs</div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded">
              <TrendingDown className="w-3 h-3 text-red-600" />
              <span className="text-xs font-bold text-red-700">{currentBranch.lowStockChange}</span>
            </div>
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Stock Alerts</div>
          <div className="text-2xl font-bold text-red-600">{currentBranch.lowStock}</div>
          <div className="text-xs text-gray-500 mt-2">Critical items</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div>
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Live Activity Feed
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Real-time transaction stream</p>
            </div>
            <button 
              onClick={() => router.push('/ledgers')}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 font-medium group"
            >
              View all
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="divide-y divide-gray-100">
            {currentBranch.transactions.map((txn, idx) => (
              <div key={idx} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900 text-sm">{txn.id}</span>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-200">
                        Completed
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="font-medium">{txn.customer}</span>
                      <span className="text-gray-300">•</span>
                      <span>{txn.items} items</span>
                      <span className="text-gray-300">•</span>
                      <span>{txn.paymentMethod}</span>
                      <span className="text-gray-300">•</span>
                      <span>{txn.time}</span>
                    </div>
                  </div>
                  
                                  <div className="font-bold text-gray-900">रु{txn.total.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">Restock Queue</h2>
                <p className="text-xs text-gray-500">Urgent attention needed</p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/inventory')}
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 font-medium group"
            >
              Manage
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="p-4 space-y-3">
            {currentBranch.lowStockItems.map((item, idx) => (
              <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">{item.name}</div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {item.category} • {item.sku}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded whitespace-nowrap ml-2">
                    CRITICAL
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Inventory level</span>
                    <span className="font-bold text-gray-900">
                      {item.current} / {item.min} units
                    </span>
                  </div>
                  <div className="relative w-full bg-red-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-red-600 rounded-full" 
                      style={{ width: `${Math.min((item.current / item.min) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
