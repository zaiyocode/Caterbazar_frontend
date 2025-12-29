import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Types
interface EventLocation {
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface VendorResponse {
  message?: string;
  respondedAt?: string;
}

interface NotificationsSent {
  email: boolean;
  sms: boolean;
  sentAt?: string;
}

export interface Inquiry {
  _id: string;
  userId: string;
  vendorId: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  } | string;
  userName: string;
  userEmail: string;
  userPhone: string;
  eventDate: string;
  guestCount: number;
  eventType: string;
  eventLocation: EventLocation;
  foodPreference: string;
  message?: string;
  status: 'pending' | 'contacted' | 'converted' | 'rejected' | 'cancelled';
  viewedByVendor: boolean;
  vendorResponse?: VendorResponse;
  notificationsSent: NotificationsSent;
  createdAt: string;
  updatedAt: string;
  viewedAt?: string;
}

interface CreateInquiryData {
  vendorId: string;
  eventDate: string;
  guestCount: number;
  eventType: string;
  eventLocation?: EventLocation;
  foodPreference?: string;
  message?: string;
}

interface CreateInquiryResponse {
  statusCode: number;
  data: {
    inquiry: Inquiry;
  };
  message: string;
  success: boolean;
}

interface GetInquiriesResponse {
  statusCode: number;
  data: {
    inquiries: Inquiry[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
  message: string;
  success: boolean;
}

interface CancelInquiryResponse {
  statusCode: number;
  data: {
    inquiry: Inquiry;
  };
  message: string;
  success: boolean;
}

// Axios instance for inquiry API
const inquiryAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
inquiryAPI.interceptors.request.use(
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
inquiryAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// Create Inquiry
export const createInquiry = async (inquiryData: CreateInquiryData): Promise<CreateInquiryResponse> => {
  try {
    const response = await inquiryAPI.post<CreateInquiryResponse>("/inquiries", inquiryData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to create inquiry. Please try again.",
      success: false,
    };
  }
};

// Get My Inquiries
export const getMyInquiries = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<GetInquiriesResponse> => {
  try {
    const response = await inquiryAPI.get<GetInquiriesResponse>("/inquiries/my-inquiries", {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to fetch inquiries. Please try again.",
      success: false,
    };
  }
};

// Cancel Inquiry
export const cancelInquiry = async (inquiryId: string): Promise<CancelInquiryResponse> => {
  try {
    const response = await inquiryAPI.delete<CancelInquiryResponse>(`/inquiries/${inquiryId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to cancel inquiry. Please try again.",
      success: false,
    };
  }
};

export type {
  EventLocation,
  VendorResponse,
  NotificationsSent,
  CreateInquiryData,
  CreateInquiryResponse,
  GetInquiriesResponse,
  CancelInquiryResponse,
};
