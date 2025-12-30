'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const users = [
      { id: 1, email: 'admin@pos.com', password: 'admin123', name: 'Admin User', role: 'admin', branch: 'Savory - ATS', branchCode: 'ATS', organization: 'Savory' },
      { id: 2, email: 'head@pos.com', password: 'head123', name: 'Branch Head', role: 'branch_head', branch: 'Butwal Branch', branchCode: 'BWL', organization: 'Savory' },
      { id: 3, email: 'head2@pos.com', password: 'head123', name: 'Ramesh Thapa', role: 'branch_head', branch: 'Bhairahawa Branch', branchCode: 'BHR', organization: 'Savory' },
      { id: 4, email: 'cashier@pos.com', password: 'cashier123', name: 'Ram Kumar', role: 'cashier', branch: 'Savory - ATS', branchCode: 'ATS', organization: 'Savory' },
      { id: 5, email: 'cashier1@pos.com', password: 'cashier123', name: 'Maya Devi', role: 'cashier', branch: 'Butwal Branch', branchCode: 'BWL', organization: 'Savory' },
      { id: 6, email: 'cashier2@pos.com', password: 'cashier123', name: 'Sunita Rai', role: 'cashier', branch: 'Bhairahawa Branch', branchCode: 'BHR', organization: 'Savory' },
      { id: 7, email: 'worker@pos.com', password: 'worker123', name: 'Gopal KC', role: 'worker', branch: 'Butwal Branch', branchCode: 'BWL', organization: 'Savory' },
      { id: 8, email: 'worker2@pos.com', password: 'worker123', name: 'Krishna Gurung', role: 'worker', branch: 'Bhairahawa Branch', branchCode: 'BHR', organization: 'Savory' },
    ]

    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      return { success: true, user: userWithoutPassword }
    }
    
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
