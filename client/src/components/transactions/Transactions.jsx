import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowDownTrayIcon,
  PlusCircleIcon,
  CalendarIcon,
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import AddEditTransactionModal from '../transactions/AddEditTransactionModal';
import TransactionInsights from '../transactions/TransactionInsights';
import { toast } from 'react-hot-toast';
import EmptyTransactionState from './EmptyTransactionState';
import AddIncomeModal from './AddIncomeModal';
import DeleteTransactionModal from './DeleteTransactionModal';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    'All Categories',
    'Groceries',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Income',
    'Shopping',
    'Restaurant',
    'Healthcare'
  ];

  const paymentMethods = [
    'All Methods',
    'Credit Card',
    'Debit Card',
    'Cash',
    'Bank Transfer',
    'Mobile Payment'
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [filters, setFilters] = useState({
    dateRange: '30',
    category: 'all categories',
    paymentMethod: 'all methods',
    search: ''
  });
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, transaction: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data);
        setFilteredTransactions(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError(error.message);
      toast.error('Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle transaction save (create/update)
  const handleSaveTransaction = async (transactionData) => {
    try {
      // Log the data being sent to help debug
      console.log('Sending transaction data:', transactionData);

      const endpoint = transactionData.type === 'income' 
        ? '/api/transactions/income'
        : '/api/transactions/expense';

      // Use import.meta.env instead of process.env
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: transactionData.amount,
          description: transactionData.description,
          category: transactionData.category,
          paymentMethod: transactionData.paymentMethod,
          date: transactionData.date,
          recurring: {
            isRecurring: transactionData.recurring?.isRecurring || false,
            frequency: transactionData.recurring?.isRecurring ? 'monthly' : null
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save transaction');
      }

      if (data.success) {
        await fetchTransactions();
        toast.success(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error(error.message || 'Failed to save transaction');
      throw error;
    }
  };

  // Handle transaction deletion
  const handleDeleteTransaction = async (transaction) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`http://localhost:5000/api/transactions/${transaction._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        await fetchTransactions();
        toast.success(`${transaction.amount >= 0 ? 'Income' : 'Expense'} deleted successfully`);
        setDeleteModal({ isOpen: false, transaction: null });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error(error.message || 'Failed to delete transaction');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle filtering
  useEffect(() => {
    let result = [...transactions];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(t => 
        t.description.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category !== 'all categories') {
      result = result.filter(t => t.category.toLowerCase() === filters.category);
    }

    // Apply payment method filter
    if (filters.paymentMethod !== 'all methods') {
      result = result.filter(t => t.paymentMethod.toLowerCase() === filters.paymentMethod);
    }

    // Apply date range filter
    const today = new Date();
    const daysAgo = new Date(today.setDate(today.getDate() - parseInt(filters.dateRange)));
    result = result.filter(t => new Date(t.date) >= daysAgo);

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortConfig.key === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortConfig.key === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else {
        comparison = a[sortConfig.key].localeCompare(b[sortConfig.key]);
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    setFilteredTransactions(result);
  }, [filters, sortConfig, transactions]);

  // Export transactions
  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Description', 'Category', 'Amount', 'Payment Method'],
      ...filteredTransactions.map(t => [
        format(new Date(t.date), 'yyyy-MM-dd'),
        t.description,
        t.category,
        t.amount,
        t.paymentMethod
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 w-full bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <div className="flex gap-3">
            {transactions.length > 0 && (
              <button 
                onClick={exportTransactions}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 
                         hover:bg-white/20 text-white rounded-xl transition-colors duration-200"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Export
              </button>
            )}
            <button 
              onClick={() => setIsIncomeModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 
                       hover:bg-green-600 text-white rounded-xl transition-colors duration-200"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Add Income
            </button>
            <button 
              onClick={() => {
                setSelectedTransaction(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 
                       hover:bg-purple-600 text-white rounded-xl transition-colors duration-200"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Add Expense
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-8">{error}</div>
        ) : transactions.length === 0 ? (
          <EmptyTransactionState 
            onAddTransaction={() => {
              setSelectedTransaction(null);
              setIsModalOpen(true);
            }} 
          />
        ) : (
          <>
            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Date Range */}
              <div className="relative">
                <div className="flex items-center p-3 bg-white/10 rounded-xl border border-white/10">
                  <CalendarIcon className="w-5 h-5 text-purple-400 mr-2" />
                  <select 
                    className="w-full bg-transparent text-white outline-none appearance-none cursor-pointer"
                    onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                    value={filters.dateRange}
                  >
                    <option value="7" className="bg-slate-800">Last 7 Days</option>
                    <option value="30" className="bg-slate-800">Last 30 Days</option>
                    <option value="90" className="bg-slate-800">Last 90 Days</option>
                    <option value="custom" className="bg-slate-800">Custom Range</option>
                  </select>
                  <ChevronDownIcon className="w-5 h-5 text-purple-400" />
                </div>
              </div>

              {/* Category Filter */}
              <div className="relative">
                <div className="flex items-center p-3 bg-white/10 rounded-xl border border-white/10">
                  <FunnelIcon className="w-5 h-5 text-purple-400 mr-2" />
                  <select 
                    className="w-full bg-transparent text-white outline-none appearance-none cursor-pointer"
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    value={filters.category}
                  >
                    {categories.map(category => (
                      <option key={category} value={category.toLowerCase()} className="bg-slate-800">
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-5 h-5 text-purple-400" />
                </div>
              </div>

              {/* Payment Method Filter */}
              <div className="relative">
                <div className="flex items-center p-3 bg-white/10 rounded-xl border border-white/10">
                  <FunnelIcon className="w-5 h-5 text-purple-400 mr-2" />
                  <select 
                    className="w-full bg-transparent text-white outline-none appearance-none cursor-pointer"
                    onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                    value={filters.paymentMethod}
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method.toLowerCase()} className="bg-slate-800">
                        {method}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-5 h-5 text-purple-400" />
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <div className="flex items-center p-3 bg-white/10 rounded-xl border border-white/10">
                  <MagnifyingGlassIcon className="w-5 h-5 text-purple-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full bg-transparent text-white placeholder-white/60 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Transaction Insights */}
            <div className="mb-8">
              <TransactionInsights transactions={filteredTransactions} />
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {[
                      { key: 'date', label: 'Date' },
                      { key: 'description', label: 'Description' },
                      { key: 'category', label: 'Category' },
                      { key: 'amount', label: 'Amount' },
                      { key: 'paymentMethod', label: 'Payment Method' }
                    ].map(({ key, label }) => (
                      <th 
                        key={key}
                        onClick={() => handleSort(key)}
                        className="px-6 py-3 text-left text-sm font-semibold text-white cursor-pointer 
                                 hover:text-purple-400 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {label}
                          {sortConfig.key === key && (
                            sortConfig.direction === 'asc' ? 
                              <ArrowUpIcon className="w-4 h-4" /> : 
                              <ArrowDownIcon className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right text-sm font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredTransactions.map((transaction) => (
                    <tr 
                      key={transaction._id}
                      className="hover:bg-white/5 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm text-white">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                          {transaction.category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-medium ${
                        transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.amount >= 0 ? '+' : ''}
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {transaction.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <button 
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setIsModalOpen(true);
                          }}
                          className="text-purple-400 hover:text-purple-300 mr-3"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setDeleteModal({ 
                            isOpen: true, 
                            transaction: transaction 
                          })}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-white">
                Showing 1 to 10 of 50 entries
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm text-white bg-white/10 rounded-lg hover:bg-white/20">
                  Previous
                </button>
                <button className="px-4 py-2 text-sm text-white bg-purple-500 rounded-lg hover:bg-purple-600">
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Add Income Modal */}
        <AddIncomeModal
          isOpen={isIncomeModalOpen}
          onClose={() => setIsIncomeModalOpen(false)}
          onSave={handleSaveTransaction}
        />

        {/* Expense Modal */}
        <AddEditTransactionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
          onSave={handleSaveTransaction}
        />

        {/* Delete Transaction Modal */}
        <DeleteTransactionModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, transaction: null })}
          transaction={deleteModal.transaction}
          onConfirm={() => handleDeleteTransaction(deleteModal.transaction)}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default Transactions;