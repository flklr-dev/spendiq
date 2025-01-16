import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  BellIcon, 
  QuestionMarkCircleIcon, 
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const notifications = [
    { id: 1, message: "Monthly budget report is ready", time: "5m ago" },
    { id: 2, message: "New savings goal achieved!", time: "1h ago" },
    { id: 3, message: "Unusual spending detected", time: "2h ago" },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 border-b border-purple-500/20 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 
                           bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              SpendIQ
            </span>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Menu as="div" className="relative">
              <Menu.Button className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 
                                   border border-purple-500/20 hover:border-purple-500/40
                                   focus:outline-none transition-all duration-300">
                <BellIcon className="h-6 w-6 text-purple-400" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl 
                                    bg-slate-800/90 backdrop-blur-xl shadow-xl z-50
                                    ring-1 ring-purple-500/20 border border-purple-500/20">
                  <div className="py-1">
                    {notifications.map((notification) => (
                      <Menu.Item key={notification.id}>
                        {({ active }) => (
                          <div className={`px-4 py-3 ${
                            active ? 'bg-purple-500/10' : ''
                          } transition-colors duration-200`}>
                            <p className="text-sm text-slate-300">{notification.message}</p>
                            <p className="text-xs text-purple-400">{notification.time}</p>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Help */}
            <button className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 
                             border border-purple-500/20 hover:border-purple-500/40
                             transition-all duration-300">
              <QuestionMarkCircleIcon className="h-6 w-6 text-purple-400" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 p-2 rounded-xl 
                                   bg-purple-500/10 hover:bg-purple-500/20 
                                   border border-purple-500/20 hover:border-purple-500/40
                                   transition-all duration-300">
                <UserCircleIcon className="h-6 w-6 text-purple-400" />
                <span className="text-sm text-slate-300">{user?.name || 'User'}</span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl 
                                    bg-slate-800/90 backdrop-blur-xl shadow-xl z-50
                                    ring-1 ring-purple-500/20 border border-purple-500/20">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/settings"
                          className={`${
                            active ? 'bg-purple-500/10' : ''
                          } flex items-center px-4 py-2 text-sm text-slate-300 
                             hover:text-purple-400 transition-colors duration-200`}
                        >
                          <Cog6ToothIcon className="h-5 w-5 mr-2 text-purple-500" />
                          Settings
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-purple-500/10' : ''
                          } flex items-center px-4 py-2 text-sm text-slate-300 w-full
                             hover:text-purple-400 transition-colors duration-200`}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-purple-500" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}