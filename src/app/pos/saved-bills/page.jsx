"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Receipt, Eye, Trash2, Printer, Download, ArrowLeft, Search, X } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import toast from "react-hot-toast";

export default function SavedBillsPage() {
  const router = useRouter();
  const [savedBills, setSavedBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedBill, setSelectedBill] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, bill: null });

  useEffect(() => {
    loadSavedBills();
  }, []);

  const loadSavedBills = () => {
    const bills = JSON.parse(localStorage.getItem("saved_bills") || "[]");
    bills.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setSavedBills(bills);
  };

  const deleteBill = (billNumber) => {
    const updatedBills = savedBills.filter((bill) => bill.billNumber !== billNumber);
    localStorage.setItem("saved_bills", JSON.stringify(updatedBills));
    setSavedBills(updatedBills);
    setDeleteModal({ show: false, bill: null });
    toast.success("Bill deleted successfully!");
  };

  const printBill = (bill) => {
    const printContent = `
      <html>
        <head>
          <title>Bill - ${bill.billNumber}</title>
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
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Restaurant Name</h1>
            <p>Address Line 1, City<br/>Phone: +123 456 7890</p>
          </div>
          <div class="info">
            <p><strong>Bill No:</strong> ${bill.billNumber}</p>
            <p><strong>Order Type:</strong> ${bill.orderInfo?.type || (bill.orderInfo?.table ? `Table ${bill.orderInfo.table.number}` : 'N/A')}</p>
            ${bill.customerName ? `<p><strong>Customer:</strong> ${bill.customerName}</p>` : ''}
            ${bill.contactNumber ? `<p><strong>Contact:</strong> ${bill.contactNumber}</p>` : ''}
            <p><strong>Date:</strong> ${new Date(bill.timestamp).toLocaleString()}</p>
          </div>
          <div class="items">
            <h3>Items:</h3>
            ${bill.items.map(item => `
              <div class="item">
                <div>
                  <div class="item-name">${item.name}</div>
                  <div style="font-size: 12px; color: #666;">₹${item.price} x ${item.quantity}</div>
                </div>
                <div>₹${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            `).join('')}
          </div>
          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${bill.subtotal.toFixed(2)}</span>
            </div>
            ${bill.discount > 0 ? `
              <div class="total-row">
                <span>Discount (${bill.discount}%):</span>
                <span>-₹${(bill.subtotal * bill.discount / 100).toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="total-row">
              <span>Tax (13%):</span>
              <span>₹${bill.tax.toFixed(2)}</span>
            </div>
            <div class="total-row final-total">
              <span>Final Total:</span>
              <span>₹${bill.total.toFixed(2)}</span>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for your visit!</p>
            <p>Please visit again</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 100);
            }
          </script>
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentDocument.write(printContent);
    iframe.contentDocument.close();
    
    toast.success("Printing...");
  };

  const downloadBill = (bill) => {
    const billText = `
RESTAURANT NAME
Address Line 1, City
Phone: +123 456 7890

Bill No: ${bill.billNumber}
Order Type: ${bill.orderInfo?.type || (bill.orderInfo?.table ? `Table ${bill.orderInfo.table.number}` : 'N/A')}
${bill.customerName ? `Customer: ${bill.customerName}` : ''}
${bill.contactNumber ? `Contact: ${bill.contactNumber}` : ''}
Date: ${new Date(bill.timestamp).toLocaleString()}

ITEMS:
${bill.items.map(item => `${item.name}
₹${item.price} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`).join('\n\n')}

Subtotal: ₹${bill.subtotal.toFixed(2)}
${bill.discount > 0 ? `Discount (${bill.discount}%): -₹${(bill.subtotal * bill.discount / 100).toFixed(2)}\n` : ''}Tax (13%): ₹${bill.tax.toFixed(2)}
FINAL TOTAL: ₹${bill.total.toFixed(2)}

Thank you for your visit!
    `;

    const blob = new Blob([billText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bill.billNumber}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Bill downloaded!");
  };

  const filteredBills = savedBills.filter((bill) => {
    const matchesSearch =
      bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.orderInfo?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bill.orderInfo?.table && `table ${bill.orderInfo.table.number}`.includes(searchTerm.toLowerCase())) ||
      (bill.customerName && bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter =
      filterType === "all" ||
      bill.orderInfo?.type === filterType ||
      (filterType === "table" && bill.orderInfo?.table);

    return matchesSearch && matchesFilter;
  });

  const BillDetailModal = ({ bill, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Bill Details</h2>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Bill Number</p>
                <p className="font-semibold text-gray-900">{bill.billNumber.replace('BILL-', '#')}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Order Type</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {bill.orderInfo?.type || (bill.orderInfo?.table ? `Table ${bill.orderInfo.table.number}` : 'N/A')}
                </p>
              </div>
              {bill.customerName && (
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs mb-1">Customer Name</p>
                  <p className="font-semibold text-gray-900">{bill.customerName}</p>
                </div>
              )}
              {bill.contactNumber && (
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs mb-1">Contact Number</p>
                  <p className="font-semibold text-gray-900">{bill.contactNumber}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-gray-500 text-xs mb-1">Date & Time</p>
                <p className="font-semibold text-gray-900">{new Date(bill.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-2">
              {bill.items.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      ₹{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{bill.subtotal.toLocaleString()}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({bill.discount}%)</span>
                <span>-₹{(bill.subtotal * bill.discount / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (13%)</span>
              <span>₹{bill.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-200 pt-2">
              <span>Final Total</span>
              <span>₹{bill.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => printBill(bill)}
              className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={() => downloadBill(bill)}
              className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={["admin", "branch_head", "cashier", "worker"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/pos")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Saved Bills</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {filteredBills.length} {filteredBills.length === 1 ? 'bill' : 'bills'} found
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by bill number, customer name or order type..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="all">All Orders</option>
              <option value="table">Table Orders</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
              <option value="dine-in">Dine-in</option>
            </select>
          </div>
        </div>

        {filteredBills.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Receipt className="text-gray-300 mx-auto mb-3" size={48} />
            <p className="text-gray-500 font-medium">No saved bills found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "Bills will appear here when you save them"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBills.map((bill) => (
              <div
                key={bill.billNumber}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Receipt className="text-gray-700" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {bill.billNumber.replace('BILL-', '#')}
                      </p>
                      <p className="text-xs text-gray-500 capitalize mt-0.5">
                        {bill.orderInfo?.type || (bill.orderInfo?.table ? `Table ${bill.orderInfo.table.number}` : 'N/A')}
                      </p>
                    </div>
                  </div>
                </div>

                {bill.customerName && (
                  <div className="mb-3 text-sm">
                    <span className="text-gray-600">Customer: </span>
                    <span className="font-medium text-gray-900">{bill.customerName}</span>
                  </div>
                )}

                <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items</span>
                    <span className="font-medium text-gray-900">{bill.items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-bold text-gray-900">
                      ₹{bill.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(bill.timestamp).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedBill(bill)}
                    className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye size={14} />
                    View
                  </button>
                  <button
                    onClick={() => printBill(bill)}
                    className="p-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    title="Print Bill"
                  >
                    <Printer size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ show: true, bill })}
                    className="p-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    title="Delete Bill"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBill && (
        <BillDetailModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
        />
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Bill
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete bill{" "}
              <span className="font-semibold">{deleteModal.bill?.billNumber}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ show: false, bill: null })}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteBill(deleteModal.bill.billNumber)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
