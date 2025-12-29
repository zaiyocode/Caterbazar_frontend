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

interface VendorProfileResponse {
  statusCode: number;
  data: {
    vendor: Vendor;
  };
  message: string;
  success: boolean;
}

interface UpdateProfileResponse {
  statusCode: number;
  data: {
    vendor: Vendor;
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

// Axios instance for vendor API
const vendorAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
vendorAPI.interceptors.request.use(
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
vendorAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("vendorData");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// Get Vendor Profile
export const getVendorProfile = async (): Promise<VendorProfileResponse> => {
  try {
    const response = await vendorAPI.get<VendorProfileResponse>("/vendors/profile/me");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to fetch profile. Please try again.",
      success: false,
    };
  }
};

// Update Vendor Profile
export const updateVendorProfile = async (profileData: {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string | null;
}): Promise<UpdateProfileResponse> => {
  try {
    const response = await vendorAPI.put<UpdateProfileResponse>("/vendors/profile", profileData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to update profile. Please try again.",
      success: false,
    };
  }
};

// Update Personal Information
export const updatePersonalInfo = async (personalData: {
  facebookHandle?: string;
  instagramHandle?: string;
  whatsappNumber?: string;
  personalWebsite?: string;
  bio?: string;
  profilePhoto?: File;
}): Promise<any> => {
  try {
    const formData = new FormData();
    let hasData = false;
    
    // Append text fields to FormData only if they have values
    if (personalData.facebookHandle && personalData.facebookHandle.trim()) {
      formData.append('facebookHandle', personalData.facebookHandle);
      hasData = true;
    }
    if (personalData.instagramHandle && personalData.instagramHandle.trim()) {
      formData.append('instagramHandle', personalData.instagramHandle);
      hasData = true;
    }
    if (personalData.whatsappNumber && personalData.whatsappNumber.trim()) {
      formData.append('whatsappNumber', personalData.whatsappNumber);
      hasData = true;
    }
    if (personalData.personalWebsite && personalData.personalWebsite.trim()) {
      formData.append('personalWebsite', personalData.personalWebsite);
      hasData = true;
    }
    if (personalData.bio && personalData.bio.trim()) {
      formData.append('bio', personalData.bio);
      hasData = true;
    }
    
    // Append file if provided
    if (personalData.profilePhoto) {
      formData.append('profilePhoto', personalData.profilePhoto);
      hasData = true;
    }
    
    // Check if there's any data to send
    if (!hasData) {
      throw {
        message: "Please provide at least one field to update",
        success: false,
      };
    }
    
    const response = await vendorAPI.put("/vendors/profile/personal", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error || {
      message: "Failed to update personal information. Please try again.",
      success: false,
    };
  }
};

// Delete Profile Photo
export const deleteProfilePhoto = async (): Promise<any> => {
  try {
    const response = await vendorAPI.delete("/vendors/profile/photo");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to delete profile photo. Please try again.",
      success: false,
    };
  }
};

// Change Password
export const changeVendorPassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ChangePasswordResponse> => {
  try {
    const response = await vendorAPI.put<ChangePasswordResponse>("/vendors/change-password", passwordData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to change password. Please try again.",
      success: false,
    };
  }
};

export type { Vendor, VendorProfileResponse, UpdateProfileResponse, ChangePasswordResponse };
