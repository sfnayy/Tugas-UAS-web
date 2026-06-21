import React from 'react';
import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, CreditCard, User, LogOut, Wifi } from 'lucide-react';

const UserLayout = () => {
  const { user, logout } = useAuth();

  // Basic protection: must be logged in
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { name: 'Dashboard', path: '/user', icon: <Home size={20} />, end: true },
    { name: 'My Payments', path: '/user/payment', icon: <CreditCard size={20} /> },
    { name: 'Profile', path: '/user/profile', icon: <User size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200">
      {/* Customer Sidebar (Dark Theme) */}
      <aside className="w-64 glass-card border-r border-white/5 flex flex-col z-20">
        <div className="p-6 flex items-center border-b border-white/5">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl mr-3 shadow-lg shadow-blue-500/30">
            <Wifi className="text-white animate-pulse" size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight font-display">NetByte</h2>
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
              <span className="ml-3">{item.name}</span>
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
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-16 glass-card border-b border-white/5 flex items-center justify-between px-8 z-10 sticky top-0">
          <h1 className="text-xl font-semibold text-slate-100 font-display">Customer Portal</h1>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-slate-300">Hi, {user.name}</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 relative z-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
