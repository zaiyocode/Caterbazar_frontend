import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Axios instance for vendor gallery API
const vendorGalleryAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
vendorGalleryAPI.interceptors.request.use(
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
vendorGalleryAPI.interceptors.response.use(
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

// Types
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

/**
 * Get all gallery images
 */
export const getGalleryImages = async (category?: string): Promise<GalleryResponse> => {
  try {
    const url = category ? `/vendors/gallery?category=${category}` : '/vendors/gallery';
    const response = await vendorGalleryAPI.get<GalleryResponse>(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch gallery images' };
  }
};

/**
 * Upload gallery image
 */
export const uploadGalleryImage = async (
  file: File,
  category: string,
  caption: string
): Promise<ImageResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('caption', caption);

    const response = await vendorGalleryAPI.post<ImageResponse>(
      '/vendors/gallery',
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
 * Update gallery image
 */
export const updateGalleryImage = async (
  imageId: string,
  file: File | undefined,
  category: string,
  caption: string
): Promise<ImageResponse> => {
  try {
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('category', category);
    formData.append('caption', caption);

    const response = await vendorGalleryAPI.put<ImageResponse>(
      `/vendors/gallery/${imageId}`,
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

/**
 * Delete gallery image
 */
export const deleteGalleryImage = async (imageId: string): Promise<void> => {
  try {
    await vendorGalleryAPI.delete(`/vendors/gallery/${imageId}`);
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to delete image' };
  }
};
