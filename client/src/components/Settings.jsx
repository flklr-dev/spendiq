import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  UserCircleIcon,
  BellIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  CreditCardIcon,
  XMarkIcon,
  ArrowPathIcon,
  CloudArrowDownIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  // State for various settings
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    avatar: null
  });

  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    paymentReminders: true,
    savingsMilestones: true,
    weeklyReports: false,
    marketingEmails: false
  });

  const [preferences, setPreferences] = useState({
    defaultBudgetPeriod: 'monthly',
    currency: 'USD',
    theme: 'dark',
    language: 'en'
  });

  const [security, setSecurity] = useState({
    mfaEnabled: false,
    dataEncrypted: true,
    dataSharing: true
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('account');

  // Custom categories management
  const [categories, setCategories] = useState([
    { id: 1, name: 'Groceries', icon: '🛒' },
    { id: 2, name: 'Transportation', icon: '🚗' },
    { id: 3, name: 'Entertainment', icon: '🎬' }
  ]);

  const [newCategory, setNewCategory] = useState({ name: '', icon: '' });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Implement profile update logic
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Implement password change logic
    setIsPasswordModalOpen(false);
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCategoryAdd = () => {
    if (newCategory.name && newCategory.icon) {
      setCategories(prev => [...prev, { 
        id: Date.now(), 
        name: newCategory.name, 
        icon: newCategory.icon 
      }]);
      setNewCategory({ name: '', icon: '' });
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

        {/* Settings Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <nav className="space-y-2">
                {[
                  { id: 'account', name: 'Account', icon: UserCircleIcon },
                  { id: 'notifications', name: 'Notifications', icon: BellIcon },
                  { id: 'preferences', name: 'Preferences', icon: CurrencyDollarIcon },
                  { id: 'security', name: 'Security', icon: ShieldCheckIcon }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === item.id 
                        ? 'bg-purple-500 text-white' 
                        : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Account Settings</h2>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <UserCircleIcon className="w-12 h-12 text-purple-400" />
                      </div>
                      <button className="absolute bottom-0 right-0 p-1 bg-purple-500 rounded-full text-white">
                        <ArrowPathIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Profile Picture</h3>
                      <p className="text-sm text-white/60">
                        JPG, GIF or PNG. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm text-white/60">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                                 outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm text-white/60">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                                 outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm text-white/60">Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                                 outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm text-white/60">Password</label>
                      <button
                        type="button"
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white/60 
                                 text-left hover:border-purple-500 transition-colors"
                      >
                        Change password
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 
                               transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Notification Settings</h2>
                
                <div className="space-y-6">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-sm text-white/60">
                          Receive notifications about {key.toLowerCase()}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleNotificationToggle(key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer 
                                    peer-checked:after:translate-x-full peer-checked:after:border-white 
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                    after:bg-white after:rounded-full after:h-5 after:w-5 
                                    after:transition-all peer-checked:bg-purple-500">
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences Settings */}
            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">General Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm text-white/60">Default Budget Period</label>
                      <select
                        value={preferences.defaultBudgetPeriod}
                        onChange={(e) => setPreferences({ 
                          ...preferences, 
                          defaultBudgetPeriod: e.target.value 
                        })}
                        className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                                 outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="weekly" className="bg-slate-800">Weekly</option>
                        <option value="biweekly" className="bg-slate-800">Bi-weekly</option>
                        <option value="monthly" className="bg-slate-800">Monthly</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm text-white/60">Currency</label>
                      <select
                        value={preferences.currency}
                        onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                        className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                                 outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="USD" className="bg-slate-800">USD ($)</option>
                        <option value="EUR" className="bg-slate-800">EUR (€)</option>
                        <option value="GBP" className="bg-slate-800">GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Custom Categories</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm text-white/60">Category Name</label>
                        <input
                          type="text"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                          className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                                   outline-none focus:border-purple-500 transition-colors"
                          placeholder="Enter category name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm text-white/60">Icon (emoji)</label>
                        <input
                          type="text"
                          value={newCategory.icon}
                          onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                          className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                                   outline-none focus:border-purple-500 transition-colors"
                          placeholder="Enter emoji"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCategoryAdd}
                      className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 
                               transition-colors"
                    >
                      Add Category
                    </button>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {categories.map((category) => (
                        <div 
                          key={category.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{category.icon}</span>
                            <span className="text-white">{category.name}</span>
                          </div>
                          <button
                            onClick={() => setCategories(
                              categories.filter(cat => cat.id !== category.id)
                            )}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-white/60">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.mfaEnabled}
                          onChange={() => setSecurity({ 
                            ...security, 
                            mfaEnabled: !security.mfaEnabled 
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer 
                                    peer-checked:after:translate-x-full peer-checked:after:border-white 
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                    after:bg-white after:rounded-full after:h-5 after:w-5 
                                    after:transition-all peer-checked:bg-purple-500">
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Data Encryption</h3>
                        <p className="text-sm text-white/60">
                          Your financial data is encrypted and secure
                        </p>
                      </div>
                      <ShieldCheckIcon className="w-6 h-6 text-green-400" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Data Sharing</h3>
                        <p className="text-sm text-white/60">
                          Allow data sharing for personalized insights
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.dataSharing}
                          onChange={() => setSecurity({ 
                            ...security, 
                            dataSharing: !security.dataSharing 
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer 
                                    peer-checked:after:translate-x-full peer-checked:after:border-white 
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                    after:bg-white after:rounded-full after:h-5 after:w-5 
                                    after:transition-all peer-checked:bg-purple-500">
                        </div>
                      </label>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-medium mb-4">Account Actions</h3>
                      <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 bg-white/5 
                                       rounded-xl hover:bg-white/10 transition-colors">
                          <div className="flex items-center space-x-3">
                            <CloudArrowDownIcon className="w-5 h-5 text-purple-400" />
                            <span className="text-white">Export Account Data</span>
                          </div>
                          <ArrowPathIcon className="w-5 h-5 text-white/60" />
                        </button>

                        <button className="w-full flex items-center justify-between p-4 bg-red-500/10 
                                       rounded-xl hover:bg-red-500/20 transition-colors">
                          <div className="flex items-center space-x-3">
                            <TrashIcon className="w-5 h-5 text-red-400" />
                            <span className="text-red-400">Delete Account</span>
                          </div>
                          <ArrowPathIcon className="w-5 h-5 text-red-400/60" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Dialog 
        open={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full rounded-2xl bg-slate-800 border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <Dialog.Title className="text-xl font-semibold text-white">
                Change Password
              </Dialog.Title>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm text-white/60">Current Password</label>
                <input
                  type="password"
                  className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                           outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-white/60">New Password</label>
                <input
                  type="password"
                  className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                           outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-white/60">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white 
                           outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
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
                  Update Password
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Settings; 