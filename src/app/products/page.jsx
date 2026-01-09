"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Pizza,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const defaultProducts = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    category: "Pizza",
    price: 450,
    cost: 180,
    image: null,
    ingredients: [
      { itemId: 3, itemName: "Pizza Dough", quantity: 0.3, unit: "kg" },
      { itemId: 2, itemName: "Tomato Sauce", quantity: 0.1, unit: "liters" },
      { itemId: 1, itemName: "Mozzarella Cheese", quantity: 0.15, unit: "kg" },
      { itemId: 8, itemName: "Basil Leaves", quantity: 0.01, unit: "kg" },
      { itemId: 7, itemName: "Olive Oil", quantity: 0.02, unit: "liters" },
    ],
    available: true,
    preparationTime: 15,
    lastUpdated: "2026-01-08",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Classic pepperoni with mozzarella cheese",
    category: "Pizza",
    price: 650,
    cost: 280,
    image: null,
    ingredients: [
      { itemId: 3, itemName: "Pizza Dough", quantity: 0.3, unit: "kg" },
      { itemId: 2, itemName: "Tomato Sauce", quantity: 0.1, unit: "liters" },
      { itemId: 1, itemName: "Mozzarella Cheese", quantity: 0.15, unit: "kg" },
      { itemId: 4, itemName: "Pepperoni", quantity: 0.1, unit: "kg" },
    ],
    available: true,
    preparationTime: 15,
    lastUpdated: "2026-01-07",
  },
  {
    id: 3,
    name: "Veggie Supreme Pizza",
    description: "Loaded with fresh vegetables and cheese",
    category: "Pizza",
    price: 550,
    cost: 220,
    image: null,
    ingredients: [
      { itemId: 3, itemName: "Pizza Dough", quantity: 0.3, unit: "kg" },
      { itemId: 2, itemName: "Tomato Sauce", quantity: 0.1, unit: "liters" },
      { itemId: 1, itemName: "Mozzarella Cheese", quantity: 0.15, unit: "kg" },
      { itemId: 5, itemName: "Bell Peppers", quantity: 0.08, unit: "kg" },
      { itemId: 6, itemName: "Mushrooms", quantity: 0.08, unit: "kg" },
    ],
    available: true,
    preparationTime: 18,
    lastUpdated: "2026-01-06",
  },
  {
    id: 4,
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter",
    category: "Sides",
    price: 150,
    cost: 50,
    image: null,
    ingredients: [
      { itemId: 3, itemName: "Pizza Dough", quantity: 0.15, unit: "kg" },
      { itemId: 7, itemName: "Olive Oil", quantity: 0.03, unit: "liters" },
      { itemId: 8, itemName: "Basil Leaves", quantity: 0.005, unit: "kg" },
    ],
    available: true,
    preparationTime: 10,
    lastUpdated: "2026-01-05",
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("products");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return defaultProducts;
  });

  const [inventory, setInventory] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    availability: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const itemsPerPage = 8;

  // Load inventory data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedInventory = localStorage.getItem("inventory");
      if (storedInventory) {
        try {
          setInventory(JSON.parse(storedInventory));
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  // Check if product can be made based on inventory
  const checkInventoryAvailability = (product) => {
    if (!product.ingredients || product.ingredients.length === 0) {
      return { canMake: true, missingIngredients: [] };
    }

    const missingIngredients = [];

    for (const ingredient of product.ingredients) {
      const inventoryItem = inventory.find(
        (item) => item.id === ingredient.itemId
      );

      if (!inventoryItem) {
        missingIngredients.push({
          name: ingredient.itemName,
          reason: "Not in inventory",
        });
      } else if (inventoryItem.stock < ingredient.quantity) {
        missingIngredients.push({
          name: ingredient.itemName,
          reason: `Low stock (${inventoryItem.stock} ${inventoryItem.unit} available, need ${ingredient.quantity} ${ingredient.unit})`,
        });
      }
    }

    return {
      canMake: missingIngredients.length === 0,
      missingIngredients,
    };
  };

  // Get products with inventory status
  const productsWithInventoryStatus = products.map((product) => {
    const inventoryCheck = checkInventoryAvailability(product);
    return {
      ...product,
      inventoryAvailable: inventoryCheck.canMake,
      missingIngredients: inventoryCheck.missingIngredients,
    };
  });

  const totalProducts = products.length;
  const availableProducts = productsWithInventoryStatus.filter(
    (p) => p.available && p.inventoryAvailable
  ).length;
  const avgProfit =
    products.reduce((sum, p) => sum + (p.price - p.cost), 0) / products.length;

  const filteredProducts = productsWithInventoryStatus.filter((product) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower);

    const matchesCategory =
      filters.category === "all" || product.category === filters.category;

    const matchesAvailability =
      filters.availability === "all" ||
      (filters.availability === "available" &&
        product.available &&
        product.inventoryAvailable) ||
      (filters.availability === "unavailable" &&
        (!product.available || !product.inventoryAvailable));

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const toggleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((product) => product.id));
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    setProducts(
      products.filter((product) => !selectedProducts.includes(product.id))
    );
    setSelectedProducts([]);
    setBulkDeleteModal(false);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Category",
      "Price",
      "Cost",
      "Profit Margin",
      "Available",
      "Inventory Status",
      "Prep Time",
    ];
    const rows = filteredProducts.map((product) => [
      product.id,
      product.name,
      product.category,
      product.price,
      product.cost,
      product.price - product.cost,
      product.available ? "Yes" : "No",
      product.inventoryAvailable ? "In Stock" : "Out of Stock",
      `${product.preparationTime} min`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products-export.csv";
    link.click();
  };

  const getProfitMargin = (price, cost) => {
    return (((price - cost) / price) * 100).toFixed(1);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "branch_head"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Menu items and finished goods
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
              onClick={() => router.push("/products/add")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Total Products
              </span>
              <ShoppingBag className="text-gray-400" size={16} />
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {totalProducts}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Available
              </span>
              <TrendingUp className="text-green-500" size={16} />
            </div>
            <div className="text-2xl font-semibold text-green-600">
              {availableProducts}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              With ingredients in stock
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Avg Profit
              </span>
              <span className="text-gray-400 text-base">रु</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              रु{avgProfit.toFixed(0)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                showFilters
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Filter size={16} />
              Filters
            </button>
            {selectedProducts.length > 0 && (
              <button
                onClick={() => setBulkDeleteModal(true)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
                Delete ({selectedProducts.length})
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Availability
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) =>
                    setFilters({ ...filters, availability: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedProducts.length === paginatedProducts.length &&
                        paginatedProducts.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Profit Margin
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedProducts.map((product) => {
                  const isFullyAvailable =
                    product.available && product.inventoryAvailable;
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleSelectProduct(product.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center relative">
                            <Pizza className="text-gray-400" size={18} />
                            {!product.inventoryAvailable && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">
                        रु{product.price}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-green-600">
                          {getProfitMargin(product.price, product.cost)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          +रु{product.price - product.cost}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex px-2 py-1 rounded text-xs font-medium w-fit ${
                              isFullyAvailable
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {isFullyAvailable ? "Available" : "Unavailable"}
                          </span>
                          {!product.inventoryAvailable &&
                            product.missingIngredients.length > 0 && (
                              <span className="text-xs text-amber-600 flex items-center gap-1">
                                <AlertTriangle size={12} />
                                {product.missingIngredients.length} missing
                              </span>
                            )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              router.push(`/products/view/${product.id}`)
                            }
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() =>
                              router.push(`/products/edit/${product.id}`)
                            }
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(product)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredProducts.length)}{" "}
                of {filteredProducts.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
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

      {deleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl animate-in zoom-in duration-200">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-gray-50">
              <Trash2 className="text-gray-700" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              Delete Product?
            </h3>
            <p className="text-center text-gray-600 text-sm leading-relaxed mb-1">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {productToDelete.name}
              </span>
              ?
            </p>
            <p className="text-center text-gray-600 text-sm leading-relaxed mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-sm hover:shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {bulkDeleteModal && selectedProducts.length > 0 && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl animate-in zoom-in duration-200">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-red-50">
              <Trash2 className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              Delete {selectedProducts.length}{" "}
              {selectedProducts.length === 1 ? "Product" : "Products"}?
            </h3>
            <p className="text-center text-gray-600 text-sm leading-relaxed mb-6">
              Are you sure you want to delete {selectedProducts.length} selected{" "}
              {selectedProducts.length === 1 ? "product" : "products"}? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setBulkDeleteModal(false)}
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-sm hover:shadow"
              >
                Delete{" "}
                {selectedProducts.length > 1 && `(${selectedProducts.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
