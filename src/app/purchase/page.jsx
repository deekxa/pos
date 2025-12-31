"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  TrendingUp,
  Clock,
  Truck,
} from "lucide-react";

const defaultPurchases = [
  {
    id: 1,
    date: "2025-12-20",
    supplier: "Supplier A",
    items: "Electronics",
    amount: 25000,
    status: "Delivered",
    reference: "PO-001",
  },
  {
    id: 2,
    date: "2025-12-22",
    supplier: "Supplier B",
    items: "Clothing",
    amount: 18000,
    status: "Pending",
    reference: "PO-002",
  },
  {
    id: 3,
    date: "2025-12-24",
    supplier: "Supplier C",
    items: "Food Items",
    amount: 12000,
    status: "In Transit",
    reference: "PO-003",
  },
];

export default function PurchasePage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("purchases");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return defaultPurchases;
  });

  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("purchases", JSON.stringify(purchases));
    }
  }, [purchases]);

  const totalPurchases = purchases.length;
  const totalAmount = purchases.reduce((sum, p) => sum + p.amount, 0);
  const pendingOrders = purchases.filter((p) => p.status === "Pending").length;

  const filteredPurchases = purchases.filter((p) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      p.supplier.toLowerCase().includes(searchLower) ||
      p.items.toLowerCase().includes(searchLower) ||
      p.reference.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedPurchases = [...filteredPurchases].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const totalPages = Math.ceil(sortedPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPurchases = sortedPurchases.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedPurchases.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedPurchases.map((item) => item.id));
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedItems.length} selected purchase orders?`)) {
      setPurchases(
        purchases.filter((item) => !selectedItems.includes(item.id))
      );
      setSelectedItems([]);
    }
  };

  const openDeleteModal = (purchase) => {
    setPurchaseToDelete(purchase);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    if (purchaseToDelete) {
      setPurchases(purchases.filter((p) => p.id !== purchaseToDelete.id));
      setDeleteModal(false);
      setPurchaseToDelete(null);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Date",
      "Reference",
      "Supplier",
      "Items",
      "Amount",
      "Status",
    ];
    const rows = sortedPurchases.map((p) => [
      p.id,
      p.date,
      p.reference,
      p.supplier,
      p.items,
      p.amount,
      p.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `purchase-orders-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "branch_head"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Purchase Management
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {sortedPurchases.length}{" "}
              {sortedPurchases.length === 1 ? "order" : "orders"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => router.push("/purchase/add")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow"
            >
              <Plus size={16} />
              New Purchase Order
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Total Orders
              </span>
              <Package className="text-gray-400" size={16} />
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {totalPurchases}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Total Amount
              </span>
              <span className="text-gray-400 text-base">रु</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              रु{totalAmount.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Pending Orders
              </span>
              <Clock className="text-gray-400" size={16} />
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {pendingOrders}
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
                placeholder="Search by supplier, items, or reference..."
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

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
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
                        selectedItems.length === paginatedPurchases.length &&
                        paginatedPurchases.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Purchase Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Reference
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Supplier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Amount
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
                {paginatedPurchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(purchase.id)}
                        onChange={() => toggleSelectItem(purchase.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Truck className="text-gray-400" size={18} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            Order #{purchase.id}
                          </div>
                          <div className="text-xs text-gray-500">
                            {purchase.date}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                      {purchase.reference}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {purchase.supplier}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {purchase.items}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 text-sm">
                      रु{purchase.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          purchase.status === "Delivered"
                            ? "bg-gray-900 text-white"
                            : purchase.status === "Pending"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() =>
                            router.push(`/purchase/view/${purchase.id}`)
                          }
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/purchase/edit/${purchase.id}`)
                          }
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(purchase)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, sortedPurchases.length)} of{" "}
                {sortedPurchases.length}
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

   
      {deleteModal && purchaseToDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl animate-in zoom-in duration-200">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-gray-50">
              <Trash2 className="text-gray-700" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              Delete Purchase Order?
            </h3>
            <p className="text-center text-gray-600 text-sm leading-relaxed mb-1">
              Are you sure you want to delete purchase order{" "}
              <span className="font-semibold text-gray-900">
                {purchaseToDelete.reference}
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
                  setPurchaseToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all shadow-sm hover:shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
