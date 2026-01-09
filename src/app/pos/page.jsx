"use client";
import { useState, useEffect } from "react";
import { Receipt, Users } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import BillingForm from "@/components/pos/BillingForm";
import toast from "react-hot-toast";
import { useConfirmToast } from "../hooks/useConfirmToast";
import OrderTypeToggle from "@/components/pos/OrderTypeToggle";
import IndividualOrderType from "@/components/pos/IndividualOrderType";
import CartWithBilling from "@/components/pos/CartWithBilling";
import StatsCards from "@/components/pos/StatsCards";
import TableGrid from "@/components/pos/TableGrid";
import ProductFilters from "@/components/pos/ProductFilters";
import ProductGrid from "@/components/pos/ProductGrid";
import ProductTable from "@/components/pos/ProductTable";
import { DeleteModal, ReserveModal, TableModal } from "@/components/pos/Modals";

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
  const [orderMode, setOrderMode] = useState("table");
  const [individualOrderType, setIndividualOrderType] = useState(null);
  const [individualOrders, setIndividualOrders] = useState([]);
  const [showIndividualBilling, setShowIndividualBilling] = useState(false);

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
    setTables([...tables, newTable]);
    setTableModal({ show: false, mode: "add", tableData: null });
    toast.success(`Table ${tableNumber} added successfully!`);
  };

  const deleteTable = (tableId) => {
    const table = tables.find((t) => t.id === tableId);
    if (table.status === "occupied") {
      toast.error("Cannot delete an occupied table");
      return;
    }
    setTables(tables.filter((t) => t.id !== tableId));
    toast.success(`Table ${table.number} deleted successfully!`);
  };

  const updateTable = (tableNumber, capacity, tableId) => {
    setTables(
      tables.map((t) =>
        t.id === tableId ? { ...t, number: tableNumber, capacity } : t
      )
    );
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
      setTables(
        tables.map((t) =>
          t.id === tableId
            ? {
                ...t,
                status: "available",
                reservedFor: null,
                reservedTime: null,
              }
            : t
        )
      );
      toast.success(`Table ${table.number} unreserved`);
    } else {
      setReserveModal({ show: true, tableId });
    }
  };

  const confirmReservation = (name) => {
    setTables(
      tables.map((t) =>
        t.id === reserveModal.tableId
          ? {
              ...t,
              status: "reserved",
              reservedFor: name,
              reservedTime: new Date().toISOString(),
            }
          : t
      )
    );
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
              { ...product, quantity: 1, addedAt: new Date().toISOString() },
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
        return { ...table, status: "available", orders: [], startTime: null };
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

  const handleIndividualOrderType = (type) => {
    setIndividualOrderType(type);
    setShowTableView(false);
  };

  const addToIndividualOrder = (product) => {
    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    const existingItem = individualOrders.find(
      (item) => item.id === product.id
    );
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error("Not enough stock available");
        return;
      }
      setIndividualOrders(
        individualOrders.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      toast.success(`${product.name} quantity increased`);
    } else {
      setIndividualOrders([
        ...individualOrders,
        { ...product, quantity: 1, addedAt: new Date().toISOString() },
      ]);
      toast.success(`${product.name} added to order`);
    }
  };

  const updateIndividualQuantity = (productId, newQty) => {
    const product = products.find((p) => p.id === productId);
    if (newQty <= 0) {
      removeFromIndividualOrder(productId);
    } else if (newQty > product.stock) {
      toast.error("Not enough stock available");
    } else {
      setIndividualOrders(
        individualOrders.map((item) =>
          item.id === productId ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  const removeFromIndividualOrder = (productId) => {
    const removedItem = individualOrders.find((item) => item.id === productId);
    if (removedItem) {
      toast.success(`${removedItem.name} removed from order`);
    }
    setIndividualOrders(
      individualOrders.filter((item) => item.id !== productId)
    );
  };

  const handleCompleteIndividualOrder = () => {
    setShowIndividualBilling(true);
  };

  const handleIndividualBillingComplete = (transactionData) => {
    const updatedProducts = products.map((product) => {
      const orderItem = individualOrders.find(
        (order) => order.id === product.id
      );
      if (orderItem) {
        return { ...product, stock: product.stock - orderItem.quantity };
      }
      return product;
    });

    setProducts(updatedProducts);
    localStorage.setItem("inventory", JSON.stringify(updatedProducts));

    const transaction = {
      orderType: individualOrderType,
      items: individualOrders,
      subtotal: individualOrders.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      ...transactionData,
      timestamp: new Date().toISOString(),
    };

    const existingHistory = JSON.parse(
      localStorage.getItem("sales_history") || "[]"
    );
    existingHistory.push(transaction);
    localStorage.setItem("sales_history", JSON.stringify(existingHistory));

    setIndividualOrders([]);
    setIndividualOrderType(null);
    setShowTableView(true);
    setOrderMode("table");
    setShowIndividualBilling(false);
    toast.success("Order completed successfully!", { duration: 4000 });
  };

  const resetToOrderSelection = () => {
    setShowTableView(true);
    setSelectedTable(null);
    setIndividualOrderType(null);
    setIndividualOrders([]);
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

  if (showIndividualBilling && individualOrders.length > 0) {
    return (
      <ProtectedRoute
        allowedRoles={["admin", "branch_head", "cashier", "worker"]}
      >
        <BillingForm
          table={{ number: individualOrderType, orders: individualOrders }}
          products={products}
          onBack={() => setShowIndividualBilling(false)}
          onComplete={handleIndividualBillingComplete}
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
            <h1 className="text-2xl font-semibold text-gray-900">Orders/KOT</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {showTableView
                ? orderMode === "table"
                  ? "Select a table to start taking orders"
                  : individualOrderType
                  ? `Individual Order - ${individualOrderType}`
                  : "Select order type"
                : selectedTable
                ? `Managing Table ${selectedTable?.number}`
                : `Individual Order - ${individualOrderType}`}
            </p>
          </div>
          <div className="flex gap-3">
            {!showTableView && (
              <button
                onClick={resetToOrderSelection}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users size={18} />
                Back to Selection
              </button>
            )}
            <button
              onClick={() => router.push("/pos/saved-bills")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Receipt size={18} />
              Saved Bills
            </button>
            <button
              onClick={() => router.push("/pos/add")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add Product
            </button>
          </div>
        </div>

        {showTableView && (
          <div className="flex justify-center">
            <OrderTypeToggle
              orderMode={orderMode}
              setOrderMode={setOrderMode}
            />
          </div>
        )}

        <StatsCards tables={tables} getTableTotal={getTableTotal} />

        {showTableView ? (
          orderMode === "individual" && !individualOrderType ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Select Individual Order Type
              </h2>
              <IndividualOrderType onSelectType={handleIndividualOrderType} />
            </div>
          ) : orderMode === "table" ? (
            <TableGrid
              tables={tables}
              onSelectTable={selectTable}
              onEditTable={(table) =>
                setTableModal({ show: true, mode: "edit", tableData: table })
              }
              onDeleteTable={(id) => openDeleteModal(id, "table")}
              onToggleReserve={toggleReserveTable}
              onAddTable={() =>
                setTableModal({ show: true, mode: "add", tableData: null })
              }
              getTableTotal={getTableTotal}
              getTableItemCount={getTableItemCount}
              getTableStatusColor={getTableStatusColor}
              getTableStatusBadge={getTableStatusBadge}
            />
          ) : null
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
            <div className="space-y-4">
              <ProductFilters
                search={search}
                onSearchChange={setSearch}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />

              <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-150">
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
                  <ProductGrid
                    products={filteredProducts}
                    onAddProduct={
                      selectedTable ? addToTable : addToIndividualOrder
                    }
                    getStockStatus={getStockStatus}
                  />
                ) : (
                  <ProductTable
                    products={filteredProducts}
                    onAddProduct={
                      selectedTable ? addToTable : addToIndividualOrder
                    }
                    onEditProduct={(id) => router.push(`/pos/edit/${id}`)}
                    onDeleteProduct={(id) => openDeleteModal(id, "product")}
                    getStockStatus={getStockStatus}
                  />
                )}
              </div>
            </div>

            {selectedTable ? (
              <div className="lg:sticky lg:top-6 h-fit">
                <CartWithBilling
                  orderInfo={{ table: selectedTable }}
                  orders={selectedTable.orders}
                  onUpdateQuantity={(productId, newQty) =>
                    updateTableQuantity(selectedTable.id, productId, newQty)
                  }
                  onRemoveItem={(productId) =>
                    removeFromTable(selectedTable.id, productId)
                  }
                  onProceedToBilling={goToBilling}
                  showCustomerInfo={false}
                />
              </div>
            ) : (
              <div className="lg:sticky lg:top-6 h-fit">
                <CartWithBilling
                  orderInfo={{ type: individualOrderType }}
                  orders={individualOrders}
                  onUpdateQuantity={updateIndividualQuantity}
                  onRemoveItem={removeFromIndividualOrder}
                  onComplete={handleCompleteIndividualOrder}
                  showCustomerInfo={true}
                />
              </div>
            )}
          </div>
        )}

        <DeleteModal
          show={deleteModal.show}
          type={deleteModal.type}
          onConfirm={confirmDelete}
          onCancel={() =>
            setDeleteModal({ show: false, itemId: null, type: null })
          }
        />
        <ReserveModal
          show={reserveModal.show}
          onConfirm={confirmReservation}
          onCancel={() => setReserveModal({ show: false, tableId: null })}
        />
        <TableModal
          show={tableModal.show}
          mode={tableModal.mode}
          tableData={tableModal.tableData}
          onConfirm={(num, cap, id) =>
            tableModal.mode === "add"
              ? addNewTable(num, cap)
              : updateTable(num, cap, id)
          }
          onCancel={() =>
            setTableModal({ show: false, mode: "add", tableData: null })
          }
        />
      </div>
    </ProtectedRoute>
  );
}
