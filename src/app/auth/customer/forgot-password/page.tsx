"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, Phone, Home } from "lucide-react";
import { forgotPassword } from "@/api/user/auth.api";

export default function UserForgotPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(phoneNumber);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push(`/auth/customer/reset-password?phoneNumber=${phoneNumber}`);
  };

  return (
    <div className="h-screen flex bg-gray-50 p-3 overflow-hidden">
      {/* Left Side - Image */}
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
              Forgot your password? No worries! We'll help you reset it quickly and securely.
            </p>
            <div>
              <p className="font-semibold text-lg">CaterBazar Security</p>
              <p className="text-gray-300 text-sm">Your account is safe with us</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex md:items-center justify-center px-8 lg:px-20 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Navigation Buttons */}
          <div className="mb-6 flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Login</span>
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
              aria-label="Go to home"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </button>
          </div>

          {/* Logo */}
          <div className="mb-2">
            <img
              src="/images/logo.png"
              alt="Caterbazar Logo"
              className="h-10 w-auto mb-1"
            />
          </div>

          {!success ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter your phone number and we'll send you an OTP to reset your password
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter your 10-digit phone number"
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send an OTP to this number
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  OTP Sent Successfully!
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  We've sent a 6-digit OTP to your phone number ending in ****{phoneNumber.slice(-4)}
                </p>
                <button
                  onClick={handleContinue}
                  className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm"
                >
                  Continue to Verify OTP
                </button>
              </div>
            </>
          )}

          {/* Sign Up Link */}
          {!success && (
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/auth/customer/signup")}
                className="text-orange-500 hover:text-orange-600 font-semibold"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}