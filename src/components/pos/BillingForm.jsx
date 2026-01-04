"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Printer,
  CheckCircle,
  CreditCard,
  Banknote,
  Wallet,
  Tag,
  X,
} from "lucide-react";

export default function BillingForm({ table, products, onBack, onComplete }) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState({ type: "none", value: 0 });
  const [showMixedModal, setShowMixedModal] = useState(false);
  const [mixedPayment, setMixedPayment] = useState({ cash: 0, online: 0 });

  const getTableTotal = () => {
    return table.orders.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const calculateDiscount = () => {
    const total = getTableTotal();
    if (discount.type === "percentage") {
      return (total * discount.value) / 100;
    } else if (discount.type === "amount") {
      return Math.min(discount.value, total);
    }
    return 0;
  };

  const getFinalTotal = () => {
    const subtotal = getTableTotal();
    const discountAmount = calculateDiscount();
    const afterDiscount = subtotal - discountAmount;
    const tax = afterDiscount * 0.1;
    return afterDiscount + tax;
  };

  const handleSplitHalf = () => {
    const finalTotal = getFinalTotal();
    const half = finalTotal / 2;
    setMixedPayment({ cash: half, online: half });
  };

  const handleMixedConfirm = () => {
    const total = getFinalTotal();
    const mixedTotal = mixedPayment.cash + mixedPayment.online;
    
    if (Math.abs(mixedTotal - total) > 0.01) {
      alert(`Combined amounts must equal total: ₹${total.toFixed(2)}`);
      return;
    }
    
    setPaymentMethod("mixed");
    setShowMixedModal(false);
  };

  const handleCompletePayment = () => {
    const transactionData = {
      id: Date.now(),
      tableNumber: table.number,
      items: table.orders,
      subtotal: getTableTotal(),
      discount: calculateDiscount(),
      tax: (getTableTotal() - calculateDiscount()) * 0.1,
      total: getFinalTotal(),
      paymentMethod: paymentMethod,
      mixedPayment: paymentMethod === "mixed" ? mixedPayment : null,
      timestamp: new Date().toISOString(),
    };

    onComplete(transactionData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Invoice</h2>
              <p className="text-sm text-gray-300 mt-1">
                Table #{table.number}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Invoice #</p>
              <p className="font-mono font-semibold text-white">
                {Date.now().toString().slice(-6)}
              </p>
              <p className="text-xs text-gray-300 mt-1">
                {new Date().toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 uppercase">
                  Item
                </th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600 uppercase">
                  Qty
                </th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600 uppercase">
                  Price
                </th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.orders.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 px-2">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.sku && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.sku}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-2 text-center text-gray-900 font-medium">
                    {item.quantity}
                  </td>
                  <td className="py-4 px-2 text-right text-gray-900">
                    ₹{item.price.toLocaleString()}
                  </td>
                  <td className="py-4 px-2 text-right font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ₹{getTableTotal().toLocaleString()}
                  </span>
                </div>

                {discount.type !== "none" && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag size={14} />
                      Discount{" "}
                      {discount.type === "percentage"
                        ? `(${discount.value}%)`
                        : ""}
                    </span>
                    <span className="font-medium">
                      -₹{calculateDiscount().toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST 10%)</span>
                  <span className="font-medium">
                    ₹
                    {((getTableTotal() - calculateDiscount()) * 0.1).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                  <span className="text-xl font-bold text-gray-900">
                    Grand Total
                  </span>
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{getFinalTotal().toFixed(2)}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Apply Discount
                  </p>
                  <div className="flex gap-2">
                    <select
                      value={discount.type}
                      onChange={(e) =>
                        setDiscount({ type: e.target.value, value: 0 })
                      }
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="none">No Discount</option>
                      <option value="percentage">Percentage (%)</option>
                      <option value="amount">Fixed Amount (₹)</option>
                    </select>
                    {discount.type !== "none" && (
                      <input
                        type="number"
                        value={discount.value}
                        onChange={(e) =>
                          setDiscount({
                            ...discount,
                            value: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder={
                          discount.type === "percentage" ? "0%" : "₹0"
                        }
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        min="0"
                        max={discount.type === "percentage" ? "100" : undefined}
                      />
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod("cash")}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${
                        paymentMethod === "cash"
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Banknote size={18} />
                      <span className="font-medium text-sm">Cash</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${
                        paymentMethod === "card"
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CreditCard size={18} />
                      <span className="font-medium text-sm">Online</span>
                    </button>
                    <button
                      onClick={() => setShowMixedModal(true)}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${
                        paymentMethod === "mixed"
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Wallet size={18} />
                      <span className="font-medium text-sm">Both</span>
                    </button>
                  </div>
                  
                  {paymentMethod === "mixed" && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Cash:</span>
                        <span className="font-semibold text-gray-900">₹{mixedPayment.cash.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">Online:</span>
                        <span className="font-semibold text-gray-900">₹{mixedPayment.online.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-gray-100 text-gray-900 border border-gray-200 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={handleCompletePayment}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Complete
            </button>
          </div>
        </div>
      </div>

      {showMixedModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Cash + Online Payment
              </h3>
              <button
                onClick={() => setShowMixedModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">₹{getFinalTotal().toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cash Amount
                  </label>
                  <input
                    type="number"
                    value={mixedPayment.cash}
                    onChange={(e) => setMixedPayment({
                      ...mixedPayment,
                      cash: parseFloat(e.target.value) || 0
                    })}
                    placeholder="Enter cash amount"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    min="0"
                    max={getFinalTotal()}
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Online Amount
                  </label>
                  <input
                    type="number"
                    value={mixedPayment.online}
                    onChange={(e) => setMixedPayment({
                      ...mixedPayment,
                      online: parseFloat(e.target.value) || 0
                    })}
                    placeholder="Enter online amount"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    min="0"
                    max={getFinalTotal()}
                    step="0.01"
                  />
                </div>

                <button
                  onClick={handleSplitHalf}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Split 50/50
                </button>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Entered:</span>
                    <span className={`font-semibold ${
                      Math.abs((mixedPayment.cash + mixedPayment.online) - getFinalTotal()) < 0.01
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      ₹{(mixedPayment.cash + mixedPayment.online).toFixed(2)}
                    </span>
                  </div>
                  {Math.abs((mixedPayment.cash + mixedPayment.online) - getFinalTotal()) >= 0.01 && (
                    <p className="text-xs text-red-600 mt-1">
                      Amount must equal ₹{getFinalTotal().toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowMixedModal(false)}
                className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMixedConfirm}
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
