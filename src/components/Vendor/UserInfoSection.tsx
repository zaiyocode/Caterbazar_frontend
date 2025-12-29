"use client";

import React from 'react';
import { Mail, Phone, Calendar, MapPin, Building2, Award } from 'lucide-react';
import { VendorProfileData } from '@/api/user/public.api';

interface UserInfoSectionProps {
  vendor: VendorProfileData | null;
}

export default function UserInfoSection({ vendor }: UserInfoSectionProps) {
  if (!vendor) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section className="py-8 sm:py-12 bg-gray-50 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">Vendor Information</h2>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* User Info Card */}
          <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Personal Details</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Full Name</p>
                <p className="text-sm font-medium text-gray-900">{vendor.userId.fullName}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  Email
                </p>
                <p className="text-sm font-medium text-gray-900 break-all">{vendor.userId.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-900">{vendor.socialMedia?.whatsappNumber || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Account Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${vendor.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <p className={`text-sm font-medium ${vendor.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {vendor.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Member Since
                </p>
                <p className="text-sm font-medium text-gray-900">{formatDate(vendor.userId.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Business Info Card */}
          <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Business Details</h3>

            <div className="space-y-4">
              {vendor.businessRegistrationId?.brandName && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Brand Name</p>
                  <p className="text-sm font-medium text-gray-900">{vendor.businessRegistrationId.brandName}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Category</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {vendor.capacity.vendorCategory.replace(/_/g, ' ')}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  Location
                </p>
                <p className="text-sm font-medium text-gray-900">{vendor.address.locality}, {vendor.address.state}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Profile Completion</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${vendor.profileCompletionPercentage}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900 text-xs">{vendor.profileCompletionPercentage}%</span>
                </div>
              </div>

              {vendor.isCaterbazarChoice && (
                <div className="flex items-center gap-2 pt-1 text-orange-600">
                  <Award className="w-4 h-4" />
                  <p className="text-sm font-medium">Caterbazar Choice</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {vendor.bio && (
          <div className="mt-8 sm:mt-10">
            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-100">About the Business</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{vendor.bio}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
