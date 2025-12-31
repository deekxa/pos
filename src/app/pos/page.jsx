"use client";
import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  Trash2,
  Package,
  ShoppingCart,
  Grid3x3,
  List,
  Search,
  X,
  Edit,
  Receipt,
  Users,
  UtensilsCrossed,
  Clock,
  TrendingUp,
  Tag,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import BillingForm from "@/components/pos/BillingForm";
import toast from "react-hot-toast";
import { useConfirmToast } from "../hooks/useConfirmToast";

export default function POSPage() {
  const router = useRouter();
  const { confirmAction } = useConfirmToast();

  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showTableView, setShowTableView] = useState(true);
  const [showBilling, setShowBilling] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    itemId: null,
    type: null,
  });
  const [reserveModal, setReserveModal] = useState({
    show: false,
    tableId: null,
  });
  const [tableModal, setTableModal] = useState({
    show: false,
    mode: "add",
    tableData: null,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("inventory");
      if (stored) {
        try {
          setProducts(JSON.parse(stored));
        } catch (error) {
          console.error("Failed to load inventory:", error);
          toast.error("Failed to load inventory");
          setProducts(getDefaultProducts());
        }
      } else {
        setProducts(getDefaultProducts());
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTables = localStorage.getItem("restaurant_tables");
      if (storedTables) {
        try {
          setTables(JSON.parse(storedTables));
        } catch (error) {
          console.error("Failed to load tables:", error);
          toast.error("Failed to load tables");
          setTables(initializeTables());
        }
      } else {
        setTables(initializeTables());
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && products.length > 0) {
      localStorage.setItem("inventory", JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== "undefined" && tables.length > 0) {
      localStorage.setItem("restaurant_tables", JSON.stringify(tables));
    }
  }, [tables]);

  const getDefaultProducts = () => [
    {
      id: 1,
      name: "Margherita Pizza",
      price: 450,
      stock: 50,
      category: "Main Course",
      sku: "FOOD-001",
      prepTime: 15,
    },
    {
      id: 2,
      name: "Caesar Salad",
      price: 280,
      stock: 40,
      category: "Appetizer",
      sku: "FOOD-002",
      prepTime: 5,
    },
    {
      id: 3,
      name: "Pasta Carbonara",
      price: 520,
      stock: 35,
      category: "Main Course",
      sku: "FOOD-003",
      prepTime: 20,
    },
    {
      id: 4,
      name: "Tiramisu",
      price: 320,
      stock: 25,
      category: "Dessert",
      sku: "FOOD-004",
      prepTime: 5,
    },
    {
      id: 5,
      name: "Cappuccino",
      price: 180,
      stock: 100,
      category: "Beverage",
      sku: "BEV-001",
      prepTime: 3,
    },
    {
      id: 6,
      name: "Garlic Bread",
      price: 150,
      stock: 60,
      category: "Appetizer",
      sku: "FOOD-005",
      prepTime: 8,
    },
    {
      id: 7,
      name: "Grilled Chicken",
      price: 680,
      stock: 30,
      category: "Main Course",
      sku: "FOOD-006",
      prepTime: 25,
    },
    {
      id: 8,
      name: "Chocolate Lava Cake",
      price: 380,
      stock: 20,
      category: "Dessert",
      sku: "FOOD-007",
      prepTime: 10,
    },
  ];

  const initializeTables = () => {
    const newTables = [];
    for (let i = 1; i <= 20; i++) {
      newTables.push({
        id: i,
        number: i,
        capacity: 4,
        status: "available",
        orders: [],
        startTime: null,
        reservedFor: null,
        reservedTime: null,
      });
    }
    return newTables;
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const addNewTable = (tableNumber, capacity) => {
    const newTable = {
      id: Date.now(),
      number: tableNumber,
      capacity: capacity || 4,
      status: "available",
      orders: [],
      startTime: null,
      reservedFor: null,
      reservedTime: null,
    };

    const updatedTables = [...tables, newTable];
    setTables(updatedTables);
    setTableModal({ show: false, mode: "add", tableData: null });
    toast.success(`Table ${tableNumber} added successfully!`);
  };

  const deleteTable = (tableId) => {
    const table = tables.find((t) => t.id === tableId);

    if (table.status === "occupied") {
      toast.error("Cannot delete an occupied table");
      return;
    }

    const updatedTables = tables.filter((t) => t.id !== tableId);
    setTables(updatedTables);
    toast.success(`Table ${table.number} deleted successfully!`);
  };

  const updateTable = (tableId, tableNumber, capacity) => {
    const updatedTables = tables.map((t) =>
      t.id === tableId ? { ...t, number: tableNumber, capacity: capacity } : t
    );
    setTables(updatedTables);
    setTableModal({ show: false, mode: "add", tableData: null });
    toast.success(`Table ${tableNumber} updated successfully!`);
  };

  const selectTable = (table) => {
    if (table.status === "reserved") {
      confirmAction(
        `This table is reserved for ${table.reservedFor}. Do you want to use it anyway?`,
        () => {
          setSelectedTable(table);
          setShowTableView(false);
          setShowBilling(false);
          toast.success(`Using reserved table ${table.number}`);
        }
      );
      return;
    }
    setSelectedTable(table);
    setShowTableView(false);
    setShowBilling(false);
  };

  const toggleReserveTable = (tableId) => {
    const table = tables.find((t) => t.id === tableId);

    if (table.status === "occupied") {
      toast.error("Cannot reserve an occupied table");
      return;
    }

    if (table.status === "reserved") {
      const updatedTables = tables.map((t) =>
        t.id === tableId
          ? { ...t, status: "available", reservedFor: null, reservedTime: null }
          : t
      );
      setTables(updatedTables);
      toast.success(`Table ${table.number} unreserved`);
    } else {
      setReserveModal({ show: true, tableId });
    }
  };

  const confirmReservation = (name) => {
    const updatedTables = tables.map((t) =>
      t.id === reserveModal.tableId
        ? {
            ...t,
            status: "reserved",
            reservedFor: name,
            reservedTime: new Date().toISOString(),
          }
        : t
    );
    setTables(updatedTables);
    const tableNumber = tables.find(
      (t) => t.id === reserveModal.tableId
    )?.number;
    setReserveModal({ show: false, tableId: null });
    toast.success(`Table ${tableNumber} reserved for ${name}`);
  };

  const addToTable = (product) => {
    if (!selectedTable) {
      toast.error("Please select a table first");
      return;
    }

    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    const updatedTables = tables.map((table) => {
      if (table.id === selectedTable.id) {
        const existingOrder = table.orders.find(
          (order) => order.id === product.id
        );

        if (existingOrder) {
          if (existingOrder.quantity >= product.stock) {
            toast.error("Not enough stock available");
            return table;
          }
          toast.success(`${product.name} quantity increased`);
          return {
            ...table,
            status: "occupied",
            orders: table.orders.map((order) =>
              order.id === product.id
                ? { ...order, quantity: order.quantity + 1 }
                : order
            ),
            startTime: table.startTime || new Date().toISOString(),
          };
        } else {
          toast.success(`${product.name} added to table`);
          return {
            ...table,
            status: "occupied",
            orders: [
              ...table.orders,
              {
                ...product,
                quantity: 1,
                addedAt: new Date().toISOString(),
              },
            ],
            startTime: table.startTime || new Date().toISOString(),
          };
        }
      }
      return table;
    });

    setTables(updatedTables);
    setSelectedTable(updatedTables.find((t) => t.id === selectedTable.id));
  };

  const updateTableQuantity = (tableId, productId, newQty) => {
    const product = products.find((p) => p.id === productId);

    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        if (newQty <= 0) {
          const newOrders = table.orders.filter(
            (order) => order.id !== productId
          );
          return {
            ...table,
            orders: newOrders,
            status: newOrders.length === 0 ? "available" : "occupied",
            startTime: newOrders.length === 0 ? null : table.startTime,
          };
        } else if (newQty > product.stock) {
          toast.error("Not enough stock available");
          return table;
        } else {
          return {
            ...table,
            orders: table.orders.map((order) =>
              order.id === productId ? { ...order, quantity: newQty } : order
            ),
          };
        }
      }
      return table;
    });

    setTables(updatedTables);
    setSelectedTable(updatedTables.find((t) => t.id === tableId));
  };

  const removeFromTable = (tableId, productId) => {
    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        const newOrders = table.orders.filter(
          (order) => order.id !== productId
        );
        const removedItem = table.orders.find(
          (order) => order.id === productId
        );
        if (removedItem) {
          toast.success(`${removedItem.name} removed from table`);
        }
        return {
          ...table,
          orders: newOrders,
          status: newOrders.length === 0 ? "available" : "occupied",
          startTime: newOrders.length === 0 ? null : table.startTime,
        };
      }
      return table;
    });

    setTables(updatedTables);
    setSelectedTable(updatedTables.find((t) => t.id === tableId));
  };

  const clearTable = async (tableId) => {
    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        return {
          ...table,
          status: "available",
          orders: [],
          startTime: null,
        };
      }
      return table;
    });

    setTables(updatedTables);
    if (selectedTable?.id === tableId) {
      setSelectedTable(null);
      setShowTableView(true);
      setShowBilling(false);
    }
   
    await new Promise((resolve) => setTimeout(resolve, 100));
   
  };

  const getTableTotal = (table) => {
    if (!table || !table.orders) return 0;
    return table.orders.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const getTableItemCount = (table) => {
    if (!table || !table.orders) return 0;
    return table.orders.reduce((sum, item) => sum + item.quantity, 0);
  };

  const goToBilling = () => {
    if (!selectedTable || selectedTable.orders.length === 0) {
      toast.error("No orders to bill");
      return;
    }
    setShowBilling(true);
  };

  const handlePaymentComplete = (transactionData) => {
    const updatedProducts = products.map((product) => {
      const orderItem = selectedTable.orders.find(
        (order) => order.id === product.id
      );
      if (orderItem) {
        return { ...product, stock: product.stock - orderItem.quantity };
      }
      return product;
    });

    setProducts(updatedProducts);
    localStorage.setItem("inventory", JSON.stringify(updatedProducts));

    const existingHistory = JSON.parse(
      localStorage.getItem("sales_history") || "[]"
    );
    existingHistory.push(transactionData);
    localStorage.setItem("sales_history", JSON.stringify(existingHistory));

    clearTable(selectedTable.id);
    toast.success("Payment completed successfully!", { duration: 4000 });
  };

  const openDeleteModal = (id, type) => {
    setDeleteModal({ show: true, itemId: id, type });
  };

  const confirmDelete = () => {
    if (deleteModal.type === "product") {
      const product = products.find((p) => p.id === deleteModal.itemId);
      setProducts(
        products.filter((product) => product.id !== deleteModal.itemId)
      );
      toast.success(`${product?.name} deleted successfully`);
    } else if (deleteModal.type === "table") {
      deleteTable(deleteModal.itemId);
    }
    setDeleteModal({ show: false, itemId: null, type: null });
  };

  const filteredProducts = products.filter((p) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower) ||
      (p.sku && p.sku.toLowerCase().includes(searchLower));
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock) => {
    if (stock === 0)
      return {
        color: "text-gray-500",
        bg: "bg-gray-50",
        label: "Out of stock",
        badge: "bg-gray-100 text-gray-600",
      };
    if (stock <= 10)
      return {
        color: "text-red-600",
        bg: "bg-red-50",
        label: `${stock} left`,
        badge: "bg-red-100 text-red-600",
      };
    if (stock <= 20)
      return {
        color: "text-amber-600",
        bg: "bg-amber-50",
        label: `${stock} in stock`,
        badge: "bg-amber-100 text-amber-600",
      };
    return {
      color: "text-green-600",
      bg: "bg-green-50",
      label: `${stock} in stock`,
      badge: "bg-green-100 text-green-600",
    };
  };

  const getTableStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-50 border-green-200 hover:border-green-400";
      case "occupied":
        return "bg-red-50 border-red-200 hover:border-red-400";
      case "reserved":
        return "bg-amber-50 border-amber-200 hover:border-amber-400";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTableStatusBadge = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700";
      case "occupied":
        return "bg-red-100 text-red-700";
      case "reserved":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getElapsedTime = (startTime) => {
    if (!startTime) return "0m";
    const elapsed = Date.now() - new Date(startTime).getTime();
    const minutes = Math.floor(elapsed / 60000);
    return `${minutes}m`;
  };

  if (showBilling && selectedTable) {
    return (
      <ProtectedRoute
        allowedRoles={["admin", "branch_head", "cashier", "worker"]}
      >
        <BillingForm
          table={selectedTable}
          products={products}
          onBack={() => setShowBilling(false)}
          onComplete={handlePaymentComplete}
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute
      allowedRoles={["admin", "branch_head", "cashier", "worker"]}
    >
      <div className="space-y-6">
     
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Point of Sale
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {showTableView
                ? "Select a table to start taking orders"
                : `Managing Table ${selectedTable?.number}`}
            </p>
          </div>
          <div className="flex gap-3">
            {!showTableView && (
              <button
                onClick={() => {
                  setShowTableView(true);
                  setSelectedTable(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users size={18} />
                All Tables
              </button>
            )}
            <button
              onClick={() => router.push("/pos/add")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add Product
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Available</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {tables.filter((t) => t.status === "available").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Occupied</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {tables.filter((t) => t.status === "occupied").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Reserved</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {tables.filter((t) => t.status === "reserved").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <Users className="text-amber-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  रु
                  {tables
                    .reduce((sum, t) => sum + getTableTotal(t), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-gray-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {showTableView ? (
         
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="text-gray-700" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Select a Table
                </h2>
              </div>
              <button
                onClick={() =>
                  setTableModal({ show: true, mode: "add", tableData: null })
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus size={18} />
                Add Table
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className={`relative border-2 rounded-xl p-6 transition-all ${getTableStatusColor(
                    table.status
                  )}`}
                >
                  <div
                    onClick={() => selectTable(table)}
                    className="text-center cursor-pointer"
                  >
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {table.number}
                    </div>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTableStatusBadge(
                        table.status
                      )}`}
                    >
                      {table.status}
                    </span>

                    {table.status === "reserved" && table.reservedFor && (
                      <div className="mt-2 text-xs text-gray-600">
                        {table.reservedFor}
                      </div>
                    )}

                    {table.orders.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                          {getTableItemCount(table)} items
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          रु{getTableTotal(table).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                
                  <div className="absolute top-2 left-2 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTableModal({
                          show: true,
                          mode: "edit",
                          tableData: table,
                        });
                      }}
                      className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      title="Edit table"
                    >
                      <Edit size={14} />
                    </button>
                    {table.status === "available" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(table.id, "table");
                        }}
                        className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        title="Delete table"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {table.status !== "occupied" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReserveTable(table.id);
                      }}
                      className={`absolute bottom-2 right-2 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                        table.status === "reserved"
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                      title={
                        table.status === "reserved"
                          ? "Unreserve table"
                          : "Reserve table"
                      }
                    >
                      {table.status === "reserved" ? "Unreserve" : "Reserve"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
         
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
           
            <div className="space-y-4">
             
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
                      placeholder="Search products by name or SKU..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg border transition-colors ${
                        viewMode === "grid"
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Grid3x3 size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-2 rounded-lg border transition-colors ${
                        viewMode === "table"
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>

               
                <div className="flex gap-2 mt-3 flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

         
              <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-[600px]">
                {filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Package className="text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500 font-medium">
                      No products found
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <div
                          key={product.id}
                          onClick={() =>
                            product.stock > 0 && addToTable(product)
                          }
                          className={`group bg-white rounded-lg border border-gray-200 p-3 transition-all ${
                            product.stock > 0
                              ? "cursor-pointer hover:border-gray-900 hover:shadow-md"
                              : "opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-3">
                            <Package className="text-gray-300" size={40} />
                          </div>

                          <div className="space-y-1">
                            <h3 className="font-medium text-gray-900 text-sm truncate">
                              {product.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {product.category}
                            </p>

                            <div className="flex items-center justify-between pt-2">
                              <span className="text-base font-semibold text-gray-900">
                                रु{product.price.toLocaleString()}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${stockStatus.bg} ${stockStatus.color} font-medium`}
                              >
                                {stockStatus.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Product
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Category
                          </th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Price
                          </th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Stock
                          </th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((product) => {
                          const stockStatus = getStockStatus(product.stock);
                          return (
                            <tr
                              key={product.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Package
                                      className="text-gray-400"
                                      size={20}
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 text-sm">
                                      {product.name}
                                    </div>
                                    {product.sku && (
                                      <div className="text-xs text-gray-500">
                                        {product.sku}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {product.category}
                              </td>
                              <td className="py-3 px-4 text-right font-semibold text-gray-900 text-sm">
                                रु{product.price.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`inline-flex px-2 py-1 rounded text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}
                                >
                                  {stockStatus.label}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => addToTable(product)}
                                    disabled={product.stock === 0}
                                    className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                  >
                                    Add to Table
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/pos/edit/${product.id}`);
                                    }}
                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Edit product"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDeleteModal(product.id, "product");
                                    }}
                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Delete product"
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
                )}
              </div>
            </div>

            <div className="lg:sticky lg:top-6 h-fit">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold text-gray-900 ${getTableStatusColor(
                          selectedTable.status
                        )}`}
                      >
                        {selectedTable.number}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Table {selectedTable.number}
                        </h2>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getTableStatusBadge(
                            selectedTable.status
                          )}`}
                        >
                          {selectedTable.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedTable.orders.length}{" "}
                    {selectedTable.orders.length === 1 ? "item" : "items"} •
                    <span className="font-medium text-gray-900 ml-1">
                      रु{getTableTotal(selectedTable).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  {selectedTable.orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart
                        className="text-gray-300 mx-auto mb-3"
                        size={48}
                      />
                      <p className="text-gray-500 font-medium">No orders yet</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Add items from menu
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                        {selectedTable.orders.map((item) => (
                          <div
                            key={item.id}
                            className="border border-gray-200 rounded-lg p-3"
                          >
                            <div className="flex gap-3">
                              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Package className="text-gray-400" size={20} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm truncate">
                                  {item.name}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  रु{item.price.toLocaleString()}
                                </p>
                              </div>

                              <div className="text-right">
                                <div className="font-semibold text-gray-900 text-sm">
                                  रु
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                                <button
                                  onClick={() =>
                                    updateTableQuantity(
                                      selectedTable.id,
                                      item.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="p-1.5 hover:bg-gray-50 transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-8 text-center text-sm font-medium text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateTableQuantity(
                                      selectedTable.id,
                                      item.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="p-1.5 hover:bg-gray-50 transition-colors"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              <button
                                onClick={() =>
                                  removeFromTable(selectedTable.id, item.id)
                                }
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Subtotal</span>
                          <span className="font-medium">
                            रु{getTableTotal(selectedTable).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Tax (10%)</span>
                          <span className="font-medium">
                            रु{(getTableTotal(selectedTable) * 0.1).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <span className="text-base font-semibold text-gray-900">
                            Total
                          </span>
                          <span className="text-xl font-bold text-gray-900">
                            रु
                            {(
                              getTableTotal(selectedTable) * 1.1
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <button
                          onClick={goToBilling}
                          className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                          <span className="text-xl font-bold">रु</span>
                          Proceed to Billing
                        </button>
                        <button
                          onClick={() => {
                            confirmAction(
                              "Are you sure you want to clear this table? All orders will be removed.",
                              async () => {
                                await clearTable(selectedTable.id);
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 1000)
                                );
                                toast.success("Table cleared successfully");
                              }
                            );
                          }}
                          className="w-full px-4 py-2.5 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200"
                        >
                          Clear Table
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {tableModal.show && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {tableModal.mode === "add" ? "Add New Table" : "Edit Table"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const tableNumber = parseInt(formData.get("tableNumber"));
                const capacity = parseInt(formData.get("capacity"));

                if (tableModal.mode === "add") {
                  if (tables.some((t) => t.number === tableNumber)) {
                    toast.error("Table number already exists");
                    return;
                  }
                  addNewTable(tableNumber, capacity);
                } else {
                  updateTable(tableModal.tableData.id, tableNumber, capacity);
                }
              }}
            >
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Table Number
                  </label>
                  <input
                    type="number"
                    name="tableNumber"
                    placeholder="Enter table number"
                    defaultValue={tableModal.tableData?.number || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                    min="1"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity (optional)
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    placeholder="Number of seats"
                    defaultValue={tableModal.tableData?.capacity || 4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    min="1"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setTableModal({ show: false, mode: "add", tableData: null })
                  }
                  className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  {tableModal.mode === "add" ? "Add Table" : "Update Table"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {reserveModal.show && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reserve Table{" "}
              {tables.find((t) => t.id === reserveModal.tableId)?.number}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const name = formData.get("reservedFor");
                if (name) {
                  confirmReservation(name);
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reserved For
                </label>
                <input
                  type="text"
                  name="reservedFor"
                  placeholder="Enter customer name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setReserveModal({ show: false, tableId: null })
                  }
                  className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-gray-50">
              <Trash2 className="text-gray-700" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              Delete {deleteModal.type === "product" ? "Product" : "Table"}?
            </h3>
            <p className="text-center text-gray-600 text-sm mb-6">
              This action cannot be undone. The {deleteModal.type} will be
              permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeleteModal({ show: false, itemId: null, type: null })
                }
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
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
