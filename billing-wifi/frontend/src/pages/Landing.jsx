import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Shield, Zap, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 glass-card border-b-0 border-white/10 rounded-none bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">NetByte</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth/login" className="text-slate-300 hover:text-white font-medium transition-colors hidden sm:block">
                Sign In
              </Link>
              <Link to="/auth/register" className="btn-primary px-6 py-2.5 rounded-xl text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-sm font-medium text-blue-200">Ultra-Fast Internet Now Available</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-display font-extrabold tracking-tight mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Experience <span className="text-gradient">Seamless</span><br />
            Connectivity
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Elevate your digital life with blazing fast speeds, zero throttling, and reliable coverage. Stream, game, and work without limits.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/auth/register" className="w-full sm:w-auto btn-primary px-8 py-4 rounded-xl text-lg flex items-center justify-center gap-2 group">
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="#features" className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-semibold glass-card hover:bg-white/5 transition-all flex items-center justify-center">
              View Plans
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative py-24 z-10 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Why Choose NetByte?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We provide more than just an internet connection. We deliver an experience designed for the modern digital age.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Lightning Fast</h3>
              <p className="text-slate-400 leading-relaxed">Experience true gigabit speeds with our fiber-optic network. No more buffering or lag during your important tasks.</p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Secure & Private</h3>
              <p className="text-slate-400 leading-relaxed">Advanced encryption and built-in threat protection keeps your data safe from malicious actors automatically.</p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">99.9% Uptime</h3>
              <p className="text-slate-400 leading-relaxed">Our redundant network architecture ensures you stay connected when it matters most, day or night.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 mix-blend-overlay"></div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-6 text-white relative z-10">Ready to upgrade your internet?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of satisfied customers who have already made the switch to a better, faster, and more reliable network.
            </p>
            <div className="flex justify-center relative z-10">
              <Link to="/auth/register" className="btn-primary px-10 py-4 rounded-xl text-lg shadow-xl shadow-blue-500/30">
                Create an Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 pt-12 pb-8 z-10 bg-slate-950/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Wifi className="w-6 h-6 text-blue-500" />
              <span className="font-display font-bold text-xl text-white">NetByte</span>
            </div>
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} NetByte. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
