import React, { useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, Shield, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const UserProfile = () => {
  const { user, token, login } = useAuth();

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // If changing password, validate matches
    if (password && password !== confirmPassword) {
      return setError('New passwords do not match.');
    }

    setLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const updateData = { name, email };
      if (password) {
        updateData.password = password;
      }

      await api.put(``/users/${user.id}`, updateData, config);
      
      // Update local storage and auth context state
      const updatedUser = { ...user, name, email };
      login(updatedUser, token);

      setSuccess('Profile updated successfully.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
        <p className="text-slate-500">Update your account information and password settings.</p>
      </div>

      {/* Notifications */}
      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3.5 rounded-xl flex items-center space-x-2 text-sm">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3.5 rounded-xl flex items-center space-x-2 text-sm">
          <AlertCircle size={18} className="text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        
        {/* User Card Header */}
        <div className="flex items-center space-x-4 pb-6 mb-6 border-b border-slate-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.email}</p>
            <div className="mt-1.5 flex items-center text-xs bg-purple-50 text-purple-700 font-medium px-2.5 py-1 rounded-full border border-purple-100 w-max">
              <Shield size={12} className="mr-1" />
              Role: {user.role}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <User size={18} />
                </span>
                <input
                  required
                  type="text"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  required
                  type="email"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-md font-bold text-slate-800 mb-4">Change Password</h4>
            <p className="text-xs text-slate-400 mb-4">Leave fields blank if you do not wish to change your password.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 placeholder-slate-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 placeholder-slate-400"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-blue-500/20 ${
              loading ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              'Saving changes...'
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
};

export default UserProfile;
