import React, { useState, useEffect, useMemo } from 'react';

// === Konfigurasi Awal ===
const API_URL = 'http://localhost:3001';

// === Komponen Pembantu (Helpers) ===

// Komponen untuk backdrop modal dengan efek blur
const ModalBackdrop = ({ children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 flex justify-center items-center p-4">
    {children}
  </div>
);

// Komponen untuk kerangka modal dengan desain baru
const ModalContainer = ({ title, onClose, children }) => (
  <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg z-50 transform transition-all animate-fade-in-up">
    <div className="flex justify-between items-center p-5 border-b border-gray-200">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-full transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

// Ikon untuk tombol aksi
const ViewIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>;
const EditIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>;
const DeleteIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;

// === Komponen Utama ===

// 1. Komponen untuk Form Tambah/Edit Transaksi
function TransactionForm({ transaction, onSave, onCancel, statusOptions }) {
  const [formData, setFormData] = useState({
    productID: '',
    productName: '',
    amount: '',
    customerName: '',
    status: 0,
    ...transaction
  });

  const isEditing = !!transaction?.id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
        ...formData,
        amount: String(formData.amount),
        status: parseInt(formData.status, 10),
    });
  };

  return (
    <ModalContainer title={isEditing ? "Edit Transaksi" : "Tambah Transaksi Baru"} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['productID', 'productName', 'amount', 'customerName'].map(field => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input 
              type={field === 'amount' ? 'number' : 'text'} 
              name={field} 
              value={formData[field]} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition" 
              required 
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition">
            {statusOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
          </select>
        </div>
        <div className="flex justify-end pt-5 space-x-3">
          <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-200 font-semibold transition-colors">Batal</button>
          <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 font-semibold shadow-sm transition-colors">{isEditing ? 'Simpan Perubahan' : 'Tambah Transaksi'}</button>
        </div>
      </form>
    </ModalContainer>
  );
}

// 2. Komponen untuk Melihat Detail Transaksi
function TransactionDetail({ transaction, onClose, statusMap }) {
  if (!transaction) return null;
  return (
    <ModalContainer title="Detail Transaksi" onClose={onClose}>
      <div className="space-y-4 text-sm">
        {Object.entries(transaction).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center border-b pb-2">
            <p className="font-semibold text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-md text-gray-900 text-right">
              {key === 'status' ? 
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${value === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {statusMap[value]}
                </span> :
               key === 'transactionDate' ? new Date(value).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) :
               key === 'amount' ? `Rp ${parseInt(value).toLocaleString('id-ID')}`:
               String(value)}
            </p>
          </div>
        ))}
      </div>
       <div className="flex justify-end pt-6">
          <button type="button" onClick={onClose} className="bg-gray-100 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-200 font-semibold transition-colors">Tutup</button>
        </div>
    </ModalContainer>
  );
}

// 3. Komponen Utama Aplikasi
export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ type: null, data: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mengambil dari endpoint /data
        const [transRes, statusRes] = await Promise.all([
          fetch(`${API_URL}/data`),
          fetch(`${API_URL}/status`)
        ]);
        if (!transRes.ok || !statusRes.ok) throw new Error('Gagal mengambil data dari server.');
        
        const transData = await transRes.json();
        const statusData = await statusRes.json();
        
        setTransactions(transData.sort((a,b) => new Date(b.transactionDate) - new Date(a.transactionDate)));
        setStatusOptions(statusData);
      } catch (err) { setError(err.message); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);
  
  const groupedTransactions = useMemo(() => {
    return transactions.reduce((acc, trans) => {
      const date = new Date(trans.transactionDate);
      const year = date.getFullYear();
      const month = date.toLocaleString('id-ID', { month: 'long' });
      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = [];
      acc[year][month].push(trans);
      return acc;
    }, {});
  }, [transactions]);
  
  const statusMap = useMemo(() => statusOptions.reduce((acc, curr) => ({...acc, [curr.id]: curr.name}), {}), [statusOptions]);

  const handleSaveTransaction = async (transactionData) => {
    const isEditing = !!transactionData.id;
    // Menyimpan dan mengedit ke endpoint /data
    const url = isEditing ? `${API_URL}/data/${transactionData.id}` : `${API_URL}/data`;
    const method = isEditing ? 'PUT' : 'POST';

    if (!isEditing) {
        transactionData.transactionDate = new Date().toISOString();
        transactionData.createBy = 'system';
        transactionData.createOn = new Date().toISOString();
    }
    
    try {
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(transactionData) });
        if (!response.ok) throw new Error('Gagal menyimpan data.');
        const savedTransaction = await response.json();
        setTransactions(prev => isEditing ? prev.map(t => t.id === savedTransaction.id ? savedTransaction : t) : [savedTransaction, ...prev]);
        setModal({ type: null, data: null });
    } catch (err) { alert(err.message); }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
        try {
            // Menghapus dari endpoint /data
            const response = await fetch(`${API_URL}/data/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Gagal menghapus data.');
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (err) { alert(err.message); }
    }
  };
  
  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading data...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-gray-800">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-4 sm:mb-0">
            Transaction Dashboard
          </h1>
          <button onClick={() => setModal({ type: 'add', data: null })} className="flex items-center bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            <span>Add Transaction</span>
          </button>
        </header>

        <main className="space-y-12">
          {Object.keys(groupedTransactions).sort((a,b) => b-a).map(year => (
            <div key={year}>
              <h2 className="text-3xl font-bold text-gray-700 mb-6 pb-2 border-b-2 border-indigo-200">{year}</h2>
              <div className="space-y-8">
                {Object.keys(groupedTransactions[year]).map(month => (
                  <div key={`${year}-${month}`} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                    <h3 className="text-xl font-semibold text-gray-700 bg-slate-100 p-4 border-b">{month}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-gray-500 uppercase tracking-wider">
                          <tr>
                            <th className="px-6 py-3">Product Name</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {groupedTransactions[year][month].map(trans => (
                            <tr key={trans.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-medium">{trans.productName}</td>
                              <td className="px-6 py-4">Rp {parseInt(trans.amount).toLocaleString('id-ID')}</td>
                              <td className="px-6 py-4">{trans.customerName}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 font-bold leading-tight rounded-full text-xs ${trans.status === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {statusMap[trans.status]}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center items-center space-x-3">
                                  <button onClick={() => setModal({ type: 'view', data: trans })} className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors" title="View Details"><ViewIcon/></button>
                                  <button onClick={() => setModal({ type: 'edit', data: trans })} className="p-2 rounded-full text-yellow-600 hover:bg-yellow-100 transition-colors" title="Edit Transaction"><EditIcon /></button>
                                  <button onClick={() => handleDeleteTransaction(trans.id)} className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors" title="Delete Transaction"><DeleteIcon /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>

      {modal.type && (
         <ModalBackdrop>
            {modal.type === 'add' && <TransactionForm onSave={handleSaveTransaction} onCancel={() => setModal({ type: null, data: null })} statusOptions={statusOptions} />}
            {modal.type === 'edit' && <TransactionForm transaction={modal.data} onSave={handleSaveTransaction} onCancel={() => setModal({ type: null, data: null })} statusOptions={statusOptions} />}
            {modal.type === 'view' && <TransactionDetail transaction={modal.data} onClose={() => setModal({ type: null, data: null })} statusMap={statusMap}/>}
         </ModalBackdrop>
      )}
    </div>
  );
}

