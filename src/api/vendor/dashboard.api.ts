import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Types
interface DashboardStats {
  totalInquiries: number;
  totalCustomers: number;
  averageRating: number;
  totalReviews: number;
}

interface DashboardStatsResponse {
  statusCode: number;
  data: {
    stats: DashboardStats;
  };
  message: string;
  success: boolean;
}

interface UpcomingEvent {
  _id: string;
  eventDate: string;
  eventType?: string;
  customerName?: string;
  status?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  guestCount?: number;
  foodPreference?: string;
  message?: string;
  viewedByVendor?: boolean;
  viewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  eventLocation?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  vendorResponse?: {
    message: string;
    respondedAt: string;
  };
  notificationsSent?: {
    email: boolean;
    sms: boolean;
  };
  vendorId?: string;
  __v?: number;
}

interface UpcomingEventsResponse {
  statusCode: number;
  data: {
    upcomingEvents: UpcomingEvent[];
  };
  message: string;
  success: boolean;
}

// Axios instance for dashboard API
const dashboardAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
dashboardAPI.interceptors.request.use(
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
dashboardAPI.interceptors.response.use(
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

// Get Dashboard Stats
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  try {
    const response = await dashboardAPI.get<DashboardStatsResponse>("/vendors/dashboard/stats");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to fetch dashboard stats. Please try again.",
      success: false,
    };
  }
};

// Get Upcoming Events
export const getUpcomingEvents = async (): Promise<UpcomingEventsResponse> => {
  try {
    const response = await dashboardAPI.get<UpcomingEventsResponse>("/vendors/dashboard/upcoming-events");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to fetch upcoming events. Please try again.",
      success: false,
    };
  }
};

export type { DashboardStats, DashboardStatsResponse, UpcomingEvent, UpcomingEventsResponse };
