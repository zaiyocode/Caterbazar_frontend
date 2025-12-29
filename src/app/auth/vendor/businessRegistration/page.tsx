"use client";
import React, { useState } from "react";
import { ChevronDown, AlertCircle, CheckCircle, Loader2, Home } from "lucide-react";
import { submitBusinessRegistration } from "@/api/vendor/business.api";
import { useRouter } from "next/navigation";

export default function BusinessRegistration() {
  const router = useRouter();
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
        setTimeout(() => {
          router.push("/auth");
        }, 2500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit business registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 p-3 overflow-hidden">
      {/* Left Side - Image and Testimonial */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center rounded-3xl overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <div className="max-w-md">
            <div className="text-7xl mb-4 font-serif">"</div>
            <p className="text-xl mb-8 leading-relaxed">
              Joining CatererBazar transformed my business! I now reach
              thousands of customers looking for quality catering services.
            </p>
            <div>
              <p className="font-semibold text-lg">Rajesh Kumar</p>
              <p className="text-gray-300 text-sm">
                Owner, Spice Haven Catering
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Business Registration Form */}
      <div className="w-full lg:w-1/2 flex  justify-center px-8 lg:px-20 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          {/* Home Button */}
          <button
            onClick={() => router.push("/")}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
            aria-label="Go to home"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </button>

          {/* Logo */}
          <div className="mb-2">
            <img
              src="/images/logo.png"
              alt="Caterbazar Logo"
              className="h-10 w-auto mb-1"
            />
          </div>

          {/* Header */}
          <div className="mb-4">
            <div className="inline-block bg-orange-100 px-3 py-1 rounded-full mb-2">
              <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-wide">
                VENDOR ONBOARDING
              </p>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Register Your Business
            </h2>
            <p className="text-gray-500 text-xs">
              Join CatererBazar to reach more events
            </p>
          </div>

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
                <span className="text-xs text-green-600 mt-1 block">Redirecting to sign in...</span>
              </div>
            </div>
          )}

          {/* Business Registration Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                1. Brand Name
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
                2. Business Email
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
                3. Business Mobile
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="+91"
                  readOnly
                  className="w-20 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 text-center"
                />
                <input
                  type="tel"
                  value={businessMobile}
                  onChange={(e) => setBusinessMobile(e.target.value)}
                  placeholder="Enter mobile number"
                  maxLength={10}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                4. Location
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
                5. Vendor Type
              </label>
              <div className="relative">
                <select
                  value={vendorType}
                  onChange={(e) => setVendorType(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm bg-white appearance-none text-gray-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Type</option>
                  <option value="food_catering">Food Catering</option>
                  <option value="decoration">Decoration</option>
                  <option value="photography">Photography</option>
                  <option value="dj_music">DJ & Music</option>
                  <option value="venue">Venue</option>
                  <option value="makeup_artist">Makeup Artist</option>
                  <option value="event_planner">Event Planner</option>
                  <option value="invitation_cards">Invitation Cards</option>
                  <option value="transportation">Transportation</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                6. Refer id ( Optional )
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
              className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3.5 rounded-lg font-semibold transition-colors text-sm mt-2 disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-sm">
            <button
              onClick={() => router.push('/auth')}
              disabled={loading}
              className="text-orange-500 hover:text-orange-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
