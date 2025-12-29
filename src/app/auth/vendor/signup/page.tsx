"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, CheckCircle, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { vendorSignup, vendorVerifyOTP, vendorResendOTP } from '@/api/vendor/auth.api';

export default function VendorSignup() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Timer countdown for OTP
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSignUp = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!fullName || !email || !mobileNumber || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the terms and privacy policy');
      return;
    }

    setLoading(true);

    try {
      const response = await vendorSignup({
        fullName,
        email,
        phoneNumber: mobileNumber,
        password,
        confirmPassword
      });

      if (response.success) {
        setSuccess('Account created! Please verify your mobile number.');
        setTimer(300); // Reset timer to 5 minutes
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await vendorVerifyOTP({
        phoneNumber: mobileNumber,
        otp: otpCode
      });

      if (response.success) {
        setSuccess('Phone verified successfully! Redirecting to business registration...');
        setTimeout(() => {
          router.push('/auth/vendor/businessRegistration');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;

    setError('');
    setLoading(true);

    try {
      const response = await vendorResendOTP(mobileNumber);

      if (response.success) {
        setSuccess('New OTP sent successfully!');
        setTimer(300); // Reset timer to 5 minutes
        setOtp(['', '', '', '', '', '']); // Clear OTP inputs
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 p-3 overflow-hidden">
      {/* Left Side - Image and Testimonial */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center rounded-3xl overflow-hidden" 
           style={{
             backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
           }}>
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <div className="max-w-md">
            <div className="text-7xl mb-4 font-serif">"</div>
            <p className="text-xl mb-8 leading-relaxed">
              Connect with customers and grow your catering business.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex justify-center px-8 lg:px-20 overflow-y-auto">
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

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
              <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
            </div>
            <div className="text-right text-xs text-gray-500">Step {step} of 2</div>
          </div>

          {step === 1 ? (
            // Step 1: Create Account
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Vendor Account</h2>
                <p className="text-gray-600 text-xs">Join CaterBazar as a catering professional</p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-5">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-5">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email*
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mobile Number*
                  </label>
                  <div className="flex gap-2">
                    <select 
                      disabled={loading}
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option>+91</option>
                    </select>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter mobile number"
                      disabled={loading}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={loading}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Min 8 chars, 1 uppercase, 1 number</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Confirm Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      disabled={loading}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 mt-1 text-orange-500 border-gray-300 rounded focus:ring-orange-500 disabled:cursor-not-allowed"
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="/terms" className="text-orange-500 hover:text-orange-600">terms</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-orange-500 hover:text-orange-600">privacy policy</a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3.5 rounded-lg font-semibold transition-colors text-sm disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/auth" className="text-orange-500 hover:text-orange-600 font-semibold">
                  Sign In
                </a>
              </p>
            </>
          ) : (
            // Step 2: Verify OTP
            <>
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Number</h2>
                <p className="text-gray-600 text-sm mb-2">Enter the 6-digit code sent to your mobile</p>
                <p className="text-sm text-gray-500">Code sent to +91-{mobileNumber.slice(-4).padStart(10, 'X')}</p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-5">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-5">
                  <CheckCircle className="h-5 w-5 shrink-0" />
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
                      disabled={loading}
                      className="w-14 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {timer > 0 ? (
                      <>
                        Didn&apos;t receive? Resend OTP in{' '}
                        <span className="font-semibold text-orange-500">{formatTime(timer)}</span>
                      </>
                    ) : (
                      <button
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-orange-500 hover:text-orange-600 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Edit Mobile Number
                </button>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3.5 rounded-lg font-semibold transition-colors text-sm disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 italic">
                  OTP expires in 5 minutes for security
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}