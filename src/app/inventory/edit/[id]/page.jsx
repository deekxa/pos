"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditInventoryPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = parseInt(params.id);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    stock: "",
    price: "",
    reorderLevel: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load inventory categories
      const storedCategories = localStorage.getItem("categories");
      if (storedCategories) {
        try {
          const allCategories = JSON.parse(storedCategories);
          setCategories(allCategories.inventory || []);
        } catch {}
      }

      const stored = localStorage.getItem("inventory");
      if (stored) {
        try {
          const inventory = JSON.parse(stored);
          const item = inventory.find((i) => i.id === itemId);
          if (item) {
            setFormData({
              name: item.name,
              category: item.category,
              unit: item.unit,
              stock: item.stock,
              price: item.price,
              reorderLevel: item.reorderLevel,
            });
          } else {
            router.push("/inventory");
          }
        } catch {
          router.push("/inventory");
        }
      }
      setLoading(false);
    }
  }, [itemId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const stored = localStorage.getItem("inventory");
    const inventory = stored ? JSON.parse(stored) : [];

    const currentDate = new Date().toISOString().split("T")[0];

    const updatedInventory = inventory.map((item) =>
      item.id === itemId
        ? {
            ...item,
            ...formData,
            stock: parseFloat(formData.stock),
            price: parseFloat(formData.price),
            reorderLevel: parseInt(formData.reorderLevel),
            lastUpdated: currentDate,
          }
        : item
    );

    localStorage.setItem("inventory", JSON.stringify(updatedInventory));
    router.push("/inventory");
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
            onClick={() => router.push("/inventory")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Item</h1>
            <p className="text-gray-500 mt-1">
              Update inventory item details
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="e.g., Mozzarella Cheese, Tomato Sauce"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select unit</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="liters">Liters</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="box">Box</option>
                  <option value="pack">Pack</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reorder Level *
                </label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alert when stock falls below this level
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price (रु) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="800"
              />
              <p className="text-xs text-gray-500 mt-1">
                Price per {formData.unit || "unit"}
              </p>
            </div>

            {formData.stock && formData.price && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700 font-medium">
                    Total Inventory Value:
                  </span>
                  <span className="text-blue-900 font-semibold text-lg">
                    रु
                    {(
                      parseFloat(formData.stock) * parseFloat(formData.price)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/inventory")}
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
              >
                Update Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
