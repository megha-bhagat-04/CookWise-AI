import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-6 m-4 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          disabled={isDeleting}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
            <AlertTriangle className="w-6 h-6" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900">
            Delete Item
          </h3>
          
          <p className="text-slate-600 text-sm">
            Are you sure you want to delete <span className="font-semibold text-slate-900">{itemName}</span>? This action cannot be undone.
          </p>

          <div className="flex space-x-3 w-full pt-4">
            <Button
              variant="ghost"
              className="flex-1 border border-slate-200"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
