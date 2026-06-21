import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { Users, CreditCard, Activity, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    pendingInvoices: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch users and invoices concurrently
        const [usersRes, invoicesRes] = await Promise.all([
          api.get('/users', config),
          api.get('/invoices', config)
        ]);

        const users = usersRes.data;
        const invoices = invoicesRes.data;

        // Calculate Metrics
        const totalUsers = users.length;
        let totalRevenue = 0;
        let pendingInvoices = 0;
        
        // Group revenue by month for the chart
        const revenueByMonth = {};

        invoices.forEach(inv => {
          if (inv.status === 'success') {
            totalRevenue += inv.gross_amount;
            
            // Format month (e.g., "Jan 2026")
            const date = new Date(inv.createdAt);
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            
            if (!revenueByMonth[monthYear]) revenueByMonth[monthYear] = 0;
            revenueByMonth[monthYear] += inv.gross_amount;
          } else if (inv.status === 'pending') {
            pendingInvoices += 1;
          }
        });

        // Format chart data
        const formattedChartData = Object.keys(revenueByMonth).map(key => ({
          name: key,
          Revenue: revenueByMonth[key]
        }));

        setMetrics({ totalUsers, totalRevenue, pendingInvoices });
        setChartData(formattedChartData.length > 0 ? formattedChartData : [{ name: 'No Data', Revenue: 0 }]);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Premium Metric Card Component
  const MetricCard = ({ title, value, icon, colorClass }) => (
    <div className="glass-card p-6 rounded-2xl flex items-center space-x-4">
      <div className={`p-4 rounded-xl ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
      </div>
    </div>
  );

  if (loading) return <div className="text-slate-400">Loading metrics...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 font-display">Overview Dashboard</h2>
        <p className="text-slate-400 mt-1">Welcome back. Here is your platform's summary.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Total Revenue" 
          value={`Rp ${metrics.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign size={24} className="text-emerald-400" />}
          colorClass="bg-emerald-500/10 border border-emerald-500/20"
        />
        <MetricCard 
          title="Active Customers" 
          value={metrics.totalUsers} 
          icon={<Users size={24} className="text-blue-400" />}
          colorClass="bg-blue-500/10 border border-blue-500/20"
        />
        <MetricCard 
          title="Pending Invoices" 
          value={metrics.pendingInvoices} 
          icon={<Activity size={24} className="text-amber-400" />}
          colorClass="bg-amber-500/10 border border-amber-500/20"
        />
      </div>

      {/* Chart Section */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-slate-100 mb-6 font-display">Revenue Trend</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dx={-10} tickFormatter={(val) => `Rp${val/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f1f5f9' }}
                itemStyle={{ color: '#60a5fa' }}
                formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="Revenue" 
                stroke="#3b82f6" 
                strokeWidth={4}
                dot={{ r: 4, strokeWidth: 2, fill: '#0f172a', stroke: '#3b82f6' }}
                activeDot={{ r: 6, fill: '#60a5fa', stroke: '#0f172a', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
