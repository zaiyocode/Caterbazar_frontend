import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Types
interface User {
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

interface UserProfileResponse {
  statusCode: number;
  data: {
    user: User;
  };
  message: string;
  success: boolean;
}

interface UpdateProfileResponse {
  statusCode: number;
  data: {
    user: User;
  };
  message: string;
  success: boolean;
}

interface ChangePasswordResponse {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
}

interface DeleteAccountResponse {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
}

interface UploadProfilePictureResponse {
  statusCode: number;
  data: {
    profilePicture: string;
  };
  message: string;
  success: boolean;
}

// Axios instance for user API
const userAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
userAPI.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
userAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// Get User Profile
export const getUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    const response = await userAPI.get<UserProfileResponse>("/users/profile");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to fetch profile. Please try again.",
      success: false,
    };
  }
};

// Update User Profile
export const updateUserProfile = async (profileData: {
  fullName?: string;
  phoneNumber?: string;
  profilePicture?: string | null;
}): Promise<UpdateProfileResponse> => {
  try {
    const response = await userAPI.put<UpdateProfileResponse>("/users/profile", profileData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to update profile. Please try again.",
      success: false,
    };
  }
};

// Change Password
export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ChangePasswordResponse> => {
  try {
    const response = await userAPI.put<ChangePasswordResponse>("/users/change-password", passwordData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to change password. Please try again.",
      success: false,
    };
  }
};

// Delete User Account
export const deleteUserAccount = async (): Promise<DeleteAccountResponse> => {
  try {
    const response = await userAPI.delete<DeleteAccountResponse>("/users/account");
    
    // Clear tokens after successful account deletion
    if (response.data.success) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to delete account. Please try again.",
      success: false,
    };
  }
};

// Upload Profile Picture
export const uploadProfilePicture = async (profilePicture: File): Promise<UploadProfilePictureResponse> => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    const response = await userAPI.put<UploadProfilePictureResponse>("/users/profile-picture", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to upload profile picture. Please try again.",
      success: false,
    };
  }
};

export type { User, UserProfileResponse, UpdateProfileResponse, ChangePasswordResponse, DeleteAccountResponse, UploadProfilePictureResponse };
