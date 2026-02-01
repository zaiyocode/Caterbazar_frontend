"use client";
import React, { useState, useEffect, Suspense } from "react";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, Home, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOTP, resendOTP } from "@/api/user/auth.api";

function VerifyOTPContent() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if email is passed via URL params
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Timer countdown for OTP
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setResendLoading(true);

    try {
      const response = await resendOTP(email);

      if (response.success) {
        setSuccess("OTP sent successfully! Please check your email.");
        setTimer(300); // 5 minutes
        setStep("otp");
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOTP({
        email: email,
        otp: otpCode,
      });

      if (response.success) {
        setSuccess("Email verified successfully! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;

    setError("");
    setSuccess("");
    setResendLoading(true);

    try {
      const response = await resendOTP(email);

      if (response.success) {
        setSuccess("New OTP sent successfully!");
        setTimer(300);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
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
              Verify your email to continue exploring CaterBazar.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Verify OTP Form */}
      <div className="w-full lg:w-1/2 flex justify-center px-8 lg:px-20 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          {/* Home Button */}
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer mb-6 flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
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

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-1 flex-1 rounded-full ${step === "email" || step === "otp" ? "bg-orange-500" : "bg-gray-200"}`}></div>
              <div className={`h-1 flex-1 rounded-full ${step === "otp" ? "bg-orange-500" : "bg-gray-200"}`}></div>
            </div>
            <div className="text-right text-xs text-gray-500">
              Step {step === "email" ? 1 : 2} of 2
            </div>
          </div>

          {step === "email" ? (
            // Step 1: Enter Email
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Verify Your Email
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter your email address to receive a verification code
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2 mb-5">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start gap-2 mb-5">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address*
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={resendLoading}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    We&apos;ll send a 6-digit verification code to this email
                  </p>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={resendLoading}
                  className="cursor-pointer w-full bg-orange-400 hover:bg-orange-500 text-white py-3.5 rounded-lg font-semibold transition-colors text-sm disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-gray-600">
                Remember your password?{" "}
                <button
                  onClick={() => router.push("/auth/customer/signin")}
                  className="cursor-pointer text-orange-500 hover:text-orange-600 font-semibold"
                >
                  Sign In
                </button>
              </p>

              <p className="mt-3 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => router.push("/auth/customer/signup")}
                  className="cursor-pointer text-orange-500 hover:text-orange-600 font-semibold"
                >
                  Sign Up
                </button>
              </p>
            </>
          ) : (
            // Step 2: Verify OTP
            <>
              <button
                onClick={() => setStep("email")}
                disabled={loading}
                className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Enter Verification Code
                </h2>
                <p className="text-gray-600 text-sm mb-2">
                  Enter the 6-digit code sent to your email
                </p>
                <p className="text-sm text-gray-500">Code sent to {email}</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2 mb-6">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start gap-2 mb-6">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={loading}
                      className="w-14 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {timer > 0 ? (
                      <>
                        Didn&apos;t receive? Resend OTP in{" "}
                        <span className="font-semibold text-orange-500">
                          {formatTimer(timer)}
                        </span>
                      </>
                    ) : (
                      <button
                        onClick={handleResendOtp}
                        disabled={resendLoading || loading}
                        className="cursor-pointer text-orange-500 hover:text-orange-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resendLoading ? "Sending..." : "Resend OTP"}
                      </button>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => setStep("email")}
                  disabled={loading}
                  className="cursor-pointer text-sm text-orange-500 hover:text-orange-600 font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Change Email
                </button>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="cursor-pointer w-full bg-orange-400 hover:bg-orange-500 text-white py-3.5 rounded-lg font-semibold transition-colors text-sm disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                <p className="text-xs text-center text-gray-500 italic">
                  OTP expires in 10 minutes for security
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomerVerifyOTP() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}
