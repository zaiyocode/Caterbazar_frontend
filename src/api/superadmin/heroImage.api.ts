import api from './auth.api';

// Types
interface UploadedBy {
  _id: string;
  fullName: string;
  email: string;
}

interface HeroImage {
  _id: string;
  title: string;
  imageUrl: string;
  publicId: string;
  isActive: boolean;
  uploadedBy: string | UploadedBy | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UploadHeroImageResponse {
  statusCode: number;
  data: {
    heroImage: HeroImage;
  };
  message: string;
  success: boolean;
}

interface GetAllHeroImagesResponse {
  statusCode: number;
  data: {
    heroImages: HeroImage[];
    pagination: PaginationInfo;
  };
  message: string;
  success: boolean;
}

interface GetSingleHeroImageResponse {
  statusCode: number;
  data: {
    heroImage: HeroImage;
  };
  message: string;
  success: boolean;
}

interface UpdateHeroImageResponse {
  statusCode: number;
  data: {
    heroImage: HeroImage;
  };
  message: string;
  success: boolean;
}

interface DeleteHeroImageResponse {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
}

// Upload Hero Image
export const uploadHeroImage = async (formData: FormData): Promise<UploadHeroImageResponse> => {
  try {
    const response = await api.post<UploadHeroImageResponse>(
      "/admin/hero-images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to upload hero image. Please try again.",
      success: false,
    };
  }
};

// Get All Hero Images
export const getAllHeroImages = async (params?: {
  isActive?: boolean;
  page?: number;
  limit?: number;
}): Promise<GetAllHeroImagesResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.isActive !== undefined) {
      queryParams.append("isActive", params.isActive.toString());
    }
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const url = `/admin/hero-images${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await api.get<GetAllHeroImagesResponse>(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to fetch hero images. Please try again.",
      success: false,
    };
  }
};

// Get Single Hero Image
export const getSingleHeroImage = async (imageId: string): Promise<GetSingleHeroImageResponse> => {
  try {
    const response = await api.get<GetSingleHeroImageResponse>(
      `/admin/hero-images/${imageId}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to fetch hero image. Please try again.",
      success: false,
    };
  }
};

// Update Hero Image Title
export const updateHeroImageTitle = async (
  imageId: string,
  title: string
): Promise<UpdateHeroImageResponse> => {
  try {
    const response = await api.put<UpdateHeroImageResponse>(
      `/admin/hero-images/${imageId}`,
      { title }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to update hero image. Please try again.",
      success: false,
    };
  }
};

// Replace Hero Image
export const replaceHeroImage = async (
  imageId: string,
  formData: FormData
): Promise<UpdateHeroImageResponse> => {
  try {
    const response = await api.put<UpdateHeroImageResponse>(
      `/admin/hero-images/${imageId}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to replace hero image. Please try again.",
      success: false,
    };
  }
};

// Toggle Hero Image Status
export const toggleHeroImageStatus = async (imageId: string): Promise<UpdateHeroImageResponse> => {
  try {
    const response = await api.patch<UpdateHeroImageResponse>(
      `/admin/hero-images/${imageId}/toggle`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to toggle hero image status. Please try again.",
      success: false,
    };
  }
};

// Delete Hero Image
export const deleteHeroImage = async (imageId: string): Promise<DeleteHeroImageResponse> => {
  try {
    const response = await api.delete<DeleteHeroImageResponse>(
      `/admin/hero-images/${imageId}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || {
      message: "Failed to delete hero image. Please try again.",
      success: false,
    };
  }
};

export type {
  HeroImage,
  UploadedBy,
  PaginationInfo,
  UploadHeroImageResponse,
  GetAllHeroImagesResponse,
  GetSingleHeroImageResponse,
  UpdateHeroImageResponse,
  DeleteHeroImageResponse,
};
