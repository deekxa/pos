'use client'

import React, { useState, useEffect, useRef } from 'react';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Receipt,
  Printer,
  X,
  Package,
  Percent
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CartWithBilling({
  orderInfo,
  orders,
  onUpdateQuantity,
  onRemoveItem,
  onComplete,
  onProceedToBilling,
  showCustomerInfo = false
}) {
  const router = useRouter();
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tempDiscount, setTempDiscount] = useState('');
  const discountInputRef = useRef(null);

  useEffect(() => {
    if (showDiscountModal) {
      setTimeout(() => {
        discountInputRef.current?.focus();
      }, 100);
    }
  }, [showDiscountModal]);

  const getSubtotal = () => {
    return orders.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTax = () => {
    const subtotal = getSubtotal();
    const afterDiscount = subtotal - (subtotal * discount / 100);
    return afterDiscount * 0.1; 
  };

  const getFinalTotal = () => {
    const subtotal = getSubtotal();
    const afterDiscount = subtotal - (subtotal * discount / 100);
    return afterDiscount + getTax();
  };

  const handleClearCart = () => {
    if (orders.length === 0) {
      toast.error('Cart is already empty');
      return;
    }
    
    orders.forEach(item => onRemoveItem(item.id));
    
    setCustomerName('');
    setContactNumber('');
    setDiscount(0);
    
    toast.success('Cart cleared successfully!');
  };

  const handleApplyDiscount = () => {
    const num = parseFloat(tempDiscount);
    if (isNaN(num)) {
      toast.error('Please enter a valid number');
      return;
    }
    if (num < 0 || num > 100) {
      toast.error('Discount must be between 0 and 100');
      return;
    }
    setDiscount(num);
    setShowDiscountModal(false);
    setTempDiscount('');
    if (num > 0) {
      toast.success(`Discount ${num}% applied!`);
    } else {
      toast.success('Discount removed');
    }
  };

  const handleSaveBill = () => {
    if (orders.length === 0) {
      toast.error('Cannot save empty bill');
      return;
    }

    const billData = {
      orderInfo,
      customerName: customerName || 'Guest',
      contactNumber,
      items: orders,
      subtotal: getSubtotal(),
      discount,
      tax: getTax(),
      total: getFinalTotal(),
      timestamp: new Date().toISOString(),
      billNumber: `BILL-${Date.now()}`
    };

    const existingBills = JSON.parse(localStorage.getItem('saved_bills') || '[]');
    existingBills.push(billData);
    localStorage.setItem('saved_bills', JSON.stringify(existingBills));
    
    toast.success(
      (t) => (
        <div className="flex items-center justify-between gap-3 w-full">
          <span className="font-medium">Bill saved successfully!</span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              router.push('/pos/saved-bills');
            }}
            className="px-3 py-1.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            View Bills
          </button>
        </div>
      ),
      {
        duration: 5000,
        style: {
          minWidth: '350px',
          maxWidth: '500px',
        },
      }
    );
  };

  const handlePreviewAndPrint = () => {
    if (orders.length === 0) {
      toast.error('Cannot print empty bill');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill Preview</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
            h1 { font-size: 24px; text-align: center; margin-bottom: 10px; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 15px; }
            .info { margin-bottom: 15px; font-size: 14px; }
            .items { margin: 20px 0; }
            .item { display: flex; justify-between; padding: 8px 0; border-bottom: 1px dashed #ccc; }
            .item-name { font-weight: bold; }
            .totals { margin-top: 15px; border-top: 2px solid #000; padding-top: 10px; }
            .total-row { display: flex; justify-between; padding: 5px 0; }
            .final-total { font-size: 18px; font-weight: bold; margin-top: 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Savory Delight</h1>
            <p>Address Line 1, City<br/>Phone: +123 456 7890</p>
          </div>
          <div class="info">
            <p><strong>Bill No:</strong> BILL-${Date.now()}</p>
            <p><strong>Order Type:</strong> ${orderInfo?.type || (orderInfo?.table ? `Table ${orderInfo.table.number}` : 'N/A')}</p>
            ${customerName ? `<p><strong>Customer:</strong> ${customerName}</p>` : ''}
            ${contactNumber ? `<p><strong>Contact:</strong> ${contactNumber}</p>` : ''}
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div class="items">
            <h3>Items:</h3>
            ${orders.map(item => `
              <div class="item">
                <div>
                  <div class="item-name">${item.name}</div>
                  <div style="font-size: 12px; color: #666;">RS.${item.price} x ${item.quantity}</div>
                </div>
                <div>RS.${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            `).join('')}
          </div>
          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>RS.${getSubtotal().toFixed(2)}</span>
            </div>
            ${discount > 0 ? `
              <div class="total-row">
                <span>Discount (${discount}%):</span>
                <span>-RS.${(getSubtotal() * discount / 100).toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="total-row">
              <span>Tax (GST 10%):</span>
              <span>RS.${getTax().toFixed(2)}</span>
            </div>
            <div class="total-row final-total">
              <span>Final Total:</span>
              <span>RS.${getFinalTotal().toFixed(2)}</span>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for your visit!</p>
            <p>Please visit again</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDiscountKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyDiscount();
    } else if (e.key === 'Escape') {
      setShowDiscountModal(false);
      setTempDiscount('');
    }
  };

  const handleDiscountBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowDiscountModal(false);
      setTempDiscount('');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-gray-700" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {orderInfo?.table ? `Table ${orderInfo.table.number.toString().padStart(2, '0')}` : 'Individual Order'}
              </h2>
              <p className="text-sm text-gray-500">
                {orders.length} items in cart
              </p>
            </div>
          </div>
        </div>

        {showCustomerInfo && (
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                id="contactNumber"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter contact number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
        )}

        <div className="p-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="text-gray-300 mx-auto mb-3" size={48} />
              <p className="text-gray-500 font-medium">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-100 overflow-y-auto">
              {orders.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">RS.{item.price.toLocaleString()} each</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-semibold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-bold text-gray-900">
                      RS.{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {orders.length > 0 && (
            <>
              <div className="flex items-center justify-between py-3 border-t border-gray-200 mt-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Percent size={16} />
                  <span>Discount</span>
                  {discount > 0 && (
                    <span className="text-green-600 font-medium">({discount}%)</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setTempDiscount(discount.toString());
                    setShowDiscountModal(true);
                  }}
                  className="text-gray-900 hover:text-gray-700 font-medium text-sm transition-colors underline"
                >
                  {discount > 0 ? 'Edit' : 'Add'}
                </button>
              </div>

              <div className="space-y-2 py-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">RS.{getSubtotal().toLocaleString()}.00</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({discount}%):</span>
                    <span>-RS.{(getSubtotal() * discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST 10%):</span>
                  <span className="font-medium text-gray-900">RS.{getTax().toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Final Total:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      RS.{getFinalTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleClearCart}
                    className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handleSaveBill}
                    className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <Receipt size={16} />
                    Save Bill
                  </button>
                </div>

                {onProceedToBilling && (
                  <button
                    onClick={onProceedToBilling}
                    className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Place Order & Mark Paid
                  </button>
                )}

                {onComplete && !onProceedToBilling && (
                  <button
                    onClick={onComplete}
                    className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-transition-colors"
                  >
                    Place {orderInfo?.type === 'dine-in' ? 'Dine-in' : orderInfo?.type === 'delivery' ? 'Delivery' : 'Takeaway'} Order
                  </button>
                )}

                <button
                  onClick={handlePreviewAndPrint}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Printer size={18} />
                  Preview & Print Bill
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showDiscountModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleDiscountBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="discount-modal-title"
        >
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 id="discount-modal-title" className="text-lg font-semibold text-gray-900">
                Add Discount
              </h3>
              <button
                onClick={() => {
                  setShowDiscountModal(false);
                  setTempDiscount('');
                }}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor="discountInput" className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage
              </label>
              <div className="relative">
                <input
                  ref={discountInputRef}
                  id="discountInput"
                  type="number"
                  value={tempDiscount}
                  onChange={(e) => setTempDiscount(e.target.value)}
                  onKeyDown={handleDiscountKeyPress}
                  placeholder="Enter discount (0-100)"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <Percent size={16} />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDiscountModal(false);
                  setTempDiscount('');
                }}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyDiscount}
                disabled={!tempDiscount}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
