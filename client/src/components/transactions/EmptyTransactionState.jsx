import { CurrencyDollarIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const EmptyTransactionState = ({ onAddTransaction }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-slate-800/50 
                    rounded-xl border border-purple-500/20 p-8 text-center">
      <CurrencyDollarIcon className="w-16 h-16 text-purple-500/50 mb-4" />
      <h3 className="text-xl font-medium text-white mb-2">
        No Transactions Yet
      </h3>
      <p className="text-slate-400 mb-6 max-w-md">
        Start tracking your income and expenses by adding your first transaction. 
        Monitor your spending habits and stay on top of your finances.
      </p>
      <button
        onClick={onAddTransaction}
        className="flex items-center px-6 py-3 bg-purple-500 text-white 
                 rounded-xl hover:bg-purple-600 transition-colors duration-200"
      >
        <PlusCircleIcon className="w-5 h-5 mr-2" />
        Add Your First Transaction
      </button>
    </div>
  );
};

export default EmptyTransactionState; 