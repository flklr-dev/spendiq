import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  CalendarIcon, 
  PlusCircleIcon,
  BellIcon,
  ArrowPathIcon,
  XMarkIcon,
  PencilIcon,
  ExclamationCircleIcon, 
  SparklesIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import EmptyBudgetState from './EmptyBudgetState';
import api from '../utils/axios';

// Add DeleteConfirmationModal component at the top level
const DeleteConfirmationModal = ({ isOpen, onClose, category, onConfirm, isDeleting }) => {
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl 
                                     bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-center w-12 h-12 mx-auto 
                              rounded-full bg-red-500/10 mb-4">
                  <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
                </div>

                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold text-white text-center mb-2"
                >
                  Delete Budget Category
                </Dialog.Title>

                <div className="mt-2">
                  <p className="text-white/60 text-center">
                    Are you sure you want to delete the{' '}
                    <span className="text-white font-medium">{category?.name}</span> category?
                    This action cannot be undone.
                  </p>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 bg-white/5 text-white rounded-lg 
                             hover:bg-white/10 transition-colors"
                    onClick={onClose}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg 
                             hover:bg-red-600 transition-colors flex items-center justify-center"
                    onClick={onConfirm}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      'Delete'
                    )}
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

// BudgetOverview Component
const BudgetOverview = ({ budget }) => {
  if (!budget || !budget.categories) {
    return null;
  }

  const totalSpent = budget.categories.reduce((sum, cat) => sum + (cat.spentAmount || 0), 0);
  const totalBudgeted = budget.totalBudget || 0;
  const remainingBudget = totalBudgeted - totalSpent;

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-4">Budget Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-sm text-white/60">Total Budgeted</p>
          <p className="text-2xl font-bold text-purple-400">
            ${totalBudgeted.toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-sm text-white/60">Total Spent</p>
          <p className="text-2xl font-bold text-red-400">
            ${totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-sm text-white/60">Remaining Budget</p>
          <p className="text-2xl font-bold text-blue-400">
            ${remainingBudget.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

// BudgetCategoryList Component
const BudgetCategoryList = ({ categories, onEditCategory, onDeleteCategory }) => {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Budget Categories</h2>
      
      <div className="space-y-4">
        {categories.map((category) => {
          const percentage = (category.spentAmount / category.plannedAmount) * 100;
          const isOverBudget = percentage > 100;

          return (
            <div key={category.name} className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-white font-medium">{category.name}</h3>
                  <p className="text-sm text-white/60">
                    ${category.spentAmount?.toFixed(2)} of ${category.plannedAmount.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditCategory(category)}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                    title="Edit category"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  {/* Only allow delete if there's no spent amount */}
                  {(!category.spentAmount || category.spentAmount === 0) && (
                    <button
                      onClick={() => onDeleteCategory(category)}
                      className="p-2 text-red-400/60 hover:text-red-400 transition-colors"
                      title="Delete category"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isOverBudget ? 'bg-red-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// BudgetInsights Component
const BudgetInsights = ({ budget }) => {
  if (!budget?.categories) return null;

  const overspentCategories = budget.categories
    .filter(cat => (cat.spentAmount || 0) > cat.plannedAmount)
    .sort((a, b) => (b.spentAmount - b.plannedAmount) - (a.spentAmount - a.plannedAmount))
    .slice(0, 3);

  const underutilizedCategories = budget.categories
    .filter(cat => cat.plannedAmount > 0 && (cat.spentAmount || 0) < cat.plannedAmount * 0.5)
    .sort((a, b) => (b.plannedAmount - b.spentAmount) - (a.plannedAmount - a.spentAmount))
    .slice(0, 3);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Budget Insights</h2>

      {overspentCategories.length > 0 && (
        <div className="mb-6">
          <h3 className="flex items-center text-red-400 font-medium mb-3">
            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
            Overspent Categories
          </h3>
          <div className="space-y-3">
            {overspentCategories.map(cat => (
              <div key={cat.name} className="flex justify-between text-sm">
                <span className="text-white">{cat.name}</span>
                <span className="text-red-400">
                  ${(cat.spentAmount - cat.plannedAmount).toFixed(2)} over budget
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {underutilizedCategories.length > 0 && (
        <div>
          <h3 className="flex items-center text-green-400 font-medium mb-3">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Potential Savings
          </h3>
          <div className="space-y-3">
            {underutilizedCategories.map(cat => (
              <div key={cat.name} className="flex justify-between text-sm">
                <span className="text-white">{cat.name}</span>
                <span className="text-green-400">
                  ${(cat.plannedAmount - (cat.spentAmount || 0)).toFixed(2)} remaining
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CATEGORY_OPTIONS = [
  'Groceries',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Rent',
  'Shopping',
  'Restaurant',
  'Healthcare',
  'Savings',
  'Other'
];

// AddEditBudgetModal Component
const AddEditBudgetModal = ({ isOpen, onClose, category, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    plannedAmount: '',
    notes: '',
    isRecurring: false
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        plannedAmount: category.plannedAmount,
        notes: category.notes || '',
        isRecurring: category.isRecurring || false
      });
    } else {
      setFormData({
        name: CATEGORY_OPTIONS[0],
        plannedAmount: '',
        notes: '',
        isRecurring: false
      });
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      plannedAmount: Number(formData.plannedAmount)
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-2xl bg-slate-800 border border-white/10">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Dialog.Title className="text-xl font-semibold text-white">
              {category ? 'Edit Budget Category' : 'Add Budget Category'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-white/60">Category Name</label>
              <select
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                     outline-none focus:border-purple-500 transition-colors
                     [&>option]:bg-slate-800 [&>option]:text-white"
                required
              >
                {CATEGORY_OPTIONS.map(option => (
                  <option 
                    key={option} 
                    value={option}
                    className="bg-slate-800 text-white hover:bg-purple-500"
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/60">Planned Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.plannedAmount}
                onChange={(e) => setFormData({ ...formData, plannedAmount: e.target.value })}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                         outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="rounded border-white/10 bg-white/5 text-purple-500 
                         focus:ring-purple-500"
              />
              <label htmlFor="isRecurring" className="text-sm text-white">
                Recurring monthly budget
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/60">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                         outline-none focus:border-purple-500 transition-colors"
                rows="3"
              />
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
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                         transition-colors"
              >
                {category ? 'Update' : 'Add'} Category
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

// SavingsGoals Component
const SavingsGoals = ({ goals = [], onUpdateGoal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    notes: ''
  });

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        targetDate: goal.targetDate?.split('T')[0] || '',
        notes: goal.notes || ''
      });
      setSelectedGoal(goal);
    } else {
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        targetDate: '',
        notes: ''
      });
      setSelectedGoal(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/savings-goals', {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount)
      });

      if (response.data.success) {
        onUpdateGoal();
        setIsModalOpen(false);
        toast.success(selectedGoal ? 'Goal updated successfully' : 'Goal created successfully');
      }
    } catch (error) {
      console.error('Error updating savings goal:', error);
      toast.error(error.message || 'Failed to save goal');
    }
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Savings Goals</h2>
        <button
          onClick={() => handleOpenModal()}
          className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <PlusCircleIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remainingAmount = goal.targetAmount - goal.currentAmount;
          
          return (
            <div key={goal._id} className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-white font-medium">{goal.name}</h3>
                  <p className="text-sm text-white/60">
                    ${goal.currentAmount.toFixed(2)} of ${goal.targetAmount.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenModal(goal)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Update
                </button>
              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              {goal.targetDate && (
                <p className="text-sm text-white/60">
                  Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}

        {goals.length === 0 && (
          <p className="text-center text-white/60 py-4">
            No savings goals yet. Click the plus icon to add one.
          </p>
        )}
      </div>

      {/* Add/Edit Savings Goal Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full rounded-2xl bg-slate-800 border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <Dialog.Title className="text-xl font-semibold text-white">
                {selectedGoal ? 'Edit Savings Goal' : 'Add Savings Goal'}
              </Dialog.Title>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm text-white/60">Goal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                           outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-white/60">Target Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                             outline-none focus:border-purple-500 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/60">Current Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                             outline-none focus:border-purple-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-white/60">Target Date</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                           outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-white/60">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                           outline-none focus:border-purple-500 transition-colors"
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20 
                           transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                           transition-colors"
                >
                  {selectedGoal ? 'Update' : 'Add'} Goal
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

// New Analytics Component
const BudgetAnalytics = () => {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Spending Analytics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-xl">
          <p className="text-sm text-white/60 mb-1">Most Spent Category</p>
          <p className="text-lg font-bold text-white">Groceries</p>
          <p className="text-sm text-purple-400">$450.00</p>
        </div>
        <div className="p-4 bg-white/5 rounded-xl">
          <p className="text-sm text-white/60 mb-1">Largest Transaction</p>
          <p className="text-lg font-bold text-white">Rent Payment</p>
          <p className="text-sm text-purple-400">$1,200.00</p>
        </div>
      </div>
    </div>
  );
};

// New Recent Activity Component
const RecentActivity = () => {
  const activities = [
    { id: 1, type: 'expense', category: 'Groceries', amount: 85.50, date: '2024-03-15' },
    { id: 2, type: 'expense', category: 'Transportation', amount: 45.00, date: '2024-03-14' },
    { id: 3, type: 'expense', category: 'Entertainment', amount: 120.00, date: '2024-03-13' },
  ];

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">{activity.category}</p>
              <p className="text-sm text-white/60">{activity.date}</p>
            </div>
            <p className="text-red-400 font-medium">-${activity.amount.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Keep only one version of AddEditSavingsGoalModal at the top of the file
const AddEditSavingsGoalModal = ({ isOpen, onClose, goal, onSave }) => {
  const [formData, setFormData] = useState({
    name: goal?.name || '',
    targetAmount: goal?.targetAmount || '',
    targetDate: goal?.targetDate ? new Date(goal.targetDate).toISOString().slice(0, 10) : '',
    category: goal?.category || 'Emergency',
    priority: goal?.priority || 'Medium',
    notes: goal?.notes || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      targetAmount: Number(formData.targetAmount),
      targetDate: new Date(formData.targetDate)
    });
  };

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
              <Dialog.Panel className="w-full max-w-md transform rounded-xl 
                                     bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold text-white mb-4"
                >
                  {goal ? 'Edit' : 'Add'} Savings Goal
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">
                      Goal Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 
                               text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">
                      Target Amount
                    </label>
                    <input
                      type="number"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 
                               text-white focus:outline-none focus:border-purple-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 
                               text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 
                               text-white focus:outline-none focus:border-purple-500"
                    >
                      {['Emergency', 'Travel', 'Education', 'Home', 'Vehicle', 'Retirement', 'Other']
                        .map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 
                               text-white focus:outline-none focus:border-purple-500"
                    >
                      {['Low', 'Medium', 'High'].map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 
                               text-white focus:outline-none focus:border-purple-500"
                      rows="3"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 bg-white/5 text-white rounded-lg 
                               hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg 
                               hover:bg-purple-600 transition-colors"
                    >
                      {goal ? 'Update' : 'Create'} Goal
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Main Budget Component
const Budget = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [budget, setBudget] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  useEffect(() => {
    fetchBudgetAndIncome();
  }, [selectedMonth]);

  const fetchBudgetAndIncome = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { start, end } = getMonthPeriod(selectedMonth);
      
      // Fetch budget data
      const budgetResponse = await api.get('/api/budgets/period', {
        params: {
          start: start.toISOString(),
          end: end.toISOString()
        }
      });

      if (budgetResponse.data.success) {
        setBudget(budgetResponse.data.data);
      } else {
        setError('Failed to load budget data');
        toast.error('Unable to load budget data');
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
      setError(error.message || 'Failed to load budget data');
      toast.error('Unable to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryUpdate = async (categoryData) => {
    try {
      setLoading(true);
      const { start, end } = getMonthPeriod(selectedMonth);
      
      const formattedCategory = {
        name: categoryData.name,
        plannedAmount: Number(categoryData.plannedAmount),
        notes: categoryData.notes || '',
        isRecurring: categoryData.isRecurring || false,
        spentAmount: selectedCategory?.spentAmount || 0
      };

      // Get current categories or initialize empty array
      const currentCategories = budget?.categories || [];
      
      // Remove existing category if editing, or check for duplicates if adding new
      const otherCategories = selectedCategory 
        ? currentCategories.filter(cat => cat.name !== selectedCategory.name)
        : currentCategories.filter(cat => cat.name !== formattedCategory.name);

      // Combine existing categories with new/updated category
      const updatedCategories = [...otherCategories, formattedCategory];

      // Calculate new total budget
      const totalBudget = updatedCategories.reduce(
        (sum, cat) => sum + Number(cat.plannedAmount),
        0
      );

      const response = await api.post('/api/budgets', {
        period: { start, end },
        categories: updatedCategories,
        totalBudget
      });

      if (response.data) {
        toast.success(selectedCategory ? 'Category updated successfully' : 'Category added successfully');
        await fetchBudgetAndIncome();
        setIsModalOpen(false);
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error(error.message || 'Failed to update budget');
    } finally {
      setLoading(false);
    }
  };

  const getMonthPeriod = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    try {
      setIsDeleting(true);
      const { start, end } = getMonthPeriod(selectedMonth);

      // Filter out the category to delete
      const updatedCategories = budget.categories.filter(
        cat => cat.name !== categoryToDelete.name
      );

      // Calculate new total budget
      const totalBudget = updatedCategories.reduce(
        (sum, cat) => sum + Number(cat.plannedAmount),
        0
      );

      const response = await api.post('/api/budgets', {
        period: { start, end },
        categories: updatedCategories,
        totalBudget
      });

      if (response.data) {
        toast.success(`${categoryToDelete.name} category deleted successfully`);
        await fetchBudgetAndIncome();
        setDeleteModal({ isOpen: false, category: null });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchSavingsGoals = async () => {
    try {
      const response = await api.get('/api/savings-goals');
      if (response.data.success) {
        setSavingsGoals(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching savings goals:', error);
      toast.error('Failed to load savings goals');
    }
  };

  useEffect(() => {
    fetchSavingsGoals();
  }, []);

  const handleSaveGoal = async (goalData) => {
    try {
      if (selectedGoal) {
        await api.put(`/api/savings-goals/${selectedGoal._id}`, goalData);
        toast.success('Savings goal updated successfully');
      } else {
        await api.post('/api/savings-goals', goalData);
        toast.success('Savings goal created successfully');
      }
      await fetchSavingsGoals();
      setIsGoalModalOpen(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error(error.message || 'Failed to save savings goal');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ArrowPathIcon className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Budget Planner</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="month"
                value={selectedMonth.toISOString().slice(0, 7)}
                onChange={(e) => setSelectedMonth(new Date(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 
                         text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setIsModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-purple-500 text-white 
                       rounded-xl hover:bg-purple-600 transition-colors"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Set Budget
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-red-400 bg-red-400/10 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <ArrowPathIcon className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : (
          /* Main Content */
          <>
            {!budget || budget.categories.length === 0 ? (
              <EmptyBudgetState 
                onCreateBudget={() => {
                  setSelectedCategory(null);
                  setIsModalOpen(true);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                  <BudgetOverview 
                    budget={budget}
                  />
                  <BudgetCategoryList 
                    categories={budget.categories}
                    onEditCategory={(category) => {
                      setSelectedCategory(category);
                      setIsModalOpen(true);
                    }}
                    onDeleteCategory={(category) => {
                      setDeleteModal({ isOpen: true, category });
                    }}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  <BudgetInsights budget={budget} />
                  <SavingsGoals 
                    goals={budget.savingsGoals || []}
                    onUpdateGoal={fetchBudgetAndIncome}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Add/Edit Budget Modal */}
        <AddEditBudgetModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          onSave={handleCategoryUpdate}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, category: null })}
          category={deleteModal.category}
          onConfirm={() => handleDeleteCategory(deleteModal.category)}
          isDeleting={isDeleting}
        />

        {/* Add/Edit Savings Goal Modal */}
        <AddEditSavingsGoalModal
          isOpen={isGoalModalOpen}
          onClose={() => {
            setIsGoalModalOpen(false);
            setSelectedGoal(null);
          }}
          goal={selectedGoal}
          onSave={handleSaveGoal}
        />
      </div>
    </div>
  );
};

export default Budget;