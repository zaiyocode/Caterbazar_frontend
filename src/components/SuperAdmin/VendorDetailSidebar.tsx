"use client";

import React, { useEffect, useState } from 'react';
import { 
  X, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, 
  Clock, User, Shield, Activity, AlertCircle, Loader2, Building2
} from 'lucide-react';
import { 
  getVendorById, 
  toggleCaterbazarChoice, 
  toggleVendorActive, 
  type Vendor 
} from '@/api/superadmin/vendor.api';

interface VendorDetailSidebarProps {
  vendorId: string;
  isOpen: boolean;
  onClose: () => void;
  isAdminPanel?: boolean;
}

export default function VendorDetailSidebar({ vendorId, isOpen, onClose, isAdminPanel = false }: VendorDetailSidebarProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen && vendorId) {
      fetchVendorDetails();
    }
  }, [isOpen, vendorId]);

  const fetchVendorDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getVendorById(vendorId);
      if (response.success) {
        setVendor(response.data.vendor);
        setAnalytics(response.data.analytics);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatLabel = (str: string) => {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Helper functions for safe data access
  const getBrandName = () => {
    if (typeof vendor?.businessRegistrationId === 'object' && vendor?.businessRegistrationId && 'brandName' in vendor.businessRegistrationId) {
      return (vendor.businessRegistrationId as any).brandName;
    }
    return vendor?.userId?.fullName || 'N/A';
  };

  const getVendorStatus = () => {
    return vendor?.accountStatus || (vendor?.isActive ? 'active' : 'pending');
  };

  const hasBusinessInfo = () => {
    return vendor?.businessInfo && (vendor.businessInfo.yearOfEstablishment || vendor.businessInfo.teamSize);
  };

  const hasCapacityInfo = () => {
    return vendor?.capacity && (vendor.capacity.minGuests || vendor.capacity.maxGuests || vendor.capacity.vendorCategory);
  };

  const hasAddressInfo = () => {
    return vendor?.address && (vendor.address.locality || vendor.address.state || vendor.address.country);
  };

  const hasPricingInfo = () => {
    return vendor?.pricing && (vendor.pricing.vegPricePerPlate || vendor.pricing.nonVegPricePerPlate);
  };

  const hasServicesInfo = () => {
    return vendor?.pricing && (vendor.pricing.servicesSpecialization?.length > 0 || vendor.pricing.cuisineOptions?.length > 0);
  };

  const hasOperationsInfo = () => {
    return vendor?.operations && (vendor.operations.languagesSpoken?.length > 0 || vendor.operations.operationalRadius || vendor.operations.weeksAdvanceBooking);
  };

  const handleToggleCaterbazarChoice = async () => {
    if (!vendor) return;
    setActionLoading('choice');
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await toggleCaterbazarChoice(vendor.userId?._id);
      if (response.success) {
        setSuccessMessage(response.message);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchVendorDetails(); // Refresh vendor data
      }
    } catch (err: any) {
      setError(err.message || 'Failed to toggle Caterbazar Choice');
      setTimeout(() => setError(''), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async () => {
    if (!vendor) return;
    setActionLoading('active');
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await toggleVendorActive(vendor.userId?._id);
      if (response.success) {
        setSuccessMessage(response.message);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchVendorDetails(); // Refresh vendor data
      }
    } catch (err: any) {
      setError(err.message || 'Failed to toggle vendor status');
      setTimeout(() => setError(''), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[90%] md:w-[600px] lg:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-orange-500 to-red-500 text-white p-4 sm:p-6 z-10">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Vendor Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-3 sm:px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-300 text-green-800 px-3 sm:px-4 py-3 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm">{successMessage}</span>
            </div>
          )}

          {vendor && !loading && (
            <div className="flex items-center gap-3 sm:gap-4">
              {vendor.profilePhoto ? (
                <img
                  src={vendor.profilePhoto}
                  alt={vendor.userId?.fullName || 'Vendor'}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white text-lg sm:text-2xl font-bold">
                    {getInitials(vendor.userId?.fullName || 'V')}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-white truncate">{getBrandName()}</h3>
                <p className="text-white/90 text-xs sm:text-sm mt-0.5">{vendor.role?.toUpperCase() || 'VENDOR'}</p>
                <span className={`inline-block mt-1.5 sm:mt-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold border ${getStatusColor(getVendorStatus())}`}>
                  {getVendorStatus().toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {vendor && !loading && (
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-xs sm:text-sm text-gray-900 font-medium break-all">{vendor.userId?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3 pt-3 border-t border-gray-200">
                  <Phone className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">WhatsApp Number</p>
                    <p className="text-xs sm:text-sm text-gray-900 font-medium">{vendor.socialMedia?.whatsappNumber || 'N/A'}</p>
                  </div>
                </div>

                {vendor.socialMedia?.personalWebsite && (
                  <div className="flex items-start gap-2 sm:gap-3 pt-3 border-t border-gray-200">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Website</p>
                      <a href={vendor.socialMedia.personalWebsite} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-blue-600 hover:underline break-all">
                        {vendor.socialMedia.personalWebsite}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Information */}
            {vendor.userId && (
              <div className="bg-linear-to-br from-indigo-50 to-indigo-50/50 rounded-xl p-4 sm:p-5 border border-indigo-200 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  User Information
                </h3>
                <div className="space-y-3">
                  {/* <div className="bg-white rounded-lg p-3 border border-indigo-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">User ID</p>
                    <p className="text-xs sm:text-sm text-gray-900 font-mono break-all">{vendor.userId._id}</p>
                  </div> */}

                  <div className="bg-white rounded-lg p-3 border border-indigo-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">Full Name</p>
                    <p className="text-xs sm:text-sm text-gray-900 font-semibold">{vendor.userId.fullName}</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-indigo-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                    <p className="text-xs sm:text-sm text-gray-900 font-semibold break-all">{vendor.userId.email}</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-indigo-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">Phone Number</p>
                    <p className="text-xs sm:text-sm text-gray-900 font-semibold">{vendor.userId.phoneNumber || 'N/A'}</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-indigo-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">Account Created</p>
                    <p className="text-xs sm:text-sm text-gray-900 font-semibold">{formatDate(vendor.userId.createdAt)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Business Registration Information */}
            {vendor.businessRegistrationId && (
              <div className="bg-linear-to-br from-amber-50 to-amber-50/50 rounded-xl p-4 sm:p-5 border border-amber-200 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  Business Registration
                </h3>
                <div className="space-y-3">
                  {typeof vendor.businessRegistrationId === 'object' ? (
                    <>
                      {/* <div className="bg-white rounded-lg p-3 border border-amber-100">
                        <p className="text-xs text-gray-500 font-medium mb-1">Registration ID</p>
                        <p className="text-xs sm:text-sm text-gray-900 font-mono break-all">{(vendor.businessRegistrationId as any)._id || 'N/A'}</p>
                      </div> */}

                      {(vendor.businessRegistrationId as any).brandName && (
                        <div className="bg-white rounded-lg p-3 border border-amber-100">
                          <p className="text-xs text-gray-500 font-medium mb-1">Brand Name</p>
                          <p className="text-xs sm:text-sm text-gray-900 font-semibold">{(vendor.businessRegistrationId as any).brandName}</p>
                        </div>
                      )}

                      {(vendor.businessRegistrationId as any).businessType && (
                        <div className="bg-white rounded-lg p-3 border border-amber-100">
                          <p className="text-xs text-gray-500 font-medium mb-1">Business Type</p>
                          <p className="text-xs sm:text-sm text-gray-900 font-semibold capitalize">{(vendor.businessRegistrationId as any).businessType}</p>
                        </div>
                      )}

                      {(vendor.businessRegistrationId as any).registrationNumber && (
                        <div className="bg-white rounded-lg p-3 border border-amber-100">
                          <p className="text-xs text-gray-500 font-medium mb-1">Registration Number</p>
                          <p className="text-xs sm:text-sm text-gray-900 font-semibold">{(vendor.businessRegistrationId as any).registrationNumber}</p>
                        </div>
                      )}

                      {(vendor.businessRegistrationId as any).panNumber && (
                        <div className="bg-white rounded-lg p-3 border border-amber-100">
                          <p className="text-xs text-gray-500 font-medium mb-1">PAN Number</p>
                          <p className="text-xs sm:text-sm text-gray-900 font-semibold">{(vendor.businessRegistrationId as any).panNumber}</p>
                        </div>
                      )}

                      {(vendor.businessRegistrationId as any).gstNumber && (
                        <div className="bg-white rounded-lg p-3 border border-amber-100">
                          <p className="text-xs text-gray-500 font-medium mb-1">GST Number</p>
                          <p className="text-xs sm:text-sm text-gray-900 font-semibold">{(vendor.businessRegistrationId as any).gstNumber}</p>
                        </div>
                      )}

                      {(vendor.businessRegistrationId as any).businessAddress && (
                        <div className="bg-white rounded-lg p-3 border border-amber-100">
                          <p className="text-xs text-gray-500 font-medium mb-1">Business Address</p>
                          <p className="text-xs sm:text-sm text-gray-900 font-semibold">{(vendor.businessRegistrationId as any).businessAddress}</p>
                        </div>
                      )}

                      {(vendor.businessRegistrationId as any).ownerName && (
                        <div className="bg-white rounded-lg p-3 border border-amber-100">
                          <p className="text-xs text-gray-500 font-medium mb-1">Owner Name</p>
                          <p className="text-xs sm:text-sm text-gray-900 font-semibold">{(vendor.businessRegistrationId as any).ownerName}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-white rounded-lg p-3 border border-amber-100">
                      <p className="text-xs text-gray-500 font-medium mb-1">Registration ID</p>
                      <p className="text-xs sm:text-sm text-gray-900 font-mono break-all">{vendor.businessRegistrationId}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Media */}
            {(vendor.socialMedia?.facebookHandle || vendor.socialMedia?.instagramHandle || vendor.socialMedia?.personalWebsite) && (
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Social Media</h3>
                <div className="space-y-2">
                  {vendor.socialMedia.facebookHandle && (
                    <a href={vendor.socialMedia.facebookHandle} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">f</span>
                      </div>
                      <span className="text-sm text-gray-700 hover:text-blue-600">Facebook</span>
                    </a>
                  )}
                  {vendor.socialMedia.instagramHandle && (
                    <a href={vendor.socialMedia.instagramHandle} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="text-pink-600 font-bold text-sm">📷</span>
                      </div>
                      <span className="text-sm text-gray-700 hover:text-pink-600">Instagram</span>
                    </a>
                  )}
                  {vendor.socialMedia.personalWebsite && (
                    <a href={vendor.socialMedia.personalWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-bold text-sm">🌐</span>
                      </div>
                      <span className="text-sm text-gray-700 hover:text-gray-900 truncate">{vendor.socialMedia.personalWebsite}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                Vendor Profile
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-600">Profile Status</span>
                  <span className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {vendor.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-600">Profile Complete</span>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${vendor.isProfileComplete ? 'text-green-600' : 'text-red-600'}`}>
                    {vendor.isProfileComplete ? (
                      <><CheckCircle className="w-4 h-4" /> Yes ({vendor.profileCompletionPercentage}%)</>
                    ) : (
                      <><XCircle className="w-4 h-4" /> No ({vendor.profileCompletionPercentage}%)</>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-600">Caterbazar Choice</span>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${vendor.isCaterbazarChoice ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {vendor.isCaterbazarChoice ? 'Yes ⭐' : 'No'}
                  </span>
                </div>

                {vendor.isCaterbazarChoice && vendor.caterbazarChoiceSetBy && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800 font-semibold mb-1">Caterbazar Choice ⭐</p>
                    <p className="text-xs text-gray-700">Set by: {vendor.caterbazarChoiceSetBy.fullName}</p>
                    {vendor.caterbazarChoiceSetAt && (
                      <p className="text-xs text-gray-600">On: {formatDate(vendor.caterbazarChoiceSetAt)}</p>
                    )}
                  </div>
                )}

               

                {vendor.bio && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 mb-1">Bio</p>
                    <p className="text-xs sm:text-sm text-gray-900">{vendor.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Business Information */}
            {(vendor.businessInfo || vendor.capacity || vendor.address) && (
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  Business Information
                </h3>
                <div className="space-y-3">
                  {vendor.capacity?.vendorCategory && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-xs sm:text-sm text-gray-600">Category</span>
                      <span className="text-xs sm:text-sm text-gray-900 font-medium capitalize">{vendor.capacity.vendorCategory.replace('_', ' ')}</span>
                    </div>
                  )}
                  {vendor.businessInfo?.yearOfEstablishment && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-xs sm:text-sm text-gray-600">Established</span>
                      <span className="text-xs sm:text-sm text-gray-900 font-medium">{vendor.businessInfo.yearOfEstablishment}</span>
                    </div>
                  )}
                  {vendor.businessInfo?.teamSize && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-xs sm:text-sm text-gray-600">Team Size</span>
                      <span className="text-xs sm:text-sm text-gray-900 font-medium">{vendor.businessInfo.teamSize}</span>
                    </div>
                  )}
                  {vendor.capacity?.minGuests && vendor.capacity?.maxGuests && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-xs sm:text-sm text-gray-600">Guest Capacity</span>
                      <span className="text-xs sm:text-sm text-gray-900 font-medium">{vendor.capacity.minGuests} - {vendor.capacity.maxGuests}</span>
                    </div>
                  )}
                  {vendor.address?.locality && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-xs sm:text-sm text-gray-600">Location</span>
                      <span className="text-xs sm:text-sm text-gray-900 font-medium text-right">
                        {vendor.address.locality}, {vendor.address.state}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Services & Cuisine */}
            {vendor.pricing && (vendor.pricing.servicesSpecialization?.length > 0 || vendor.pricing.cuisineOptions?.length > 0) && (
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Services & Cuisine</h3>
                
                {vendor.pricing.servicesSpecialization?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Services Offered</p>
                    <div className="flex flex-wrap gap-2">
                      {vendor.pricing.servicesSpecialization.map((service, index) => (
                        <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                          {formatLabel(service)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {vendor.pricing.cuisineOptions?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Cuisine Options</p>
                    <div className="flex flex-wrap gap-2">
                      {vendor.pricing.cuisineOptions.map((cuisine, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {formatLabel(cuisine)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pricing Information */}
            {vendor.pricing && (
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Pricing</h3>
                
                {/* Veg & Non-Veg Pricing - For Full Catering and Other */}
                {(vendor.capacity?.vendorCategory === 'full_catering' || vendor.capacity?.vendorCategory === 'other') ? (
                  <div className="grid grid-cols-2 gap-3">
                    {vendor.pricing.vegPricePerPlate && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-xs text-green-600 mb-1">Veg Per Plate</p>
                        <p className="text-lg font-bold text-green-900">₹{vendor.pricing.vegPricePerPlate}</p>
                      </div>
                    )}
                    {vendor.pricing.nonVegPricePerPlate && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-xs text-red-600 mb-1">Non-Veg Per Plate</p>
                        <p className="text-lg font-bold text-red-900">₹{vendor.pricing.nonVegPricePerPlate}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white p-3 rounded-lg border border-gray-300">
                    <p className="text-xs text-gray-600 mb-1">Starting Price</p>
                    <p className="text-lg font-bold text-gray-900">₹{vendor.pricing.vegPricePerPlate || 'N/A'}</p>
                  </div>
                )}

                {/* Service Specialization - Only for Full Catering and Other */}
                {(vendor.capacity?.vendorCategory === 'full_catering' || vendor.capacity?.vendorCategory === 'other') && vendor.pricing.servicesSpecialization?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <p className="text-xs text-gray-600 mb-2 font-semibold">Services Offered</p>
                    <div className="flex flex-wrap gap-2">
                      {vendor.pricing.servicesSpecialization.map((service, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                          {service.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cuisine Options - Only for Full Catering and Other */}
                {(vendor.capacity?.vendorCategory === 'full_catering' || vendor.capacity?.vendorCategory === 'other') && vendor.pricing.cuisineOptions?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <p className="text-xs text-gray-600 mb-2 font-semibold">Cuisine Options</p>
                    <div className="flex flex-wrap gap-2">
                      {vendor.pricing.cuisineOptions.map((cuisine, index) => (
                        <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium capitalize">
                          {cuisine.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Operations & Languages */}
            {vendor.operations && (vendor.operations.languagesSpoken?.length > 0 || vendor.operations.operationalRadius || vendor.operations.weeksAdvanceBooking) && (
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Operations</h3>
                <div className="space-y-3">
                  {vendor.operations.languagesSpoken?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Languages Spoken</p>
                      <div className="flex flex-wrap gap-2">
                        {vendor.operations.languagesSpoken.map((lang, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium capitalize">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {vendor.operations.operationalRadius && (
                    <div className="flex items-center justify-between py-2 border-t border-gray-200">
                      <span className="text-xs sm:text-sm text-gray-600">Operational Radius</span>
                      <span className="text-xs sm:text-sm text-gray-900 font-medium">{vendor.operations.operationalRadius} km</span>
                    </div>
                  )}
                  {vendor.operations.weeksAdvanceBooking && (
                    <div className="flex items-center justify-between py-2 border-t border-gray-200">
                      <span className="text-xs sm:text-sm text-gray-600">Advance Booking</span>
                      <span className="text-xs sm:text-sm text-gray-900 font-medium">{vendor.operations.weeksAdvanceBooking} weeks</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cancellation Policy */}
            {vendor.cancellationPolicy?.policyType && (
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Cancellation Policy</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold capitalize">
                      {formatLabel(vendor.cancellationPolicy.policyType)}
                    </span>
                  </div>
                  {vendor.cancellationPolicy.policyDetails && (
                    <p className="text-xs sm:text-sm text-gray-700 mt-5"> <span className='text-black font-medium'> Policy Details : </span>{vendor.cancellationPolicy.policyDetails}</p>
                  )}
                </div>
              </div>
            )}

            {/* Stats */}
            {(vendor.stats || analytics) && (
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  Statistics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-2xl font-bold text-gray-900">{vendor.stats?.totalInquiries || analytics?.inquiriesCount || 0}</p>
                    <p className="text-xs text-gray-600 mt-1">Total Inquiries</p>
                  </div>
                  {analytics?.pendingInquiries !== undefined && (
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-2xl font-bold text-yellow-900">{analytics.pendingInquiries}</p>
                      <p className="text-xs text-gray-600 mt-1">Pending Inquiries</p>
                    </div>
                  )}
                  <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-2xl font-bold text-gray-900">{vendor.stats?.totalReviews || analytics?.reviewsCount || 0}</p>
                    <p className="text-xs text-gray-600 mt-1">Total Reviews</p>
                  </div>
                  {analytics?.approvedReviews !== undefined && (
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-2xl font-bold text-green-900">{analytics.approvedReviews}</p>
                      <p className="text-xs text-gray-600 mt-1">Approved Reviews</p>
                    </div>
                  )}
                  <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-2xl font-bold text-gray-900">{vendor.stats?.averageRating?.toFixed(1) || '0.0'}</p>
                    <p className="text-xs text-gray-600 mt-1">Avg Rating</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-2xl font-bold text-gray-900">{vendor.analytics?.profileViews || 0}</p>
                    <p className="text-xs text-gray-600 mt-1">Profile Views</p>
                  </div>
                  {vendor.analytics?.responseRate !== undefined && (
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-2xl font-bold text-gray-900">{vendor.analytics.responseRate}%</p>
                      <p className="text-xs text-gray-600 mt-1">Response Rate</p>
                    </div>
                  )}
                  {vendor.stats?.totalCustomers !== undefined && (
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-2xl font-bold text-gray-900">{vendor.stats.totalCustomers}</p>
                      <p className="text-xs text-gray-600 mt-1">Total Customers</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Activity Timeline */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                Activity Timeline
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">User Created</p>
                    <p className="text-xs text-gray-600 wrap-break-word">{formatDate(vendor.userId?.createdAt || vendor.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Profile Created</p>
                    <p className="text-xs text-gray-600 wrap-break-word">{formatDate(vendor.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-xs text-gray-600 wrap-break-word">{formatDate(vendor.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isAdminPanel && (
            <div className="space-y-2 sm:space-y-3 pt-4 border-t border-gray-200">
              {vendor.isActive ? (
                <button 
                  onClick={handleToggleActive}
                  disabled={actionLoading === 'active'}
                  className="w-full bg-red-100 text-red-700 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading === 'active' ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Deactivate Vendor'
                  )}
                </button>
              ) : (
                <button 
                  onClick={handleToggleActive}
                  disabled={actionLoading === 'active'}
                  className="w-full bg-green-100 text-green-700 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading === 'active' ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Activate Vendor'
                  )}
                </button>
              )}
              {vendor.isCaterbazarChoice ? (
                <button 
                  onClick={handleToggleCaterbazarChoice}
                  disabled={actionLoading === 'choice'}
                  className="w-full bg-gray-100 text-gray-700 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading === 'choice' ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Remove Caterbazar Choice ⭐'
                  )}
                </button>
              ) : (
                <button 
                  onClick={handleToggleCaterbazarChoice}
                  disabled={actionLoading === 'choice'}
                  className="w-full bg-yellow-100 text-yellow-700 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading === 'choice' ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Mark as Caterbazar Choice ⭐'
                  )}
                </button>
              )}
            </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
