import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  ArrowDownIcon, 
  ArrowUpIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  ChartPieIcon,
  ChartBarIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Reports = () => {
  // State for date range filter
  const [dateRange, setDateRange] = useState('monthly');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

  // Sample data - replace with actual data from your backend
  const financialData = {
    totalIncome: 5000,
    totalExpenses: 3500,
    netSavings: 1500,
    savingsRate: 30,
    healthScore: 85,
    monthlyData: [
      { month: 'Jan', income: 5000, expenses: 3500 },
      { month: 'Feb', income: 5200, expenses: 3700 },
      { month: 'Mar', income: 4800, expenses: 3400 },
    ],
    expenseCategories: [
      { name: 'Housing', value: 1500, color: '#8B5CF6' },
      { name: 'Food', value: 600, color: '#EC4899' },
      { name: 'Transportation', value: 400, color: '#6366F1' },
      { name: 'Entertainment', value: 300, color: '#14B8A6' },
      { name: 'Utilities', value: 200, color: '#F59E0B' },
    ],
    transactions: [
      { id: 1, date: '2024-03-15', category: 'Housing', description: 'Rent', amount: 1500, type: 'expense' },
      { id: 2, date: '2024-03-14', category: 'Food', description: 'Groceries', amount: 150, type: 'expense' },
      { id: 3, date: '2024-03-13', category: 'Income', description: 'Salary', amount: 5000, type: 'income' },
    ],
    savingsGoals: [
      { name: 'Emergency Fund', target: 10000, current: 6000 },
      { name: 'Vacation', target: 5000, current: 2000 },
    ]
  };

  return (
    <div className="flex-1 w-full bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Financial Reports</h1>
          
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white 
                       focus:outline-none focus:border-purple-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="custom">Custom Range</option>
            </select>

            <button
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-xl 
                       hover:bg-purple-600 transition-colors"
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Total Income</p>
                <p className="text-2xl font-bold text-white">
                  ${financialData.totalIncome.toFixed(2)}
                </p>
              </div>
              <ArrowUpIcon className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-white">
                  ${financialData.totalExpenses.toFixed(2)}
                </p>
              </div>
              <ArrowDownIcon className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Net Savings</p>
                <p className="text-2xl font-bold text-green-400">
                  ${financialData.netSavings.toFixed(2)}
                </p>
              </div>
              <BanknotesIcon className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Savings Rate</p>
                <p className="text-2xl font-bold text-purple-400">
                  {financialData.savingsRate}%
                </p>
              </div>
              <ArrowTrendingUpIcon className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Income vs Expenses Chart */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Income vs Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financialData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1b4b', 
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Bar dataKey="income" fill="#8B5CF6" name="Income" />
                <Bar dataKey="expenses" fill="#EC4899" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Expense Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financialData.expenseCategories}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {financialData.expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1b4b', 
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-white/60 border-b border-white/10">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Type</th>
                </tr>
              </thead>
              <tbody>
                {financialData.transactions.map((transaction) => (
                  <tr 
                    key={transaction.id} 
                    className="border-b border-white/10 text-white hover:bg-white/5"
                  >
                    <td className="py-3 px-4">{transaction.date}</td>
                    <td className="py-3 px-4">{transaction.category}</td>
                    <td className="py-3 px-4">{transaction.description}</td>
                    <td className={`py-3 px-4 text-right ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        transaction.type === 'income' 
                          ? 'bg-green-400/10 text-green-400' 
                          : 'bg-red-400/10 text-red-400'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Savings Goals Progress */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Savings Goals Progress</h2>
          <div className="space-y-6">
            {financialData.savingsGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <div key={goal.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white">{goal.name}</span>
                    <span className="text-purple-400">
                      ${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Health Score */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Financial Health Score</h2>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-white">{financialData.healthScore}</p>
              <p className="text-sm text-white/60">Your financial health is good!</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60 mb-2">Recommendations:</p>
              <ul className="text-sm text-purple-400 space-y-1">
                <li>• Consider increasing emergency fund</li>
                <li>• Review subscription services</li>
                <li>• Look for ways to boost income</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 