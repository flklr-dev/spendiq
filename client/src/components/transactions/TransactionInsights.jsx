import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const TransactionInsights = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return null;
  }

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));

  // Calculate category spending
  const categorySpending = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const pieData = Object.entries(categorySpending)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Transaction Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white/5 rounded-xl">
          <p className="text-sm text-white/60 mb-1">Total Income</p>
          <p className="text-2xl font-bold text-green-400">
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        
        <div className="p-4 bg-white/5 rounded-xl">
          <p className="text-sm text-white/60 mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-400">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>
        
        <div className="p-4 bg-white/5 rounded-xl">
          <p className="text-sm text-white/60 mb-1">Net Balance</p>
          <p className={`text-2xl font-bold ${
            totalIncome - totalExpenses >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            ${(totalIncome - totalExpenses).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="h-64">
        <h3 className="text-lg font-medium text-white mb-4">Top Spending Categories</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionInsights; 