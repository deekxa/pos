"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

const defaultInventory = [
  {
    id: 1,
    name: "Product A",
    sku: "SKU001",
    stock: 50,
    price: 100,
    category: "Electronics",
    reorderLevel: 20,
    lastUpdated: "2025-12-28",
  },
  {
    id: 2,
    name: "Product B",
    sku: "SKU002",
    stock: 15,
    price: 200,
    category: "Clothing",
    reorderLevel: 20,
    lastUpdated: "2025-12-27",
  },
  {
    id: 3,
    name: "Product C",
    sku: "SKU003",
    stock: 40,
    price: 150,
    category: "Food",
    reorderLevel: 20,
    lastUpdated: "2025-12-29",
  },
  {
    id: 4,
    name: "Product D",
    sku: "SKU004",
    stock: 8,
    price: 300,
    category: "Electronics",
    reorderLevel: 20,
    lastUpdated: "2025-12-30",
  },
];

export default function InventoryPage() {
  const router = useRouter();
  const [inventory, setInventory] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("inventory");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return defaultInventory;
  });

  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    stockLevel: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inventory", JSON.stringify(inventory));
    }
  }, [inventory]);

  const totalProducts = inventory.length;
  const lowStockItems = inventory.filter(
    (item) => item.stock < item.reorderLevel
  ).length;
  const totalValue = inventory.reduce(
    (sum, item) => sum + item.stock * item.price,
    0
  );
  const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);

  const filteredInventory = inventory.filter((item) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchLower) ||
      item.sku.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower);

    const matchesCategory =
      filters.category === "all" || item.category === filters.category;

    const matchesStockLevel =
      filters.stockLevel === "all" ||
      (filters.stockLevel === "low" && item.stock < item.reorderLevel) ||
      (filters.stockLevel === "medium" &&
        item.stock >= item.reorderLevel &&
        item.stock < item.reorderLevel * 2) ||
      (filters.stockLevel === "high" && item.stock >= item.reorderLevel * 2);

    return matchesSearch && matchesCategory && matchesStockLevel;
  });

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInventory = filteredInventory.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const categories = ["all", ...new Set(inventory.map((p) => p.category))];

  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedInventory.map((item) => item.id));
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedItems.length} selected items?`)) {
      setInventory(
        inventory.filter((item) => !selectedItems.includes(item.id))
      );
      setSelectedItems([]);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Name",
      "SKU",
      "Category",
      "Stock",
      "Price",
      "Reorder Level",
    ];
    const rows = filteredInventory.map((item) => [
      item.id,
      item.name,
      item.sku,
      item.category,
      item.stock,
      item.price,
      item.reorderLevel,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory-export.csv";
    link.click();
  };

  const getStockProgress = (stock, reorderLevel) => {
    const percentage = Math.min((stock / (reorderLevel * 3)) * 100, 100);
    let colorClass = "bg-green-500";
    if (stock < reorderLevel) colorClass = "bg-red-500";
    else if (stock < reorderLevel * 2) colorClass = "bg-amber-500";
    return { percentage, colorClass };
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "branch_head"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredInventory.length}{" "}
              {filteredInventory.length === 1 ? "product" : "products"}
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
              onClick={() => router.push("/inventory/add")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Products
              </span>
              <Package className="text-gray-400" size={16} />
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {totalProducts}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Low Stock
              </span>
              <AlertTriangle className="text-red-500" size={16} />
            </div>
            <div className="text-2xl font-semibold text-red-600">
              {lowStockItems}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Total Units
              </span>
              <TrendingUp className="text-gray-400" size={16} />
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {totalStock}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Total Value
              </span>
              <span className="text-gray-400 text-base">₹</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              ₹{totalValue.toLocaleString()}
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
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
                Delete ({selectedItems.length})
              </button>
            )}
          </div>

          {/* Filters Panel */}
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
                  Stock Level
                </label>
                <select
                  value={filters.stockLevel}
                  onChange={(e) =>
                    setFilters({ ...filters, stockLevel: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="all">All Levels</option>
                  <option value="low">Low Stock</option>
                  <option value="medium">Medium Stock</option>
                  <option value="high">High Stock</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === paginatedInventory.length &&
                        paginatedInventory.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedInventory.map((item) => {
                  const stockProgress = getStockProgress(
                    item.stock,
                    item.reorderLevel
                  );
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="text-gray-400" size={18} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Updated {item.lastUpdated}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.sku}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {item.stock} units
                          </div>
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${stockProgress.colorClass} transition-all`}
                              style={{ width: `${stockProgress.percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">
                        ₹{item.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              router.push(`/inventory/edit/${item.id}`)
                            }
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this product?")) {
                                setInventory(
                                  inventory.filter((i) => i.id !== item.id)
                                );
                              }
                            }}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredInventory.length)}{" "}
                of {filteredInventory.length}
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
    </ProtectedRoute>
  );
}
