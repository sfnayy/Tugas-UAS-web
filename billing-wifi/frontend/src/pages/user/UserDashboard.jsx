import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { Wifi, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeSub, setActiveSub] = useState(null);
  const [pkgDetails, setPkgDetails] = useState(null);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch all needed data
        const [subsRes, pkgsRes, invsRes] = await Promise.all([
          api.get('/subscriptions/my-subscription', config),
          api.get('/packages', config),
          api.get('/invoices/my-invoices', config)
        ]);

        // Set state from direct responses
        const mySubs = Array.isArray(subsRes.data) ? subsRes.data : [];
        const active = mySubs[0]; // Assuming 1 active sub per user for simplicity
        
        if (active) {
          setActiveSub(active);
          const pkg = pkgsRes.data.find(p => p.id === active.package_id);
          setPkgDetails(pkg);
        }

        const myInvoices = Array.isArray(invsRes.data) ? invsRes.data.filter(i => i.status === 'pending') : [];
        setPendingInvoices(myInvoices.length);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id, token]);

  if (loading) return <div className="text-slate-400">Loading your dashboard...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 font-display">Overview</h2>
        <p className="text-slate-400 mt-1">Manage your active service and billing status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Package Card */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Wifi size={100} />
          </div>
          <div className="flex items-center space-x-3 mb-6 relative z-10">
            <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400 shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]">
              <Wifi size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Current Plan</h3>
          </div>
          
          {pkgDetails ? (
            <div className="relative z-10">
              <div className="flex items-baseline mb-2">
                <span className="text-3xl font-extrabold text-white">{pkgDetails.name}</span>
              </div>
              <p className="text-slate-400 mb-6">{pkgDetails.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-slate-400 font-medium mb-1">Speed</p>
                  <p className="font-bold text-slate-200">{pkgDetails.speed} Mbps</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-slate-400 font-medium mb-1">Monthly Fee</p>
                  <p className="font-bold text-slate-200">Rp {pkgDetails.price.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg inline-flex">
                <CheckCircle size={16} className="mr-2" /> Active until {new Date(activeSub.due_date).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 relative z-10">
              <p>You don't have an active subscription.</p>
            </div>
          )}
        </div>

        {/* Billing Overview Card */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-3 rounded-xl ${pendingInvoices > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                {pendingInvoices > 0 ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
              </div>
              <h3 className="text-xl font-bold text-slate-100">Billing Status</h3>
            </div>
            
            <div className="py-6">
              {pendingInvoices > 0 ? (
                <div>
                  <h4 className="text-4xl font-extrabold text-white mb-2">{pendingInvoices}</h4>
                  <p className="text-lg text-slate-400">Unpaid invoice{pendingInvoices > 1 ? 's' : ''} waiting for payment.</p>
                </div>
              ) : (
                <div>
                  <h4 className="text-2xl font-bold text-slate-100 mb-2">All caught up!</h4>
                  <p className="text-slate-400">You have no pending invoices.</p>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => navigate('/user/payment')}
            className={`w-full py-3 rounded-xl font-medium transition-all ${
              pendingInvoices > 0 
                ? 'btn-primary' 
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-white/5'
            }`}
          >
            {pendingInvoices > 0 ? 'Pay Now' : 'View History'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
