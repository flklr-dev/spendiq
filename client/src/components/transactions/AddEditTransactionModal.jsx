import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const AddEditTransactionModal = ({ isOpen, onClose, transaction = null, onSave }) => {
  const isEditing = !!transaction;
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    category: '',
    paymentMethod: '',
    type: 'expense',
    attachments: []
  });
  const [categoryBudget, setCategoryBudget] = useState(null);

  useEffect(() => {
    const fetchBudgetInfo = async () => {
      if (formData.category) {
        try {
          const response = await fetch(`/api/budgets/category-info?category=${formData.category}&date=${formData.date}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          setCategoryBudget(data.categoryBudget);
        } catch (error) {
          console.error('Error fetching budget info:', error);
        }
      }
    };

    fetchBudgetInfo();
  }, [formData.category, formData.date]);

  const expenseCategories = [
    'Groceries',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Rent',
    'Shopping',
    'Restaurant',
    'Healthcare',
    'Other'
  ];

  const paymentMethods = [
    'Credit Card',
    'Debit Card',
    'Cash',
    'Bank Transfer',
    'Mobile Payment',
    'Check',
    'Digital Payment'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.category || !formData.paymentMethod) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const expenseData = {
        ...formData,
        amount: Math.abs(parseFloat(formData.amount)),
        type: 'expense',
        date: new Date(formData.date).toISOString()
      };

      await onSave(expenseData);
      onClose();
    } catch (error) {
      console.error('Error submitting expense:', error);
      toast.error(error.message || 'Failed to save expense');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl 
                               bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              {isEditing ? 'Edit Expense' : 'Add New Expense'}
            </Dialog.Title>
            <button onClick={onClose}>
              <XMarkIcon className="w-6 h-6 text-white/60 hover:text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-white/60">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                         outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/60">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-3 pl-8 bg-white/5 rounded-xl border border-white/10 
                           text-white outline-none focus:border-purple-500 transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/60">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                         outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter transaction description"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/60">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 
                         text-white outline-none focus:border-purple-500 transition-colors"
                required
              >
                <option value="" className="bg-slate-800">Select a category</option>
                {expenseCategories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {categoryBudget && (
              <div className="mt-2 text-sm">
                <p className="text-white/60">Budget: ${categoryBudget.plannedAmount}</p>
                <p className="text-white/60">Spent: ${categoryBudget.spentAmount}</p>
                <p className={`font-medium ${
                  categoryBudget.plannedAmount - categoryBudget.spentAmount > 0 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  Remaining: ${(categoryBudget.plannedAmount - categoryBudget.spentAmount).toFixed(2)}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm text-white/60">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                         outline-none focus:border-purple-500 transition-colors cursor-pointer"
              >
                <option value="" className="bg-slate-800">Select a payment method</option>
                {paymentMethods.map(method => (
                  <option key={method} value={method} className="bg-slate-800">
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/60">Attachment (Optional)</label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, attachment: e.target.files[0] })}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                         outline-none focus:border-purple-500 transition-colors"
                accept="image/*,.pdf"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-white bg-white/10 rounded-lg 
                         hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg 
                         hover:bg-purple-600 transition-colors"
              >
                {isEditing ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddEditTransactionModal; 