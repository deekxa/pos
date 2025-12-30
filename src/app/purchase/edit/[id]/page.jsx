'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

export default function EditPurchasePage() {
  const router = useRouter()
  const params = useParams()
  const purchaseId = parseInt(params.id)
  
  const [formData, setFormData] = useState({
    date: '',
    supplier: '',
    items: '',
    amount: '',
    reference: '',
    status: 'Pending'
  })
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('purchases')
    if (stored) {
      const purchases = JSON.parse(stored)
      const purchase = purchases.find(p => p.id === purchaseId)
      
      if (purchase) {
        setFormData({
          date: purchase.date,
          supplier: purchase.supplier,
          items: purchase.items,
          amount: purchase.amount.toString(),
          reference: purchase.reference,
          status: purchase.status
        })
      } else {
        router.push('/purchase')
      }
    }
    setLoading(false)
  }, [purchaseId, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const stored = localStorage.getItem('purchases')
    const purchases = stored ? JSON.parse(stored) : []
    
    const updatedPurchase = {
      id: purchaseId,
      date: formData.date,
      supplier: formData.supplier,
      items: formData.items,
      reference: formData.reference,
      status: formData.status,
      amount: parseFloat(formData.amount)
    }
    
    const updatedPurchases = purchases.map(p => 
      p.id === purchaseId ? updatedPurchase : p
    )
    
    localStorage.setItem('purchases', JSON.stringify(updatedPurchases))
    router.push(`/purchase/view/${purchaseId}`)
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
              onClick={() => router.push(`/purchase/view/${purchaseId}`)}
              className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all"
            >
              <ArrowLeft className="text-gray-600" size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Edit Purchase Order</h1>
              <p className="text-sm text-gray-500 mt-0.5">Update purchase order details</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Date & Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="e.g., PO-001"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  required
                  placeholder="Enter supplier name"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Items Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="items"
                  value={formData.items}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Describe the items being purchased..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>

              {/* Amount & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push(`/purchase/view/${purchaseId}`)}
                  className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all shadow-sm hover:shadow"
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
