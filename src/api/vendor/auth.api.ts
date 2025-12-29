import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Types
interface Vendor {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  accountStatus: string;
  profilePicture: string | null;
  loginAttempts: number;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface SignupResponse {
  statusCode: number;
  data: {
    user: Vendor;
  };
  message: string;
  success: boolean;
}

interface LoginResponse {
  statusCode: number;
  data: {
    user: Vendor;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

interface VerifyOTPResponse {
  statusCode: number;
  data: {
    user: Vendor;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

interface ResendOTPResponse {
  statusCode: number;
  data: object;
  message: string;
  success: boolean;
}

interface ForgotPasswordResponse {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
}

interface VerifyResetOTPResponse {
  statusCode: number;
  data: {
    resetToken: string;
  };
  message: string;
  success: boolean;
}

interface ResetPasswordResponse {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
}

// Axios instance for vendor auth
const vendorAuthAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Vendor Signup
export const vendorSignup = async (signupData: {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}): Promise<SignupResponse> => {
  try {
    const response = await vendorAuthAPI.post<SignupResponse>("/auth/signup", {
      ...signupData,
      role: "vendor",
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Signup failed. Please try again.",
      success: false,
    };
  }
};

// Helper function to set auth cookies
const setAuthCookies = (accessToken: string, refreshToken: string, role: string) => {
  // Set cookies for middleware access
  document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; secure; samesite=strict`; // 1 day
  document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; secure; samesite=strict`; // 7 days
  document.cookie = `userRole=${role}; path=/; max-age=86400; secure; samesite=strict`; // 1 day
};

// Helper function to clear auth cookies
const clearAuthCookies = () => {
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

// Vendor Login
export const vendorLogin = async (loginData: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await vendorAuthAPI.post<LoginResponse>("/auth/login", loginData);
    
    // Store tokens and user data in localStorage and cookies
    if (response.data.success && response.data.data.accessToken) {
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("role", response.data.data.user.role);
      localStorage.setItem("vendorData", JSON.stringify(response.data.data.user));
      
      // Set cookies for middleware
      setAuthCookies(response.data.data.accessToken, response.data.data.refreshToken, response.data.data.user.role);
      
      // Trigger auth state update
      window.dispatchEvent(new CustomEvent('authStateChanged'));
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Login failed. Please try again.",
      success: false,
    };
  }
};

// Verify OTP
export const vendorVerifyOTP = async (otpData: {
  phoneNumber: string;
  otp: string;
}): Promise<VerifyOTPResponse> => {
  try {
    const response = await vendorAuthAPI.post<VerifyOTPResponse>("/auth/verify-otp", otpData);
    
    // Store tokens and user data in localStorage and cookies after successful verification
    if (response.data.success && response.data.data.accessToken) {
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("role", response.data.data.user.role);
      localStorage.setItem("vendorData", JSON.stringify(response.data.data.user));
      
      // Set cookies for middleware
      setAuthCookies(response.data.data.accessToken, response.data.data.refreshToken, response.data.data.user.role);
      
      // Trigger auth state update
      window.dispatchEvent(new CustomEvent('authStateChanged'));
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "OTP verification failed. Please try again.",
      success: false,
    };
  }
};

// Resend OTP
export const vendorResendOTP = async (phoneNumber: string): Promise<ResendOTPResponse> => {
  try {
    const response = await vendorAuthAPI.post<ResendOTPResponse>("/auth/resend-otp", {
      phoneNumber,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to resend OTP. Please try again.",
      success: false,
    };
  }
};

// Get Current Vendor
export const getCurrentVendor = async (): Promise<Vendor | null> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return null;

    const response = await vendorAuthAPI.get<{ data: { user: Vendor } }>("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    return response.data.data.user;
  } catch (error) {
    return null;
  }
};

// Logout
export const vendorLogout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (refreshToken) {
      await vendorAuthAPI.post("/auth/logout", { refreshToken });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear localStorage and cookies regardless of API call success
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("vendorData");
    
    // Clear cookies
    clearAuthCookies();
    
    // Trigger auth state update
    window.dispatchEvent(new CustomEvent('authStateChanged'));
  }
};

// Forgot Password - Request OTP
export const vendorForgotPassword = async (phoneNumber: string): Promise<ForgotPasswordResponse> => {
  try {
    const response = await vendorAuthAPI.post<ForgotPasswordResponse>("/auth/forgot-password", {
      phoneNumber,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to send OTP. Please try again.",
      success: false,
    };
  }
};

// Verify Reset OTP
export const vendorVerifyResetOTP = async (otpData: {
  phoneNumber: string;
  otp: string;
}): Promise<VerifyResetOTPResponse> => {
  try {
    const response = await vendorAuthAPI.post<VerifyResetOTPResponse>("/auth/verify-reset-otp", otpData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "OTP verification failed. Please try again.",
      success: false,
    };
  }
};

// Reset Password
export const vendorResetPassword = async (resetData: {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ResetPasswordResponse> => {
  try {
    const response = await vendorAuthAPI.post<ResetPasswordResponse>("/auth/reset-password", resetData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Password reset failed. Please try again.",
      success: false,
    };
  }
};

export type { Vendor, SignupResponse, LoginResponse, VerifyOTPResponse, ResendOTPResponse, ForgotPasswordResponse, VerifyResetOTPResponse, ResetPasswordResponse };
