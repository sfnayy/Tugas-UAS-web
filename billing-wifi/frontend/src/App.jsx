import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PackageManagement from './pages/admin/PackageManagement';
import SubscriptionsManagement from './pages/admin/SubscriptionsManagement';
import AdminReports from './pages/admin/AdminReports';

import UserDashboard from './pages/user/UserDashboard';
import UserPayment from './pages/user/UserPayment';
import UserProfile from './pages/user/UserProfile';

function App() {
  return (
    <Routes>
      {/* Root route redirects to auth for now, or you can point to a landing page */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* Authentication Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="packages" element={<PackageManagement />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="subscriptions" element={<SubscriptionsManagement />} />
      </Route>

      {/* User Protected Routes */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="payment" element={<UserPayment />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
