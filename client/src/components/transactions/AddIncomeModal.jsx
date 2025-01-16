import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const AddIncomeModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    category: '',
    paymentMethod: '',
    recurring: {
      isRecurring: false,
      frequency: 'monthly' // Default to monthly since that's what budget uses
    }
  });

  const incomeCategories = [
    'Salary',
    'Freelance',
    'Investments',
    'Business',
    'Rental',
    'Other Income'
  ];

  const paymentMethods = [
    'Bank Transfer',
    'Cash',
    'Check',
    'Digital Payment'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log the form data to help debug
    console.log('Form data:', formData);

    // Validate all required fields
    if (!formData.amount || 
        !formData.description || 
        !formData.category || 
        !formData.paymentMethod || 
        !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const incomeData = {
        amount: Math.abs(parseFloat(formData.amount)),
        description: formData.description.trim(),
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        type: 'income',
        date: formData.date,
        recurring: {
          isRecurring: formData.recurring.isRecurring,
          frequency: formData.recurring.isRecurring ? 'monthly' : null
        }
      };

      // Log the processed data being sent
      console.log('Processed income data:', incomeData);

      await onSave(incomeData);
      
      // Clear form data after successful submission
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        description: '',
        category: '',
        paymentMethod: '',
        recurring: {
          isRecurring: false,
          frequency: 'monthly'
        }
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting income:', error);
      toast.error(error.message || 'Failed to save income');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl 
                               bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              Add Income
            </Dialog.Title>
            <button onClick={onClose}>
              <XMarkIcon className="w-6 h-6 text-white/70 hover:text-white/90" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-white/60">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                         outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/60">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                         outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter description"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/60">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                         outline-none focus:border-purple-500 transition-colors cursor-pointer"
                required
              >
                <option value="" className="bg-slate-800">Select a category</option>
                {incomeCategories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/60">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                         outline-none focus:border-purple-500 transition-colors cursor-pointer"
                required
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
              <label className="block text-sm text-white/60">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                         outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            {/* Recurring Income Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.recurring.isRecurring}
                onChange={(e) => setFormData({
                  ...formData,
                  recurring: {
                    ...formData.recurring,
                    isRecurring: e.target.checked
                  }
                })}
                className="rounded border-white/10 bg-white/5 text-purple-500 
                         focus:ring-purple-500"
              />
              <label htmlFor="isRecurring" className="text-sm text-white">
                Recurring monthly income
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20 
                         transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                         transition-colors"
              >
                Add Income
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddIncomeModal; 