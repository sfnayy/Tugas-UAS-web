import React, { useState } from 'react';
import api from '../../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { Wifi, AlertCircle, User, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        role: 'user' // defaults to user
      });

      setSuccess('Account created successfully! Redirecting to login...');
      
      // Clean inputs
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Premium Register Card */}
      <div className="glass-card p-8 rounded-3xl">
        
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/30 mb-4">
            <Wifi size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">Create Account</h2>
          <p className="text-slate-400 mt-2">Sign up for your NetByte internet services</p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3.5 rounded-2xl flex items-center space-x-3 text-sm animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3.5 rounded-2xl flex items-center space-x-3 text-sm animate-shake">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <User size={18} />
              </span>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="glass-input w-full pl-11 pr-4 py-3.5 rounded-2xl outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                required
                type="email"
                placeholder="john@example.com"
                className="glass-input w-full pl-11 pr-4 py-3.5 rounded-2xl outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="glass-input w-full pl-11 pr-4 py-3.5 rounded-2xl outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="glass-input w-full pl-11 pr-4 py-3.5 rounded-2xl outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className={`btn-primary w-full py-4 flex items-center justify-center group mt-6 ${
              loading || success ? 'opacity-85 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Registering...</span>
              </span>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight size={18} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Log In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
