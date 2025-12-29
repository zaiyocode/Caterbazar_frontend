"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getCurrentUser } from '@/api/superadmin/auth.api';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import AdminMobileMenu from '@/components/Admin/AdminMobileMenu';
import VendorManagement from '@/components/SuperAdmin/VendorManagement';
import BusinessRegistrationManagement from '@/components/SuperAdmin/BusinessRegistrationManagement';
import CustomerManagement from '@/components/SuperAdmin/CustomerManagement';
import HeroImageManagement from '@/components/SuperAdmin/HeroImageManagement';
import TotalOrdersManagement from '@/components/SuperAdmin/TotalOrdersManagement';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('vendors');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication and authorization
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push('/auth/admin/signin');
        return;
      }

      const user = await getCurrentUser();
      
      // Check if user is admin and has the specific phone number for Sales Admin
      if (!user || user.role !== 'admin' || user.phoneNumber !== '9178114124') {
        router.push('/auth/admin/signin');
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'vendors':
        return <VendorManagement isAdminPanel={true} />;
      case 'business-registrations':
        return <BusinessRegistrationManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'hero-images':
        return <HeroImageManagement />;
      case 'total-orders':
        return <TotalOrdersManagement isAdminPanel={true} />;
      default:
        return <VendorManagement isAdminPanel={true} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Sales Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage vendors, customers, and platform content</p>
        </div>
        
        <div className="flex gap-6 lg:gap-8">
          {/* Left Sidebar - Desktop */}
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Right Content */}
          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AdminMobileMenu activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
