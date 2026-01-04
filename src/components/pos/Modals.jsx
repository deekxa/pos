import { X } from 'lucide-react';

export function DeleteModal({ show, type, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this {type}? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReserveModal({ show, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reserve Table</h3>
        <input
          type="text"
          id="reserveName"
          placeholder="Enter customer name"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-4"
          onKeyPress={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              onConfirm(e.target.value.trim());
            }
          }}
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const input = document.getElementById("reserveName");
              if (input.value.trim()) {
                onConfirm(input.value.trim());
              }
            }}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}

export function TableModal({ show, mode, tableData, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {mode === "add" ? "Add New Table" : "Edit Table"}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
            <input
              type="number"
              id="tableNumber"
              defaultValue={tableData?.number || ""}
              placeholder="Enter table number"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input
              type="number"
              id="tableCapacity"
              defaultValue={tableData?.capacity || 4}
              placeholder="Enter capacity"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const tableNumber = parseInt(document.getElementById("tableNumber").value);
              const capacity = parseInt(document.getElementById("tableCapacity").value);
              onConfirm(tableNumber, capacity, tableData?.id);
            }}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            {mode === "add" ? "Add Table" : "Update Table"}
          </button>
        </div>
      </div>
    </div>
  );
}
