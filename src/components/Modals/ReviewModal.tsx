"use client";

import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { createReview, CreateReviewData } from '@/api/user/review.api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName: string;
  inquiryId: string;
  onSuccess?: () => void;
}

export default function ReviewModal({ isOpen, onClose, vendorId, vendorName, inquiryId, onSuccess }: ReviewModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    foodQuality: 5,
    serviceQuality: 5,
    valueForMoney: 5,
    hygiene: 5,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleRatingChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validation
    if (!formData.title.trim()) {
      setError("Please provide a review title");
      setIsSubmitting(false);
      return;
    }

    if (!formData.comment.trim()) {
      setError("Please provide a review comment");
      setIsSubmitting(false);
      return;
    }

    try {
      const reviewData: CreateReviewData = {
        vendorId,
        inquiryId,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        foodQuality: formData.foodQuality,
        serviceQuality: formData.serviceQuality,
        valueForMoney: formData.valueForMoney,
        hygiene: formData.hygiene,
      };

      const response = await createReview(reviewData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
          // Reset form
          setFormData({
            rating: 5,
            title: '',
            comment: '',
            foodQuality: 5,
            serviceQuality: 5,
            valueForMoney: 5,
            hygiene: 5,
          });
          setSuccess(false);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (field: string, value: number, label: string) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(field, star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-lg font-semibold text-gray-700">{value}/5</span>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Write a Review</h2>
              <p className="text-white/90 text-sm mt-1">for {vendorName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-2 border-green-200 text-green-800 p-4 rounded-lg">
              <p className="font-semibold">Review submitted successfully! ✓</p>
              <p className="text-sm mt-1">Thank you for your feedback!</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-lg">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Overall Rating */}
          {renderStarRating('rating', formData.rating, 'Overall Rating *')}

          {/* Review Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Review Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Excellent Service"
              required
              maxLength={100}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Share your experience with this vendor..."
              required
              rows={5}
              maxLength={1000}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.comment.length}/1000 characters</p>
          </div>

          {/* Detailed Ratings */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Ratings</h3>
            <div className="space-y-4">
              {renderStarRating('foodQuality', formData.foodQuality, 'Food Quality')}
              {renderStarRating('serviceQuality', formData.serviceQuality, 'Service Quality')}
              {renderStarRating('valueForMoney', formData.valueForMoney, 'Value for Money')}
              {renderStarRating('hygiene', formData.hygiene, 'Hygiene')}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : success ? 'Submitted!' : 'Submit Review'}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Your review will be verified and published after admin approval.
          </p>
        </form>
      </div>
    </div>
  );
}
