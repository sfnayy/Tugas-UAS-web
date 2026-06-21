import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit2, Trash2, X, Wifi } from 'lucide-react';

const PackageManagement = () => {
  const { token } = useAuth();
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', speed: '', price: '', description: '' });

  const fetchPackages = async () => {
    try {
      const res = await api.get('/packages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPackages(res.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        await api.put(`/packages/${editingId}`, formData, config);
      } else {
        await api.post('/packages', formData, config);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '', speed: '', price: '', description: '' });
      fetchPackages();
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg.id);
    setFormData({ name: pkg.name, speed: pkg.speed, price: pkg.price, description: pkg.description });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await api.delete(`/packages/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Internet Packages</h2>
          <p className="text-slate-500">Manage available WiFi plans and pricing.</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setFormData({ name: '', speed: '', price: '', description: '' }); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center shadow-lg shadow-blue-500/30 transition-all"
        >
          <Plus size={20} className="mr-2" />
          Add Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
              <button onClick={() => handleEdit(pkg)} className="bg-slate-100 p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(pkg.id)} className="bg-slate-100 p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
            </div>
            
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Wifi size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{pkg.name}</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-extrabold text-slate-900">Rp {(Number(pkg.price)).toLocaleString()}</span>
              <span className="text-slate-500 font-medium ml-1">/mo</span>
            </div>
            <div className="bg-slate-50 px-3 py-2 rounded-lg inline-block mb-4 border border-slate-100">
              <span className="font-semibold text-slate-700">{pkg.speed} Mbps</span> Speed
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{pkg.description}</p>
          </div>
        ))}
        {packages.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 border-dashed">
            No packages configured yet.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Package' : 'Add New Package'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Package Name</label>
                <input required type="text" placeholder="e.g. Premium Family" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Speed (Mbps)</label>
                  <input required type="number" placeholder="e.g. 50" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.speed} onChange={(e) => setFormData({...formData, speed: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (Rp)</label>
                  <input required type="number" placeholder="e.g. 350000" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea required rows="3" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors mt-6">
                {editingId ? 'Save Changes' : 'Create Package'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageManagement;
