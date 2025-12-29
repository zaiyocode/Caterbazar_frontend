import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface VendorSearchParams {
  vendorCategory?: string;
  state?: string;
  locality?: string;
  minGuests?: number;
  maxGuests?: number;
  vegPriceMin?: number;
  vegPriceMax?: number;
  nonVegPriceMin?: number;
  nonVegPriceMax?: number;
  foodPreference?: 'veg' | 'non-veg' | 'both';
  minRating?: number;
  caterbazarChoice?: boolean;
  sortBy?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface VendorData {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  businessRegistrationId: {
    _id: string;
    brandName: string;
  };
  profilePhoto: string | null;
  businessInfo: {
    yearOfEstablishment: number;
    yearsInBusiness: number;
    teamSize: string;
  };
  capacity: {
    minGuests: number;
    maxGuests: number;
    advanceBookingTime: string;
    vendorCategory: string;
  };
  address: {
    country: string;
    state: string;
    locality: string;
    pincode: string;
  };
  pricing: {
    vegPricePerPlate: number;
    nonVegPricePerPlate: number;
    servicesSpecialization: string[];
    cuisineOptions: string[];
  };
  stats: {
    totalOrders: number;
    totalCustomers: number;
    averageRating: number;
    totalReviews: number;
    totalRevenue: number;
    totalInquiries: number;
  };
  analytics: {
    profileViews: number;
    popularity: number;
    responseRate: number;
    totalInquiries: number;
    totalReviews: number;
  };
  isCaterbazarChoice: boolean;
  location: {
    coordinates: [number, number];
    type: string;
  };
  gallery: {
    url: string;
    publicId: string;
    category: 'menu' | 'highlights' | 'events' | 'setup' | 'testimonials' | 'certificates' | 'team';
    caption: string;
    uploadedAt: string;
    _id: string;
  }[];
}

export interface ReviewUser {
  _id: string;
  fullName: string;
  profilePicture: string | null;
}

export interface ReviewData {
  _id: string;
  vendorId: {
    _id: string;
    fullName: string;
  };
  userId: ReviewUser | null;
  inquiryId: string;
  orderId: string | null;
  rating: number;
  foodQuality: number;
  serviceQuality: number;
  valueForMoney: number;
  hygiene: number;
  comment: string;
  title: string;
  isVerified: boolean;
  adminApproved: boolean;
  vendorResponse?: {
    message: string;
    respondedAt: string;
  };
  helpfulCount: number;
  helpfulVotes: string[];
  isReported: boolean;
  reportReason: string | null;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RatingBreakdown {
  stars: number;
  count: number;
  percentage: number;
}

export interface VendorProfileData extends VendorData {
  socialMedia: {
    facebookHandle: string;
    instagramHandle: string;
    whatsappNumber: string;
    personalWebsite: string;
  };
  bio: string;
  cancellationPolicy: {
    policyType: string;
    policyDetails: string;
  };
  operations: {
    languagesSpoken: string[];
    weeksAdvanceBooking: number;
    operationalRadius: number;
  };
  profileCompletionPercentage: number;
  isProfileComplete: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  caterbazarChoiceSetAt?: string;
  caterbazarChoiceSetBy?: string;
  fssaiCertificate?: {
    url: string;
    publicId: string;
    uploadedAt: string;
  };
  menuPhotos: string[];
  userId: {
    _id: string;
    fullName: string;
    email: string;
    createdAt: string;
  };
}

export interface GalleryImage {
  _id: string;
  url: string;
  publicId: string;
  category: 'menu' | 'highlights' | 'events' | 'setup' | 'testimonials' | 'certificates' | 'team';
  caption: string;
  uploadedAt: string;
}

export interface VendorProfileResponse {
  statusCode: number;
  data: {
    vendor: VendorProfileData;
    reviews: ReviewData[];
    ratingBreakdown: RatingBreakdown[];
    gallery: GalleryImage[];
  };
  message: string;
  success: boolean;
}

export interface VendorSearchResponse {
  statusCode: number;
  data: {
    vendors: VendorData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
    filters: {
      vendorCategory?: string;
      state?: string;
      caterbazarChoice?: string;
    };
  };
  message: string;
  success: boolean;
}

export const searchVendors = async (params: VendorSearchParams): Promise<VendorSearchResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.vendorCategory) queryParams.append('vendorCategory', params.vendorCategory);
  if (params.state) queryParams.append('state', params.state);
  if (params.locality) queryParams.append('locality', params.locality);
  if (params.minGuests) queryParams.append('minGuests', String(params.minGuests));
  if (params.maxGuests) queryParams.append('maxGuests', String(params.maxGuests));
  if (params.vegPriceMin) queryParams.append('vegPriceMin', String(params.vegPriceMin));
  if (params.vegPriceMax) queryParams.append('vegPriceMax', String(params.vegPriceMax));
  if (params.nonVegPriceMin) queryParams.append('nonVegPriceMin', String(params.nonVegPriceMin));
  if (params.nonVegPriceMax) queryParams.append('nonVegPriceMax', String(params.nonVegPriceMax));
  if (params.foodPreference) queryParams.append('foodPreference', params.foodPreference);
  if (params.minRating) queryParams.append('minRating', String(params.minRating));
  if (params.caterbazarChoice !== undefined) queryParams.append('caterbazarChoice', String(params.caterbazarChoice));
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.searchQuery) queryParams.append('searchQuery', params.searchQuery);
  if (params.page) queryParams.append('page', String(params.page));
  if (params.limit) queryParams.append('limit', String(params.limit));

  const response = await axios.get<VendorSearchResponse>(
    `${BASE_URL}/public/vendors/search?${queryParams.toString()}`
  );
  
  return response.data;
};

export const getVendorProfile = async (vendorId: string): Promise<VendorProfileResponse> => {
  const response = await axios.get<VendorProfileResponse>(
    `${BASE_URL}/public/vendors/${vendorId}`
  );
  
  return response.data;
};

export interface ReviewsParams {
  page?: number;
  limit?: number;
  rating?: number;
  sortBy?: string;
}

export interface ReviewsResponse {
  statusCode: number;
  data: {
    reviews: ReviewData[];
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

export const getVendorReviews = async (
  vendorId: string,
  params: ReviewsParams = {}
): Promise<ReviewsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', String(params.page));
  if (params.limit) queryParams.append('limit', String(params.limit));
  if (params.rating) queryParams.append('rating', String(params.rating));
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);

  const response = await axios.get<ReviewsResponse>(
    `${BASE_URL}/public/vendors/${vendorId}/reviews?${queryParams.toString()}`
  );
  
  return response.data;
};

export interface TopRatedReviewsParams {
  page?: number;
  limit?: number;
  rating?: number;
  sortBy?: string;
}

export interface TopRatedReviewsResponse {
  statusCode: number;
  data: {
    reviews: ReviewData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
    stats: {
      totalFiveStars: number;
      totalFourStars: number;
    };
  };
  message: string;
  success: boolean;
}

export const getTopRatedReviews = async (
  params: TopRatedReviewsParams = {}
): Promise<TopRatedReviewsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', String(params.page));
  if (params.limit) queryParams.append('limit', String(params.limit));
  if (params.rating) queryParams.append('rating', String(params.rating));
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);

  const response = await axios.get<TopRatedReviewsResponse>(
    `${BASE_URL}/public/vendors/reviews/top-rated?${queryParams.toString()}`
  );
  
  return response.data;
};

export interface HeroImage {
  _id: string;
  title: string;
  imageUrl: string;
}

export interface HeroImagesResponse {
  statusCode: number;
  data: {
    heroImages: HeroImage[];
  };
  message: string;
  success: boolean;
}

export const getHeroImages = async (): Promise<HeroImagesResponse> => {
  const response = await axios.get<HeroImagesResponse>(
    `${BASE_URL}/public/vendors/hero-images`
  );
  
  return response.data;
};