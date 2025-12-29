"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreVertical, Eye, Edit, Ban, CheckCircle, 
  X, Building2, Phone, Mail, MapPin, Calendar, Star, Loader2, AlertCircle, XCircle
} from 'lucide-react';
import { 
  getAllVendors, 
  type Vendor, 
  type PaginationData 
} from '@/api/superadmin/vendor.api';
import VendorDetailSidebar from './VendorDetailSidebar';

interface VendorManagementProps {
  isAdminPanel?: boolean;
}

export default function VendorManagement({ isAdminPanel = false }: VendorManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0
  });

  useEffect(() => {
    fetchVendors();
  }, [pagination.currentPage, statusFilter, searchTerm]);

  const fetchVendors = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllVendors(
        pagination.currentPage,
        pagination.itemsPerPage,
        statusFilter,
        searchTerm
      );
      
      if (response.success) {
        setVendors(response.data.vendors);
        
        // Map API pagination to component pagination
        setPagination({
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.pages,
          totalItems: response.data.pagination.total,
          itemsPerPage: response.data.pagination.limit
        });
        
        // Use stats from API response
        if (response.data.stats) {
          setStats({
            total: response.data.stats.totalVendors,
            active: response.data.stats.activeVendors,
            pending: response.data.stats.totalVendors - response.data.stats.activeVendors,
            suspended: 0 // Not provided by API
          });
        } else {
          calculateStats(response.data.vendors);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (vendorList: Vendor[]) => {
    const active = vendorList.filter(v => (v.accountStatus === 'active' || v.isActive)).length;
    const pending = vendorList.filter(v => v.accountStatus === 'pending' || (!v.isActive && !v.accountStatus)).length;
    const suspended = vendorList.filter(v => v.accountStatus === 'suspended').length;
    
    setStats({
      total: pagination.totalItems,
      active,
      pending,
      suspended
    });
  };

  const handleViewVendor = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    setIsSidebarOpen(true);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <X className="w-4 h-4" />;
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

  const getVendorStatus = (vendor: Vendor) => {
    return vendor.accountStatus || (vendor.isActive ? 'active' : 'pending');
  };

  const getVendorBrandName = (vendor: Vendor) => {
    return (vendor.businessRegistrationId as any)?.brandName || vendor.userId?.fullName || 'N/A';
  };

  const getVendorRole = (vendor: Vendor) => {
    return vendor.role?.toUpperCase() || 'VENDOR';
  };

  const getVendorPhone = (vendor: Vendor) => {
    return vendor.phoneNumber || vendor.userId?.phoneNumber || 'N/A';
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Vendor Management</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Manage and monitor all registered vendors</p>
          </div>
          
          {/* <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-xs sm:text-sm font-medium">Total Vendors</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">{pagination.totalItems}</p>
              </div>
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-xs sm:text-sm font-medium">Active Vendors</p>
                <p className="text-xl sm:text-2xl font-bold text-green-900">{stats.active}</p>
              </div>
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-xs sm:text-sm font-medium">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <X className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
            </div>
          </div>
          
          {/* <div className="bg-red-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-xs sm:text-sm font-medium">Suspended</p>
                <p className="text-xl sm:text-2xl font-bold text-red-900">{stats.suspended}</p>
              </div>
              <Ban className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
          </div> */}
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
              <p className="text-gray-600">Loading vendors...</p>
            </div>
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View - Hidden on Mobile */}
            <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[250px]">Vendor Details</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[250px]">Contact</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[150px]">Profile Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[150px]">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[150px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vendors.map((vendor) => {
                    const status = getVendorStatus(vendor);
                    const brandName = getVendorBrandName(vendor);
                    const phone = getVendorPhone(vendor);
                    
                    return (
                    <tr key={vendor._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-5 px-6">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-900 text-sm">{brandName}</h3>
                          <p className="text-xs text-gray-600">{getVendorRole(vendor)}</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">Joined {formatDate(vendor.createdAt)}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-5 px-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600 truncate max-w-[200px]">{vendor.userId?.email || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{phone}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-5 px-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {vendor.isProfileComplete ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-500" />
                            )}
                            <span className="text-xs text-gray-600">
                              {vendor.profileCompletionPercentage ? `${vendor.profileCompletionPercentage}%` : '0%'} Complete
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {vendor.isCaterbazarChoice ? (
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            ) : (
                              <Star className="w-3 h-3 text-gray-400" />
                            )}
                            <span className="text-xs text-gray-600">Caterbazar Choice</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleViewVendor(vendor.userId?._id || vendor._id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - Visible only on Mobile */}
            <div className="lg:hidden space-y-4">
              {vendors.map((vendor) => {
                const status = getVendorStatus(vendor);
                const brandName = getVendorBrandName(vendor);
                const phone = getVendorPhone(vendor);
                
                return (
                <div 
                  key={vendor._id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Vendor Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base mb-1">{brandName}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {getStatusIcon(status)}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-gray-700 truncate">{vendor.userId?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-gray-700">{phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-gray-600">Joined {formatDate(vendor.createdAt)}</span>
                    </div>
                  </div>

                  {/* Profile Status */}
                  <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-1.5">
                      {vendor.isProfileComplete ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-xs text-gray-600">
                        {vendor.profileCompletionPercentage ? `${vendor.profileCompletionPercentage}%` : '0%'} Complete
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {vendor.isCaterbazarChoice ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <Star className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-600">CB Choice</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleViewVendor(vendor.userId?._id || vendor._id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
              <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Showing {vendors.length} of {pagination.totalItems} vendors (Page {pagination.currentPage} of {pagination.totalPages})
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <button 
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                          page === pagination.currentPage
                            ? 'bg-orange-500 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === pagination.currentPage - 2 ||
                    page === pagination.currentPage + 2
                  ) {
                    return <span key={page} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}
                <button 
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Vendor Detail Sidebar */}
      {selectedVendorId && (
        <VendorDetailSidebar
          vendorId={selectedVendorId}
          isOpen={isSidebarOpen}
          onClose={() => {
            setIsSidebarOpen(false);
            setSelectedVendorId(null);
          }}
          isAdminPanel={isAdminPanel}
        />
      )}
    </>
  );
}