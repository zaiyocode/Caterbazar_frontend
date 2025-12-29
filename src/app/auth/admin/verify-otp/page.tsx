"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyResetOtp } from "@/api/superadmin/auth.api";
import { AlertCircle, ArrowLeft, Loader } from "lucide-react";

export default function AdminVerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Get phone number from session storage
    const storedPhone = sessionStorage.getItem("resetPhoneNumber");
    if (!storedPhone) {
      router.push("/auth/admin/forgot-password");
      return;
    }
    setPhoneNumber(storedPhone);
  }, [router]);

  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOtpChange = (value: string) => {
    // Only allow digits and max 6 characters
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setOtp(numericValue);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyResetOtp({
        phoneNumber,
        otp,
      });

      if (response.success && response.data.resetToken) {
        // Store reset token for password reset page
        sessionStorage.setItem("resetToken", response.data.resetToken);

        // Redirect to reset password page
        setTimeout(() => {
          router.push("/auth/admin/reset-password");
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);

    try {
      // Import and call the request OTP function
      const { requestPasswordResetOtp } = await import("@/api/superadmin/auth.api");
      const response = await requestPasswordResetOtp({ phoneNumber });

      if (response.success) {
        setTimeLeft(300);
        setCanResend(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
          <p className="text-gray-600">
            Enter the 6-digit OTP sent to {phoneNumber}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              disabled={loading}
              autoComplete="one-time-code"
            />
            <p className="text-xs text-gray-500 mt-1">
              OTP expires in {formatTime(timeLeft)}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-sm text-gray-600">
              Didn't receive OTP? Try again in {formatTime(timeLeft)}
            </p>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-4">
          <button
            onClick={() => router.push("/auth/admin/forgot-password")}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm w-full justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Phone Number
          </button>
        </div>
      </div>
    </div>
  );
}
