import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { LostFoundItem } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  item: LostFoundItem | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  item,
  isDeleting,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="delete-modal-container"
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-stone-900">
            Confirm Deletion
          </h3>
          <p className="mt-2 text-sm text-stone-600">
            Are you sure you want to delete this item?
          </p>

          <div className="mt-3 p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1">
            <div className="font-semibold text-stone-900 line-clamp-1">{item.item_name}</div>
            <div className="text-stone-500">Category: {item.category} • Status: {item.status}</div>
            <div className="text-stone-500">Location: {item.location}</div>
          </div>

          <p className="mt-2 text-xs text-red-600">
            This action will permanently delete the record from the SQLite database.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            id="btn-cancel-delete"
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-delete"
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
