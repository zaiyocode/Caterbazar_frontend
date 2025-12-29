"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyInquiries, cancelInquiry, Inquiry } from '@/api/user/inquiry.api';
import { getMyReviews, Review } from '@/api/user/review.api';
import { Calendar, MessageSquare, Star, Trash2, Eye, Phone, User as UserIcon, CheckCircle, Clock, Package, Edit, MapPin, X } from 'lucide-react';
import ReviewModal from '@/components/Modals/ReviewModal';

export default function MyInquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'inquiries' | 'reviews'>('inquiries');
  const [loading, setLoading] = useState(true);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedInquiryForDetails, setSelectedInquiryForDetails] = useState<Inquiry | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/auth");
      return;
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (!loading) {
      if (activeTab === 'inquiries') {
        fetchInquiries();
      } else {
        fetchReviews();
      }
    }
  }, [activeTab, statusFilter, currentPage, loading]);

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const params: any = { page: currentPage, limit: 10 };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await getMyInquiries(params);
      if (response.success) {
        setInquiries(response.data.inquiries);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error: any) {
      console.error("Failed to fetch inquiries:", error);
      if (error.response?.status === 401) {
        router.push("/auth");
      }
    } finally {
      setInquiriesLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await getMyReviews({ page: currentPage, limit: 10 });
      if (response.success) {
        setReviews(response.data.reviews);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error: any) {
      console.error("Failed to fetch reviews:", error);
      if (error.response?.status === 401) {
        router.push("/auth");
      }
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleCancelInquiry = async (inquiryId: string) => {
    if (!confirm("Are you sure you want to cancel this inquiry?")) return;

    try {
      const response = await cancelInquiry(inquiryId);
      if (response.success) {
        fetchInquiries();
      }
    } catch (error) {
      console.error("Failed to cancel inquiry:", error);
      alert("Failed to cancel inquiry. Please try again.");
    }
  };

  const handleWriteReview = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    fetchInquiries();
    fetchReviews();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      converted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Activity</h1>
          <p className="text-gray-600 mt-1">Track your inquiries and reviews</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => {
                  setActiveTab('inquiries');
                  setCurrentPage(1);
                }}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'inquiries'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  My Inquiries
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('reviews');
                  setCurrentPage(1);
                }}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-5 h-5" />
                  My Reviews
                </div>
              </button>
            </div>
          </div>

          {/* Inquiries Tab Content */}
          {activeTab === 'inquiries' && (
            <div className="p-6">
              {/* Status Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'contacted', 'converted', 'rejected', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === status
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquiries List */}
              {inquiriesLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading inquiries...</p>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No inquiries found</p>
                  <button
                    onClick={() => router.push('/vendors')}
                    className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Browse Vendors
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inquiry) => (
                    <div
                      key={inquiry._id}
                      className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Left - Summary Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                {typeof inquiry.vendorId === 'object' && inquiry.vendorId.fullName}
                              </h3>
                              <p className="text-xs text-gray-600 mt-1">
                                {inquiry.eventType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} • {formatDate(inquiry.eventDate)}
                              </p>
                            </div>
                          </div>

                          {/* Quick Info */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <UserIcon className="w-3.5 h-3.5" />
                              <span>{inquiry.guestCount} guests</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="capitalize">{inquiry.foodPreference}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{formatDate(inquiry.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right - Status & Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              {getStatusBadge(inquiry.status)}
                              {inquiry.viewedByVendor && (
                                <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                  <Eye className="w-3 h-3" />
                                  Viewed
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedInquiryForDetails(inquiry);
                                  setDetailsModalOpen(true);
                                }}
                                className="px-3 py-1.5 text-xs sm:text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors whitespace-nowrap"
                              >
                                View Details
                              </button>

                              {inquiry.status === 'pending' && (
                                <button
                                  onClick={() => handleCancelInquiry(inquiry._id)}
                                  className="px-3 py-1.5 text-xs sm:text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}

                              {(inquiry.status === 'converted' || inquiry.status === 'contacted') && (
                                <button
                                  onClick={() => handleWriteReview(inquiry)}
                                  className="px-3 py-1.5 text-xs sm:text-sm text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
                                >
                                  Review
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab Content */}
          {activeTab === 'reviews' && (
            <div className="p-6">
              {reviewsLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No reviews yet</p>
                  <p className="text-gray-400 text-sm mt-2">Reviews will appear here after your events</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {review.vendorId.fullName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {review.inquiryId.eventType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} • {formatDate(review.inquiryId.eventDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-lg">{review.rating}</span>
                        </div>
                      </div>

                      {review.title && (
                        <h4 className="text-base font-semibold text-gray-900 mb-2">{review.title}</h4>
                      )}

                      <p className="text-gray-700 mb-3">{review.comment}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-600">Food Quality</div>
                          <div className="font-semibold text-orange-600">{review.foodQuality}/5</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-600">Service</div>
                          <div className="font-semibold text-orange-600">{review.serviceQuality}/5</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-600">Value</div>
                          <div className="font-semibold text-orange-600">{review.valueForMoney}/5</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-600">Hygiene</div>
                          <div className="font-semibold text-orange-600">{review.hygiene}/5</div>
                        </div>
                      </div>

                      {review.vendorResponse && (
                        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Vendor Response:</p>
                          <p className="text-sm text-blue-800">{review.vendorResponse.message}</p>
                          <p className="text-xs text-blue-600 mt-1">
                            {formatDate(review.vendorResponse.respondedAt)}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        <span>Posted: {formatDate(review.createdAt)}</span>
                        {review.isVerified && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {detailsModalOpen && selectedInquiryForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Inquiry Details</h2>
                  <p className="text-orange-100 text-sm mt-1">
                    {typeof selectedInquiryForDetails.vendorId === 'object' && selectedInquiryForDetails.vendorId.fullName}
                  </p>
                </div>
                <button
                  onClick={() => setDetailsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Vendor Info */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Vendor Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">
                      {typeof selectedInquiryForDetails.vendorId === 'object' && selectedInquiryForDetails.vendorId.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900 break-all">
                      {typeof selectedInquiryForDetails.vendorId === 'object' && selectedInquiryForDetails.vendorId.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Event Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-900">{formatDate(selectedInquiryForDetails.eventDate)}</span>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Event Type</p>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedInquiryForDetails.eventType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Guest Count</p>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-gray-900">{selectedInquiryForDetails.guestCount} Guests</span>
                  </div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Food Preference</p>
                  <span className="text-sm font-medium text-gray-900 capitalize">{selectedInquiryForDetails.foodPreference}</span>
                </div>
              </div>

              {/* Your Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Your Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">{selectedInquiryForDetails.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900 break-all">{selectedInquiryForDetails.userEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-900">{selectedInquiryForDetails.userPhone}</span>
                  </div>
                </div>
              </div>

              {/* Event Location */}
              {selectedInquiryForDetails.eventLocation && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    Event Location
                  </h3>
                  <div className="space-y-2 text-sm">
                    {selectedInquiryForDetails.eventLocation.address && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-gray-900">{selectedInquiryForDetails.eventLocation.address}</span>
                      </div>
                    )}
                    {selectedInquiryForDetails.eventLocation.city && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">City:</span>
                        <span className="font-medium text-gray-900">{selectedInquiryForDetails.eventLocation.city}</span>
                      </div>
                    )}
                    {selectedInquiryForDetails.eventLocation.state && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">State:</span>
                        <span className="font-medium text-gray-900">{selectedInquiryForDetails.eventLocation.state}</span>
                      </div>
                    )}
                    {selectedInquiryForDetails.eventLocation.pincode && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pincode:</span>
                        <span className="font-medium text-gray-900">{selectedInquiryForDetails.eventLocation.pincode}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Message */}
              {selectedInquiryForDetails.message && (
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Your Message</p>
                  <p className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border-l-4 border-orange-500">
                    {selectedInquiryForDetails.message}
                  </p>
                </div>
              )}

              {/* Vendor Response */}
              {selectedInquiryForDetails.vendorResponse?.message && (
                <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                  <p className="text-sm font-semibold text-orange-900 mb-2">Vendor Response:</p>
                  <p className="text-sm text-orange-800 mb-2">{selectedInquiryForDetails.vendorResponse.message}</p>
                  <p className="text-xs text-orange-600">
                    {formatDate(selectedInquiryForDetails.vendorResponse.respondedAt!)}
                  </p>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Status:</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedInquiryForDetails.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Sent On:</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedInquiryForDetails.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Viewed by Vendor:</p>
                    <p className="font-medium text-gray-900">{selectedInquiryForDetails.viewedByVendor ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedInquiry && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedInquiry(null);
          }}
          vendorId={typeof selectedInquiry.vendorId === 'object' ? selectedInquiry.vendorId._id : selectedInquiry.vendorId}
          vendorName={typeof selectedInquiry.vendorId === 'object' ? selectedInquiry.vendorId.fullName : ''}
          inquiryId={selectedInquiry._id}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}
