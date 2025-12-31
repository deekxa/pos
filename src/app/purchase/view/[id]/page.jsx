'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Calendar, User, Package, Hash, Truck } from 'lucide-react'

export default function ViewPurchasePage() {
  const router = useRouter()
  const params = useParams()
  const purchaseId = parseInt(params.id)
  
  const [purchase, setPurchase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('purchases')
    if (stored) {
      const purchases = JSON.parse(stored)
      const found = purchases.find(p => p.id === purchaseId)
      
      if (found) {
        setPurchase(found)
      } else {
        router.push('/purchase')
      }
    }
    setLoading(false)
  }, [purchaseId, router])

  const handleDelete = () => {
    const stored = localStorage.getItem('purchases')
    if (stored) {
      const purchases = JSON.parse(stored)
      const updated = purchases.filter(p => p.id !== purchaseId)
      localStorage.setItem('purchases', JSON.stringify(updated))
      router.push('/purchase')
    }
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

  if (!purchase) {
    return null
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'branch_head']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          
    
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/purchase')}
                className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all"
              >
                <ArrowLeft className="text-gray-600" size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Purchase Order Details</h1>
                <p className="text-sm text-gray-500 mt-0.5">{purchase.reference}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/purchase/edit/${purchase.id}`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => setDeleteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
         
            <div className="px-6 py-10 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Purchase Amount</p>
                <div className="inline-flex items-baseline gap-1">
                  <h2 className="text-5xl font-bold text-gray-900">
                    रु{purchase.amount.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>

           
            <div className="p-6 space-y-6">
             
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                  purchase.status === 'Delivered' ? 'bg-gray-900 text-white' :
                  purchase.status === 'Pending' ? 'bg-white border border-gray-300 text-gray-700' :
                  'bg-gray-100 text-gray-700 border border-gray-200'
                }`}>
                  {purchase.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div className="flex items-start gap-3 group">
                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 group-hover:border-gray-200 transition-colors">
                    <Calendar className="text-gray-500" size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date</p>
                    <p className="text-sm font-semibold text-gray-900">{purchase.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 group-hover:border-gray-200 transition-colors">
                    <Hash className="text-gray-500" size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Reference</p>
                    <p className="text-sm font-semibold text-gray-900 font-mono">{purchase.reference}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 group-hover:border-gray-200 transition-colors">
                    <User className="text-gray-500" size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Supplier</p>
                    <p className="text-sm font-semibold text-gray-900">{purchase.supplier}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 group-hover:border-gray-200 transition-colors">
                    <Package className="text-gray-500" size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Order ID</p>
                    <p className="text-sm font-semibold text-gray-900">#{purchase.id}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Items</p>
                <p className="text-sm text-gray-700 leading-relaxed">{purchase.items}</p>
              </div>
            </div>
          </div>
        </div>

   
        {deleteModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl animate-in zoom-in duration-200">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-gray-50">
                <Trash2 className="text-gray-700" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
                Delete Purchase Order?
              </h3>
              <p className="text-center text-gray-600 text-sm leading-relaxed mb-6">
                This will permanently remove this purchase order. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-gray-800 transition-all shadow-sm hover:shadow"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
