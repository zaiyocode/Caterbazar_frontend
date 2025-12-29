'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Filter
} from 'lucide-react';
import { 
  getGalleryImages, 
  uploadGalleryImage, 
  updateGalleryImage, 
  deleteGalleryImage,
  GalleryImage 
} from '@/api/vendor/gallery.api';

const CATEGORIES = [
  { value: 'all', label: 'All Images' },
  // { value: 'menu', label: 'Menu' },
  { value: 'highlights', label: 'Highlights' },
  // { value: 'events', label: 'Events' },
  { value: 'setup', label: 'Featured Image' },
  // { value: 'testimonials', label: 'Testimonials' },
  // { value: 'certificates', label: 'Certificates' },
  // { value: 'team', label: 'Team' },
];

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    category: 'highlights',
    caption: '',
    preview: null as string | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch images on mount and when category changes
  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const fetchImages = async () => {
    setLoading(true);
    setError('');
    try {
      const category = selectedCategory === 'all' ? undefined : selectedCategory;
      const response = await getGalleryImages(category);
      setImages(response.data.images);
    } catch (err: any) {
      console.error('Error fetching gallery images:', err);
      setError(err.message || 'Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, WEBP)');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Create preview
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
      const response = await uploadGalleryImage(
        uploadForm.file,
        uploadForm.category,
        uploadForm.caption
      );

      // Add new image to list
      setImages(prev => [response.data.image, ...prev]);
      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);

      // Reset form and close modal
      resetUploadForm();
      setShowUploadModal(false);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image');
      setTimeout(() => setError(''), 5000);
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
      const response = await updateGalleryImage(
        editingImage._id,
        uploadForm.file || undefined,
        uploadForm.category,
        uploadForm.caption
      );

      // Update image in list
      setImages(prev => prev.map(img => 
        img._id === editingImage._id ? response.data.image : img
      ));

      setSuccess('Image updated successfully!');
      setTimeout(() => setSuccess(''), 3000);

      // Reset form and close modal
      resetUploadForm();
      setEditingImage(null);
      setShowUploadModal(false);
    } catch (err: any) {
      console.error('Error updating image:', err);
      setError(err.message || 'Failed to update image');
      setTimeout(() => setError(''), 5000);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    setError('');
    setSuccess('');

    try {
      await deleteGalleryImage(imageId);
      
      // Remove from list
      setImages(prev => prev.filter(img => img._id !== imageId));
      setSuccess('Image deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error deleting image:', err);
      setError(err.message || 'Failed to delete image');
      setTimeout(() => setError(''), 5000);
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
    // Clean up object URL if it's a new file
    if (uploadForm.file && uploadForm.preview && uploadForm.preview.startsWith('blob:')) {
      URL.revokeObjectURL(uploadForm.preview);
    }
    
    // If editing, keep the original image; if new upload, clear everything
    if (editingImage) {
      setUploadForm(prev => ({ 
        ...prev, 
        file: null, 
        preview: editingImage.url 
      }));
    } else {
      setUploadForm(prev => ({ 
        ...prev, 
        file: null, 
        preview: null 
      }));
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
      menu: 'Menu',
      highlights: 'Highlights',
      events: 'Events',
      setup: 'Featured Image',
      testimonials: 'Testimonials',
      certificates: 'Certificates',
      team: 'Team',
    };
    return labels[category] || category;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Upload and manage your gallery images</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload Image
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-semibold text-gray-900">Filter by Category</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No images yet</h3>
          <p className="text-gray-600 mb-6">Upload your first image to get started</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square group">
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => openEditModal(image)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(image._id)}
                    className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColor(image.category)}`}>
                    {getCategoryLabel(image.category)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(image.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{image.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingImage ? 'Edit Image' : 'Upload Image'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Image {editingImage && '(Upload a new image to replace current one)'}
                </label>
                {uploadForm.preview ? (
                  <div className="relative">
                    <img
                      src={uploadForm.preview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {/* <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemovePreview();
                      }}
                      className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                      type="button"
                    >
                      <X className="w-5 h-5 text-gray-700" />
                    </button> */}
                    {uploadForm.file && editingImage && (
                      <div className="absolute bottom-2 left-2 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                        New image selected
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-orange-500 transition-colors block">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium mb-2">Click to upload image</p>
                    <p className="text-xs text-gray-500">JPG, PNG or WEBP (max 10MB)</p>
                  </label>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category
                </label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  {CATEGORIES.filter(cat => cat.value !== 'all').map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Caption <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={uploadForm.caption}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="e.g., Wedding catering setup"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={closeModal}
                disabled={uploading}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={editingImage ? handleUpdate : handleUpload}
                disabled={uploading}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {editingImage ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    {editingImage ? 'Update Image' : 'Upload Image'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
