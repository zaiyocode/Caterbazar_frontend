import api from './auth.api';

// Types
export interface User {
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

export interface GetUsersResponse {
  statusCode: number;
  data: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
    stats: {
      totalUsers: number;
      totalVendors: number;
      totalAdmins: number;
    };
  };
  message: string;
  success: boolean;
}

/**
 * Get all users with pagination and search
 */
export const getAllUsers = async (
  page: number = 1,
  limit: number = 20,
  sortBy: string = 'createdAt',
  search?: string
): Promise<GetUsersResponse> => {
  try {
    const params: any = {
      page,
      limit,
      sortBy,
    };

    if (search) {
      params.search = search;
    }

    const response = await api.get<GetUsersResponse>('/admin/users', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch users' };
  }
};
