import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  FlagIcon, 
  ChartPieIcon, 
  SparklesIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const navigation = [
    { name: 'Dashboard', icon: HomeIcon, path: '/' },
    { name: 'Transactions', icon: CurrencyDollarIcon, path: '/transactions' },
    { name: 'Budget', icon: ChartBarIcon, path: '/budget' },
    { name: 'Savings Goals', icon: FlagIcon, path: '/savings-goals' },
    { name: 'Reports', icon: ChartPieIcon, path: '/reports' },
    { name: 'AI Insights', icon: SparklesIcon, path: '/insights' },
    { name: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
  ];

  return (
    <nav className="bg-slate-900 backdrop-blur-xl relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide py-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                relative group px-4 py-3 rounded-xl
                transition-all duration-300 ease-in-out
                ${isActive 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white' 
                  : 'text-slate-400 hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Glowing background effect */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl
                               blur-xl transition-all duration-300"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  
                  {/* Content */}
                  <div className="relative flex items-center space-x-2">
                    <item.icon className={`h-5 w-5 transition-colors duration-300
                      ${isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'}`} 
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>

                  {/* Bottom gradient line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full
                    transition-all duration-300 transform origin-left
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-x-100' 
                      : 'bg-purple-500/0 scale-x-0 group-hover:scale-x-100 group-hover:bg-gradient-to-r group-hover:from-purple-500/50 group-hover:to-pink-500/50'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}