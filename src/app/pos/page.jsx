'use client'

import { useState, useEffect } from 'react'
import { Minus, Plus, Trash2, Package, ShoppingCart, Grid3x3, List, Search, X, ChevronRight, Edit } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'

export default function POSPage() {
  const router = useRouter()
  
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [deleteModal, setDeleteModal] = useState({ show: false, itemId: null, type: null })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('inventory')
      if (stored) {
        try {
          setProducts(JSON.parse(stored))
        } catch (error) {
          console.error('Failed to load inventory:', error)
          setProducts(getDefaultProducts())
        }
      } else {
        setProducts(getDefaultProducts())
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && products.length > 0) {
      localStorage.setItem('inventory', JSON.stringify(products))
    }
  }, [products])

  const getDefaultProducts = () => [
    { id: 1, name: 'Modern Sofa', price: 45000, stock: 12, category: 'Furniture', sku: 'FUR-001' },
    { id: 2, name: 'Office Chair', price: 8500, stock: 25, category: 'Furniture', sku: 'FUR-002' },
    { id: 3, name: 'Dining Table', price: 32000, stock: 8, category: 'Furniture', sku: 'FUR-003' },
    { id: 4, name: 'LED TV 55"', price: 52000, stock: 15, category: 'Electronics', sku: 'ELC-001' },
    { id: 5, name: 'Coffee Maker', price: 4500, stock: 30, category: 'Electronics', sku: 'ELC-002' },
    { id: 6, name: 'Bookshelf', price: 12000, stock: 18, category: 'Furniture', sku: 'FUR-004' },
  ]

  const categories = ['All', ...new Set(products.map(p => p.category))]

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert('Product is out of stock')
      return
    }

    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert('Not enough stock available')
        return
      }
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id, qty) => {
    const product = products.find(p => p.id === id)
    
    if (qty <= 0) {
      setCart(cart.filter(item => item.id !== id))
    } else if (qty > product.stock) {
      alert('Not enough stock available')
    } else {
      setCart(cart.map(item => item.id === id ? { ...item, quantity: qty } : item))
    }
  }

  const removeCartItem = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const openDeleteModal = (id, type) => {
    setDeleteModal({ show: true, itemId: id, type })
  }

  const confirmDelete = () => {
    if (deleteModal.type === 'product') {
      setProducts(products.filter(product => product.id !== deleteModal.itemId))
    }
    setDeleteModal({ show: false, itemId: null, type: null })
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const filteredProducts = products.filter(p => {
    const searchLower = search.toLowerCase()
    const matchesSearch = p.name.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower) ||
      (p.sku && p.sku.toLowerCase().includes(searchLower))
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCompletePayment = () => {
    if (cart.length === 0) {
      alert('Cart is empty')
      return
    }

    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id)
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity }
      }
      return product
    })

    setProducts(updatedProducts)
    localStorage.setItem('inventory', JSON.stringify(updatedProducts))
    setCart([])
    
    alert('Payment completed successfully!')
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'text-gray-500', bg: 'bg-gray-50', label: 'Out of stock' }
    if (stock <= 10) return { color: 'text-red-600', bg: 'bg-red-50', label: `${stock} left` }
    if (stock <= 20) return { color: 'text-amber-600', bg: 'bg-amber-50', label: `${stock} in stock` }
    return { color: 'text-green-600', bg: 'bg-green-50', label: `${stock} in stock` }
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'branch_head', 'cashier', 'worker']}>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Point of Sale</h1>
            <p className="text-sm text-gray-500 mt-0.5">Process transactions and manage cart</p>
          </div>
          <button 
            onClick={() => router.push('/pos/add')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          
          {/* Products Section */}
          <div className="space-y-4">
            
            {/* Search and Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products by name or SKU..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg border transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg border transition-colors ${
                      viewMode === 'table'
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Display */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-[600px]">
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Package className="text-gray-300 mb-3" size={48} />
                  <p className="text-gray-500 font-medium">No products found</p>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredProducts.map(product => {
                    const stockStatus = getStockStatus(product.stock)
                    return (
                      <div
                        key={product.id}
                        onClick={() => product.stock > 0 && addToCart(product)}
                        className={`group bg-white rounded-lg border border-gray-200 p-3 transition-all ${
                          product.stock > 0 
                            ? 'cursor-pointer hover:border-gray-900' 
                            : 'opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-3">
                          <Package className="text-gray-300" size={40} />
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-medium text-gray-900 text-sm truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500">{product.category}</p>
                          
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-base font-semibold text-gray-900">
                              ₹{product.price.toLocaleString()}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${stockStatus.bg} ${stockStatus.color} font-medium`}>
                              {stockStatus.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Product</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Price</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Stock</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map(product => {
                        const stockStatus = getStockStatus(product.stock)
                        return (
                          <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Package className="text-gray-400" size={20} />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                                  {product.sku && <div className="text-xs text-gray-500">{product.sku}</div>}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                            <td className="py-3 px-4 text-right font-semibold text-gray-900 text-sm">
                              ₹{product.price.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                                {stockStatus.label}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => addToCart(product)}
                                  disabled={product.stock === 0}
                                  className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                  Add
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/pos/edit/${product.id}`)
                                  }}
                                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Edit product"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openDeleteModal(product.id, 'product')
                                  }}
                                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Delete product"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              
              <div className="border-b border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={20} className="text-gray-700" />
                    <h2 className="text-lg font-semibold text-gray-900">Cart</h2>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">
                    {cart.length} {cart.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>

              <div className="p-5">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="text-gray-300 mx-auto mb-3" size={48} />
                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-1">Add products to get started</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex gap-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="text-gray-400" size={20} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                              <p className="text-gray-600 text-sm">₹{item.price.toLocaleString()}</p>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold text-gray-900 text-sm">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-gray-50 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-gray-50 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeCartItem(item.id)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Tax (10%)</span>
                        <span className="font-medium">₹{tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-base font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-gray-900">
                          ₹{total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <button 
                        onClick={handleCompletePayment}
                        className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                      >
                        Complete Payment
                      </button>
                      <button
                        onClick={() => setCart([])}
                        className="w-full px-4 py-2.5 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-gray-50">
              <Trash2 className="text-gray-700" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              Delete Product?
            </h3>
            <p className="text-center text-gray-600 text-sm mb-6">
              This action cannot be undone. The product will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, itemId: null, type: null })}
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
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
