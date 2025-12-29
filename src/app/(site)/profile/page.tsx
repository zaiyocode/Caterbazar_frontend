"use client";

import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Calendar,
  Clock,
  Edit2,
  Lock,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  X,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserAccount,
  uploadProfilePicture,
  User,
} from "@/api/user/user.api";
import { userLogout } from "@/api/user/auth.api";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Edit Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Change Password States
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete Account States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Profile Picture States
  const [uploadingPicture, setUploadingPicture] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.success) {
        setUser(response.data.user);
        setFullName(response.data.user.fullName);
        setPhoneNumber(response.data.user.phoneNumber || "");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
      if (err.statusCode === 401) {
        router.push("/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    // Validate phone number if provided
    if (phoneNumber.trim() && !/^[0-9]{10}$/.test(phoneNumber.trim())) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setUpdatingProfile(true);

    try {
      const response = await updateUserProfile({ 
        fullName,
        phoneNumber: phoneNumber.trim() || undefined 
      });
      if (response.success) {
        setUser(response.data.user);
        setSuccess("Profile updated successfully!");
        setIsEditingProfile(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (response.success) {
        setSuccess("Password changed successfully!");
        setIsChangingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError("");
    setDeletingAccount(true);

    try {
      const response = await deleteUserAccount();
      if (response.success) {
        await userLogout();
        router.push("/auth");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete account");
      setDeletingAccount(false);
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setError("");
    setSuccess("");
    setUploadingPicture(true);

    try {
      const response = await uploadProfilePicture(file);
      if (response.success && user) {
        // Update user state with new profile picture URL
        setUser({
          ...user,
          profilePicture: response.data.profilePicture
        });
        setSuccess("Profile picture updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload profile picture");
    } finally {
      setUploadingPicture(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile</p>
          <button
            onClick={() => router.push("/auth")}
            className="mt-4 text-orange-500 hover:text-orange-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start gap-2">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="relative">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.fullName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-orange-100"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center border-4 border-orange-100">
                  <span className="text-white text-2xl sm:text-3xl font-bold">
                    {getInitials(user.fullName)}
                  </span>
                </div>
              )}
              
              {/* Upload Button Overlay */}
              <button
                onClick={() => document.getElementById('profilePictureInput')?.click()}
                disabled={uploadingPicture}
                className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors disabled:bg-orange-300"
                title="Upload new profile picture"
              >
                {uploadingPicture ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </button>
              
              {/* Hidden File Input */}
              <input
                type="file"
                id="profilePictureInput"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleProfilePictureUpload}
                className="hidden"
                disabled={uploadingPicture}
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {user.fullName}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">Click the upload icon to change your profile picture</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.accountStatus === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user.accountStatus.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {user.role.toUpperCase()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              {isEditingProfile ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Edit Profile Form */}
          {isEditingProfile && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={updatingProfile}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={updatingProfile}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm disabled:bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter 10-digit phone number (e.g., 9876543210)
                  </p>
                </div>

                <button
                  onClick={handleUpdateProfile}
                  disabled={updatingProfile}
                  className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300 flex items-center justify-center gap-2 text-sm"
                >
                  {updatingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" />
            Account Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="text-sm font-medium text-gray-900 break-all">
                  {user.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {user.isEmailVerified ? (
                    <>
                      {/* <CheckCircle className="w-3 h-3 text-green-500" /> */}
                      {/* <span className="text-xs text-green-600">Verified</span> */}
                    </>
                  ) : (
                    <>
                      {/* <XCircle className="w-3 h-3 text-red-500" /> */}
                      {/* <span className="text-xs text-red-600">Not Verified</span> */}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.phoneNumber}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {user.isPhoneVerified ? (
                    <>
                      {/* <CheckCircle className="w-3 h-3 text-green-500" /> */}
                      {/* <span className="text-xs text-green-600">Verified</span> */}
                    </>
                  ) : (
                    <>
                      {/* <XCircle className="w-3 h-3 text-red-500" /> */}
                      {/* <span className="text-xs text-red-600">Not Verified</span> */}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm font-medium text-gray-900 wrap-break-word">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            {user.lastLogin && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Last Login</p>
                  <p className="text-sm font-medium text-gray-900 wrap-break-word">
                    {formatDate(user.lastLogin)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              Change Password
            </h3>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="px-4 py-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors text-sm"
              >
                Change
              </button>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={changingPassword}
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={changingPassword}
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={changingPassword}
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="flex-1 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300 flex items-center justify-center gap-2 text-sm"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Password
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  disabled={changingPassword}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border-2 border-red-200">
          <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-2 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 sm:px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => !deletingAccount && setShowDeleteModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Delete Account
                  </h3>
                </div>

                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete your account? This action cannot be
                  undone. All your data will be permanently removed.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 flex items-center justify-center gap-2"
                  >
                    {deletingAccount ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Yes, Delete My Account"
                    )}
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deletingAccount}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
