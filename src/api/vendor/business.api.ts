import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Axios instance for vendor business API
const vendorBusinessAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
vendorBusinessAPI.interceptors.request.use(
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
vendorBusinessAPI.interceptors.response.use(
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

// Types
export interface BusinessRegistrationRequest {
  brandName: string;
  businessEmail: string;
  businessMobile: string;
  location: string;
  vendorType: string;
  referId?: string;
}

export interface BusinessRegistration {
  _id: string;
  brandName: string;
  businessEmail: string;
  businessMobile: string;
  location: string;
  vendorType: string;
  referId: string | null;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessRegistrationResponse {
  statusCode: number;
  data: {
    registration: BusinessRegistration;
  };
  message: string;
  success: boolean;
}

export interface VendorProfile {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  businessRegistrationId: {
    _id: string;
    brandName: string;
    businessEmail: string;
    businessMobile: string;
    location: string;
    vendorType: string;
    referId: string;
    submittedBy: string;
    status: string;
    reviewedBy: string | null;
    reviewedAt: string | null;
    rejectionReason: string | null;
    adminNotes: string | null;
    createdAt: string;
    updatedAt: string;
  };
  bio: string;
  profilePhoto: string | null;
  socialMedia: {
    facebookHandle: string;
    instagramHandle: string;
    whatsappNumber: string;
    personalWebsite: string;
  };
  businessInfo: {
    yearOfEstablishment: number | null;
    yearsInBusiness: number | null;
    teamSize: number | null;
  };
  capacity: {
    minGuests: number | null;
    maxGuests: number | null;
    advanceBookingTime: number | null;
    vendorCategory: string | null;
  };
  address: {
    country: string | null;
    state: string | null;
    locality: string | null;
    pincode: string | null;
  };
  pricing: {
    vegPricePerPlate: number | null;
    nonVegPricePerPlate: number | null;
    servicesSpecialization: string[];
    cuisineOptions: string[];
  };
  fssaiCertificate: {
    url: string | null;
    publicId: string | null;
    uploadedAt: string | null;
  };
  cancellationPolicy: {
    policyType: string | null;
    policyDetails: string | null;
  };
  operations: {
    languagesSpoken: string[];
    weeksAdvanceBooking: number | null;
    operationalRadius: number | null;
  };
  stats: {
    totalInquiries: number;
    totalCustomers: number;
    averageRating: number;
    totalReviews: number;
  };
  analytics: {
    totalInquiries: number;
    totalReviews: number;
    responseRate: number;
    profileViews: number;
    popularity: number;
  };
  location: {
    type: string;
    coordinates: number[];
  };
  profileCompletionPercentage: number;
  isProfileComplete: boolean;
  isActive: boolean;
  isCaterbazarChoice: boolean;
  menuPhotos: {
    _id: string;
    url: string;
    type: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface VendorProfileResponse {
  statusCode: number;
  data: {
    profile: VendorProfile;
  };
  message: string;
  success: boolean;
}

export interface UpdatePersonalInfoRequest {
  facebookHandle?: string;
  instagramHandle?: string;
  whatsappNumber?: string;
  personalWebsite?: string;
  bio?: string;
}

export interface UpdateBusinessProfileRequest {
  // Business Info
  yearOfEstablishment?: number;
  yearsInBusiness?: number;
  teamSize?: string;
  
  // Capacity
  minGuests?: number;
  maxGuests?: number;
  advanceBookingTime?: string;
  vendorCategory?: string;
  
  // Address
  country?: string;
  state?: string;
  locality?: string;
  pincode?: string;
  
  // Pricing
  vegPricePerPlate?: number;
  nonVegPricePerPlate?: number;
  servicesSpecialization?: string[];
  cuisineOptions?: string[];
  
  // Operations
  languagesSpoken?: string[];
  weeksAdvanceBooking?: number;
  operationalRadius?: number;
  
  // Cancellation Policy
  policyType?: string;
  policyDetails?: string;
}

/**
 * Submit business registration
 */
export const submitBusinessRegistration = async (
  data: BusinessRegistrationRequest
): Promise<BusinessRegistrationResponse> => {
  try {
    const response = await vendorBusinessAPI.post<BusinessRegistrationResponse>(
      '/vendors/business-registration',
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to submit business registration' };
  }
};

/**
 * Get business registration status
 */
export const getBusinessRegistrationStatus = async (): Promise<BusinessRegistrationResponse> => {
  try {
    const response = await vendorBusinessAPI.get<BusinessRegistrationResponse>(
      '/vendors/business-registration/status'
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to get registration status' };
  }
};

/**
 * Get vendor profile
 */
export const getVendorProfile = async (): Promise<VendorProfileResponse> => {
  try {
    const response = await vendorBusinessAPI.get<VendorProfileResponse>(
      '/vendors/profile'
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to get vendor profile' };
  }
};

/**
 * Update personal information
 */
export const updatePersonalInfo = async (
  data: UpdatePersonalInfoRequest
): Promise<VendorProfileResponse> => {
  try {
    const response = await vendorBusinessAPI.put<VendorProfileResponse>(
      '/vendors/profile/personal',
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update personal information' };
  }
};

/**
 * Delete FSSAI certificate
 */
export const deleteFSSAICertificate = async (): Promise<VendorProfileResponse> => {
  try {
    const response = await vendorBusinessAPI.delete<VendorProfileResponse>(
      '/vendors/profile/fssai-certificate'
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to delete FSSAI certificate' };
  }
};
