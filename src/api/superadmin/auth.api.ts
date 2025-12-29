import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  phoneNumber: string;
}

export interface VerifyResetOtpRequest {
  phoneNumber: string;
  otp: string;
}

export interface VerifyResetOtpResponse {
  statusCode: number;
  data: {
    resetToken: string;
  };
  message: string;
  success: boolean;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordResponse {
  statusCode: number;
  data: null | { expiresIn: number };
  message: string;
  success: boolean;
}

export interface User {
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
  lastLogin: string;
}

export interface LoginResponse {
  statusCode: number;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export interface LogoutResponse {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
}

// Create axios instance for authenticated requests
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/sessions
});

// Create axios instance for unauthenticated requests (password reset, etc.)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // No credentials for public endpoints
});

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

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if this is a password reset endpoint (don't redirect on these)
      const passwordResetEndpoints = [
        '/auth/admin/forgot-password',
        '/auth/admin/verify-reset-otp',
        '/auth/admin/reset-password',
      ];
      
      const isPasswordResetRequest = passwordResetEndpoints.some(
        (endpoint) => error.config?.url?.includes(endpoint)
      );
      
      // Only redirect if NOT a password reset endpoint
      if (!isPasswordResetRequest) {
        // Clear tokens and cookies, then redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        clearAuthCookies();
        window.location.href = '/auth/superadmin/signin';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Super Admin Login
 */
export const superAdminLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/admin/login', credentials);
    
    // Store tokens and user data in localStorage and cookies
    if (response.data.success && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      // Set cookies for middleware
      setAuthCookies(response.data.data.accessToken, response.data.data.refreshToken, response.data.data.user.role);
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Login failed. Please try again.' };
  }
};

/**
 * Super Admin Logout
 */
export const superAdminLogout = async (): Promise<LogoutResponse> => {
  try {
    const response = await api.post<LogoutResponse>('/admin/logout');
    
    // Clear local storage and cookies
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Clear cookies
    clearAuthCookies();
    
    return response.data;
  } catch (error: any) {
    // Even if API call fails, clear local storage and cookies
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Clear cookies
    clearAuthCookies();
    
    throw error.response?.data || { message: 'Logout failed. Please try again.' };
  }
};

/**
 * Get current admin user from API
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<{
      statusCode: number;
      data: { user: User };
      message: string;
      success: boolean;
    }>('/admin/me');
    
    if (response.data.success && response.data.data.user) {
      return response.data.data.user;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

/**
 * Request OTP for Password Reset
 */
export const requestPasswordResetOtp = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  try {
    const response = await publicApi.post<ForgotPasswordResponse>('/auth/admin/forgot-password', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to request OTP. Please try again.' };
  }
};

/**
 * Verify OTP and Get Reset Token
 */
export const verifyResetOtp = async (data: VerifyResetOtpRequest): Promise<VerifyResetOtpResponse> => {
  try {
    const response = await publicApi.post<VerifyResetOtpResponse>('/auth/admin/verify-reset-otp', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Invalid OTP. Please try again.' };
  }
};

/**
 * Reset Password
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<ForgotPasswordResponse> => {
  try {
    const response = await publicApi.post<ForgotPasswordResponse>('/auth/admin/reset-password', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to reset password. Please try again.' };
  }
};

export default api;
