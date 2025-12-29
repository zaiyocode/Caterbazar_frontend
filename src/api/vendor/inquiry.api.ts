import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Axios instance for vendor inquiry API
const vendorInquiryAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
vendorInquiryAPI.interceptors.request.use(
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
vendorInquiryAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
export interface Inquiry {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    profilePicture: string | null;
  };
  vendorId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  eventDate: string;
  guestCount: number;
  eventType: string;
  foodPreference: string;
  message: string;
  status: 'pending' | 'contacted' | 'converted' | 'rejected' | 'cancelled';
  viewedByVendor: boolean;
  viewedAt?: string;
  eventLocation: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  budgetPerPlate: {
    min: number;
    max: number;
  };
  vendorResponse?: {
    message: string;
    respondedAt: string;
  };
  notificationsSent: {
    email: boolean;
    sms: boolean;
    sentAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InquiriesResponse {
  statusCode: number;
  data: {
    inquiries: Inquiry[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
    statusCounts: Array<{
      _id: string;
      count: number;
    }>;
  };
  message: string;
  success: boolean;
}

export interface InquiryDetailResponse {
  statusCode: number;
  data: {
    inquiry: Inquiry;
  };
  message: string;
  success: boolean;
}

export interface UpdateInquiryStatusRequest {
  status: 'pending' | 'contacted' | 'converted' | 'rejected' | 'cancelled';
  message?: string;
}

/**
 * Get vendor inquiries with filters
 */
export const getVendorInquiries = async (
  status?: string,
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt'
): Promise<InquiriesResponse> => {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    params.append('sortBy', sortBy);

    const response = await vendorInquiryAPI.get<InquiriesResponse>(
      `/vendors/inquiries?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch inquiries' };
  }
};

/**
 * Get inquiry details by ID
 */
export const getInquiryDetails = async (inquiryId: string): Promise<InquiryDetailResponse> => {
  try {
    const response = await vendorInquiryAPI.get<InquiryDetailResponse>(
      `/vendors/inquiries/${inquiryId}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch inquiry details' };
  }
};

/**
 * Update inquiry status
 */
export const updateInquiryStatus = async (
  inquiryId: string,
  data: UpdateInquiryStatusRequest
): Promise<InquiryDetailResponse> => {
  try {
    const response = await vendorInquiryAPI.patch<InquiryDetailResponse>(
      `/vendors/inquiries/${inquiryId}/status`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update inquiry status' };
  }
};
