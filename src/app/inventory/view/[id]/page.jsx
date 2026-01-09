"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Edit,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Tag,
  DollarSign,
  Calendar,
  Activity,
} from "lucide-react";

export default function ViewInventoryPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = parseInt(params.id);

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("inventory");
      if (stored) {
        try {
          const inventory = JSON.parse(stored);
          const foundItem = inventory.find((i) => i.id === itemId);
          if (foundItem) {
            setItem(foundItem);
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

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin", "branch_head"]}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </ProtectedRoute>
    );
  }

  if (!item) {
    return null;
  }

  const totalValue = item.stock * item.price;
  const stockPercentage = Math.min(
    (item.stock / (item.reorderLevel * 3)) * 100,
    100
  );
  const isLowStock = item.stock < item.reorderLevel;
  const isMediumStock =
    item.stock >= item.reorderLevel && item.stock < item.reorderLevel * 2;
  const isHighStock = item.stock >= item.reorderLevel * 2;

  const getStockStatus = () => {
    if (isLowStock)
      return {
        text: "Low Stock",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      };
    if (isMediumStock)
      return {
        text: "Medium Stock",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    return {
      text: "Good Stock",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    };
  };

  const stockStatus = getStockStatus();

  return (
    <ProtectedRoute allowedRoles={["admin", "branch_head"]}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/inventory")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {item.name}
              </h1>
              <p className="text-gray-500 mt-1">{item.category}</p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/inventory/edit/${item.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Edit size={16} />
            Edit Item
          </button>
        </div>

        {/* Stock Alert */}
        {isLowStock && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900 mb-1">
                  Low Stock Alert
                </h3>
                <p className="text-sm text-red-700">
                  Current stock ({item.stock} {item.unit}) is below the reorder
                  level ({item.reorderLevel} {item.unit}). Consider restocking
                  soon.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="text-blue-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Stock</p>
                <p className="text-lg font-semibold text-gray-900">
                  {item.stock} {item.unit}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Unit Price</p>
                <p className="text-lg font-semibold text-gray-900">
                  रु{item.price}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Value</p>
                <p className="text-lg font-semibold text-gray-900">
                  रु{totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Activity className="text-amber-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Reorder Level</p>
                <p className="text-lg font-semibold text-gray-900">
                  {item.reorderLevel} {item.unit}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Level Visual */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Stock Level Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.color} ${stockStatus.border} border`}
              >
                {stockStatus.text}
              </span>
              <span className="text-sm text-gray-600">
                {item.stock} / {item.reorderLevel * 3} {item.unit}
              </span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isLowStock
                    ? "bg-red-500"
                    : isMediumStock
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Low ({item.reorderLevel})</span>
              <span>Medium ({item.reorderLevel * 2})</span>
              <span>High ({item.reorderLevel * 3}+)</span>
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Item Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Item ID</p>
              <p className="text-sm font-medium text-gray-900">#{item.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Category</p>
              <p className="text-sm font-medium text-gray-900">
                {item.category}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Unit of Measure</p>
              <p className="text-sm font-medium text-gray-900">{item.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {item.lastUpdated}
              </p>
            </div>
          </div>
        </div>

        {/* Value Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Value Breakdown
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Unit Price</span>
              <span className="text-sm font-semibold text-gray-900">
                रु{item.price.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Current Stock</span>
              <span className="text-sm font-semibold text-gray-900">
                {item.stock} {item.unit}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-blue-700">
                Total Inventory Value
              </span>
              <span className="text-lg font-bold text-blue-900">
                रु{totalValue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Reorder Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Reorder Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Reorder Level</p>
              <p className="text-xl font-semibold text-gray-900">
                {item.reorderLevel} {item.unit}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Alert threshold for low stock
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Stock Above Reorder</p>
              <p
                className={`text-xl font-semibold ${
                  item.stock < item.reorderLevel
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {item.stock >= item.reorderLevel ? "+" : ""}
                {(item.stock - item.reorderLevel).toFixed(2)} {item.unit}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {item.stock < item.reorderLevel
                  ? "Below threshold"
                  : "Above threshold"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
