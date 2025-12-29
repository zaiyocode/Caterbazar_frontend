"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/api/superadmin/auth.api";
import {
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader,
  CheckCircle,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Validation states
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | "">("");

  useEffect(() => {
    // Get reset token from session storage
    const storedToken = sessionStorage.getItem("resetToken");
    if (!storedToken) {
      router.push("/auth/superadmin/forgot-password");
      return;
    }
    setResetToken(storedToken);
  }, [router]);

  // Password strength checker
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength("");
      return;
    }

    let strength: "weak" | "medium" | "strong" = "weak";

    if (
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[0-9]/.test(newPassword) &&
      /[!@#$%^&*]/.test(newPassword)
    ) {
      strength = "strong";
    } else if (
      newPassword.length >= 6 &&
      (/[A-Z]/.test(newPassword) || /[0-9]/.test(newPassword))
    ) {
      strength = "medium";
    }

    setPasswordStrength(strength);
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validations
    if (!newPassword.trim()) {
      setError("New password is required");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!resetToken) {
      setError("Invalid session. Please start over.");
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword({
        resetToken,
        newPassword,
        confirmPassword,
      });

      if (response.success) {
        setSuccess(true);

        // Clear session storage
        sessionStorage.removeItem("resetToken");
        sessionStorage.removeItem("resetPhoneNumber");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/auth/superadmin/signin");
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <p className="text-sm text-gray-500">Redirecting to sign in page...</p>
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
            Set New Password
          </h1>
          <p className="text-gray-600">
            Create a strong password to secure your account.
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
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  <div
                    className={`h-1 flex-1 rounded ${
                      passwordStrength ? "bg-red-500" : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded ${
                      passwordStrength === "medium" || passwordStrength === "strong"
                        ? "bg-yellow-500"
                        : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded ${
                      passwordStrength === "strong" ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                </div>
                <p
                  className={`text-xs font-medium ${
                    passwordStrength === "strong"
                      ? "text-green-600"
                      : passwordStrength === "medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  Password Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                </p>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              • At least 6 characters
              <br />• Include uppercase letters and numbers for stronger security
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {confirmPassword && newPassword === confirmPassword && (
              <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
            )}
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-600 mt-1">✗ Passwords do not match</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
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
