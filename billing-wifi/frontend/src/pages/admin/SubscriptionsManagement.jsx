import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit2, Trash2, X, Wifi, User, Calendar, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const SubscriptionsManagement = () => {
  const { token } = useAuth();
  
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    user_id: '',
    package_id: '',
    due_date: '5', // standard default: 5th of every month
    status: 'active'
  });

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    user_id: '',
    subscription_id: '',
    gross_amount: '',
    due_date: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsRes, usersRes, pkgsRes] = await Promise.all([
        api.get('/subscriptions', config),
        api.get('/users', config),
        api.get('/packages')
      ]);

      setSubscriptions(subsRes.data);
      // Filter out admin users from assignment list
      setUsers(usersRes.data.filter(u => u.role !== 'admin'));
      setPackages(pkgsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching subscription page data:', err);
      setError('Failed to fetch data from server.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await api.put(`/subscriptions/${editingId}`, formData, config);
        setSuccess('Subscription updated successfully.');
      } else {
        await api.post('/subscriptions', formData, config);
        setSuccess('Subscription created successfully.');
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ user_id: '', package_id: '', due_date: '5', status: 'active' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving subscription.');
    }
  };

  const handleEdit = (sub) => {
    setEditingId(sub.id);
    setFormData({
      user_id: sub.user_id,
      package_id: sub.package_id,
      due_date: sub.due_date,
      status: sub.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        setError('');
        setSuccess('');
        await api.delete(`/subscriptions/${id}`, config);
        setSuccess('Subscription deleted.');
        fetchData();
      } catch (err) {
        setError('Failed to delete subscription.');
      }
    }
  };

  const openInvoiceModal = (sub) => {
    const pkg = packages.find(p => p.id === sub.package_id);
    const today = new Date();
    // Default invoice due date is 7 days from now, in format YYYY-MM-DD
    const due = new Date();
    due.setDate(today.getDate() + 7);
    const formattedDueDate = due.toISOString().split('T')[0];

    setInvoiceData({
      user_id: sub.user_id,
      subscription_id: sub.id,
      gross_amount: pkg ? pkg.price : '',
      due_date: formattedDueDate
    });
    setInvoiceModalOpen(true);
  };

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/invoices/generate', invoiceData, config);
      setSuccess('Invoice generated and assigned to user successfully.');
      setInvoiceModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating invoice.');
    }
  };

  // Helper functions to get user and package names
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getPackageInfo = (pkgId) => {
    const pkg = packages.find(p => p.id === pkgId);
    return pkg ? `${pkg.name} (${pkg.speed} Mbps)` : 'Unknown Package';
  };

  if (loading) return <div className="text-slate-500">Loading subscriptions...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Subscription Management</h2>
          <p className="text-slate-500">Assign internet plans, configure due dates, and generate monthly invoices.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ user_id: '', package_id: '', due_date: '5', status: 'active' });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center shadow-lg shadow-blue-500/30 transition-all"
        >
          <Plus size={20} className="mr-2" />
          Assign Package
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl flex items-center space-x-2 text-sm">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2 text-sm">
          <AlertCircle size={18} className="text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-semibold text-sm text-slate-600">Customer Name</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-600">Active Package</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-600">Billing Date</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-600">Status</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscriptions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User size={16} className="text-slate-400 mr-2" />
                      <span className="font-medium text-slate-800">{getUserName(sub.user_id)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Wifi size={16} className="text-blue-500 mr-2" />
                      <span className="text-slate-700">{getPackageInfo(sub.package_id)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    <div className="flex items-center">
                      <Calendar size={14} className="text-slate-400 mr-1.5" />
                      Every {sub.due_date === '31' || sub.due_date.includes('-') ? sub.due_date : `${sub.due_date}th`} of the month
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${sub.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => openInvoiceModal(sub)} 
                      title="Generate Invoice" 
                      className="text-emerald-600 hover:text-emerald-800 transition-colors inline-flex items-center align-middle"
                    >
                      <FileText size={18} className="mr-1" />
                      <span className="text-xs font-semibold">Bill</span>
                    </button>
                    <span className="text-slate-200">|</span>
                    <button onClick={() => handleEdit(sub)} className="text-blue-600 hover:text-blue-800 transition-colors inline-block align-middle"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(sub.id)} className="text-red-600 hover:text-red-800 transition-colors inline-block align-middle"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No active subscriptions configured.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Subscription' : 'Assign Package'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Customer</label>
                <select 
                  required 
                  disabled={!!editingId}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-slate-50 text-slate-800"
                  value={formData.user_id} 
                  onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                >
                  <option value="">-- Choose User --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Internet Package</label>
                <select 
                  required 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-800"
                  value={formData.package_id} 
                  onChange={(e) => setFormData({...formData, package_id: e.target.value})}
                >
                  <option value="">-- Choose Package --</option>
                  {packages.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.speed} Mbps (Rp {p.price.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Due Date</label>
                <select
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-800"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                >
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i+1} value={String(i+1)}>{i+1}</option>
                  ))}
                </select>
                <span className="text-xs text-slate-400 mt-1 block">Day of the month to trigger monthly payment invoice.</span>
              </div>

              {editingId && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subscription Status</label>
                  <select 
                    required 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-800"
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              )}

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors mt-6 shadow-md shadow-blue-500/10">
                {editingId ? 'Save Changes' : 'Assign Package'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Manual Generate Invoice Modal */}
      {invoiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Generate Invoice</h3>
              <button onClick={() => setInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleGenerateInvoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
                <input 
                  type="text" 
                  readOnly 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 outline-none cursor-not-allowed" 
                  value={getUserName(invoiceData.user_id)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Amount (Rp)</label>
                <input 
                  required 
                  type="number" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" 
                  value={invoiceData.gross_amount} 
                  onChange={(e) => setInvoiceData({...invoiceData, gross_amount: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input 
                  required 
                  type="date" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" 
                  value={invoiceData.due_date} 
                  onChange={(e) => setInvoiceData({...invoiceData, due_date: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors mt-6 shadow-md">
                Generate and Send Invoice
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SubscriptionsManagement;
