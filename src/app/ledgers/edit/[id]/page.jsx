'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

export default function EditTransactionPage() {
  const router = useRouter()
  const params = useParams()
  const transactionId = parseInt(params.id)
  
  const [formData, setFormData] = useState({
    date: '',
    type: 'Sale',
    category: 'Revenue',
    description: '',
    amount: '',
    reference: '',
    status: 'Completed'
  })
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('ledger')
    if (stored) {
      const ledger = JSON.parse(stored)
      const transaction = ledger.find(t => t.id === transactionId)
      
      if (transaction) {
        setFormData({
          date: transaction.date,
          type: transaction.type,
          category: transaction.category,
          description: transaction.description,
          amount: Math.abs(transaction.amount).toString(),
          reference: transaction.reference,
          status: transaction.status
        })
      } else {
        router.push('/ledgers')
      }
    }
    setLoading(false)
  }, [transactionId, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const stored = localStorage.getItem('ledger')
    const ledger = stored ? JSON.parse(stored) : []
    
    const updatedTransaction = {
      id: transactionId,
      date: formData.date,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      reference: formData.reference,
      status: formData.status,
      amount: formData.type === 'Sale' ? parseFloat(formData.amount) : -Math.abs(parseFloat(formData.amount))
    }
    
    const updatedLedger = ledger.map(t => 
      t.id === transactionId ? updatedTransaction : t
    )
    
    localStorage.setItem('ledger', JSON.stringify(updatedLedger))
    router.push(`/ledgers/view/${transactionId}`)
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'branch_head']}>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <p className="text-gray-500">Loading...</p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'branch_head']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push(`/ledgers/view/${transactionId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="text-gray-600" size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Edit Transaction</h1>
              <p className="text-sm text-gray-500 mt-0.5">Update transaction details</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Transaction Type & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="Sale">Sale</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="Revenue">Revenue</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Operating">Operating</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  required
                  placeholder="e.g., INV-1234, PO-5678, EXP-0012"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1.5">Unique identifier for this transaction</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Detailed description of the transaction..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  {formData.type === 'Sale' ? 'Will be recorded as income (+)' : 'Will be recorded as expense (-)'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push(`/ledgers/view/${transactionId}`)}
                  className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
