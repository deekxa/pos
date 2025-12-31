'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Building2 } from 'lucide-react'

export default function EditBranchPage() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    location: '',
    type: 'Sub Branch',
    manager: '',
    employees: 0,
  })

  useEffect(() => {
   
    const mockBranch = {
      code: 'BWL',
      name: 'Butwal Branch',
      location: 'Butwal, Nepal',
      type: 'Sub Branch',
      manager: 'Hari Prasad',
      employees: 10,
    }
    setFormData(mockBranch)
  }, [params.id])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Updated branch data:', formData)
    router.push('/branches')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Branch</h1>
            <p className="text-sm text-gray-500 mt-0.5">Update branch information</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="Headquarters">Headquarters</option>
                    <option value="Sub Branch">Sub Branch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Employees
                  </label>
                  <input
                    type="number"
                    name="employees"
                    value={formData.employees}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}
