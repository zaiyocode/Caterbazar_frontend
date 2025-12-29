import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { getVendorProfile } from '@/api/vendor/business.api';
import { updatePersonalInfo, deleteProfilePhoto } from '@/api/vendor/vendor.api';

export default function PersonalInfo() {
  const [formData, setFormData] = useState({
    fullName: '',
    brandName: '',
    email: '',
    businessEmail: '',
    businessMobile: '',
    whatsappNumber: '',
    websiteUrl: '',
    facebookPage: '',
    instagramHandle: '',
    shortBio: ''
  });

  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch vendor profile and business registration on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch vendor profile
        const profileResponse = await getVendorProfile();
        const profile = profileResponse.data.profile;
        
        // Set form data with profile info
        setFormData({
          fullName: profile.userId.fullName || '',
          brandName: profile.businessRegistrationId?.brandName || '',
          email: profile.userId.email || '',
          businessEmail: profile.businessRegistrationId?.businessEmail || '',
          businessMobile: profile.businessRegistrationId?.businessMobile || '',
          whatsappNumber: profile.socialMedia?.whatsappNumber || '',
          websiteUrl: profile.socialMedia?.personalWebsite || '',
          facebookPage: profile.socialMedia?.facebookHandle || '',
          instagramHandle: profile.socialMedia?.instagramHandle || '',
          shortBio: profile.bio || ''
        });
        
        setProfilePicture(profile.profilePhoto);
        setIsPhoneVerified(true); // Assuming verified if profile exists
        setIsEmailVerified(true); // Assuming verified if profile exists
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Prevent editing of read-only fields
    if (name === 'fullName' || name === 'email' || name === 'brandName' || name === 'businessEmail' || name === 'businessMobile') {
      return; // These fields are read-only
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG or PNG)');
        return;
      }
      
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB');
        return;
      }
      
      setProfilePhotoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setError('');
    }
  };

  const handleDeleteProfilePhoto = async () => {
    if (!profilePicture) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete your profile photo?');
    if (!confirmDelete) return;
    
    setError('');
    setSuccess('');
    setDeleting(true);

    try {
      await deleteProfilePhoto();
      setProfilePicture(null);
      setProfilePhotoFile(null);
      setSuccess('Profile photo deleted successfully!');
      
      // Refresh profile data
      const profileResponse = await getVendorProfile();
      const profile = profileResponse.data.profile;
      setProfilePicture(profile.profilePhoto);
    } catch (err: any) {
      setError(err.message || 'Failed to delete profile photo');
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await updatePersonalInfo({
        facebookHandle: formData.facebookPage || undefined,
        instagramHandle: formData.instagramHandle || undefined,
        whatsappNumber: formData.whatsappNumber || undefined,
        personalWebsite: formData.websiteUrl || undefined,
        bio: formData.shortBio || undefined,
        profilePhoto: profilePhotoFile || undefined,
      });

      setSuccess('Profile updated successfully!');
      setProfilePhotoFile(null); // Clear file after successful upload
      
      // Refresh profile data to show updated photo URL
      const profileResponse = await getVendorProfile();
      const profile = profileResponse.data.profile;
      if (profile.profilePhoto) {
        setProfilePicture(profile.profilePhoto);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Personal Information</h1>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Manage your business profile details</p>

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

      {/* Profile Photo Section */}
      <div className="rounded-xl p-4 sm:p-6 border border-gray-200 mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Business Profile Photo</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-2xl">
              {formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'V'}
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <input
              type="file"
              id="profilePhotoInput"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleProfilePhotoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById('profilePhotoInput')?.click()}
              className="px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-sm sm:text-base text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Upload className="w-4 h-4" />
              Upload New Photo
            </button>
            {profilePicture && (
              <button
                type="button"
                onClick={handleDeleteProfilePhoto}
                disabled={deleting}
                className="px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-red-300 rounded-lg font-semibold text-sm sm:text-base text-red-600 hover:border-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Photo
                  </>
                )}
              </button>
            )}
            {/* <span className="text-xs sm:text-sm text-gray-500">JPG or PNG. Max size 2MB.</span> */}
          </div>
        </div>
      </div>

      {/* Information Overview Form */}
      <div className="rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Information Overview</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Full Name - Read Only */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              readOnly
              placeholder="Your full name"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed outline-none text-sm sm:text-base"
              title="This field cannot be edited"
            />
          </div>

          {/* Email - Read Only */}
          <div>
            <label className="flex text-sm font-semibold text-gray-900 mb-2 items-center gap-1">
              Email <span className="text-red-500">*</span>
              {isEmailVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              placeholder="Your email"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed outline-none text-sm sm:text-base"
              title="This field cannot be edited"
            />
          </div>

          {/* Brand Name - Read Only from Business Registration */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              readOnly
              placeholder="From Business Registration"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed outline-none text-sm sm:text-base"
              title="This field is filled from your business registration"
            />
            <p className="text-xs text-gray-500 mt-1">From Business Registration</p>
          </div>

          {/* Business Email - Read Only from Business Registration */}
          <div>
            <label className="flex text-sm font-semibold text-gray-900 mb-2 items-center gap-1">
              Business Email <span className="text-red-500">*</span>
              {isEmailVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
            </label>
            <input
              type="email"
              name="businessEmail"
              value={formData.businessEmail}
              readOnly
              placeholder="From Business Registration"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed outline-none text-sm sm:text-base"
              title="This field is filled from your business registration"
            />
            <p className="text-xs text-gray-500 mt-1">From Business Registration</p>
          </div>

          {/* Business Mobile - Read Only from Business Registration */}
          <div>
            <label className="flex text-sm font-semibold text-gray-900 mb-2 items-center gap-1">
              Business Mobile <span className="text-red-500">*</span>
              {isPhoneVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value="+91"
                readOnly
                className="w-16 px-3 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm sm:text-base text-center cursor-not-allowed"
              />
              <input
                type="tel"
                name="businessMobile"
                value={formData.businessMobile}
                readOnly
                placeholder="From Business Registration"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed outline-none text-sm sm:text-base"
                title="This field is filled from your business registration"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">From Business Registration</p>
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleInputChange}
              placeholder="WhatsApp number"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base"
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Website URL (Optional)
            </label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base"
            />
          </div>

          {/* Facebook Page */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Facebook Page (Optional)
            </label>
            <input
              type="text"
              name="facebookPage"
              value={formData.facebookPage}
              onChange={handleInputChange}
              placeholder="Facebook page URL"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base"
            />
          </div>

          {/* Instagram Handle */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Instagram Handle (Optional)
            </label>
            <input
              type="text"
              name="instagramHandle"
              value={formData.instagramHandle}
              onChange={handleInputChange}
              placeholder="@yourhandle"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Short Bio */}
        <div className="mt-4 sm:mt-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Short Bio (50 words)
          </label>
          <textarea
            name="shortBio"
            value={formData.shortBio}
            onChange={handleInputChange}
            placeholder="Describe your business in 50 words..."
            maxLength={250}
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base resize-none"
          />
          <div className="text-right text-xs sm:text-sm text-gray-500 mt-1">
            {formData.shortBio.length}/250
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-500 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              "Save Profile"
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
