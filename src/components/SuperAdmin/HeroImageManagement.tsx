"use client";

import React, { useState, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, Edit, Trash2, Plus, 
  Calendar, ToggleLeft, ToggleRight, X, AlertCircle 
} from 'lucide-react';
import {
  getAllHeroImages,
  uploadHeroImage,
  updateHeroImageTitle,
  replaceHeroImage,
  toggleHeroImageStatus,
  deleteHeroImage,
  HeroImage,
} from '@/api/superadmin/heroImage.api';

export default function HeroImageManagement() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<HeroImage | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    fetchHeroImages();
  }, [currentPage, filterActive]);

  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllHeroImages({
        isActive: filterActive,
        page: currentPage,
        limit: 20,
      });

      if (response.success) {
        setHeroImages(response.data.heroImages);
        setTotalPages(response.data.pagination.pages);
        setTotalImages(response.data.pagination.total);
      }
    } catch (err: any) {
      console.error('Error fetching hero images:', err);
      setError(err.message || 'Failed to load hero images');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (imageId: string) => {
    try {
      const response = await toggleHeroImageStatus(imageId);
      if (response.success) {
        // Update the local state
        setHeroImages(prev =>
          prev.map(img =>
            img._id === imageId ? { ...img, isActive: response.data.heroImage.isActive } : img
          )
        );
      }
    } catch (err: any) {
      console.error('Error toggling image status:', err);
      alert(err.message || 'Failed to toggle image status');
    }
  };

  const handleDeleteImage = async () => {
    if (!selectedImage) return;
    
    try {
      setUploadProgress(true);
      const response = await deleteHeroImage(selectedImage._id);
      if (response.success) {
        setHeroImages(prev => prev.filter(img => img._id !== selectedImage._id));
        setIsDeleteModalOpen(false);
        setSelectedImage(null);
      }
    } catch (err: any) {
      console.error('Error deleting image:', err);
      alert(err.message || 'Failed to delete image');
    } finally {
      setUploadProgress(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Image Management</h2>
          <p className="text-gray-600 mt-1">Manage homepage hero images and banners</p>
        </div>
        
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Image
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilterActive(undefined)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterActive === undefined
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({totalImages})
        </button>
        <button
          onClick={() => setFilterActive(true)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterActive === true
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilterActive(false)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterActive === false
              ? 'bg-gray-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Inactive
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Images</p>
              <p className="text-2xl font-bold text-blue-900">{totalImages}</p>
            </div>
            <ImageIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Active Images</p>
              <p className="text-2xl font-bold text-green-900">
                {heroImages.filter(img => img.isActive).length}
              </p>
            </div>
            <ToggleRight className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Inactive Images</p>
              <p className="text-2xl font-bold text-gray-900">
                {heroImages.filter(img => !img.isActive).length}
              </p>
            </div>
            <ToggleLeft className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hero images...</p>
        </div>
      ) : heroImages.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No hero images found</p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Upload First Image
          </button>
        </div>
      ) : (
        <>
          {/* Images Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {heroImages.map((image) => (
              <div key={image._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {/* Image Preview */}
                <div className="relative aspect-video bg-gray-100">
                  <img 
                    src={image.imageUrl} 
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(image._id)}
                      className={`p-1 rounded bg-white bg-opacity-90 hover:bg-opacity-100 transition-all ${
                        image.isActive ? 'text-green-500' : 'text-gray-500'
                      }`}
                      title={image.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {image.isActive ? (
                        <ToggleRight className="w-6 h-6" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Image Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{image.title}</h3>
                      <p className="text-xs text-gray-500">
                        Uploaded by: {typeof image.uploadedBy === 'object' && image.uploadedBy ? image.uploadedBy.fullName : 'Admin'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => {
                          setSelectedImage(image);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedImage(image);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Status and Metadata */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      image.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {image.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchHeroImages}
      />

      {/* Edit Modal */}
      {selectedImage && (
        <EditModal
          isOpen={isEditModalOpen}
          image={selectedImage}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedImage(null);
          }}
          onSuccess={fetchHeroImages}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedImage && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          image={selectedImage}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedImage(null);
          }}
          onConfirm={handleDeleteImage}
          loading={uploadProgress}
        />
      )}
    </div>
  );
}

// Upload Modal Component
function UploadModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', selectedFile);

      const response = await uploadHeroImage(formData);
      
      if (response.success) {
        onSuccess();
        onClose();
        // Reset form
        setTitle('');
        setSelectedFile(null);
        setPreview(null);
      }
    } catch (err: any) {
      console.error('Error uploading hero image:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Upload Hero Image</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter hero image title"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreview(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      JPG, PNG, WebP (Max 5MB, 1920x1080 recommended)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="hero-image-upload"
                    />
                    <label
                      htmlFor="hero-image-upload"
                      className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 cursor-pointer transition-colors"
                    >
                      Choose File
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || !title || !selectedFile}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  'Upload Image'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Edit Modal Component
function EditModal({
  isOpen,
  image,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  image: HeroImage;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState(image.title);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'title' | 'image'>('title');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setSelectedFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateTitle = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const response = await updateHeroImageTitle(image._id, title);
      
      if (response.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error('Error updating title:', err);
      setError(err.message || 'Failed to update title');
    } finally {
      setUpdating(false);
    }
  };

  const handleReplaceImage = async () => {
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await replaceHeroImage(image._id, formData);
      
      if (response.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error('Error replacing image:', err);
      setError(err.message || 'Failed to replace image');
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Edit Hero Image</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('title')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'title'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Edit Title
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'image'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Replace Image
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'title' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter hero image title"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTitle}
                  disabled={updating || !title || title === image.title}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    'Update Title'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Image
                </label>
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              {/* New Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  {preview ? (
                    <div className="space-y-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreview(null);
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Select new image</p>
                      <p className="text-xs text-gray-500 mb-4">
                        JPG, PNG, WebP (Max 5MB)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="replace-image-upload"
                      />
                      <label
                        htmlFor="replace-image-upload"
                        className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 cursor-pointer transition-colors"
                      >
                        Choose File
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReplaceImage}
                  disabled={updating || !selectedFile}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Replacing...
                    </>
                  ) : (
                    'Replace Image'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteModal({
  isOpen,
  image,
  onClose,
  onConfirm,
  loading,
}: {
  isOpen: boolean;
  image: HeroImage;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Delete Hero Image</h3>
            <p className="text-sm text-gray-600">This action cannot be undone</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-3">
            Are you sure you want to delete <strong>{image.title}</strong>?
          </p>
          <img
            src={image.imageUrl}
            alt={image.title}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              'Delete Image'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
