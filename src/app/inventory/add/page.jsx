"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AddInventoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    stock: "",
    price: "",
    reorderLevel: 20,
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

    const stored = localStorage.getItem("inventory");
    const inventory = stored ? JSON.parse(stored) : [];

    const currentDate = new Date().toISOString().split("T")[0];

    const itemData = {
      ...formData,
      id: Math.max(...inventory.map((i) => i.id), 0) + 1,
      stock: parseFloat(formData.stock),
      price: parseFloat(formData.price),
      reorderLevel: parseInt(formData.reorderLevel),
      lastUpdated: currentDate,
    };

    inventory.push(itemData);
    localStorage.setItem("inventory", JSON.stringify(inventory));

    router.push("/inventory");
  };

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
            <h1 className="text-2xl font-semibold text-gray-900">
              Add New Item
            </h1>
            <p className="text-gray-500 mt-1">
              Add a new inventory item to your stock
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
                  <option value="Dairy">Dairy</option>
                  <option value="Meat">Meat</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Sauces">Sauces</option>
                  <option value="Dry Goods">Dry Goods</option>
                  <option value="Oils & Condiments">Oils & Condiments</option>
                  <option value="Herbs & Spices">Herbs & Spices</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit of Measure *
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
                  <option value="pieces">Pieces</option>
                  <option value="bottles">Bottles</option>
                  <option value="cans">Cans</option>
                  <option value="packets">Packets</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Stock Quantity *
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
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current quantity in stock
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Unit (रु) *
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
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cost per unit of measure
                </p>
              </div>
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

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Stock Value Preview
              </h3>
              <div className="text-sm text-gray-600">
                {formData.stock && formData.price ? (
                  <>
                    <p>
                      Total Value:{" "}
                      <span className="font-semibold text-gray-900">
                        रु
                        {(
                          parseFloat(formData.stock) * parseFloat(formData.price)
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.stock} {formData.unit || "units"} × रु
                      {formData.price}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-400">
                    Enter stock quantity and price to see total value
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/inventory")}
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
