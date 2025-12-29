"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, RefreshCw, Home } from "lucide-react";
import { verifyResetOTP, forgotPassword } from "@/api/user/auth.api";

function UserResetPasswordContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("phoneNumber") || "";
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phoneNumber) {
      router.push("/auth/customer/forgot-password");
    }
  }, [phoneNumber, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await verifyResetOTP({
        phoneNumber,
        otp: otpString,
      });

      if (response.success) {
        setResetToken(response.data.resetToken);
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError("");

    try {
      await forgotPassword(phoneNumber);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleContinue = () => {
    router.push(`/auth/customer/new-password?resetToken=${resetToken}`);
  };

  if (!phoneNumber) {
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
              We've sent a secure code to verify your identity. Almost there!
            </p>
            <div>
              <p className="font-semibold text-lg">CaterBazar Security</p>
              <p className="text-gray-300 text-sm">Your account is safe with us</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - OTP Form */}
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
                  Verify OTP
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter the 6-digit code sent to ****{phoneNumber.slice(-4)}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Enter OTP
                  </label>
                  <div className="flex gap-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        maxLength={1}
                        disabled={loading}
                        className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    ))}
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
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </form>

              {/* Resend OTP */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-orange-500 hover:text-orange-600 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Resend OTP
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  OTP Verified Successfully!
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  You can now set your new password
                </p>
                <button
                  onClick={handleContinue}
                  className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm"
                >
                  Set New Password
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>}>
      <UserResetPasswordContent />
    </Suspense>
  );
}