"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { superAdminLogin } from '@/api/superadmin/auth.api';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await superAdminLogin({ email, password });
      
      if (response.success) {
        // Check if user is admin with correct phone number
        const user = response.data?.user;
        if (user?.role === 'admin' && user?.phoneNumber === '9178114124') {
          // Store user role and phone number in cookies for middleware validation
          document.cookie = `userRole=admin; path=/; max-age=86400`;
          document.cookie = `userPhoneNumber=${user.phoneNumber}; path=/; max-age=86400`;
          
          // Redirect to admin dashboard
          router.push('/admin/dashboard');
        } else {
          setError('You do not have access to the Sales Admin panel.');
        }
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-orange-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Admin</h1>
          <p className="text-gray-600">Platform Sales Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@caterbazar.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Password
                </label>
                <a
                  href="/auth/admin/forgot-password"
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-gray-600 text-center">
              <span className="font-semibold text-gray-900">Security Notice:</span> This is a restricted area. All access attempts are logged and monitored.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          CaterBazar Sales Admin Dashboard © 2025
        </p>
      </div>
    </div>
  );
}
