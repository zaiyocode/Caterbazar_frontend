'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash2,
  Edit2,
  Image as ImageIcon,
} from 'lucide-react';
import { getVendorGalleryImages, uploadVendorGalleryImage, deleteVendorGalleryImage, updateVendorGalleryImage } from '@/api/superadmin/vendorManagement.api';
import type { GalleryImage } from '@/api/superadmin/vendorManagement.api';

interface VendorGalleryManagementProps {
  vendorId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { value: 'all', label: 'All Images' },
  { value: 'highlights', label: 'Highlights' },
  { value: 'setup', label: 'Featured Image' },
];

export default function VendorGalleryManagement({
  vendorId,
  isOpen,
  onClose,
}: VendorGalleryManagementProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    category: 'highlights',
    caption: '',
    preview: null as string | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && vendorId) {
      fetchImages();
    }
  }, [isOpen, vendorId, selectedCategory]);

  const fetchImages = async () => {
    setLoading(true);
    setError('');
    try {
      const category = selectedCategory === 'all' ? undefined : selectedCategory;
      const response = await getVendorGalleryImages(vendorId, category);
      setImages(response.data.images);
    } catch (err: any) {
      setError(err.message || 'Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, WEBP)');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const preview = URL.createObjectURL(file);
    setUploadForm(prev => ({ ...prev, file, preview }));
  };

  const handleUpload = async () => {
    if (!uploadForm.file) {
      setError('Please select an image');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!uploadForm.caption.trim()) {
      setError('Please enter a caption');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await uploadVendorGalleryImage(
        vendorId,
        uploadForm.file,
        uploadForm.category,
        uploadForm.caption
      );

      setImages(prev => [response.data.image, ...prev]);
      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);

      closeModal();
      setTimeout(() => fetchImages(), 500);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingImage) return;

    if (!uploadForm.caption.trim()) {
      setError('Please enter a caption');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateVendorGalleryImage(
        vendorId,
        editingImage._id,
        {
          category: uploadForm.category,
          caption: uploadForm.caption,
          file: uploadForm.file || undefined,
        }
      );

      setImages(prev =>
        prev.map(img => (img._id === editingImage._id ? response.data.image : img))
      );

      setSuccess('Image updated successfully!');
      setTimeout(() => setSuccess(''), 3000);

      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to update image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    setError('');
    setSuccess('');

    try {
      await deleteVendorGalleryImage(vendorId, imageId);
      setImages(prev => prev.filter(img => img._id !== imageId));
      setSuccess('Image deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
      setTimeout(() => setError(''), 3000);
    }
  };

  const openEditModal = (image: GalleryImage) => {
    setEditingImage(image);
    setUploadForm({
      file: null,
      category: image.category,
      caption: image.caption,
      preview: image.url,
    });
    setShowUploadModal(true);
  };

  const handleRemovePreview = () => {
    if (uploadForm.file && uploadForm.preview && uploadForm.preview.startsWith('blob:')) {
      URL.revokeObjectURL(uploadForm.preview);
    }

    if (editingImage) {
      setUploadForm({
        file: null,
        category: uploadForm.category,
        caption: uploadForm.caption,
        preview: editingImage.url,
      });
    } else {
      setUploadForm({
        file: null,
        category: 'highlights',
        caption: '',
        preview: null,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetUploadForm = () => {
    if (uploadForm.preview && uploadForm.file) {
      URL.revokeObjectURL(uploadForm.preview);
    }
    setUploadForm({
      file: null,
      category: 'highlights',
      caption: '',
      preview: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeModal = () => {
    resetUploadForm();
    setEditingImage(null);
    setShowUploadModal(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      menu: 'bg-orange-100 text-orange-700',
      highlights: 'bg-purple-100 text-purple-700',
      events: 'bg-blue-100 text-blue-700',
      setup: 'bg-green-100 text-green-700',
      testimonials: 'bg-pink-100 text-pink-700',
      certificates: 'bg-yellow-100 text-yellow-700',
      team: 'bg-indigo-100 text-indigo-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      highlights: 'Highlights',
      setup: 'Featured Image',
      testimonials: 'Testimonials',
      certificates: 'Certificates',
      team: 'Team',
    };
    return labels[category] || category;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[90%] md:w-[85%] bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-orange-500 to-red-500 text-white p-6 flex items-center justify-between border-b">
          <h2 className="text-lg sm:text-xl font-bold">Manage Gallery</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-100 text-red-800 rounded-lg border border-red-200">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-100 text-green-800 rounded-lg border border-green-200">
              <CheckCircle size={20} />
              <span>{success}</span>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === cat.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 transition"
            >
              <Upload size={20} />
              Upload Image
            </button>
          </div>

          {/* Images Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="animate-spin" size={48} />
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <ImageIcon size={64} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">No images found</p>
              <p className="text-sm">Upload your first image to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={image._id || image.url || index}
                  className="relative group bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-48 object-cover group-hover:opacity-75 transition"
                  />

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditModal(image)}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="p-3 bg-white">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getCategoryColor(image.category)}`}>
                      {getCategoryLabel(image.category)}
                    </span>
                    <p className="text-sm text-gray-800 truncate">{image.caption}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(image.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={closeModal} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full sm:w-[90%] md:w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-linear-to-r from-orange-500 to-red-500 text-white p-6 flex items-center justify-between border-b">
              <h3 className="text-lg font-bold">
                {editingImage ? 'Edit Image' : 'Upload Image'}
              </h3>
              <button onClick={closeModal} className="hover:bg-white/20 p-2 rounded-full">
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                editingImage ? handleUpdate() : handleUpload();
              }}
              className="p-6 space-y-4"
            >
              {/* Image Preview */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                {uploadForm.preview ? (
                  <div className="relative">
                    <img
                      src={uploadForm.preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {uploadForm.file && (
                      <button
                        type="button"
                        onClick={handleRemovePreview}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-gray-100 transition rounded-lg">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-center text-gray-600">
                      Click to upload image
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={uploadForm.category}
                  onChange={(e) =>
                    setUploadForm(prev => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="highlights">Highlights</option>
                  <option value="setup">Featured Image</option>
                </select>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <input
                  type="text"
                  value={uploadForm.caption}
                  onChange={(e) =>
                    setUploadForm(prev => ({ ...prev, caption: e.target.value }))
                  }
                  placeholder="Enter image caption"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : editingImage ? (
                    'Update Image'
                  ) : (
                    'Upload Image'
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
