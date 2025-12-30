'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Users, UserCheck, Building2, Edit, Trash2 } from 'lucide-react'

export default function BranchesPage() {
  const router = useRouter()
  const [deleteModal, setDeleteModal] = useState({ show: false, branchId: null, branchName: '' })
  
  const [branches, setBranches] = useState([
    {
      id: 1,
      code: 'ATS',
      name: 'Savory - ATS',
      location: 'Kathmandu, Nepal',
      type: 'Headquarters',
      manager: 'Admin User',
      employees: 15,
      status: 'Active',
      poles: [
        { name: 'Admin', head: 'Admin User', count: 2, role: 'admin' },
        { name: 'Branch Head', head: 'Jane Smith', count: 1, role: 'branch_head' },
        { name: 'Cashier', head: 'Ram Kumar', count: 6, role: 'cashier' },
        { name: 'Worker', head: 'Sita Sharma', count: 6, role: 'worker' },
      ]
    },
    {
      id: 2,
      code: 'BWL',
      name: 'Butwal Branch',
      location: 'Butwal, Nepal',
      type: 'Sub Branch',
      manager: 'Hari Prasad',
      employees: 10,
      status: 'Active',
      poles: [
        { name: 'Branch Head', head: 'Hari Prasad', count: 1, role: 'branch_head' },
        { name: 'Cashier', head: 'Maya Devi', count: 4, role: 'cashier' },
        { name: 'Worker', head: 'Gopal KC', count: 5, role: 'worker' },
      ]
    },
    {
      id: 3,
      code: 'BHR',
      name: 'Bhairahawa Branch',
      location: 'Bhairahawa, Nepal',
      type: 'Sub Branch',
      manager: 'Ramesh Thapa',
      employees: 8,
      status: 'Active',
      poles: [
        { name: 'Branch Head', head: 'Ramesh Thapa', count: 1, role: 'branch_head' },
        { name: 'Cashier', head: 'Sunita Rai', count: 3, role: 'cashier' },
        { name: 'Worker', head: 'Krishna Gurung', count: 4, role: 'worker' },
      ]
    },
  ])

  const openDeleteModal = (id, name) => {
    setDeleteModal({ show: true, branchId: id, branchName: name })
  }

  const confirmDelete = () => {
    setBranches(branches.filter(branch => branch.id !== deleteModal.branchId))
    setDeleteModal({ show: false, branchId: null, branchName: '' })
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Branches</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage branch locations and team structure</p>
          </div>
          <button 
            onClick={() => router.push('/branches/add')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Add Branch
          </button>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 gap-6">
          {branches.map(branch => (
            <div key={branch.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              
              {/* Branch Header */}
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-gray-900">{branch.name}</h2>
                          <span className="px-2 py-0.5 bg-gray-900 text-white rounded text-xs font-bold">
                            {branch.code}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            branch.type === 'Headquarters' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {branch.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {branch.location}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="w-4 h-4" />
                            {branch.manager}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            {branch.employees} Employees
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => router.push(`/branches/edit/${branch.id}`)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(branch.id, branch.name)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Organization Structure */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Organization Structure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {branch.poles.map((pole, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 text-sm">{pole.name}</h4>
                        <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                          {pole.count}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Head:</span> {pole.head}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-gray-50">
              <Trash2 className="text-gray-700" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              Delete Branch?
            </h3>
            <p className="text-center text-gray-600 text-sm mb-6">
              Are you sure you want to delete <span className="font-semibold">{deleteModal.branchName}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, branchId: null, branchName: '' })}
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}
