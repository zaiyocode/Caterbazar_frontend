import api from './auth.api';

// Types
export interface Vendor {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
  };
  businessRegistrationId: string;
  bio: string | null;
  profilePhoto: string | null;
  profileCompletionPercentage: number;
  isProfileComplete: boolean;
  isActive: boolean;
  isCaterbazarChoice?: boolean;
  caterbazarChoiceSetAt?: string;
  caterbazarChoiceSetBy?: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  menuPhotos?: string[];
  accountStatus?: 'active' | 'pending' | 'suspended';
  phoneNumber?: string;
  role?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  socialMedia?: {
    facebookHandle: string | null;
    instagramHandle: string | null;
    whatsappNumber: string | null;
    personalWebsite: string | null;
  };
  businessInfo?: {
    yearOfEstablishment: number | null;
    yearsInBusiness: number | null;
    teamSize: string | null;
  };
  capacity?: {
    minGuests: number | null;
    maxGuests: number | null;
    advanceBookingTime: string | null;
    vendorCategory: string | null;
  };
  address?: {
    country: string | null;
    state: string | null;
    locality: string | null;
    pincode: string | null;
  };
  pricing?: {
    vegPricePerPlate: number | null;
    nonVegPricePerPlate: number | null;
    servicesSpecialization: string[];
    cuisineOptions: string[];
  };
  cancellationPolicy?: {
    policyType: string | null;
    policyDetails: string | null;
  };
  operations?: {
    languagesSpoken: string[];
    weeksAdvanceBooking: number | null;
    operationalRadius: number | null;
  };
  stats?: {
    totalInquiries: number;
    totalOrders?: number;
    totalCustomers: number;
    averageRating: number;
    totalReviews: number;
    totalRevenue?: number;
  };
  analytics?: {
    profileViews: number;
    popularity: number;
    responseRate: number;
    totalInquiries: number;
    totalReviews: number;
  };
  location?: {
    type: string;
    coordinates: number[];
  };
  fssaiCertificate?: {
    url: string | null;
    publicId: string | null;
    uploadedAt: string | null;
  };
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface GetVendorsResponse {
  statusCode: number;
  data: {
    vendors: Vendor[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
    stats: {
      totalVendors: number;
      activeVendors: number;
      caterbazarChoice: number;
      totalInquiries: number;
      totalReviews: number;
    };
  };
  message: string;
  success: boolean;
}

export interface GetVendorByIdResponse {
  statusCode: number;
  data: {
    vendor: Vendor;
    analytics?: {
      inquiriesCount: number;
      pendingInquiries: number;
      reviewsCount: number;
      approvedReviews: number;
      pendingReviews: number;
    };
  };
  message: string;
  success: boolean;
}

/**
 * Get all vendors with pagination
 */
export const getAllVendors = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
): Promise<GetVendorsResponse> => {
  try {
    const params: any = {
      page,
      limit,
    };

    if (status && status !== 'all') {
      params.status = status;
    }

    if (search) {
      params.search = search;
    }

    const response = await api.get<GetVendorsResponse>('/admin/vendors', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch vendors' };
  }
};

/**
 * Get vendor by ID
 */
export const getVendorById = async (vendorId: string): Promise<GetVendorByIdResponse> => {
  try {
    const response = await api.get<GetVendorByIdResponse>(`/admin/vendors/${vendorId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch vendor details' };
  }
};

/**
 * Update vendor status
 */
export const updateVendorStatus = async (
  vendorId: string,
  status: 'active' | 'suspended' | 'pending'
): Promise<any> => {
  try {
    const response = await api.patch(`/admin/vendors/${vendorId}/status`, { status });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update vendor status' };
  }
};

/**
 * Toggle Caterbazar Choice status for a vendor
 */
export const toggleCaterbazarChoice = async (vendorId: string): Promise<GetVendorByIdResponse> => {
  try {
    const response = await api.patch<GetVendorByIdResponse>(`/admin/vendors/${vendorId}/caterbazar-choice`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to toggle Caterbazar Choice' };
  }
};

/**
 * Toggle vendor active status
 */
export const toggleVendorActive = async (vendorId: string): Promise<GetVendorByIdResponse> => {
  try {
    const response = await api.patch<GetVendorByIdResponse>(`/admin/vendors/${vendorId}/active`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to toggle vendor active status' };
  }
};
