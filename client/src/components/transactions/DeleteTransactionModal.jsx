import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const DeleteTransactionModal = ({ isOpen, onClose, transaction, onConfirm, isDeleting }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl 
                                    bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <ExclamationCircleIcon className="h-6 w-6 text-red-400" />
                  <Dialog.Title className="text-lg font-medium text-white">
                    Delete {transaction?.amount >= 0 ? 'Income' : 'Expense'}
                  </Dialog.Title>
                </div>

                <p className="text-sm text-white/70 mb-4">
                  Are you sure you want to delete this {transaction?.amount >= 0 ? 'income' : 'expense'}? 
                  This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-white bg-white/10 
                             rounded-lg hover:bg-white/20 transition-colors"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 
                             rounded-lg hover:bg-red-600 transition-colors"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteTransactionModal; 