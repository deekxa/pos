'use client'

import ProtectedRoute from '@/components/ProtectedRoute'

import { useState } from 'react'

export default function BranchesPage() {
  const [branches] = useState([
    {
      id: 1,
      code: 'ATS',
      name: 'Savory - ATS Branch',
      location: 'Kathmandu, Nepal',
      type: 'Main Branch (Headquarters)',
      manager: 'Admin User',
      employees: 15,
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
      manager: 'Branch Head',
      employees: 10,
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
      manager: 'Branch Head',
      employees: 8,
      poles: [
        { name: 'Branch Head', head: 'Ramesh Thapa', count: 1, role: 'branch_head' },
        { name: 'Cashier', head: 'Sunita Rai', count: 3, role: 'cashier' },
        { name: 'Worker', head: 'Krishna Gurung', count: 4, role: 'worker' },
      ]
    },
  ])

  return (
    <ProtectedRoute allowedRoles={['admin']}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Branches & Organization</h1>
          <p className="text-slate-500 mt-1">Manage branches, poles, and team structure</p>
        </div>
        <button className="px-4 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
          + Add Branch
        </button>
      </div>

      <div className="space-y-6">
        {branches.map(branch => (
          <div key={branch.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Branch Header */}
            <div className="p-6 border-b border-gray-200 bg-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-semibold text-slate-900">{branch.name}</h2>
                    <span className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-xs font-medium">
                      {branch.code}
                    </span>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                      {branch.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-slate-600">
                    <span>📍 {branch.location}</span>
                    <span>👤 Manager: {branch.manager}</span>
                    <span>👥 {branch.employees} Employees</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors border border-gray-200 text-sm">
                  Manage
                </button>
              </div>
            </div>

            {/* Organizational Poles */}
            <div className="p-6">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
                Organizational Poles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {branch.poles.map((pole, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">{pole.name}</h4>
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-xs font-medium">
                        {pole.count}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">Head: {pole.head}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </ProtectedRoute>
  )
}
