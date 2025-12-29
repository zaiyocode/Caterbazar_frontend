"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  Shield,
  Home,
  UserCircle,
  BarChart3,
  Settings,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  superAdminLogout,
  getCurrentUser,
  type User as UserType,
} from "@/api/superadmin/auth.api";

export default function AdminNavbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await superAdminLogout();
      router.push("/auth/admin/signin");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, redirect to login
      router.push("/auth/admin/signin");
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
    <nav className="bg-linear-to-r from-orange-600 to-red-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo and Admin Title */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-3"
            >
              <div className="flex items-center">
                <img
                  src="/images/logo.png"
                  alt="Caterbazar Logo"
                  className="h-8 w-auto filter brightness-0 invert"
                />
              </div>
              <div className="hidden sm:block border-l border-white/30 pl-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-lg">
                    Sales Admin
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Side - Profile */}
          <div className="flex items-center space-x-3">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                    <span className="text-white text-xs font-semibold">
                      {user ? getInitials(user.fullName) : "SA"}
                    </span>
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-white text-sm font-medium">
                    {isLoadingUser ? "Loading..." : user?.fullName || "Admin"}
                  </p>
                  <p className="text-white/60 text-xs">Sales Administrator</p>
                </div>
              </button>

              {/* Enhanced Profile Dropdown Menu */}
              {isProfileOpen && user && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl  overflow-hidden z-50">
                  {/* Profile Header */}
                  <div className="bg-linear-to-r from-orange-500 to-red-500 p-6 text-white">
                    <div className="flex items-center space-x-4">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.fullName}
                          className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-3 border-white shadow-lg">
                          <span className="text-white text-xl font-bold">
                            {getInitials(user.fullName)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{user.fullName}</h3>
                        <p className="text-white/90 text-sm">
                          {user.role.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="p-4 space-y-3 bg-gray-50">
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{user.email}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{user.phoneNumber}</span>
                    </div>

                    {/* <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        {user.isEmailVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-xs text-gray-600">
                          Email Verified
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.isPhoneVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-xs text-gray-600">
                          Phone Verified
                        </span>
                      </div>
                    </div> */}

                    <div className="flex items-center space-x-3 text-xs text-gray-500 pt-2">
                      <Calendar className="w-3 h-3" />
                      <span>Last login: {formatDate(user.lastLogin)}</span>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="px-4 py-2 bg-white border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Account Status
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.accountStatus === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.accountStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-3">
              {/* Mobile Links */}
              <Link
                href="/"
                className="flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Main Site</span>
              </Link>

              <Link
                href="/admin/dashboard"
                className="flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>

              {/* Mobile Profile Section */}
              {user && (
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                        <span className="text-white text-sm font-semibold">
                          {getInitials(user.fullName)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        {user.fullName}
                      </p>
                      <p className="text-white/60 text-xs">{user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center space-x-3 px-3 py-2 text-red-300 hover:text-red-200 hover:bg-white/10 rounded-lg transition-all w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </span>
                  </button>
                </div>
              )}
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
