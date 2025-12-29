'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Mail, 
  Phone, 
  MessageSquare, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  X,
  Eye,
  Clock,
  DollarSign,
  UtensilsCrossed,
  Send
} from 'lucide-react';
import {
  getVendorInquiries,
  getInquiryDetails,
  updateInquiryStatus,
  Inquiry
} from '@/api/vendor/inquiry.api';

const STATUS_FILTERS = [
  { value: 'all', label: 'All Inquiries', color: 'bg-gray-500' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-500' },
  { value: 'converted', label: 'Converted', color: 'bg-green-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-500' },
];

export default function InquiriesManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responding, setResponding] = useState(false);
  
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  
  const [responseForm, setResponseForm] = useState({
    status: 'contacted' as 'pending' | 'contacted' | 'converted' | 'rejected' | 'cancelled',
    message: '',
  });

  useEffect(() => {
    fetchInquiries();
  }, [selectedStatus, pagination.page]);

  const fetchInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const status = selectedStatus === 'all' ? undefined : selectedStatus;
      const response = await getVendorInquiries(status, pagination.page, pagination.limit);
      
      setInquiries(response.data.inquiries);
      setPagination(response.data.pagination);
      
      // Process status counts
      const counts: Record<string, number> = {};
      response.data.statusCounts.forEach(item => {
        counts[item._id] = item.count;
      });
      setStatusCounts(counts);
    } catch (err: any) {
      console.error('Error fetching inquiries:', err);
      setError(err.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (inquiry: Inquiry) => {
    try {
      const response = await getInquiryDetails(inquiry._id);
      setSelectedInquiry(response.data.inquiry);
      setShowDetailModal(true);
    } catch (err: any) {
      console.error('Error fetching inquiry details:', err);
      setError(err.message || 'Failed to load inquiry details');
      setTimeout(() => setError(''), 3000);
    }
  };

  const openResponseModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setResponseForm({
      status: inquiry.status === 'pending' ? 'contacted' : inquiry.status,
      message: inquiry.vendorResponse?.message || '',
    });
    setShowResponseModal(true);
  };

  const handleRespond = async () => {
    if (!selectedInquiry) return;

    if (!responseForm.message.trim()) {
      setError('Please enter a message');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setResponding(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateInquiryStatus(selectedInquiry._id, {
        status: responseForm.status,
        message: responseForm.message,
      });

      // Update inquiry in list
      setInquiries(prev =>
        prev.map(inq => (inq._id === selectedInquiry._id ? response.data.inquiry : inq))
      );

      setSuccess('Response sent successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setShowResponseModal(false);
      fetchInquiries(); // Refresh to update counts
    } catch (err: any) {
      console.error('Error responding to inquiry:', err);
      setError(err.message || 'Failed to send response');
      setTimeout(() => setError(''), 5000);
    } finally {
      setResponding(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; class: string }> = {
      pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700' },
      contacted: { label: 'Contacted', class: 'bg-blue-100 text-blue-700' },
      converted: { label: 'Converted', class: 'bg-green-100 text-green-700' },
      rejected: { label: 'Rejected', class: 'bg-red-100 text-red-700' },
      cancelled: { label: 'Cancelled', class: 'bg-gray-100 text-gray-700' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config.class}`}>{config.label}</span>;
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      wedding: 'Wedding',
      engagement: 'Engagement',
      birthday: 'Birthday',
      corporate: 'Corporate Event',
      reception: 'Reception',
      anniversary: 'Anniversary',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const getFoodPreferenceLabel = (pref: string) => {
    const labels: Record<string, string> = {
      veg: 'Vegetarian',
      'non-veg': 'Non-Vegetarian',
      both: 'Both',
    };
    return labels[pref] || pref;
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Inquiries Management</h1>
        <p className="text-sm sm:text-base text-gray-600">View and respond to customer inquiries</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setSelectedStatus(filter.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === filter.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
              {filter.value !== 'all' && statusCounts[filter.value] > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/40 bg-opacity-30 rounded-full text-xs">
                  {statusCounts[filter.value]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No inquiries yet</h3>
          <p className="text-gray-600">
            {selectedStatus === 'all' 
              ? 'You have no inquiries at the moment'
              : `No ${selectedStatus} inquiries found`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <img
                    src={inquiry.userId?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(inquiry.userName)}&background=f97316&color=fff`}
                    alt={inquiry.userName}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{inquiry.userName}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(inquiry.status)}
                      {!inquiry.viewedByVendor && (
                        <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                          New
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(inquiry)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium inline-flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => openResponseModal(inquiry)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium inline-flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {inquiry.vendorResponse ? 'Update' : 'Respond'}
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span>{new Date(inquiry.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span>{inquiry.guestCount} Guests</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                  <span>{getEventTypeLabel(inquiry.eventType)}</span>
                </div>
                {inquiry.budgetPerPlate?.min && inquiry.budgetPerPlate?.max && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <DollarSign className="w-4 h-4 text-orange-500" />
                    <span>₹{inquiry.budgetPerPlate.min}-{inquiry.budgetPerPlate.max}/plate</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-700 line-clamp-2">{inquiry.message}</p>
              </div>

              {inquiry.vendorResponse && (
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Your Response:</p>
                  <p className="text-sm text-gray-700">{inquiry.vendorResponse.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Sent on {new Date(inquiry.vendorResponse.respondedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">Inquiry Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedInquiry.userName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${selectedInquiry.userEmail}`} className="text-blue-600 hover:underline">
                      {selectedInquiry.userEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${selectedInquiry.userPhone}`} className="text-blue-600 hover:underline">
                      {selectedInquiry.userPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Event Details</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{new Date(selectedInquiry.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedInquiry.guestCount} Guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <UtensilsCrossed className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{getEventTypeLabel(selectedInquiry.eventType)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-700">Food: {getFoodPreferenceLabel(selectedInquiry.foodPreference)}</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Event Location</h3>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p>{selectedInquiry.eventLocation.address}</p>
                    <p>{selectedInquiry.eventLocation.city}, {selectedInquiry.eventLocation.state} - {selectedInquiry.eventLocation.pincode}</p>
                  </div>
                </div>
              </div>

              {/* Budget */}
              {selectedInquiry.budgetPerPlate?.min && selectedInquiry.budgetPerPlate?.max && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Budget Per Plate</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>₹{selectedInquiry.budgetPerPlate.min} - ₹{selectedInquiry.budgetPerPlate.max}</span>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer Message</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Status</h3>
                {getStatusBadge(selectedInquiry.status)}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  openResponseModal(selectedInquiry);
                }}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                {selectedInquiry.vendorResponse ? 'Update Response' : 'Send Response'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Respond to Inquiry</h2>
              <button
                onClick={() => setShowResponseModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Update Status
                </label>
                <select
                  value={responseForm.status}
                  onChange={(e) => setResponseForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Message
                </label>
                <textarea
                  value={responseForm.message}
                  onChange={(e) => setResponseForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Thank you for your inquiry. We would love to cater your event..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowResponseModal(false)}
                disabled={responding}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRespond}
                disabled={responding}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {responding ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Response
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
