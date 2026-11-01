import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'} maxWidth="max-w-md">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {message || 'Are you sure you want to proceed? This action cannot be undone.'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="btn-danger min-w-[90px]"
          disabled={loading}
        >
          {loading ? 'Deleting...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
