"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle, CheckCircle, Loader2, Clock, XCircle } from 'lucide-react';
import { submitBusinessRegistration, getBusinessRegistrationStatus } from '@/api/vendor/business.api';

const VENDOR_TYPES = {
  FULL_CATERING: 'full_catering',
  SNACKS_AND_STARTER: 'snacks_and_starter',
  DESSERT_AND_SWEET: 'dessert_and_sweet',
  BEVERAGE: 'beverage',
  PAAN: 'paan',
  WATER: 'water',
  OTHER: 'other',
};

export default function BusinessRegistration() {
  const [brandName, setBrandName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessMobile, setBusinessMobile] = useState("");
  const [location, setLocation] = useState("");
  const [vendorType, setVendorType] = useState("");
  const [referId, setReferId] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState<any>(null);

  // Check if user already has a registration
  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const response = await getBusinessRegistrationStatus();
        if (response.success && response.data?.registration) {
          setRegistrationStatus(response.data.registration);
          // Prefill form with existing data
          const reg = response.data.registration;
          setBrandName(reg.brandName);
          setBusinessEmail(reg.businessEmail);
          setBusinessMobile(reg.businessMobile);
          setLocation(reg.location);
          setVendorType(reg.vendorType);
          setReferId(reg.referId || "");
        }
      } catch (err: any) {
        // No registration found - that's okay, user can create one
        console.log('No existing registration');
      } finally {
        setCheckingStatus(false);
      }
    };

    checkRegistration();
  }, []);

  const handleRegistration = async () => {
    setError("");
    setSuccess("");

    // Validation
    if (!brandName || !businessEmail || !businessMobile || !location || !vendorType) {
      setError("Please fill in all required fields");
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the terms and privacy policy");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate mobile number (10 digits)
    if (businessMobile.length !== 10 || !/^\d+$/.test(businessMobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const response = await submitBusinessRegistration({
        brandName,
        businessEmail,
        businessMobile,
        location,
        vendorType,
        referId: referId || undefined,
      });

      if (response.success) {
        setSuccess(response.message);
        setRegistrationStatus(response.data.registration);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit business registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // If registration exists and is approved
  if (registrationStatus?.status === 'approved') {
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Business Registration</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Your business registration details</p>

        <div className="rounded-xl p-6 border border-green-200 bg-green-50">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-green-900">Registration Approved</h2>
              <p className="text-sm text-green-700">Your business has been successfully registered and approved</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 bg-white rounded-lg p-4 border border-green-200">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Brand Name</p>
                <p className="text-gray-900">{registrationStatus.brandName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Business Email</p>
                <p className="text-gray-900">{registrationStatus.businessEmail}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Business Mobile</p>
                <p className="text-gray-900">{registrationStatus.businessMobile}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Location</p>
                <p className="text-gray-900">{registrationStatus.location}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Vendor Type</p>
                <p className="text-gray-900 capitalize">{registrationStatus.vendorType.replace('_', ' ')}</p>
              </div>
              {registrationStatus.referId && (
                <div>
                  <p className="text-sm font-semibold text-gray-700">Refer ID</p>
                  <p className="text-gray-900">{registrationStatus.referId}</p>
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Approved on {new Date(registrationStatus.reviewedAt).toLocaleDateString()} at {new Date(registrationStatus.reviewedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If registration exists and is pending
  if (registrationStatus?.status === 'pending') {
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Business Registration</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Your business registration details</p>

        <div className="rounded-xl p-6 border border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <h2 className="text-xl font-bold text-yellow-900">Registration Under Review</h2>
              <p className="text-sm text-yellow-700">Your business registration is being reviewed by our team</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 bg-white rounded-lg p-4 border border-yellow-200">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Brand Name</p>
                <p className="text-gray-900">{registrationStatus.brandName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Business Email</p>
                <p className="text-gray-900">{registrationStatus.businessEmail}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Business Mobile</p>
                <p className="text-gray-900">{registrationStatus.businessMobile}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Location</p>
                <p className="text-gray-900">{registrationStatus.location}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Vendor Type</p>
                <p className="text-gray-900 capitalize">{registrationStatus.vendorType.replace('_', ' ')}</p>
              </div>
              {registrationStatus.referId && (
                <div>
                  <p className="text-sm font-semibold text-gray-700">Refer ID</p>
                  <p className="text-gray-900">{registrationStatus.referId}</p>
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Submitted on {new Date(registrationStatus.createdAt).toLocaleDateString()} at {new Date(registrationStatus.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If registration exists and is rejected
  if (registrationStatus?.status === 'rejected') {
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Business Registration</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Your business registration details</p>

        <div className="rounded-xl p-6 border border-red-200 bg-red-50 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <h2 className="text-xl font-bold text-red-900">Registration Rejected</h2>
              <p className="text-sm text-red-700">Your business registration was not approved</p>
            </div>
          </div>

          {registrationStatus.rejectionReason && (
            <div className="mt-4 bg-white rounded-lg p-4 border border-red-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">Rejection Reason:</p>
              <p className="text-gray-900">{registrationStatus.rejectionReason}</p>
            </div>
          )}

          <p className="mt-4 text-sm text-red-700">Please update your information and resubmit below</p>
        </div>

        {/* Show form for resubmission */}
      </div>
    );
  }

  // No registration exists - show the form
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Business Registration</h1>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Complete your business registration to activate your vendor account</p>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-5">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2 mb-5">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-sm font-medium block">{success}</span>
            <span className="text-xs text-green-600 mt-1 block">Your registration is under review</span>
          </div>
        </div>
      )}

      {/* Business Registration Form */}
      <div className="rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter your brand name e.g., Spice Haven"
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Business Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              placeholder="Enter business email"
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Business Mobile <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value="+91"
                readOnly
                className="w-20 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 text-center"
              />
              <input
                type="number"
                value={businessMobile}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numbers, max 10 digits
                  if (value === '' || /^\d{0,10}$/.test(value)) {
                    setBusinessMobile(value);
                  }
                }}
                placeholder="Enter mobile number"
                maxLength={10}
                min="0"
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State e.g., Mumbai, Maharashtra"
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vendor Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={vendorType}
                onChange={(e) => setVendorType(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm bg-white appearance-none text-gray-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Type</option>
                <option value={VENDOR_TYPES.FULL_CATERING}>Full Catering</option>
                <option value={VENDOR_TYPES.SNACKS_AND_STARTER}>Snacks & Starter</option>
                <option value={VENDOR_TYPES.DESSERT_AND_SWEET}>Dessert & Sweets</option>
                <option value={VENDOR_TYPES.BEVERAGE}>Beverage</option>
                <option value={VENDOR_TYPES.PAAN}>Paan</option>
                <option value={VENDOR_TYPES.WATER}>Water</option>
                <option value={VENDOR_TYPES.OTHER}>Other</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Refer ID (Optional)
            </label>
            <input
              type="text"
              value={referId}
              onChange={(e) => setReferId(e.target.value)}
              placeholder="CB1234"
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 disabled:cursor-not-allowed"
            />
            <label className="ml-3 text-sm text-gray-600">
              I agree to the{" "}
              <button className="text-orange-500 hover:text-orange-600 font-medium">
                terms
              </button>{" "}
              and{" "}
              <button className="text-orange-500 hover:text-orange-600 font-medium">
                privacy policy
              </button>
            </label>
          </div>

          <button
            onClick={handleRegistration}
            disabled={loading}
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-500 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Registration'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
