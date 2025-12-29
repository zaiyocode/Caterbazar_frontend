import api from './auth.api';

// Types
export interface BusinessRegistration {
  _id: string;
  brandName: string;
  businessEmail: string;
  businessMobile: string;
  location: string;
  vendorType: string;
  referId: string | null;
  submittedBy: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'resubmission_required';
  reviewedBy: {
    _id: string;
    fullName: string;
    email: string;
  } | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessRegistrationsResponse {
  statusCode: number;
  data: {
    registrations: BusinessRegistration[];
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

export interface ReviewRegistrationRequest {
  status: 'approved' | 'rejected' | 'resubmission_required';
  rejectionReason?: string;
  adminNotes?: string;
}

export interface ReviewRegistrationResponse {
  statusCode: number;
  data: {
    registration: BusinessRegistration;
  };
  message: string;
  success: boolean;
}

export interface UpdateRegistrationRequest {
  brandName: string;
  businessEmail: string;
  businessMobile: string;
  location: string;
  vendorType: string;
  referId?: string;
}

export interface UpdateRegistrationResponse {
  statusCode: number;
  data: {
    registration: BusinessRegistration;
  };
  message: string;
  success: boolean;
}

export interface RegistrationStatsResponse {
  statusCode: number;
  data: {
    stats: {
      pending: number;
      approved: number;
      rejected: number;
      resubmission_required: number;
      total: number;
    };
  };
  message: string;
  success: boolean;
}

/**
 * Get all business registrations with filters
 */
export const getAllBusinessRegistrations = async (
  status?: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortBy: string = 'createdAt'
): Promise<BusinessRegistrationsResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
    });

    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await api.get<BusinessRegistrationsResponse>(
      `/admin/business-registrations?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch business registrations' };
  }
};

/**
 * Review business registration (approve/reject/resubmission)
 */
export const reviewBusinessRegistration = async (
  id: string,
  data: ReviewRegistrationRequest
): Promise<ReviewRegistrationResponse> => {
  try {
    const response = await api.put<ReviewRegistrationResponse>(
      `/admin/business-registrations/${id}/review`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to review business registration' };
  }
};

/**
 * Get business registration statistics
 */
export const getRegistrationStats = async (): Promise<RegistrationStatsResponse> => {
  try {
    const response = await api.get<RegistrationStatsResponse>(
      '/admin/business-registrations/stats'
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch registration statistics' };
  }
};

/**
 * Update business registration
 */
export const updateBusinessRegistration = async (
  id: string,
  data: UpdateRegistrationRequest
): Promise<UpdateRegistrationResponse> => {
  try {
    const response = await api.put<UpdateRegistrationResponse>(
      `/admin/business-registrations/${id}/update`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update business registration' };
  }
};