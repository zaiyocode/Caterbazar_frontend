import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Axios instance for vendor review API
const vendorReviewAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
vendorReviewAPI.interceptors.request.use(
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
vendorReviewAPI.interceptors.response.use(
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
export interface Review {
  _id: string;
  vendorId: string;
  userId: {
    _id: string;
    fullName: string;
    profilePicture: string | null;
  };
  inquiryId: {
    _id: string;
    eventDate: string;
    guestCount: number;
    eventType: string;
  } | null;
  orderId: string | null;
  rating: number;
  foodQuality?: number;
  serviceQuality?: number;
  valueForMoney?: number;
  hygiene?: number;
  comment: string;
  title?: string;
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
  moderatedAt?: string;
  moderatedBy?: string;
}

export interface ReviewsResponse {
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

export interface ReviewStatsResponse {
  statusCode: number;
  data: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  message: string;
  success: boolean;
}

export interface RespondToReviewRequest {
  message: string;
}

export interface ReviewDetailResponse {
  statusCode: number;
  data: {
    review: Review;
  };
  message: string;
  success: boolean;
}

/**
 * Get vendor reviews with pagination
 */
export const getVendorReviews = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  rating?: number
): Promise<ReviewsResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    params.append('sortBy', sortBy);
    if (rating) params.append('rating', rating.toString());

    const response = await vendorReviewAPI.get<ReviewsResponse>(
      `/vendors/reviews?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch reviews' };
  }
};

/**
 * Get review statistics
 */
export const getReviewStats = async (): Promise<ReviewStatsResponse> => {
  try {
    const response = await vendorReviewAPI.get<ReviewStatsResponse>(
      '/vendors/reviews/stats'
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch review statistics' };
  }
};

/**
 * Respond to a review (create new or update existing response)
 */
export const respondToReview = async (
  reviewId: string,
  data: RespondToReviewRequest
): Promise<ReviewDetailResponse> => {
  try {
    const response = await vendorReviewAPI.post<ReviewDetailResponse>(
      `/vendors/reviews/${reviewId}/respond`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to respond to review' };
  }
};
