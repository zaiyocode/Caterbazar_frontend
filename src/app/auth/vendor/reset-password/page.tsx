"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, RefreshCw, Home } from "lucide-react";
import { vendorVerifyResetOTP, vendorForgotPassword } from "@/api/vendor/auth.api";

function VendorResetPasswordContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes countdown
  const [resetToken, setResetToken] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("phoneNumber") || "";

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("").slice(0, 6);
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await vendorVerifyResetOTP({ phoneNumber, otp: otpString });
      setResetToken(response.data.resetToken);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError("");
    
    try {
      await vendorForgotPassword(phoneNumber);
      setTimer(120);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleContinue = () => {
    router.push(`/auth/vendor/new-password?resetToken=${resetToken}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-screen flex bg-gray-50 p-3 overflow-hidden">
      {/* Left Side - Image */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center rounded-3xl overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <div className="max-w-md">
            <div className="text-7xl mb-4 font-serif">"</div>
            <p className="text-xl mb-8 leading-relaxed">
              Enter the verification code sent to your phone to secure your vendor account.
            </p>
            <div>
              <p className="font-semibold text-lg">CaterBazar Security</p>
              <p className="text-gray-300 text-sm">Protecting your business data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - OTP Verification */}
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
                    Verification Code
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
                        onPaste={handlePaste}
                        maxLength={1}
                        disabled={loading}
                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    ))}
                  </div>
                </div>

                {/* Timer and Resend */}
                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-sm text-gray-600">
                      Resend OTP in {formatTime(timer)}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resending}
                      className="text-sm text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Resend OTP
                        </>
                      )}
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
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
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  OTP Verified!
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Your identity has been verified. Now you can set a new password.
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

          {/* Help Text */}
          {!success && (
            <p className="mt-6 text-center text-xs text-gray-500">
              Didn't receive the code? Check your phone or try resending
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VendorResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>}>
      <VendorResetPasswordContent />
    </Suspense>
  );
}