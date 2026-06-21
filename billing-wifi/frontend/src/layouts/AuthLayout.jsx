import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-200">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Container */}
      <div className="relative max-w-md w-full space-y-8 z-10 animate-fade-in-up">
        {/* Render child routes like Login / Register */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
