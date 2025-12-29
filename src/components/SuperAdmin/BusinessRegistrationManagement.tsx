"use client";

import React, { useState, useEffect } from 'react';
import {
  Search, Filter, ChevronDown, Eye, CheckCircle, XCircle,
  Clock, RefreshCw, FileText, Calendar, Mail, Phone, MapPin,
  User, AlertCircle, Loader2, X
} from 'lucide-react';
import {
  getAllBusinessRegistrations,
  reviewBusinessRegistration,
  getRegistrationStats,
  updateBusinessRegistration,
  type BusinessRegistration,
  type UpdateRegistrationRequest
} from '@/api/superadmin/business.api';
import { getCurrentUser } from '@/api/superadmin/auth.api';

export default function BusinessRegistrationManagement() {
  const [registrations, setRegistrations] = useState<BusinessRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    resubmission_required: 0,
    total: 0
  });
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  
  // Selected registration for detail view
  const [selectedRegistration, setSelectedRegistration] = useState<BusinessRegistration | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected' | 'resubmission_required'>('approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateRegistrationRequest>({
    brandName: '',
    businessEmail: '',
    businessMobile: '',
    location: '',
    vendorType: '',
    referId: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [statusFilter, currentPage, searchQuery]);

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getRegistrationStats();
      if (response.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await getAllBusinessRegistrations(
        statusFilter,
        currentPage,
        itemsPerPage,
        searchQuery,
        'createdAt'
      );
      
      if (response.success) {
        setRegistrations(response.data.registrations);
        setTotalPages(response.data.pagination.pages);
        setTotalItems(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (registration: BusinessRegistration) => {
    setSelectedRegistration(registration);
    setShowDetailModal(true);
  };

  const handleReview = (registration: BusinessRegistration) => {
    setSelectedRegistration(registration);
    setShowReviewModal(true);
    setReviewAction('approved');
    setRejectionReason('');
    setAdminNotes('');
  };

  const handleEdit = (registration: BusinessRegistration) => {
    setSelectedRegistration(registration);
    setEditFormData({
      brandName: registration.brandName,
      businessEmail: registration.businessEmail,
      businessMobile: registration.businessMobile,
      location: registration.location,
      vendorType: registration.vendorType,
      referId: registration.referId || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedRegistration) return;

    // Validation
    if (!editFormData.brandName.trim()) {
      alert('Brand name is required');
      return;
    }
    if (!editFormData.businessEmail.trim()) {
      alert('Business email is required');
      return;
    }
    if (!editFormData.businessMobile.trim()) {
      alert('Business mobile is required');
      return;
    }
    if (!editFormData.location.trim()) {
      alert('Location is required');
      return;
    }
    if (!editFormData.vendorType) {
      alert('Vendor type is required');
      return;
    }

    setUpdating(true);
    try {
      const response = await updateBusinessRegistration(selectedRegistration._id, editFormData);
      
      if (response.success) {
        setShowEditModal(false);
        fetchRegistrations();
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update registration');
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedRegistration) return;

    if ((reviewAction === 'rejected' || reviewAction === 'resubmission_required') && !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setReviewing(true);
    try {
      const reviewData: any = {
        status: reviewAction,
      };

      if (reviewAction === 'rejected' || reviewAction === 'resubmission_required') {
        reviewData.rejectionReason = rejectionReason;
      }

      if (adminNotes.trim()) {
        reviewData.adminNotes = adminNotes;
      }

      const response = await reviewBusinessRegistration(selectedRegistration._id, reviewData);
      
      if (response.success) {
        setShowReviewModal(false);
        fetchRegistrations();
        fetchStats();
      }
    } catch (error: any) {
      alert(error.message || 'Failed to review registration');
    } finally {
      setReviewing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      resubmission_required: 'bg-orange-100 text-orange-800 border-orange-200'
    };

    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
      resubmission_required: <RefreshCw className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getVendorTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Registration Management</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total</p>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-yellow-700">Pending</p>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>

        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-green-700">Approved</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
        </div>

        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-red-700">Rejected</p>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
        </div>

        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-orange-700">Resubmit</p>
            <RefreshCw className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-900">{stats.resubmission_required}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by brand name, email, or mobile..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:w-48 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none bg-white"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="resubmission_required">Resubmission Required</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No registrations found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Brand Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Vendor Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Submitted Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{registration.brandName}</span>
                          <span className="text-sm text-gray-500">{registration.businessEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">{registration.submittedBy.fullName}</span>
                          <span className="text-xs text-gray-500">{registration.submittedBy.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{getVendorTypeLabel(registration.vendorType)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{registration.location}</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(registration.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {new Date(registration.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(registration)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {currentUser?.phoneNumber !== '9178114124' && (
                            <button
                              onClick={() => handleEdit(registration)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit Details"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                          {registration.status === 'pending' && (
                            <button
                              onClick={() => handleReview(registration)}
                              className="px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors"
                            >
                              Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} registrations
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Registration Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Status</p>
                {getStatusBadge(selectedRegistration.status)}
              </div>

              {/* Business Information */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Business Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Brand Name</p>
                    <p className="font-medium text-gray-900">{selectedRegistration.brandName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vendor Type</p>
                    <p className="font-medium text-gray-900">{getVendorTypeLabel(selectedRegistration.vendorType)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Business Email</p>
                    <p className="font-medium text-gray-900">{selectedRegistration.businessEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Business Mobile</p>
                    <p className="font-medium text-gray-900">+91 {selectedRegistration.businessMobile}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{selectedRegistration.location}</p>
                  </div>
                  {selectedRegistration.referId && (
                    <div>
                      <p className="text-sm text-gray-600">Refer ID</p>
                      <p className="font-medium text-gray-900">{selectedRegistration.referId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submitted By */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Submitted By</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{selectedRegistration.submittedBy.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedRegistration.submittedBy.email}</p>
                  </div>
                  {selectedRegistration.submittedBy.phoneNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{selectedRegistration.submittedBy.phoneNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Information */}
              {selectedRegistration.reviewedBy && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Review Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Reviewed By</p>
                      <p className="font-medium text-gray-900">{selectedRegistration.reviewedBy.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reviewed At</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedRegistration.reviewedAt!).toLocaleString()}
                      </p>
                    </div>
                    {selectedRegistration.adminNotes && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Admin Notes</p>
                        <p className="font-medium text-gray-900">{selectedRegistration.adminNotes}</p>
                      </div>
                    )}
                    {selectedRegistration.rejectionReason && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Rejection Reason</p>
                        <p className="font-medium text-red-900">{selectedRegistration.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Submitted Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedRegistration.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedRegistration.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              {selectedRegistration.status === 'pending' && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleReview(selectedRegistration);
                  }}
                  className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Review Registration
                </button>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Edit Business Registration</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Brand Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.brandName}
                  onChange={(e) => setEditFormData({ ...editFormData, brandName: e.target.value })}
                  placeholder="Enter brand name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Business Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={editFormData.businessEmail}
                  onChange={(e) => setEditFormData({ ...editFormData, businessEmail: e.target.value })}
                  placeholder="Enter business email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Business Mobile */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Mobile <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="w-16 px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center text-gray-700 font-medium">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={editFormData.businessMobile}
                    onChange={(e) => setEditFormData({ ...editFormData, businessMobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  placeholder="Enter location (City, State)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Vendor Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vendor Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={editFormData.vendorType}
                  onChange={(e) => setEditFormData({ ...editFormData, vendorType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option value="">Select vendor type</option>
                  <option value="full_catering">Full Catering</option>
                  <option value="snacks_and_starter">Snacks and Starter</option>
                  <option value="dessert_and_sweet">Dessert and Sweet</option>
                  <option value="beverage">Beverage</option>
                  <option value="paan">Paan</option>
                  <option value="water">Water</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Refer ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Refer ID (Optional)
                </label>
                <input
                  type="text"
                  value={editFormData.referId}
                  onChange={(e) => setEditFormData({ ...editFormData, referId: e.target.value })}
                  placeholder="Enter refer ID if any"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={updating}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                disabled={updating}
                className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300 flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Registration'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Review Registration</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Brand: {selectedRegistration.brandName}</p>
                <p className="text-sm text-gray-600">Submitted by: {selectedRegistration.submittedBy.fullName}</p>
              </div>

              {/* Action Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Review Action <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="reviewAction"
                      value="approved"
                      checked={reviewAction === 'approved'}
                      onChange={(e) => setReviewAction(e.target.value as any)}
                      className="w-4 h-4 text-green-500"
                    />
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-gray-900">Approve Registration</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="reviewAction"
                      value="rejected"
                      checked={reviewAction === 'rejected'}
                      onChange={(e) => setReviewAction(e.target.value as any)}
                      className="w-4 h-4 text-red-500"
                    />
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-gray-900">Reject Registration</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="reviewAction"
                      value="resubmission_required"
                      checked={reviewAction === 'resubmission_required'}
                      onChange={(e) => setReviewAction(e.target.value as any)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-orange-500" />
                      <span className="font-medium text-gray-900">Request Resubmission</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Rejection Reason */}
              {(reviewAction === 'rejected' || reviewAction === 'resubmission_required') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {reviewAction === 'rejected' ? 'Rejection' : 'Resubmission'} Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a detailed reason..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal notes for reference..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowReviewModal(false)}
                disabled={reviewing}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={reviewing}
                className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300 flex items-center gap-2"
              >
                {reviewing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
