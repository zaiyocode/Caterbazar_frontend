import api from './auth.api';

// Types
export interface Customer {
  name: string;
  phone: string;
  email: string;
  profilePicture: string | null;
  userId: string | null;
}

export interface Vendor {
  name: string;
  businessName: string | null;
  email: string;
  vendorId: string;
}

export interface EventLocation {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface AmountBreakdown {
  veg: number;
  nonVeg: number;
}

export interface Amount {
  total: number;
  perPlate: number;
  breakdown: AmountBreakdown;
}

export interface VendorResponse {
  message: string;
  respondedAt: string;
}

export interface Order {
  orderId: string;
  _id: string;
  customer: Customer;
  vendor: Vendor;
  eventType: string;
  eventDate: string;
  eventTime: string;
  guests: number;
  amount: Amount;
  status: 'pending' | 'contacted' | 'converted' | 'rejected' | 'cancelled';
  eventLocation: EventLocation;
  foodPreference: 'veg' | 'non-veg' | 'both';
  message: string;
  createdAt: string;
  viewedByVendor: boolean;
  vendorResponse?: VendorResponse;
}

export interface OrderSummary {
  totalOrders: number;
  pending: number;
  contacted: number;
  converted: number;
  rejected: number;
  cancelled: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  showing: string;
}

export interface GetOrdersResponse {
  statusCode: number;
  data: {
    orders: Order[];
    pagination: Pagination;
    summary: OrderSummary;
  };
  message: string;
  success: boolean;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  eventType?: string;
  dateRange?: string;
  search?: string;
  sortBy?: string;
}

/**
 * Get all orders with filters and pagination
 */
export const getAllOrders = async (params?: GetOrdersParams): Promise<GetOrdersResponse> => {
  try {
    const queryParams: any = {
      page: params?.page || 1,
      limit: params?.limit || 10,
      sortBy: params?.sortBy || 'createdAt',
    };

    if (params?.status) {
      queryParams.status = params.status;
    }

    if (params?.eventType) {
      queryParams.eventType = params.eventType;
    }

    if (params?.dateRange) {
      queryParams.dateRange = params.dateRange;
    }

    if (params?.search) {
      queryParams.search = params.search;
    }

    const response = await api.get<GetOrdersResponse>('/admin/orders', { params: queryParams });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch orders' };
  }
};

export type {
  GetOrdersParams as OrderFilters,
};
