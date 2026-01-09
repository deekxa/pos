"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Package } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    cost: "",
    preparationTime: "",
    available: true,
  });
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedInventory = localStorage.getItem("inventory");
      if (storedInventory) {
        try {
          setInventory(JSON.parse(storedInventory));
        } catch {}
      }

      // Load product categories
      const storedCategories = localStorage.getItem("categories");
      if (storedCategories) {
        try {
          const allCategories = JSON.parse(storedCategories);
          setCategories(allCategories.products || []);
        } catch {}
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { itemId: "", itemName: "", quantity: "", unit: "" },
    ]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    
    if (field === "itemId") {
      const selectedItem = inventory.find((item) => item.id === parseInt(value));
      if (selectedItem) {
        updated[index] = {
          ...updated[index],
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          unit: selectedItem.unit,
        };
      }
    } else {
      updated[index][field] = value;
    }
    
    setIngredients(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const stored = localStorage.getItem("products");
    const products = stored ? JSON.parse(stored) : [];

    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const currentDate = new Date().toISOString().split("T")[0];

    const newProduct = {
      id: newId,
      ...formData,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      preparationTime: parseInt(formData.preparationTime),
      ingredients: ingredients.map((ing) => ({
        itemId: parseInt(ing.itemId),
        itemName: ing.itemName,
        quantity: parseFloat(ing.quantity),
        unit: ing.unit,
      })),
      image: null,
      lastUpdated: currentDate,
    };

    localStorage.setItem("products", JSON.stringify([...products, newProduct]));
    router.push("/products");
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "branch_head"]}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/products")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Add New Product
            </h1>
            <p className="text-gray-500 mt-1">Create a new menu item</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="e.g., Margherita Pizza"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  placeholder="Brief description of the product"
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
                    Preparation Time (minutes) *
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="15"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pricing
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Price (रु) *
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="180"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price (रु) *
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
                  placeholder="450"
                />
              </div>
            </div>

            {formData.price && formData.cost && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-700 font-medium">
                    Profit Margin:
                  </span>
                  <span className="text-green-900 font-semibold">
                    रु{(parseFloat(formData.price) - parseFloat(formData.cost)).toFixed(2)} (
                    {(
                      ((parseFloat(formData.price) - parseFloat(formData.cost)) /
                        parseFloat(formData.price)) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recipe Ingredients
              </h2>
              <button
                type="button"
                onClick={addIngredient}
                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus size={16} />
                Add Ingredient
              </button>
            </div>

            {ingredients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-sm">No ingredients added yet</p>
                <p className="text-xs mt-1">
                  Click "Add Ingredient" to start building your recipe
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-end gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          Inventory Item *
                        </label>
                        <select
                          value={ingredient.itemId}
                          onChange={(e) =>
                            handleIngredientChange(index, "itemId", e.target.value)
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                          <option value="">Select item</option>
                          {inventory.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.stock} {item.unit} available)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          Quantity *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={ingredient.quantity}
                            onChange={(e) =>
                              handleIngredientChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            required
                            min="0"
                            step="0.01"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            placeholder="0.5"
                          />
                          <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 min-w-[60px] flex items-center justify-center">
                            {ingredient.unit || "unit"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove ingredient"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Availability
            </h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Mark as available
                </span>
                <p className="text-xs text-gray-500">
                  This product will be visible and orderable
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
