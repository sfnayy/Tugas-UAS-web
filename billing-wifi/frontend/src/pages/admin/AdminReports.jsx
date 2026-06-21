import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { Download, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminReports = () => {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get('/invoices', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Sort newest first
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInvoices(sorted);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [token]);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('NetByte WiFi - Transaction Report', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Table Setup
    const tableColumn = ["Invoice ID", "User ID", "Amount (Rp)", "Due Date", "Status", "Date Created"];
    const tableRows = [];

    invoices.forEach(inv => {
      const rowData = [
        inv.id.substring(0, 8) + '...',
        inv.user_id.substring(0, 8) + '...',
        inv.gross_amount.toLocaleString(),
        new Date(inv.due_date).toLocaleDateString(),
        inv.status.toUpperCase(),
        new Date(inv.createdAt).toLocaleString()
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255 }
    });

    doc.save(`NetByte_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      success: { color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={14} className="mr-1" /> },
      pending: { color: 'bg-amber-100 text-amber-700', icon: <Clock size={14} className="mr-1" /> },
      failed: { color: 'bg-red-100 text-red-700', icon: <XCircle size={14} className="mr-1" /> }
    };
    const conf = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${conf.color}`}>
        {conf.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Transaction Reports</h2>
          <p className="text-slate-500">View and export billing history and invoice statuses.</p>
        </div>
        <button 
          onClick={generatePDF}
          disabled={invoices.length === 0}
          className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl font-medium flex items-center shadow-lg transition-all"
        >
          <Download size={20} className="mr-2" />
          Export PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading reports...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">Invoice ID</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">Amount</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">Due Date</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">Status</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText size={16} className="text-slate-400 mr-2" />
                        <span className="font-medium text-slate-800 font-mono text-sm">{inv.id.substring(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">Rp {inv.gross_amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(inv.due_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(inv.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No transactions recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
