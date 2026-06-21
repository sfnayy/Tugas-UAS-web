import React from 'react';
import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, Wifi, CreditCard, FileText, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();

  // Basic protection: must be logged in and be an admin
  // Temporarily bypass strictly for UI development if user is not set, 
  // but let's keep the real protection:
  if (!user || user.role !== 'admin') {
     return <Navigate to="/auth/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, end: true },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Packages', path: '/admin/packages', icon: <Wifi size={20} /> },
    // Temporarily point subscriptions and invoices/reports appropriately
    { name: 'Reports', path: '/admin/reports', icon: <FileText size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200">
      {/* Premium Sidebar */}
      <aside className="w-64 glass-card border-r border-white/5 flex flex-col z-20">
        <div className="p-6 flex items-center justify-center border-b border-white/5">
          <Wifi className="text-blue-500 mr-3 animate-pulse" size={28} />
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-wide font-display">NetByte</h2>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-500/10 text-blue-400 shadow-[inset_4px_0_0_0] shadow-blue-500' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`
              }
            >
              {item.icon}
              <span className="ml-3 font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Animated Background Blob (Subtle) */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-16 glass-card border-b border-white/5 flex items-center justify-between px-8 shadow-sm z-10 sticky top-0">
          <h1 className="text-xl font-semibold text-slate-100 font-display">Admin Portal</h1>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="text-sm font-medium text-slate-300">{user.name || 'Administrator'}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
