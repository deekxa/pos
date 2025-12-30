'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package,
  Download,
  Eye,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

export default function ReportsPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState('month')

  const metrics = {
    totalRevenue: 340000,
    revenueChange: 12.5,
    totalOrders: 284,
    ordersChange: -3.2,
    avgOrderValue: 1197,
    avgOrderChange: 8.4,
    lowStockItems: 8,
    stockChange: 2
  }

  const topProducts = [
    { id: 1, name: 'Product A', sold: 145, revenue: 50000, stock: 45 },
    { id: 2, name: 'Product C', sold: 98, revenue: 35000, stock: 23 },
    { id: 3, name: 'Product D', sold: 76, revenue: 28000, stock: 12 },
    { id: 4, name: 'Product B', sold: 64, revenue: 22000, stock: 67 },
    { id: 5, name: 'Product E', sold: 52, revenue: 18000, stock: 8 },
  ]

  const categoryBreakdown = [
    { category: 'Electronics', revenue: 125000, percentage: 36.8, growth: 12.5 },
    { category: 'Clothing', revenue: 98000, percentage: 28.8, growth: -3.2 },
    { category: 'Food', revenue: 67000, percentage: 19.7, growth: 8.7 },
    { category: 'Other', revenue: 50000, percentage: 14.7, growth: 5.3 },
  ]

  const recentTransactions = [
    { id: 1, invoice: 'INV-1234', date: '2025-12-26', customer: 'Walk-in Customer', amount: 5000, status: 'Completed' },
    { id: 2, invoice: 'INV-1233', date: '2025-12-24', customer: 'John Doe', amount: 3500, status: 'Completed' },
    { id: 3, invoice: 'INV-1232', date: '2025-12-22', customer: 'Jane Smith', amount: 4200, status: 'Pending' },
  ]

  const exportToCSV = () => {
    const report = [
      ['Business Report Summary'],
      ['Period', dateRange],
      ['Generated', new Date().toLocaleString()],
      [''],
      ['KEY METRICS'],
      ['Metric', 'Value', 'Change'],
      ['Total Revenue', `₹${metrics.totalRevenue}`, `${metrics.revenueChange}%`],
      ['Total Orders', metrics.totalOrders, `${metrics.ordersChange}%`],
      ['Avg Order Value', `₹${metrics.avgOrderValue}`, `${metrics.avgOrderChange}%`],
      ['Low Stock Items', metrics.lowStockItems, `${metrics.stockChange} items`],
      [''],
      ['TOP SELLING PRODUCTS'],
      ['Rank', 'Product', 'Units Sold', 'Revenue', 'Stock'],
      ...topProducts.map((p, idx) => [idx + 1, p.name, p.sold, p.revenue, p.stock]),
      [''],
      ['REVENUE BY CATEGORY'],
      ['Category', 'Revenue', 'Percentage', 'Growth'],
      ...categoryBreakdown.map(c => [c.category, c.revenue, `${c.percentage}%`, `${c.growth}%`]),
      [''],
      ['RECENT TRANSACTIONS'],
      ['Invoice', 'Date', 'Customer', 'Amount', 'Status'],
      ...recentTransactions.map(t => [t.invoice, t.date, t.customer, t.amount, t.status])
    ]

    const csv = report.map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `business-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const getGrowthColor = (growth) => {
    if (growth >= 0) return 'bg-green-500'
    return 'bg-red-500'
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'branch_head']}>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Business Reports</h1>
            <p className="text-sm text-gray-500 mt-1">Track performance and analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button 
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Revenue</span>
              <div className="p-2 bg-gray-50 rounded-lg">
                <DollarSign className="text-gray-600" size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">₹{metrics.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="text-green-600" size={12} />
              <span className="font-medium text-green-700">{metrics.revenueChange}% vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</span>
              <div className="p-2 bg-gray-50 rounded-lg">
                <ShoppingCart className="text-gray-600" size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{metrics.totalOrders}</div>
            <div className="flex items-center gap-1 text-xs">
              <ArrowDown className="text-red-600" size={12} />
              <span className="font-medium text-red-700">{Math.abs(metrics.ordersChange)}% vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Order Value</span>
              <div className="p-2 bg-gray-50 rounded-lg">
                <TrendingUp className="text-gray-600" size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">₹{metrics.avgOrderValue}</div>
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="text-green-600" size={12} />
              <span className="font-medium text-green-700">{metrics.avgOrderChange}% vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Low Stock Items</span>
              <div className="p-2 bg-red-50 rounded-lg">
                <Package className="text-red-600" size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-red-600 mb-2">{metrics.lowStockItems}</div>
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="text-gray-600" size={12} />
              <span className="font-medium text-gray-600">{metrics.stockChange} items need reorder</span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Selling Products */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Top Selling Products</h2>
              <button 
                onClick={() => router.push('/reports/products')}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.sold} units sold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 text-sm">₹{product.revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{product.stock} in stock</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Revenue by Category</h2>
              <button 
                onClick={() => router.push('/reports/categories')}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {categoryBreakdown.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{cat.category}</span>
                      <div className="inline-flex items-center gap-0.5">
                        {cat.growth >= 0 ? (
                          <TrendingUp className="text-green-600" size={12} />
                        ) : (
                          <TrendingDown className="text-red-600" size={12} />
                        )}
                        <span className={`text-xs font-medium ${
                          cat.growth >= 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {cat.growth >= 0 ? '+' : ''}{cat.growth}%
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">₹{cat.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getGrowthColor(cat.growth)}`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Recent Transactions</h2>
              <button 
                onClick={() => router.push('/ledgers')}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{txn.invoice}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{txn.date}</td>
                    <td className="px-5 py-3 text-sm text-gray-900">{txn.customer}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-gray-900 text-right">₹{txn.amount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                        txn.status === 'Completed' 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => router.push(`/ledgers/view/${txn.id}`)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
