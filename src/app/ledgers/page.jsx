'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { 
  Plus, Filter, Download, Search, 
  TrendingUp, TrendingDown, Eye,
  ChevronLeft, ChevronRight, CheckCircle, Clock
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const defaultTransactions = [
  { id: 1, date: '2025-12-26', type: 'Sale', category: 'Revenue', description: 'Product sales - Invoice #1234', amount: 5000, reference: 'INV-1234', status: 'Completed' },
  { id: 2, date: '2025-12-25', type: 'Purchase', category: 'Inventory', description: 'Inventory purchase from Supplier A', amount: -2000, reference: 'PO-5678', status: 'Completed' },
  { id: 3, date: '2025-12-24', type: 'Sale', category: 'Revenue', description: 'Product sales - Invoice #1233', amount: 3500, reference: 'INV-1233', status: 'Completed' },
  { id: 4, date: '2025-12-23', type: 'Expense', category: 'Operating', description: 'Rent payment for December', amount: -1500, reference: 'EXP-0012', status: 'Completed' },
  { id: 5, date: '2025-12-22', type: 'Sale', category: 'Revenue', description: 'Product sales - Invoice #1232', amount: 4200, reference: 'INV-1232', status: 'Pending' },
]

export default function LedgersPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ledger')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {}
      }
    }
    return defaultTransactions
  })

  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ledger', JSON.stringify(transactions))
    }
  }, [transactions])

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  
  const netBalance = totalIncome - totalExpense

  const categories = ['all', ...new Set(transactions.map(t => t.category))]
  const types = ['all', ...new Set(transactions.map(t => t.type))]

  const filteredTransactions = transactions.filter(t => {
    const searchLower = search.toLowerCase()
    const matchesSearch = (
      t.description.toLowerCase().includes(searchLower) ||
      t.reference.toLowerCase().includes(searchLower) ||
      t.category.toLowerCase().includes(searchLower)
    )
    
    const matchesType = filters.type === 'all' || t.type === filters.type
    const matchesCategory = filters.category === 'all' || t.category === filters.category
    const matchesStatus = filters.status === 'all' || t.status === filters.status
    
    const matchesDateFrom = !filters.dateFrom || t.date >= filters.dateFrom
    const matchesDateTo = !filters.dateTo || t.date <= filters.dateTo
    
    return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo
  })

  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage)

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Reference', 'Amount', 'Status']
    const rows = sortedTransactions.map(t => 
      [t.date, t.type, t.category, t.description, t.reference, t.amount, t.status]
    )
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ledger-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'branch_head']}>
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Financial Ledger</h1>
            <p className="text-sm text-gray-500 mt-1">
              {sortedTransactions.length} {sortedTransactions.length === 1 ? 'transaction' : 'transactions'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={16} />
              Export
            </button>
            <button 
              onClick={() => router.push('/ledgers/add')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} />
              Add Transaction
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Income</span>
              <TrendingUp className="text-gray-400" size={16} />
            </div>
            <div className="text-2xl font-semibold text-gray-900">रु{totalIncome.toLocaleString()}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Expenses</span>
              <TrendingDown className="text-gray-400" size={16} />
            </div>
            <div className="text-2xl font-semibold text-gray-900">रु{totalExpense.toLocaleString()}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Net Balance</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900">रु{netBalance.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions by description or reference..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                showFilters ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type === 'all' ? 'All Types' : type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="all">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Amount</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{t.date}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{t.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{t.reference}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-sm">
                      <span className={t.amount >= 0 ? 'text-green-700' : 'text-red-700'}>
                        {t.amount >= 0 ? '+' : '-'}रु{Math.abs(t.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {t.status === 'Completed' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                          <CheckCircle size={12} />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-medium">
                          <Clock size={12} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => router.push(`/ledgers/view/${t.id}`)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View details"
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

          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedTransactions.length)} of {sortedTransactions.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
