import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  PlusCircleIcon, 
  XMarkIcon,
  SparklesIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useSpring, animated } from '@react-spring/web';

const SavingsGoals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Sample data - replace with actual data from your backend
  const [goals] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      targetAmount: 10000,
      savedAmount: 6500,
      deadline: "2024-12-31",
      category: "Emergency",
      monthlyContribution: 500,
      contributions: [
        { date: "2024-03-01", amount: 500 },
        { date: "2024-02-01", amount: 500 },
      ],
      notes: "Building 6-month emergency fund"
    },
    {
      id: 2,
      name: "Dream Vacation",
      targetAmount: 5000,
      savedAmount: 2000,
      deadline: "2024-08-31",
      category: "Travel",
      monthlyContribution: 400,
      contributions: [
        { date: "2024-03-01", amount: 400 },
        { date: "2024-02-01", amount: 400 },
      ],
      notes: "Trip to Japan"
    }
  ]);

  // Calculate total savings and progress
  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = (totalSaved / totalTarget) * 100;

  // Animation for progress bars
  const progressSpring = useSpring({
    width: `${overallProgress}%`,
    from: { width: '0%' }
  });

  return (
    <div className="flex-1 w-full bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Savings Goals</h1>
          <button
            onClick={() => {
              setSelectedGoal(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-xl 
                     hover:bg-purple-600 transition-colors"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            New Goal
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center mb-4">
              <BanknotesIcon className="w-8 h-8 text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Total Saved</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">${totalSaved.toFixed(2)}</p>
            <p className="text-sm text-purple-400">
              {((totalSaved / totalTarget) * 100).toFixed(1)}% of total goals
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center mb-4">
              <TrophyIcon className="w-8 h-8 text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Active Goals</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{goals.length}</p>
            <p className="text-sm text-purple-400">
              ${(totalTarget - totalSaved).toFixed(2)} remaining
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="w-8 h-8 text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Monthly Target</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              ${goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0).toFixed(2)}
            </p>
            <p className="text-sm text-purple-400">Combined monthly goal</p>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-6 mb-8">
          {goals.map(goal => {
            const progress = (goal.savedAmount / goal.targetAmount) * 100;
            const remainingAmount = goal.targetAmount - goal.savedAmount;
            const daysUntilDeadline = Math.ceil(
              (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div key={goal.id} className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{goal.name}</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsQuickAddOpen(true)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Quick Add
                    </button>
                    <button
                      onClick={() => {
                        setSelectedGoal(goal);
                        setIsModalOpen(true);
                      }}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-white/60 mb-1">Target Amount</p>
                    <p className="text-lg font-semibold text-white">
                      ${goal.targetAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60 mb-1">Saved Amount</p>
                    <p className="text-lg font-semibold text-green-400">
                      ${goal.savedAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60 mb-1">Remaining</p>
                    <p className="text-lg font-semibold text-purple-400">
                      ${remainingAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Progress</span>
                    <span className="text-purple-400">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <animated.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{
                        width: `${progress}%`
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-white/60">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {daysUntilDeadline} days remaining
                  </div>
                  <div className="flex items-center text-white/60">
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                    ${goal.monthlyContribution}/month
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Insights Section */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center mb-6">
            <SparklesIcon className="w-8 h-8 text-purple-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Savings Insights</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <h3 className="text-lg font-medium text-white mb-2">On Track</h3>
              <p className="text-white/60">
                You're consistently meeting your monthly savings targets. Keep it up!
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Recommendation</h3>
              <p className="text-white/60">
                Consider increasing your emergency fund contribution by $100/month to reach your goal faster.
              </p>
            </div>
          </div>
        </div>

        {/* Add/Edit Goal Modal */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-lg w-full rounded-2xl bg-slate-800 border border-white/10">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <Dialog.Title className="text-xl font-semibold text-white">
                  {selectedGoal ? 'Edit Savings Goal' : 'Create New Savings Goal'}
                </Dialog.Title>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form className="p-6 space-y-4">
                {/* Form fields go here */}
                <div className="space-y-2">
                  <label className="block text-sm text-white/60">Goal Name</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                             outline-none focus:border-purple-500 transition-colors"
                    placeholder="Enter goal name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm text-white/60">Target Amount</label>
                    <input
                      type="number"
                      className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                               outline-none focus:border-purple-500 transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm text-white/60">Monthly Contribution</label>
                    <input
                      type="number"
                      className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                               outline-none focus:border-purple-500 transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/60">Target Date</label>
                  <input
                    type="date"
                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                             outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/60">Category</label>
                  <select
                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                             outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="emergency" className="bg-slate-800">Emergency Fund</option>
                    <option value="travel" className="bg-slate-800">Travel</option>
                    <option value="education" className="bg-slate-800">Education</option>
                    <option value="home" className="bg-slate-800">Home</option>
                    <option value="other" className="bg-slate-800">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/60">Notes (Optional)</label>
                  <textarea
                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                             outline-none focus:border-purple-500 transition-colors"
                    rows="3"
                    placeholder="Add any additional notes..."
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
                    {selectedGoal ? 'Update Goal' : 'Create Goal'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Quick Add Contribution Modal */}
        <Dialog 
          open={isQuickAddOpen} 
          onClose={() => setIsQuickAddOpen(false)} 
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm w-full rounded-2xl bg-slate-800 border border-white/10">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <Dialog.Title className="text-xl font-semibold text-white">
                  Add Contribution
                </Dialog.Title>
                <button
                  onClick={() => setIsQuickAddOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm text-white/60">Amount</label>
                  <input
                    type="number"
                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                             outline-none focus:border-purple-500 transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/60">Date</label>
                  <input
                    type="date"
                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                             outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsQuickAddOpen(false)}
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
                    Add Contribution
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default SavingsGoals; 