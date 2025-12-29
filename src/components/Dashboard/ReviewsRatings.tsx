'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  X, 
  Send,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import {
  getVendorReviews,
  getReviewStats,
  respondToReview,
  Review
} from '@/api/vendor/review.api';

export default function ReviewsRatings() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responding, setResponding] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | undefined>();

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [pagination.page, selectedRatingFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getVendorReviews(
        pagination.page,
        pagination.limit,
        'createdAt',
        selectedRatingFilter
      );
      setReviews(response.data.reviews);
      setPagination(response.data.pagination);
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getReviewStats();
      setStats(response.data);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  const openResponseModal = (review: Review) => {
    setSelectedReview(review);
    setResponseMessage(review.vendorResponse?.message || '');
    setShowResponseModal(true);
  };

  const handleRespond = async () => {
    if (!selectedReview) return;

    if (!responseMessage.trim()) {
      setError('Please enter a response message');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setResponding(true);
    setError('');
    setSuccess('');

    try {
      // Same endpoint for both create and update
      const response = await respondToReview(selectedReview._id, {
        message: responseMessage,
      });

      // Update review in list
      setReviews(prev =>
        prev.map(rev => (rev._id === selectedReview._id ? response.data.review : rev))
      );

      setSuccess(selectedReview.vendorResponse ? 'Response updated successfully!' : 'Response posted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setShowResponseModal(false);
      setResponseMessage('');
    } catch (err: any) {
      console.error('Error responding to review:', err);
      setError(err.message || 'Failed to post response');
      setTimeout(() => setError(''), 5000);
    } finally {
      setResponding(false);
    }
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

  const getRatingPercentage = (stars: number) => {
    const totalCount = Object.values(stats.ratingDistribution).reduce((sum, count) => sum + count, 0);
    if (totalCount === 0) return 0;
    return Math.round((stats.ratingDistribution[stars as keyof typeof stats.ratingDistribution] / totalCount) * 100);
  };

  const ratingDistribution = [
    { stars: 5, count: stats.ratingDistribution[5], percentage: getRatingPercentage(5) },
    { stars: 4, count: stats.ratingDistribution[4], percentage: getRatingPercentage(4) },
    { stars: 3, count: stats.ratingDistribution[3], percentage: getRatingPercentage(3) },
    { stars: 2, count: stats.ratingDistribution[2], percentage: getRatingPercentage(2) },
    { stars: 1, count: stats.ratingDistribution[1], percentage: getRatingPercentage(1) }
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Reviews & Ratings</h1>
        <p className="text-sm sm:text-base text-gray-600">View and respond to customer reviews</p>
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

      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8" />
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.averageRating.toFixed(1)}</p>
          <p className="text-sm opacity-90">Average Rating</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalReviews}</p>
          <p className="text-sm text-gray-600">Total Reviews</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 sm:col-span-2">
          <p className="text-sm font-semibold text-gray-900 mb-3">Rating Distribution</p>
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-gray-700">{item.stars}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedRatingFilter(undefined);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedRatingFilter === undefined
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Ratings
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => {
                setSelectedRatingFilter(rating);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1 ${
                selectedRatingFilter === rating
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star className="w-4 h-4 fill-current" />
              {rating}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600">
            {selectedRatingFilter
              ? `No ${selectedRatingFilter}-star reviews found`
              : 'Your first review will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
              {/* Review Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  <img
                    src={
                      review.userId?.profilePicture ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userId?.fullName || 'User')}&background=f97316&color=fff`
                    }
                    alt={review.userId?.fullName || 'User'}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {review.userId?.fullName || 'Anonymous User'}
                      </h3>
                      {review.isVerified && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full shrink-0">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      {review.adminApproved && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-semibold">
                          Approved
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openResponseModal(review)}
                  className={`px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base font-medium shrink-0 inline-flex items-center gap-2 ${
                    review.vendorResponse
                      ? 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {review.vendorResponse ? 'Edit Response' : 'Reply'}
                </button>
              </div>

              {/* Review Content */}
              {review.title && (
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {review.title}
                </h4>
              )}
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                {review.comment}
              </p>

              {/* Detailed Ratings */}
              {(review.foodQuality || review.serviceQuality || review.valueForMoney || review.hygiene) && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  {review.foodQuality && (
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Food Quality</p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">{review.foodQuality}</span>
                      </div>
                    </div>
                  )}
                  {review.serviceQuality && (
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Service</p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">{review.serviceQuality}</span>
                      </div>
                    </div>
                  )}
                  {review.valueForMoney && (
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Value</p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">{review.valueForMoney}</span>
                      </div>
                    </div>
                  )}
                  {review.hygiene && (
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Hygiene</p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">{review.hygiene}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Vendor Response */}
              {review.vendorResponse && (
                <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-4">
                  <p className="text-xs font-semibold text-orange-700 mb-2">Your Response:</p>
                  <p className="text-sm text-gray-700">{review.vendorResponse.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Responded on {new Date(review.vendorResponse.respondedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Review Footer */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4 border-t border-gray-100">
                <span className="text-xs sm:text-sm text-gray-600">
                  {review.helpfulCount} {review.helpfulCount === 1 ? 'person' : 'people'} found this helpful
                </span>
                {review.inquiryId && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs sm:text-sm rounded-full font-medium">
                    {getEventTypeLabel(review.inquiryId.eventType)} • {review.inquiryId.guestCount} Guests
                  </span>
                )}
              </div>
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

      {/* Response Modal */}
      {showResponseModal && selectedReview && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedReview.vendorResponse ? 'Edit Response' : 'Respond to Review'}
              </h2>
              <button
                onClick={() => setShowResponseModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Review Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={
                      selectedReview.userId.profilePicture ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedReview.userId.fullName)}&background=f97316&color=fff`
                    }
                    alt={selectedReview.userId.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{selectedReview.userId.fullName}</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= selectedReview.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{selectedReview.comment}</p>
              </div>

              {/* Response Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Response
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Thank you for your wonderful feedback! We're glad you enjoyed our service..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {selectedReview.vendorResponse
                    ? 'Update your response to this review'
                    : 'Note: You can edit your response anytime'}
                </p>
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
                    {selectedReview.vendorResponse ? 'Updating...' : 'Posting...'}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {selectedReview.vendorResponse ? 'Update Response' : 'Post Response'}
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
