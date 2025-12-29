"use client";
import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ChevronDown, ChevronRight, Loader2, X, ChevronLeft } from 'lucide-react';
import { getVendorReviews, ReviewData, getVendorProfile, GalleryImage } from '@/api/user/public.api';

interface ReviewsSectionProps {
  vendorId: string;
}

export default function ReviewsSection({ vendorId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [highlightImages, setHighlightImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Fetch reviews and gallery images
  useEffect(() => {
    fetchReviews(true);
    fetchHighlightImages();
  }, [vendorId, sortBy, filterStars]);

  const fetchHighlightImages = async () => {
    try {
      const response = await getVendorProfile(vendorId);
      if (response.success) {
        const highlights = response.data.gallery.filter(img => img.category === 'highlights');
        setHighlightImages(highlights);
      }
    } catch (error) {
      console.error('Error fetching highlight images:', error);
    }
  };

  const fetchReviews = async (resetPage = false) => {
    const currentPage = resetPage ? 1 : pagination.page;
    
    if (resetPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getVendorReviews(vendorId, {
        page: currentPage,
        limit: pagination.limit,
        rating: filterStars || undefined,
        sortBy: sortBy,
      });

      if (response.success) {
        if (resetPage) {
          setReviews(response.data.reviews);
        } else {
          setReviews(prev => [...prev, ...response.data.reviews]);
        }
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
      fetchReviews(false);
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterStars = (stars: number) => {
    setFilterStars(filterStars === stars ? null : stars);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Calculate average rating and rating breakdown from current reviews
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => Math.floor(r.rating) === stars).length;
    const percentage = pagination.total > 0 ? (count / pagination.total) * 100 : 0;
    return { stars, percentage, count };
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Gallery/Albums Section */}
        {highlightImages.length > 0 && (
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gallery Highlights</h2>
              <span className="text-sm text-gray-600">{highlightImages.length} Photos</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {(showAllImages ? highlightImages : highlightImages.slice(0, 5)).map((image, index) => (
                <div 
                  key={image._id}
                  onClick={() => setSelectedImageIndex(showAllImages ? highlightImages.indexOf(image) : index)}
                  className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-shadow"
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
            </div>
            
            {/* Show More Button */}
            {!showAllImages && highlightImages.length > 5 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowAllImages(true)}
                  className="px-6 py-2.5 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition-colors text-sm sm:text-base"
                >
                  View {highlightImages.length - 5} More Photos
                </button>
              </div>
            )}
          </div>
        )}

        {/* Rating Overview */}
        <div className="mb-6 sm:mb-8">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Left: Overall Rating */}
            <div className="text-center md:text-left">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex items-center gap-1 mb-2 justify-center md:justify-start">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      star <= Math.floor(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`} 
                  />
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-600">{pagination.total} Reviews</p>
            </div>

            {/* Right: Rating Breakdown */}
            <div className="space-y-2">
              {ratingBreakdown.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 w-6 sm:w-8">{rating.stars}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                    <div
                      className="bg-orange-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 w-10 sm:w-12 text-right">{rating.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="mt-6">
            <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base">
              <Star className="w-4 h-4 sm:w-5 sm:h-5" />
              Write a Review
            </button>
          </div> */}
        </div>

        {/* Filters */}
        <div className="border border-gray-200 px-3 sm:px-4 py-4 sm:py-5 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
            {/* Sort By */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
              <div className="relative flex-1 lg:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full lg:w-auto px-3 sm:px-4 py-2 pr-8 sm:pr-10 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium appearance-none bg-white cursor-pointer hover:border-gray-400"
                >
                  <option value="createdAt">Newest</option>
                  <option value="-rating">Highest Rating</option>
                  <option value="rating">Lowest Rating</option>
                  <option value="-helpfulCount">Most Helpful</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Filter by Stars */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Filter:</span>
              <div className="flex gap-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleFilterStars(star)}
                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      filterStars === star
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {star}★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              reviews.map((review) => (
            <div key={review._id} className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Avatar */}
                <img
                  src={review.userId?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userId?.fullName || 'User')}&background=random`}
                  alt={review.userId?.fullName || 'User'}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{review.userId?.fullName || 'Anonymous User'}</h3>
                    {review.isVerified && (
                      <span className="bg-green-100 text-green-700 text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full font-medium flex items-center gap-1 w-fit">
                        ✓ Verified Booking
                      </span>
                    )}
                  </div>

                  {/* Rating and Date */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                  </div>

                  {/* Review Title */}
                  <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base leading-snug">{review.title}</h4>

                  {/* Review Content */}
                  <p className="text-gray-700 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">{review.comment}</p>

                  {/* Detailed Ratings */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 sm:mb-4">
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                      <div className="text-[10px] sm:text-xs text-gray-600 mb-1">Food Quality</div>
                      <div className="flex items-center justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                              star <= review.foodQuality
                                ? 'fill-orange-400 text-orange-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-orange-600 mt-1">{review.foodQuality}/5</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                      <div className="text-[10px] sm:text-xs text-gray-600 mb-1">Service</div>
                      <div className="flex items-center justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                              star <= review.serviceQuality
                                ? 'fill-orange-400 text-orange-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-orange-600 mt-1">{review.serviceQuality}/5</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                      <div className="text-[10px] sm:text-xs text-gray-600 mb-1">Value</div>
                      <div className="flex items-center justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                              star <= review.valueForMoney
                                ? 'fill-orange-400 text-orange-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-orange-600 mt-1">{review.valueForMoney}/5</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                      <div className="text-[10px] sm:text-xs text-gray-600 mb-1">Hygiene</div>
                      <div className="flex items-center justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                              star <= review.hygiene
                                ? 'fill-orange-400 text-orange-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-orange-600 mt-1">{review.hygiene}/5</div>
                    </div>
                  </div>

                  {/* Images */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 mb-3 sm:mb-4 overflow-x-auto hide-scrollbar pb-2">
                      {review.photos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo}
                          alt={`Review ${idx + 1}`}
                          className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </div>
                  )}

                  {/* Vendor Response */}
                  {review.vendorResponse?.message && (
                    <div className="bg-orange-50 rounded-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-gray-900 mb-1">Vendor Response</p>
                      <p className="text-xs text-gray-700 mb-1">{review.vendorResponse.message}</p>
                      <p className="text-xs text-gray-500">{formatDate(review.vendorResponse.respondedAt)}</p>
                    </div>
                  )}

                  {/* Helpful Section */}
                  {/* <div className="flex items-center gap-3 sm:gap-4 pt-3 border-t border-gray-100">
                    <span className="text-xs sm:text-sm text-gray-600">Was this helpful?</span>
                    <button className="flex items-center gap-1 sm:gap-1.5 text-gray-600 hover:text-orange-500 transition-colors">
                      <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">{review.helpfulCount}</span>
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
            ))
            )}
          </div>
        )}

        {/* Load More Button */}
        {!loading && pagination.page < pagination.pages && (
          <div className="text-center mt-6 sm:mt-8">
            <button 
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-500 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Reviews'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && highlightImages.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
            {selectedImageIndex + 1} / {highlightImages.length}
          </div>

          {/* Previous Button */}
          {highlightImages.length > 1 && (
            <button
              onClick={() => setSelectedImageIndex(prev => 
                prev === 0 ? highlightImages.length - 1 : prev! - 1
              )}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Image */}
          <div className="flex items-center justify-center max-w-full max-h-[90vh]">
            <img
              src={highlightImages[selectedImageIndex].url}
              alt={highlightImages[selectedImageIndex].caption}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
          
          {/* Caption */}
          {highlightImages[selectedImageIndex].caption && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-2xl px-4">
              <p className="text-white text-center bg-black/60 px-4 py-2 rounded-lg text-sm sm:text-base">
                {highlightImages[selectedImageIndex].caption}
              </p>
            </div>
          )}

          {/* Next Button */}
          {highlightImages.length > 1 && (
            <button
              onClick={() => setSelectedImageIndex(prev => 
                prev === highlightImages.length - 1 ? 0 : prev! + 1
              )}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Thumbnail Navigation */}
          {highlightImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-full overflow-x-auto px-4">
              <div className="flex gap-2 sm:gap-3">
                {highlightImages.map((image, index) => (
                  <button
                    key={image._id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-orange-500 ring-2 ring-orange-300'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}