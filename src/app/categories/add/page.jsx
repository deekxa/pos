"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Tag, Package, ShoppingBag } from "lucide-react";

export default function AddCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    type: "inventory",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const stored = localStorage.getItem("categories");
    const categories = stored
      ? JSON.parse(stored)
      : { inventory: [], products: [] };

    const currentCategories = categories[formData.type];
    const newId =
      currentCategories.length > 0
        ? Math.max(...currentCategories.map((c) => c.id)) + 1
        : 1;

    const newCategory = {
      id: newId,
      name: formData.name.trim(),
      description: formData.description.trim(),
      itemCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    categories[formData.type] = [...currentCategories, newCategory];
    localStorage.setItem("categories", JSON.stringify(categories));

    router.push("/categories");
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "branch_head"]}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/categories")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Add Category
            </h1>
            <p className="text-gray-500 mt-1">
              Create a new category for inventory or products
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "inventory" })}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    formData.type === "inventory"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      formData.type === "inventory"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Package size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">
                      Inventory
                    </p>
                    <p className="text-xs text-gray-500">
                      Raw ingredients
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "products" })}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    formData.type === "products"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      formData.type === "products"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <ShoppingBag size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">
                      Products
                    </p>
                    <p className="text-xs text-gray-500">
                      Menu items
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="e.g., Frozen Items, Appetizers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                placeholder="Brief description of this category"
              />
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Tag className="text-gray-600" size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    Category Preview
                  </h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">
                      {formData.name || "Category Name"}
                    </span>
                    {" will be added to "}
                    <span className="font-medium">
                      {formData.type === "inventory" ? "Inventory" : "Products"}
                    </span>
                    {" categories"}
                  </p>
                  {formData.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/categories")}
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
