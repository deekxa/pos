"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  AlertTriangle,
  Edit,
  Clock,
  DollarSign,
  Tag,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load product
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        try {
          const products = JSON.parse(storedProducts);
          const foundProduct = products.find((p) => p.id === productId);
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            router.push("/products");
          }
        } catch {
          router.push("/products");
        }
      }

      // Load inventory
      const storedInventory = localStorage.getItem("inventory");
      if (storedInventory) {
        try {
          setInventory(JSON.parse(storedInventory));
        } catch {}
      }

      setLoading(false);
    }
  }, [productId, router]);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin", "branch_head"]}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </ProtectedRoute>
    );
  }

  if (!product) {
    return null;
  }

  // Check inventory availability
  const checkInventoryAvailability = () => {
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
          ...ingredient,
          reason: "Not in inventory",
          available: 0,
        });
      } else if (inventoryItem.stock < ingredient.quantity) {
        missingIngredients.push({
          ...ingredient,
          reason: "Low stock",
          available: inventoryItem.stock,
          unit: inventoryItem.unit,
        });
      }
    }

    return {
      canMake: missingIngredients.length === 0,
      missingIngredients,
    };
  };

  const inventoryCheck = checkInventoryAvailability();
  const isFullyAvailable = product.available && inventoryCheck.canMake;
  const getProfitMargin = (price, cost) => {
    return (((price - cost) / price) * 100).toFixed(1);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "branch_head"]}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/products")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {product.name}
              </h1>
              <p className="text-gray-500 mt-1">{product.description}</p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/products/edit/${product.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Edit size={16} />
            Edit Product
          </button>
        </div>

        {/* Inventory Warning */}
        {!inventoryCheck.canMake && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="text-amber-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900 mb-1">
                  Insufficient Inventory
                </h3>
                <p className="text-sm text-amber-700 mb-2">
                  This product cannot be made due to missing or low stock
                  ingredients:
                </p>
                <ul className="space-y-1">
                  {inventoryCheck.missingIngredients.map((ing, idx) => (
                    <li key={idx} className="text-sm text-amber-700">
                      • <span className="font-medium">{ing.itemName}</span>:{" "}
                      {ing.reason}
                      {ing.available > 0 &&
                        ` (${ing.available} ${ing.unit} available, need ${ing.quantity} ${ing.unit})`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Product Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Product Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Tag className="text-gray-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {product.category}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Clock className="text-gray-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Preparation Time</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {product.preparationTime} minutes
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  {isFullyAvailable ? (
                    <CheckCircle className="text-green-600" size={18} />
                  ) : (
                    <XCircle className="text-red-600" size={18} />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p
                    className={`text-sm font-semibold ${
                      isFullyAvailable ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isFullyAvailable ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Profit */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pricing & Profit Analysis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-xs text-blue-600 font-medium mb-1">
                Selling Price
              </p>
              <p className="text-2xl font-bold text-blue-900">
                रु{product.price}
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-xs text-red-600 font-medium mb-1">Cost</p>
              <p className="text-2xl font-bold text-red-900">
                रु{product.cost}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-xs text-green-600 font-medium mb-1">Profit</p>
              <p className="text-2xl font-bold text-green-900">
                रु{product.price - product.cost}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-xs text-purple-600 font-medium mb-1">
                Profit Margin
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {getProfitMargin(product.price, product.cost)}%
              </p>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recipe Ingredients
          </h2>
          {product.ingredients && product.ingredients.length > 0 ? (
            <div className="space-y-3">
              {product.ingredients.map((ing, idx) => {
                const inventoryItem = inventory.find(
                  (item) => item.id === ing.itemId
                );
                const hasEnough =
                  inventoryItem && inventoryItem.stock >= ing.quantity;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      hasEnough
                        ? "bg-gray-50 border-gray-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          hasEnough ? "bg-white" : "bg-red-100"
                        }`}
                      >
                        <Package
                          className={
                            hasEnough ? "text-gray-400" : "text-red-500"
                          }
                          size={20}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {ing.itemName}
                        </p>
                        {inventoryItem ? (
                          <p
                            className={`text-xs ${
                              hasEnough ? "text-gray-500" : "text-red-600"
                            }`}
                          >
                            {hasEnough
                              ? `${inventoryItem.stock} ${inventoryItem.unit} in stock`
                              : `Only ${inventoryItem.stock} ${inventoryItem.unit} available`}
                          </p>
                        ) : (
                          <p className="text-xs text-red-600">
                            Not in inventory
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          hasEnough ? "text-gray-900" : "text-red-600"
                        }`}
                      >
                        {ing.quantity} {ing.unit}
                      </p>
                      <p className="text-xs text-gray-500">Required</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-sm">No ingredients defined for this product</p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Product ID</p>
              <p className="text-sm font-medium text-gray-900">#{product.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {product.lastUpdated}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Ingredients</p>
              <p className="text-sm font-medium text-gray-900">
                {product.ingredients ? product.ingredients.length : 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Inventory Status</p>
              <p
                className={`text-sm font-medium ${
                  inventoryCheck.canMake ? "text-green-600" : "text-red-600"
                }`}
              >
                {inventoryCheck.canMake
                  ? "All ingredients available"
                  : `${inventoryCheck.missingIngredients.length} ingredients missing`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
