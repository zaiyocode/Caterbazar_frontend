"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getVendorProfile } from "@/api/vendor/vendor.api";
import { vendorLogout } from "@/api/vendor/auth.api";

interface VendorData {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  profilePicture?: string | null;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  accountStatus?: string;
  lastLogin?: string;
  vendorProfile?: {
    businessRegistrationId?: {
      brandName?: string;
    };
  };
}

export default function VendorNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingVendor, setIsLoadingVendor] = useState(true);
  const router = useRouter();

  // Check authentication and fetch vendor profile
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userRole = localStorage.getItem("role");

        if (accessToken && userRole === "vendor") {
          const response = await getVendorProfile();
          if (response.success && response.data) {
            setVendor(response.data.vendor);
          }
        }
      } catch (error) {
        console.error("Failed to fetch vendor profile:", error);
      } finally {
        setIsLoadingVendor(false);
      }
    };

    fetchVendor();
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await vendorLogout();
      setVendor(null);
      setIsProfileOpen(false);
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API call fails, redirect to login
      router.push("/auth");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <nav className="bg-orange-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="Caterbazar Logo"
                className="h-10 w-auto filter brightness-0 invert"
              />
            </Link>
          </div>

          {/* Right Side - Profile */}
          <div className="flex items-center space-x-3">
            {/* Profile Dropdown - Only show if vendor is logged in */}
            {vendor && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  {vendor.profilePicture ? (
                    <img
                      src={vendor.profilePicture}
                      alt={vendor.fullName}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                      <span className="text-white text-xs font-semibold">
                        {getInitials(vendor.vendorProfile?.businessRegistrationId?.brandName || vendor.fullName)}
                      </span>
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-white text-sm font-medium">
                      {vendor.vendorProfile?.businessRegistrationId?.brandName || vendor.fullName}
                    </p>
                    <p className="text-white/60 text-xs">Vendor Account</p>
                  </div>
                </button>

                {/* Enhanced Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-50">
                    {/* Profile Header */}
                    <div className="bg-linear-to-r from-orange-500 to-red-500 p-6 text-white">
                      <div className="flex items-center space-x-4">
                        {vendor.profilePicture ? (
                          <img
                            src={vendor.profilePicture}
                            alt={vendor.fullName}
                            className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-3 border-white shadow-lg">
                            <span className="text-white text-xl font-bold">
                              {getInitials(vendor.fullName)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">
                            {vendor.fullName}
                          </h3>
                          <p className="text-white/90 text-sm">
                            {vendor.vendorProfile?.businessRegistrationId
                              ?.brandName
                              ? vendor.vendorProfile.businessRegistrationId
                                  .brandName
                              : vendor.role.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-4 space-y-3 bg-gray-50">
                      {vendor.vendorProfile?.businessRegistrationId
                        ?.brandName && (
                        <div className="text-sm">
                          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                            Business Name :{" "}
                            <span className="text-gray-800 font-semibold mt-1">
                              {
                                vendor.vendorProfile.businessRegistrationId
                                  .brandName
                              }
                            </span>
                          </p>
                          {/* <p className="text-gray-800 font-semibold mt-1">
                            {vendor.vendorProfile.businessRegistrationId.brandName}
                          </p> */}
                        </div>
                      )}

                      <div className="flex items-center space-x-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{vendor.email}</span>
                      </div>

                      <div className="flex items-center space-x-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {vendor.phoneNumber}
                        </span>
                      </div>

                      {vendor.lastLogin && (
                        <div className="flex items-center space-x-3 text-xs text-gray-500 pt-2">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Last login: {formatDate(vendor.lastLogin)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Account Status */}
                    {vendor.accountStatus && (
                      <div className="px-4 py-2 bg-white border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Account Status
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              vendor.accountStatus === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {vendor.accountStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Logout */}
                    <div className="p-2 bg-gray-50 border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Login/Signup for unauthenticated users */}
            {!vendor && !isLoadingVendor && (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/auth"
                  className="text-white hover:text-orange-300 font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth"
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-orange-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              <Link
                href="/vendors"
                className="text-white hover:text-orange-300 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Vendors
              </Link>
              <Link
                href="/photos"
                className="text-white hover:text-orange-300 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Photos
              </Link>
              <Link
                href="/blogs"
                className="text-white hover:text-orange-300 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blogs
              </Link>

              <div className="pt-4 border-t border-white/20 space-y-3">
                {vendor ? (
                  <>
                    <div className="flex items-center gap-3 px-2">
                      {vendor.profilePicture ? (
                        <img
                          src={vendor.profilePicture}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white font-semibold">
                          {getInitials(vendor.fullName)}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {vendor.fullName}
                        </p>
                        <p className="text-white/70 text-xs truncate">
                          {vendor.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-white hover:text-orange-300 font-medium transition-colors px-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-white hover:text-red-300 font-medium transition-colors px-2 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth"
                      className="block text-center text-white hover:text-orange-300 font-semibold transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth"
                      className="block text-center bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside handler */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  );
}
