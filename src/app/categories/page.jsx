"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Package,
  ShoppingBag,
  BookOpen,
} from "lucide-react";

const defaultCategories = {
  inventory: [
    { id: 1, name: "Dairy", itemCount: 0 },
    { id: 2, name: "Meat", itemCount: 0 },
    { id: 3, name: "Vegetables", itemCount: 0 },
    { id: 4, name: "Fruits", itemCount: 0 },
    { id: 5, name: "Dry Goods", itemCount: 0 },
    { id: 6, name: "Sauces", itemCount: 0 },
    { id: 7, name: "Oils & Condiments", itemCount: 0 },
    { id: 8, name: "Herbs & Spices", itemCount: 0 },
    { id: 9, name: "Beverages", itemCount: 0 },
    { id: 10, name: "Packaging", itemCount: 0 },
  ],
  products: [
    { id: 1, name: "Pizza", itemCount: 0 },
    { id: 2, name: "Pasta", itemCount: 0 },
    { id: 3, name: "Burger", itemCount: 0 },
    { id: 4, name: "Sides", itemCount: 0 },
    { id: 5, name: "Beverages", itemCount: 0 },
    { id: 6, name: "Desserts", itemCount: 0 },
  ],
  ledger: [
    { id: 1, name: "Revenue", itemCount: 0 },
    { id: 2, name: "Inventory", itemCount: 0 },
    { id: 3, name: "Operating", itemCount: 0 },
    { id: 4, name: "Payroll", itemCount: 0 },
    { id: 5, name: "Utilities", itemCount: 0 },
    { id: 6, name: "Other", itemCount: 0 },
  ],
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("categories");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return defaultCategories;
  });

  const [activeTab, setActiveTab] = useState("inventory");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("categories", JSON.stringify(categories));
    }
  }, [categories]);

  // Count items in each category
  useEffect(() => {
    if (typeof window !== "undefined") {
      const inventory = JSON.parse(localStorage.getItem("inventory") || "[]");
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const ledger = JSON.parse(localStorage.getItem("ledger") || "[]");

      const inventoryCounts = {};
      inventory.forEach((item) => {
        inventoryCounts[item.category] = (inventoryCounts[item.category] || 0) + 1;
      });

      const productCounts = {};
      products.forEach((item) => {
        productCounts[item.category] = (productCounts[item.category] || 0) + 1;
      });

      const ledgerCounts = {};
      ledger.forEach((item) => {
        ledgerCounts[item.category] = (ledgerCounts[item.category] || 0) + 1;
      });

      setCategories((prev) => ({
        inventory: prev.inventory?.map((cat) => ({
          ...cat,
          itemCount: inventoryCounts[cat.name] || 0,
        })) || [],
        products: prev.products?.map((cat) => ({
          ...cat,
          itemCount: productCounts[cat.name] || 0,
        })) || [],
        ledger: prev.ledger?.map((cat) => ({
          ...cat,
          itemCount: ledgerCounts[cat.name] || 0,
        })) || [],
      }));
    }
  }, []);

  const handleAddCategory = () => {
    if (!categoryName.trim()) return;

    const newId =
      categories[activeTab].length > 0
        ? Math.max(...categories[activeTab].map((c) => c.id)) + 1
        : 1;

    setCategories((prev) => ({
      ...prev,
      [activeTab]: [
        ...prev[activeTab],
        { id: newId, name: categoryName.trim(), itemCount: 0 },
      ],
    }));

    setCategoryName("");
    setAddModal(false);
  };

  const handleEditCategory = () => {
    if (!categoryName.trim() || !selectedCategory) return;

    setCategories((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((cat) =>
        cat.id === selectedCategory.id
          ? { ...cat, name: categoryName.trim() }
          : cat
      ),
    }));

    setCategoryName("");
    setSelectedCategory(null);
    setEditModal(false);
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;

    setCategories((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((cat) => cat.id !== selectedCategory.id),
    }));

    setSelectedCategory(null);
    setDeleteModal(false);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setEditModal(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setDeleteModal(true);
  };

  const currentCategories = categories[activeTab];

  return (
    <ProtectedRoute allowedRoles={["admin", "branch_head"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage inventory and product categories
            </p>
          </div>
          <button
            onClick={() => setAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 inline-flex gap-1">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "inventory"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Package size={16} />
            Inventory
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "products"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ShoppingBag size={16} />
            Products
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "ledger"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BookOpen size={16} />
            Ledger
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Tag className="text-gray-600" size={18} />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(category)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500">
                {category.itemCount} {category.itemCount === 1 ? "item" : "items"}
              </p>
            </div>
          ))}
        </div>

        {currentCategories.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Tag className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Categories Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by adding your first category
            </p>
            <button
              onClick={() => setAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} />
              Add Category
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl animate-in zoom-in duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add {activeTab === "inventory" ? "Inventory" : "Product"} Category
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Frozen Items"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddCategory();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAddModal(false);
                  setCategoryName("");
                }}
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!categoryName.trim()}
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

    
      {editModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl animate-in zoom-in duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Category
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Frozen Items"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleEditCategory();
                  }
                }}
                autoFocus
              />
            </div>
            {selectedCategory.itemCount > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700">
                  This category is used by {selectedCategory.itemCount}{" "}
                  {selectedCategory.itemCount === 1 ? "item" : "items"}.
                  Renaming will update all associated items.
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditModal(false);
                  setCategoryName("");
                  setSelectedCategory(null);
                }}
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCategory}
                disabled={!categoryName.trim()}
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl animate-in zoom-in duration-200">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-red-50">
              <Trash2 className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              Delete Category?
            </h3>
            <p className="text-center text-gray-600 text-sm leading-relaxed mb-1">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {selectedCategory.name}
              </span>
              ?
            </p>
            {selectedCategory.itemCount > 0 && (
              <p className="text-center text-red-600 text-sm leading-relaxed mb-4 font-medium">
                Warning: {selectedCategory.itemCount}{" "}
                {selectedCategory.itemCount === 1 ? "item is" : "items are"} using
                this category!
              </p>
            )}
            <p className="text-center text-gray-600 text-sm leading-relaxed mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setSelectedCategory(null);
                }}
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-sm hover:shadow"
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
