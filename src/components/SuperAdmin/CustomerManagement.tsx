"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreVertical, Eye, Edit, Ban, CheckCircle, 
  UserCheck, Phone, Mail, MapPin, Calendar, ShoppingBag, Heart, Loader2, AlertCircle, Users
} from 'lucide-react';
import { getAllUsers, type User } from '@/api/superadmin/user.api';

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalAdmins: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllUsers(
        pagination.page,
        pagination.limit,
        'createdAt',
        searchTerm || undefined
      );

      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
        setStats(response.data.stats);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Mock customer data
  const customers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 9876543210',
      location: 'Mumbai, Maharashtra',
      status: 'active',
      joinDate: '2024-01-15',
      totalOrders: 12,
      totalSpent: '₹45,600',
      lastOrder: '2024-11-05',
      favoriteVendors: 3
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 8765432109',
      location: 'Delhi, NCR',
      status: 'active',
      joinDate: '2024-02-20',
      totalOrders: 8,
      totalSpent: '₹32,400',
      lastOrder: '2024-11-02',
      favoriteVendors: 2
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91 7654321098',
      location: 'Ahmedabad, Gujarat',
      status: 'inactive',
      joinDate: '2024-03-10',
      totalOrders: 3,
      totalSpent: '₹12,800',
      lastOrder: '2024-09-15',
      favoriteVendors: 1
    },
    {
      id: 4,
      name: 'Sneha Gupta',
      email: 'sneha.gupta@email.com',
      phone: '+91 6543210987',
      location: 'Bangalore, Karnataka',
      status: 'active',
      joinDate: '2024-01-28',
      totalOrders: 18,
      totalSpent: '₹67,200',
      lastOrder: '2024-11-08',
      favoriteVendors: 5
    },
    {
      id: 5,
      name: 'Vikash Singh',
      email: 'vikash.singh@email.com',
      phone: '+91 5432109876',
      location: 'Kolkata, West Bengal',
      status: 'suspended',
      joinDate: '2024-04-12',
      totalOrders: 5,
      totalSpent: '₹18,900',
      lastOrder: '2024-10-20',
      favoriteVendors: 2
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <UserCheck className="w-4 h-4" />;
      case 'suspended': return <Ban className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const filteredUsers = users.filter(user => {
    if (statusFilter === 'all') return true;
    return user.accountStatus === statusFilter;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage and monitor all registered customers</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search by email, name, phone..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-xs sm:text-sm font-medium">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-xs sm:text-sm font-medium">Total Customers</p>
              <p className="text-xl sm:text-2xl font-bold text-green-900">{filteredUsers.length}</p>
            </div>
            <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-xs sm:text-sm font-medium">Active</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-900">
                {filteredUsers.filter(u => u.accountStatus === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-900 font-semibold">Error</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[200px]">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[200px]">Contact</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[150px]">Role</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[150px]">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[150px]">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-5 px-6">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{user.fullName}</h3>
                        <div className="flex items-center gap-2">
                          {user.isPhoneVerified && (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          )}
                          {user.isEmailVerified && (
                            <Mail className="w-3 h-3 text-blue-500" />
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600 truncate max-w-[200px]">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{user.phoneNumber}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.accountStatus)}`}>
                        {getStatusIcon(user.accountStatus)}
                        {user.accountStatus.charAt(0).toUpperCase() + user.accountStatus.slice(1)}
                      </span>
                    </td>
                    
                    <td className="py-5 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{formatDate(user.createdAt)}</span>
                        </div>
                        {user.lastLogin && (
                          <span className="text-xs text-gray-500">Last: {formatDate(user.lastLogin)}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div 
                key={user._id} 
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base mb-1">{user.fullName}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(user.accountStatus)}`}>
                      {getStatusIcon(user.accountStatus)}
                      {user.accountStatus.charAt(0).toUpperCase() + user.accountStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{user.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing {filteredUsers.length} of {pagination.total} users (Page {pagination.page} of {pagination.pages})
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(pagination.pages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === pagination.pages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                          page === pagination.page
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                    return <span key={page} className="text-gray-400">...</span>;
                  }
                  return null;
                })}
                <button 
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}