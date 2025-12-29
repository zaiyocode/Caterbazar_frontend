"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestPasswordResetOtp } from "@/api/superadmin/auth.api";
import { AlertCircle, Phone, ArrowLeft, Loader } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate phone number
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      setLoading(false);
      return;
    }

    if (phoneNumber.length < 10) {
      setError("Phone number must be at least 10 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await requestPasswordResetOtp({ phoneNumber });

      if (response.success) {
        setSuccess(true);
        // Store phone number in session storage for next step
        sessionStorage.setItem("resetPhoneNumber", phoneNumber);

        // Redirect to OTP verification page after 2 seconds
        setTimeout(() => {
          router.push("/auth/superadmin/verify-otp");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to request OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">OTP Sent!</h2>
          <p className="text-gray-600 mb-6">
            We've sent a 6-digit OTP to your registered phone number. Check your messages and enter it to continue.
          </p>
          <p className="text-sm text-gray-500">Redirecting to verification page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600">
            Enter your phone number to receive an OTP for password reset.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number Input */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 15));
                  setError("");
                }}
                placeholder="Enter your 10-digit phone number"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Make sure this is the phone number registered with your account.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !phoneNumber.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Request OTP"
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            href="/auth/superadmin/signin"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
