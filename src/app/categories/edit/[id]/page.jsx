"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Tag, Loader2, AlertTriangle } from "lucide-react";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryType = params.type; // 'inventory' or 'products'
  const categoryId = parseInt(params.id);

  const [loading, setLoading] = useState(true);
  const [itemCount, setItemCount] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("categories");
      if (stored) {
        try {
          const categories = JSON.parse(stored);
          const category = categories[categoryType]?.find(
            (c) => c.id === categoryId
          );

          if (category) {
            setFormData({
              name: category.name,
              description: category.description || "",
            });

            // Count items using this category
            const itemsKey = categoryType === "inventory" ? "inventory" : "products";
            const items = JSON.parse(localStorage.getItem(itemsKey) || "[]");
            const count = items.filter((item) => item.category === category.name).length;
            setItemCount(count);
          } else {
            router.push("/categories");
          }
        } catch {
          router.push("/categories");
        }
      }
      setLoading(false);
    }
  }, [categoryId, categoryType, router]);

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
    const categories = stored ? JSON.parse(stored) : { inventory: [], products: [] };

    const oldCategoryName = categories[categoryType].find(
      (c) => c.id === categoryId
    )?.name;

    // Update category
    categories[categoryType] = categories[categoryType].map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            name: formData.name.trim(),
            description: formData.description.trim(),
          }
        : cat
    );

    localStorage.setItem("categories", JSON.stringify(categories));

    // Update all items using this category
    if (oldCategoryName !== formData.name.trim()) {
      const itemsKey = categoryType === "inventory" ? "inventory" : "products";
      const items = JSON.parse(localStorage.getItem(itemsKey) || "[]");

      const updatedItems = items.map((item) =>
        item.category === oldCategoryName
          ? { ...item, category: formData.name.trim() }
          : item
      );

      localStorage.setItem(itemsKey, JSON.stringify(updatedItems));
    }

    router.push("/categories");
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin", "branch_head"]}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </ProtectedRoute>
    );
  }

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
              Edit Category
            </h1>
            <p className="text-gray-500 mt-1">
              Update {categoryType === "inventory" ? "inventory" : "product"}{" "}
              category details
            </p>
          </div>
        </div>

        {itemCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="text-amber-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <h3 className="text-sm font-semibold text-amber-900 mb-1">
                  Category In Use
                </h3>
                <p className="text-sm text-amber-700">
                  This category is currently used by{" "}
                  <span className="font-semibold">{itemCount}</span>{" "}
                  {itemCount === 1 ? "item" : "items"}. Updating the category
                  name will automatically update all associated items.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500">Category Type</p>
              <p className="text-sm font-medium text-gray-900 capitalize mt-0.5">
                {categoryType === "inventory" ? "Inventory" : "Products"}
              </p>
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

            {itemCount > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Tag className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Update Impact
                    </h4>
                    <p className="text-sm text-blue-700">
                      {itemCount} {itemCount === 1 ? "item" : "items"} will be
                      automatically updated with the new category name.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                Update Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
