import api from './auth.api';

// Types for Business Details
export interface BusinessDetailsData {
  yearOfEstablishment?: number;
  yearsInBusiness?: number;
  teamSize?: string;
  minGuests?: number;
  maxGuests?: number;
  advanceBookingTime?: string;
  vendorCategory?: string;
  country?: string;
  state?: string;
  locality?: string;
  pincode?: string;
  vegPricePerPlate?: number;
  nonVegPricePerPlate?: number;
  servicesSpecialization?: string[];
  cuisineOptions?: string[];
  languagesSpoken?: string[];
  weeksAdvanceBooking?: number;
  operationalRadius?: number;
  policyType?: string;
  policyDetails?: string;
}

export interface UpdateBusinessResponse {
  statusCode: number;
  data: {
    vendor: any;
  };
  message: string;
  success: boolean;
}

export interface GalleryImage {
  _id: string;
  url: string;
  publicId: string;
  category: 'menu' | 'highlights' | 'events' | 'setup' | 'testimonials' | 'certificates' | 'team';
  caption: string;
  uploadedAt: string;
}

export interface GalleryResponse {
  statusCode: number;
  data: {
    images: GalleryImage[];
  };
  message: string;
  success: boolean;
}

export interface ImageResponse {
  statusCode: number;
  data: {
    image: GalleryImage;
  };
  message: string;
  success: boolean;
}

export interface DeleteImageResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
}

/**
 * Update vendor business details (SuperAdmin)
 * PUT /vendors/profile/business?vendorId={{vendorID}}
 */
export const updateVendorBusinessDetails = async (
  vendorId: string,
  businessData: BusinessDetailsData
): Promise<UpdateBusinessResponse> => {
  try {
    const response = await api.put<UpdateBusinessResponse>(
      `/vendors/profile/business?vendorId=${vendorId}`,
      businessData
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update business details' };
  }
};

/**
 * Get vendor gallery images (SuperAdmin)
 * GET /vendors/gallery?vendorId={{vendorID}}
 */
export const getVendorGalleryImages = async (
  vendorId: string,
  category?: string
): Promise<GalleryResponse> => {
  try {
    let url = `/vendors/gallery?vendorId=${vendorId}`;
    if (category && category !== 'all') {
      url += `&category=${category}`;
    }
    const response = await api.get<GalleryResponse>(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch gallery images' };
  }
};

/**
 * Upload gallery image (SuperAdmin)
 * POST /vendors/gallery?vendorId={{vendorID}}
 */
export const uploadVendorGalleryImage = async (
  vendorId: string,
  file: File,
  category: string,
  caption: string
): Promise<ImageResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('caption', caption);

    const response = await api.post<ImageResponse>(
      `/vendors/gallery?vendorId=${vendorId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to upload image' };
  }
};

/**
 * Delete gallery image (SuperAdmin)
 * DELETE /vendors/gallery/:imageId?vendorId={{vendorID}}
 */
export const deleteVendorGalleryImage = async (
  vendorId: string,
  imageId: string
): Promise<DeleteImageResponse> => {
  try {
    const response = await api.delete<DeleteImageResponse>(
      `/vendors/gallery/${imageId}?vendorId=${vendorId}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to delete image' };
  }
};

/**
 * Update gallery image (SuperAdmin)
 * PUT /vendors/gallery/:imageId?vendorId={{vendorID}}
 */
export const updateVendorGalleryImage = async (
  vendorId: string,
  imageId: string,
  updateData: { category?: string; caption?: string; file?: File }
): Promise<ImageResponse> => {
  try {
    const formData = new FormData();
    if (updateData.file) {
      formData.append('file', updateData.file);
    }
    if (updateData.category) {
      formData.append('category', updateData.category);
    }
    if (updateData.caption) {
      formData.append('caption', updateData.caption);
    }

    const response = await api.put<ImageResponse>(
      `/vendors/gallery/${imageId}?vendorId=${vendorId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update image' };
  }
};
