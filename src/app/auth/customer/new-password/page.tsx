"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, Eye, EyeOff, Home } from "lucide-react";
import { resetPassword } from "@/api/user/auth.api";

function UserNewPasswordContent() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("resetToken") || "";

  useEffect(() => {
    if (!resetToken) {
      router.push("/auth/customer/forgot-password");
    }
  }, [resetToken, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({
        resetToken,
        newPassword,
        confirmPassword,
      });

      if (response.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push("/auth/customer/signin");
  };

  if (!resetToken) {
    return null;
  }

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
              Choose a strong password to keep your account secure and protected.
            </p>
            <div>
              <p className="font-semibold text-lg">CaterBazar Security</p>
              <p className="text-gray-300 text-sm">Your account is safe with us</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - New Password Form */}
      <div className="w-full lg:w-1/2 flex md:items-center justify-center px-8 lg:px-20 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Navigation Buttons */}
          <div className="mb-6 flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
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
                  Set New Password
                </h2>
                <p className="text-gray-600 text-sm">
                  Choose a strong password for your account
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
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      disabled={loading}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={loading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      disabled={loading}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
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
                  Password Reset Successfully!
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Your password has been reset. You can now sign in with your new password.
                </p>
                <button
                  onClick={handleContinue}
                  className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm"
                >
                  Continue to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserNewPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>}>
      <UserNewPasswordContent />
    </Suspense>
  );
}