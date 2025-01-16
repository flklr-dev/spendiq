import { Link } from 'react-router-dom';

const AuthHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 
                               bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  SpendIQ
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <a
                href="https://docs.spendiq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-purple-400 transition-colors duration-200"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AuthHeader; 