"use client";

import React, { useState } from 'react';
import { X, Calendar, Users, MapPin, MessageSquare, Utensils } from 'lucide-react';
import { createInquiry, CreateInquiryData } from '@/api/user/inquiry.api';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName: string;
}

const eventTypes = [
  'wedding',
  'engagement',
  'reception',
  'birthday',
  'anniversary',
  'corporate',
  'conference',
  'seminar',
  'product_launch',
  'team_building',
  'festival',
  'religious',
  'farewell',
  'reunion',
  'other',
];

const foodPreferences = [
  { value: 'veg', label: 'Vegetarian' },
  { value: 'non_veg', label: 'Non-Vegetarian' },
  { value: 'both', label: 'Both' },
];

export default function InquiryModal({ isOpen, onClose, vendorId, vendorName }: InquiryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    eventDate: '',
    guestCount: '',
    eventType: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    foodPreference: 'both',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Check if user is logged in
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("Please login to send an inquiry");
      setIsSubmitting(false);
      setTimeout(() => {
        window.location.href = "/auth";
      }, 2000);
      return;
    }

    try {
      const inquiryData: CreateInquiryData = {
        vendorId,
        eventDate: formData.eventDate,
        guestCount: parseInt(formData.guestCount),
        eventType: formData.eventType,
        foodPreference: formData.foodPreference,
        message: formData.message,
      };

      // Add event location if any field is filled
      if (formData.address || formData.city || formData.state || formData.pincode) {
        inquiryData.eventLocation = {
          address: formData.address || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          pincode: formData.pincode || undefined,
        };
      }

      const response = await createInquiry(inquiryData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          // Reset form
          setFormData({
            eventDate: '',
            guestCount: '',
            eventType: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            foodPreference: 'both',
            message: '',
          });
          setSuccess(false);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Send Inquiry</h2>
              <p className="text-white/90 text-sm mt-1">to {vendorName}</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-2 border-green-200 text-green-800 p-4 rounded-lg">
              <p className="font-semibold">Inquiry sent successfully! ✓</p>
              <p className="text-sm mt-1">The vendor will contact you shortly.</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-lg">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Event Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Event Date *
            </label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 text-orange-500" />
              Event Type *
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
            >
              <option value="">Select event type</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Count */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Users className="w-4 h-4 text-orange-500" />
              Number of Guests *
            </label>
            <input
              type="number"
              name="guestCount"
              value={formData.guestCount}
              onChange={handleChange}
              min="1"
              max="100000"
              placeholder="e.g., 500"
              required
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
            />
          </div>

          {/* Food Preference */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Utensils className="w-4 h-4 text-orange-500" />
              Food Preference
            </label>
            <div className="flex gap-3">
              {foodPreferences.map((pref) => (
                <label
                  key={pref.value}
                  className="flex-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="foodPreference"
                    value={pref.value}
                    checked={formData.foodPreference === pref.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`p-3 border-2 rounded-lg text-center transition-all ${
                    formData.foodPreference === pref.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}>
                    {pref.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Event Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Event Location (Optional)
            </label>
            <div className="space-y-3">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street Address"
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                />
              </div>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                pattern="[0-9]{6}"
                maxLength={6}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 text-orange-500" />
              Additional Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us more about your requirements..."
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.message.length}/1000 characters</p>
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
              {isSubmitting ? 'Sending...' : success ? 'Sent!' : 'Send Inquiry'}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Your contact details will be shared with the vendor for this inquiry.
          </p>
        </form>
      </div>
    </div>
  );
}
