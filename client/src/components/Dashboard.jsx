import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { 
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Legend, Area, AreaChart
} from 'recharts';
import { 
  WalletIcon, 
  BanknotesIcon,
  ChartBarIcon,
  ChartPieIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  CircleStackIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  // Sample data
  const spendingData = [
    { month: 'Jan', expenses: 2400, income: 4000 },
    { month: 'Feb', expenses: 1398, income: 3000 },
    { month: 'Mar', expenses: 9800, income: 2000 },
  ];

  const categoryData = [
    { name: 'Groceries', value: 400, color: '#0088FE' },
    { name: 'Bills', value: 300, color: '#00C49F' },
    { name: 'Entertainment', value: 200, color: '#FFBB28' },
    { name: 'Transport', value: 100, color: '#FF8042' },
  ];

  // Animation springs
  const statsSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.gentle
  });

  const chartSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: config.gentle,
    delay: 300
  });

  const financialSummary = [
    {
      title: 'Total Balance',
      amount: 3024.00,
      change: '+$250 from last month',
      icon: WalletIcon,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: "Current Month's Spending",
      amount: 1290.00,
      change: '45% of monthly budget',
      icon: BanknotesIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Savings Progress',
      amount: 5000.00,
      change: '75% of goal reached',
      icon: CircleStackIcon,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Budget Status',
      amount: 2710.00,
      change: 'remaining this month',
      icon: ChartBarIcon,
      color: 'from-orange-500 to-amber-500'
    }
  ];

  return (
    <div className="flex-1 w-full bg-slate-900">
      <main className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Financial Summary Stats */}
          <animated.div 
            style={statsSpring}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {financialSummary.map((item, index) => {
              const props = useSpring({
                from: { 
                  value: 0,
                  rotation: 0 
                },
                to: { 
                  value: item.amount,
                  rotation: 360 
                },
                delay: index * 100,
                config: {
                  mass: 1,
                  tension: 20,
                  friction: 10
                }
              });

              return (
                <div 
                  key={index}
                  className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/10 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${item.color} bg-opacity-20`}>
                      <animated.div 
                        style={{
                          transform: props.rotation.to(r => `rotate(${r}deg)`)
                        }}
                      >
                        <item.icon className="w-6 h-6 text-white" />
                      </animated.div>
                    </div>
                  </div>
                  <h3 className="text-white/60 text-sm mb-2">{item.title}</h3>
                  <animated.div className="text-2xl font-bold text-white mb-1">
                    {props.value.to(val => `$${val.toFixed(2)}`)}
                  </animated.div>
                  <p className="text-sm text-purple-400">{item.change}</p>
                  {item.title === 'Savings Progress' && (
                    <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                      <animated.div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{
                          width: props.value.to(n => `${(n / 5000) * 100}%`)
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </animated.div>

          {/* Charts Section */}
          <animated.div
            style={chartSpring}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Income vs Expenses Chart */}
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center mb-4">
                <ArrowTrendingUpIcon className="w-8 h-8 text-purple-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Income vs Expenses</h2>
              </div>
              <div className="h-80">
                <ResponsiveContainer>
                  <AreaChart data={spendingData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#e9d5ff" />
                    <YAxis stroke="#e9d5ff" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(147, 51, 234, 0.2)',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="income" stroke="#a855f7" fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expenses" stroke="#ec4899" fillOpacity={1} fill="url(#colorExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Spending Breakdown */}
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center mb-4">
                <ChartPieIcon className="w-8 h-8 text-purple-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Spending Breakdown</h2>
              </div>
              <div className="h-80">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#colorGradient${index})`} 
                        />
                      ))}
                    </Pie>
                    <defs>
                      <linearGradient id="colorGradient0" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                      <linearGradient id="colorGradient1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                      <linearGradient id="colorGradient2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f43f5e" />
                      </linearGradient>
                      <linearGradient id="colorGradient3" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(147, 51, 234, 0.2)',
                        borderRadius: '0.5rem',
                        color: '#e9d5ff'
                      }}
                    />
                    <Legend 
                      formatter={(value) => <span style={{ color: '#e9d5ff' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </animated.div>

          {/* AI Predictions */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/10 p-6 mb-8">
            <div className="flex items-center mb-4">
              <SparklesIcon className="w-8 h-8 text-purple-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">AI Predictions</h2>
            </div>
            
            <div className="p-4 mb-3 border border-white/10 rounded-lg bg-white/10">
              <div className="flex items-center mb-2">
                <ArrowTrendingUpIcon className="w-6 h-6 text-purple-400 mr-2" />
                <span className="text-white/90">Forecasted Expenses for Next Month:</span>
                <span className="text-purple-400 font-bold ml-2">
                  $2,450
                </span>
              </div>
              
              <div className="flex items-center">
                <BanknotesIcon className="w-6 h-6 text-purple-400 mr-2" />
                <span className="text-white/90">Recommended Savings:</span>
                <span className="text-purple-400 font-bold ml-2">
                  $500
                </span>
              </div>
            </div>

            <div className="p-4 border border-white/10 rounded-lg bg-white/10">
              <p className="text-white/90">
                Based on your spending patterns, you could save more on entertainment expenses.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Add Transaction', 'Set Budget', 'Track Goals'].map((action, index) => (
              <animated.button
                key={action}
                className="p-4 backdrop-blur-lg bg-white/10 rounded-xl border border-white/10 
                           text-white font-medium hover:bg-purple-500/20 transition-all duration-300"
              >
                {action}
              </animated.button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;