



// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { DollarSign, ShoppingCart, Trash2, Edit } from 'lucide-react';
// import { useTransactions } from '../contexts/TransactionContext';

// const TransactionList = ({ type }) => {
//   const { transactions, deleteTransaction, editTransaction, searchTransactions, filterTransactions } = useTransactions();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [editingTransaction, setEditingTransaction] = useState(null);

//   const handleDelete = (id) => {
//     deleteTransaction(id, type);
//   };

//   const handleEdit = (transaction) => {
//     setEditingTransaction(transaction);
//   };

//   const handleUpdate = (e) => {
//     e.preventDefault();
//     editTransaction(editingTransaction._id, editingTransaction);
//     setEditingTransaction(null);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditingTransaction(prev => ({ ...prev, [name]: value }));
//   };

//   const filteredTransactions = filterTransactions(type, selectedCategory);
//   const searchedTransactions = searchTransactions(searchQuery, type);
//   const displayedTransactions = searchQuery ? searchedTransactions : filteredTransactions;

//   return (
//     <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
//       <h3 className="text-xl font-semibold mb-4 text-white">Recent {type === 'expense' ? 'Expenses' : 'Income'}</h3>
//       <div className="mb-4 flex space-x-4">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
//         />
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="px-3 py-2 bg-gray-700 text-white rounded-md"
//         >
//           <option value="All">All Categories</option>
//           {/* Add your categories here */}
//         </select>
//       </div>
//       {displayedTransactions.length === 0 ? (
//         <p className="text-gray-400">No transactions to display.</p>
//       ) : (
//         <ul className="space-y-4">
//           {displayedTransactions.map((transaction) => (
//             <motion.li
//               key={transaction._id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className={`flex items-center justify-between p-4 rounded-lg ${
//                 type === 'expense' ? 'bg-red-500 bg-opacity-20' : 'bg-green-500 bg-opacity-20'
//               }`}
//             >
//               {editingTransaction && editingTransaction._id === transaction._id ? (
//                 <form onSubmit={handleUpdate} className="w-full">
//                   <input
//                     type="text"
//                     name="name"
//                     value={editingTransaction.name}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 mb-2 bg-gray-700 text-white rounded-md"
//                   />
//                   <input
//                     type="number"
//                     name="amount"
//                     value={editingTransaction.amount}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 mb-2 bg-gray-700 text-white rounded-md"
//                   />
//                   <select
//                     name="category"
//                     value={editingTransaction.category}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 mb-2 bg-gray-700 text-white rounded-md"
//                   >
//                     {/* Add your categories here */}
//                   </select>
//                   <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
//                   <button onClick={() => setEditingTransaction(null)} className="px-4 py-2 ml-2 bg-gray-500 text-white rounded-md">Cancel</button>
//                 </form>
//               ) : (
//                 <>
//                   <div className="flex items-center">
//                     {type === 'expense' ? (
//                       <ShoppingCart className="w-6 h-6 mr-3 text-red-400" />
//                     ) : (
//                       <DollarSign className="w-6 h-6 mr-3 text-green-400" />
//                     )}
//                     <div>
//                       <p className="font-semibold text-white">{transaction.name}</p>
//                       <p className="text-sm text-gray-300">{transaction.category}</p>
//                       {transaction.referral && (
//                         <p className="text-xs text-gray-400">Ref: {transaction.referral}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="text-right mr-4">
//                       <p className={`font-bold ${type === 'expense' ? 'text-red-400' : 'text-green-400'}`}>
//                         {type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
//                       </p>
//                       <p className="text-sm text-gray-300">{new Date(transaction.date).toLocaleDateString()}</p>
//                     </div>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleDelete(transaction._id)}
//                         className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
//                       >
//                         <Trash2 className="w-4 h-4 text-gray-400" />
//                       </button>
//                       <button
//                         onClick={() => handleEdit(transaction)}
//                         className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
//                       >
//                         <Edit className="w-4 h-4 text-gray-400" />
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </motion.li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default TransactionList;



import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Trash2, Edit, Download } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';

const TransactionList = ({ type }) => {
  const { transactions, deleteTransaction, editTransaction, searchTransactions, filterTransactions } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleDelete = (id) => {
    deleteTransaction(id, type);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    editTransaction(editingTransaction._id, editingTransaction);
    setEditingTransaction(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingTransaction(prev => ({ ...prev, [name]: value }));
  };

  const exportToCSV = () => {
    // Convert transactions to CSV format
    const headers = ['Name', 'Amount', 'Category', 'Date', 'Referral'];
    const csvData = displayedTransactions.map(t => [
      t.name,
      t.amount,
      t.category,
      new Date(t.date).toLocaleDateString(),
      t.referral || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}_transactions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = filterTransactions(type, selectedCategory);
  const searchedTransactions = searchTransactions(searchQuery, type);
  const displayedTransactions = searchQuery ? searchedTransactions : filteredTransactions;

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Recent {type === 'expense' ? 'Expenses' : 'Income'}</h3>
        <button
          onClick={exportToCSV}
          className="flex items-center px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-gray-700 text-white rounded-md"
        >
          <option value="All">All Categories</option>
          {/* Add your categories here */}
        </select>
      </div>
      {displayedTransactions.length === 0 ? (
        <p className="text-gray-400">No transactions to display.</p>
      ) : (
        <ul className="space-y-4">
          {displayedTransactions.map((transaction) => (
            <motion.li
              key={transaction._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-between p-4 rounded-lg ${
                type === 'expense' ? 'bg-red-500 bg-opacity-20' : 'bg-green-500 bg-opacity-20'
              }`}
            >
              {editingTransaction && editingTransaction._id === transaction._id ? (
                <form onSubmit={handleUpdate} className="w-full">
                  <input
                    type="text"
                    name="name"
                    value={editingTransaction.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-2 bg-gray-700 text-white rounded-md"
                  />
                  <input
                    type="number"
                    name="amount"
                    value={editingTransaction.amount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-2 bg-gray-700 text-white rounded-md"
                  />
                  <select
                    name="category"
                    value={editingTransaction.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-2 bg-gray-700 text-white rounded-md"
                  >
                    {/* Add your categories here */}
                  </select>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
                  <button onClick={() => setEditingTransaction(null)} className="px-4 py-2 ml-2 bg-gray-500 text-white rounded-md">Cancel</button>
                </form>
              ) : (
                <>
                  <div className="flex items-center">
                    {type === 'expense' ? (
                      <ShoppingCart className="w-6 h-6 mr-3 text-red-400" />
                    ) : (
                      <DollarSign className="w-6 h-6 mr-3 text-green-400" />
                    )}
                    <div>
                      <p className="font-semibold text-white">{transaction.name}</p>
                      <p className="text-sm text-gray-300">{transaction.category}</p>
                      {transaction.referral && (
                        <p className="text-xs text-gray-400">Ref: {transaction.referral}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <p className={`font-bold ${type === 'expense' ? 'text-red-400' : 'text-green-400'}`}>
                        {type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-300">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;