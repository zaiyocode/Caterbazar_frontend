import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Types
export interface Review {
  _id: string;
  vendorId: {
    _id: string;
    fullName: string;
  };
  userId: string;
  inquiryId: {
    _id: string;
    eventDate: string;
    eventType: string;
  };
  rating: number;
  foodQuality: number;
  serviceQuality: number;
  valueForMoney: number;
  hygiene: number;
  comment: string;
  title: string;
  isVerified: boolean;
  adminApproved: boolean;
  helpfulCount: number;
  helpfulVotes: string[];
  isReported: boolean;
  reportReason: string | null;
  photos: string[];
  vendorResponse?: {
    message: string;
    respondedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface GetMyReviewsResponse {
  statusCode: number;
  data: {
    reviews: Review[];
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

interface CreateReviewData {
  vendorId: string;
  inquiryId: string;
  rating: number;
  title: string;
  comment: string;
  foodQuality: number;
  serviceQuality: number;
  valueForMoney: number;
  hygiene: number;
}

interface CreateReviewResponse {
  statusCode: number;
  data: {
    review: Review;
  };
  message: string;
  success: boolean;
}

// Axios instance for review API
const reviewAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
reviewAPI.interceptors.request.use(
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
reviewAPI.interceptors.response.use(
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

// Get My Reviews
export const getMyReviews = async (params?: {
  page?: number;
  limit?: number;
}): Promise<GetMyReviewsResponse> => {
  try {
    const response = await reviewAPI.get<GetMyReviewsResponse>("/reviews/my-reviews", {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to fetch reviews. Please try again.",
      success: false,
    };
  }
};

// Create Review
export const createReview = async (reviewData: CreateReviewData): Promise<CreateReviewResponse> => {
  try {
    const response = await reviewAPI.post<CreateReviewResponse>("/reviews", reviewData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to create review. Please try again.",
      success: false,
    };
  }
};

export type { GetMyReviewsResponse, CreateReviewData, CreateReviewResponse };
