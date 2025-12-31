'use client'

import toast from 'react-hot-toast'

export const useConfirmToast = () => {
  const confirmAction = (message, onConfirm, onCancel) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">Confirm Action</p>
                <p className="mt-1 text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                onConfirm()
                toast.dismiss(t.id)
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                if (onCancel) onCancel()
                toast.dismiss(t.id)
              }}
              className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    )
  }

  return { confirmAction }
}
