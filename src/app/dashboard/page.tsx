"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Dashboard/Sidebar';
import MobileMenu from '@/components/Dashboard/MobileMenu';
import DashboardOverview from '@/components/Dashboard/DashboardOverview';
import VendorProfile from '@/components/Dashboard/VendorProfile';
import PersonalInfo from '@/components/Dashboard/PersonalInfo';
import BusinessRegistration from '@/components/Dashboard/BusinessRegistration';
import BusinessDetails from '@/components/Dashboard/BusinessDetails';
import GalleryManagement from '@/components/Dashboard/GalleryManagement';
import SubscriptionPlan from '@/components/Dashboard/SubscriptionPlan';
import InquiriesManagement from '@/components/Dashboard/InquiriesManagement';
import ReviewsRatings from '@/components/Dashboard/ReviewsRatings';
import OrdersBookings from '@/components/Dashboard/OrdersBookings';

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'profile':
        return <VendorProfile />;
      case 'personal':
        return <PersonalInfo />;
      case 'registration':
        return <BusinessRegistration />;
      case 'business':
        return <BusinessDetails />;
      case 'gallery':
        return <GalleryManagement />;
      case 'subscription':
        return <SubscriptionPlan />;
      case 'inquiries':
        return <InquiriesManagement />;
      case 'reviews':
        return <ReviewsRatings />;
      case 'orders':
        return <OrdersBookings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Left Sidebar - Desktop */}
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Right Content */}
          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}