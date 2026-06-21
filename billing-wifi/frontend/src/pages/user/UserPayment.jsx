import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, CheckCircle, Clock, FileText } from 'lucide-react';

const UserPayment = () => {
  const { user, token } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchInvoices = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get('/invoices/my-invoices', config);
      
      const myInvoices = Array.isArray(res.data) ? res.data : [];
      myInvoices.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setInvoices(myInvoices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user.id, token]);

  const handlePayment = async (invoice) => {
    try {
      setProcessingId(invoice.id);
      
      // 1. Get Snap Token from backend
      const res = await api.post(
        '/payments/charge',
        { invoice_id: invoice.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const snapToken = res.data.token;

      // 2. Trigger Midtrans Snap UI
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: function(result) {
            alert("Payment success!");
            fetchInvoices();
            setProcessingId(null);
          },
          onPending: function(result) {
            alert("Waiting for your payment!");
            fetchInvoices();
            setProcessingId(null);
          },
          onError: function(result) {
            alert("Payment failed!");
            setProcessingId(null);
          },
          onClose: function() {
            setProcessingId(null);
          }
        });
      } else {
        alert("Midtrans snap script is not loaded properly.");
        setProcessingId(null);
      }
      
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
      setProcessingId(null);
    }
  };

  const StatusBadge = ({ status }) => {
    if (status === 'success') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
          <CheckCircle size={14} className="mr-1" /> Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        <Clock size={14} className="mr-1" /> Pending
      </span>
    );
  };

  if (loading) return <div className="text-slate-500">Loading your invoices...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Payments</h2>
        <p className="text-slate-500 mt-1">View and settle your pending invoices.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {invoices.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {invoices.map((invoice) => (
              <li key={invoice.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${invoice.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Monthly Internet Subscription</h4>
                    <div className="flex items-center mt-1 space-x-3 text-sm">
                      <span className="text-slate-500 font-mono">INV-{invoice.id.substring(0, 8)}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end md:space-x-8 w-full md:w-auto">
                  <div className="text-left md:text-right">
                    <p className="text-sm text-slate-500 font-medium mb-1">Amount</p>
                    <p className="text-xl font-bold text-slate-900">Rp {invoice.gross_amount.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <StatusBadge status={invoice.status} />
                    
                    {invoice.status === 'pending' && (
                      <button
                        onClick={() => handlePayment(invoice)}
                        disabled={processingId === invoice.id}
                        className={`px-6 py-2.5 rounded-xl font-medium flex items-center transition-all ${
                          processingId === invoice.id 
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                        }`}
                      >
                        {processingId === invoice.id ? (
                          'Processing...'
                        ) : (
                          <>
                            <CreditCard size={18} className="mr-2" />
                            Bayar
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center text-slate-500">
            You don't have any invoices yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPayment;
