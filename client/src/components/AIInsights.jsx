import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  SparklesIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ChartPieIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AIInsights = () => {
  const [dateRange, setDateRange] = useState('monthly');
  const [selectedInsight, setSelectedInsight] = useState(null);

  // Sample data - replace with actual AI-generated insights from your backend
  const insightsData = {
    financialHealth: {
      score: 78,
      status: 'Good',
      trend: 'improving',
      recommendations: [
        'Increase emergency fund by $200/month',
        'Review subscription services',
        'Consider debt consolidation'
      ]
    },
    spendingPatterns: {
      topCategories: [
        { category: 'Dining', amount: 450, trend: 'increasing', status: 'warning' },
        { category: 'Shopping', amount: 320, trend: 'stable', status: 'normal' },
        { category: 'Entertainment', amount: 280, trend: 'decreasing', status: 'good' }
      ],
      unusualSpending: [
        { category: 'Dining', amount: 450, difference: 150, date: '2024-03-15' }
      ]
    },
    savingsInsights: {
      currentRate: 15,
      recommended: 20,
      projectedSavings: [
        { month: 'Jan', current: 5000, projected: 5500 },
        { month: 'Feb', current: 5500, projected: 6100 },
        { month: 'Mar', current: 6100, projected: 6800 }
      ]
    },
    budgetOptimization: {
      recommendations: [
        { category: 'Dining', current: 500, suggested: 400, savings: 100 },
        { category: 'Entertainment', current: 300, suggested: 250, savings: 50 }
      ]
    },
    upcomingExpenses: [
      { name: 'Annual Insurance', amount: 1200, dueDate: '2024-04-15' },
      { name: 'Car Maintenance', amount: 300, dueDate: '2024-04-01' }
    ]
  };

  return (
    <div className="flex-1 w-full bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">AI Financial Insights</h1>
            <p className="text-white/60">
              Personalized financial recommendations powered by AI
            </p>
          </div>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white 
                     focus:outline-none focus:border-purple-500"
          >
            <option value="weekly">Last Week</option>
            <option value="monthly">Last Month</option>
            <option value="quarterly">Last Quarter</option>
            <option value="yearly">Last Year</option>
          </select>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center mb-4">
              <SparklesIcon className="w-8 h-8 text-purple-400 mr-2" />
              <h2 className="text-lg font-semibold text-white">Financial Health Score</h2>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{insightsData.financialHealth.score}</p>
            <p className="text-sm text-purple-400">Your financial health is {insightsData.financialHealth.status}</p>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center mb-4">
              <ExclamationCircleIcon className="w-8 h-8 text-yellow-400 mr-2" />
              <h2 className="text-lg font-semibold text-white">Alert</h2>
            </div>
            <p className="text-white/80">Dining expenses exceeded budget by $150 this month</p>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center mb-4">
              <LightBulbIcon className="w-8 h-8 text-green-400 mr-2" />
              <h2 className="text-lg font-semibold text-white">Opportunity</h2>
            </div>
            <p className="text-white/80">You could save $150/month by optimizing subscriptions</p>
          </div>
        </div>

        {/* Main Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Spending Patterns */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Spending Patterns</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={insightsData.savingsInsights.projectedSavings}>
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
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF680" 
                  name="Current"
                />
                <Area 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="#EC4899" 
                  fill="#EC489980" 
                  name="Projected"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Budget Optimization */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Budget Optimization</h2>
            <div className="space-y-4">
              {insightsData.budgetOptimization.recommendations.map((rec) => (
                <div key={rec.category} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-white">{rec.category}</span>
                    <span className="text-green-400">Save ${rec.savings}/month</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${(rec.suggested / rec.current) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-white/60">Current: ${rec.current}</span>
                    <span className="text-white/60">Suggested: ${rec.suggested}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Financial Recommendations */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Recommendations</h2>
            <div className="space-y-4">
              {insightsData.financialHealth.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <LightBulbIcon className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white/80">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Expenses */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Upcoming Expenses</h2>
            <div className="space-y-4">
              {insightsData.upcomingExpenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">{expense.name}</p>
                    <p className="text-sm text-white/60">Due: {expense.dueDate}</p>
                  </div>
                  <span className="text-purple-400 font-medium">${expense.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Spending Categories */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Top Spending Categories</h2>
            <div className="space-y-4">
              {insightsData.spendingPatterns.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">{category.category}</p>
                    <p className="text-sm text-white/60">Trend: {category.trend}</p>
                  </div>
                  <span className={`font-medium ${
                    category.status === 'warning' ? 'text-red-400' : 
                    category.status === 'good' ? 'text-green-400' : 'text-purple-400'
                  }`}>
                    ${category.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/20 p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Ready to Optimize Your Finances?</h2>
              <p className="text-white/80 mb-4">
                Take action on these insights to improve your financial health.
              </p>
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 
                                 transition-colors">
                  Adjust Budget
                </button>
                <button className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 
                                 transition-colors">
                  View Goals
                </button>
              </div>
            </div>
            <SparklesIcon className="w-16 h-16 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights; 