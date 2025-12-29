"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VendorDetailsPage from '@/components/Vendor/VendorProduct';
import ReviewsSection from '@/components/Vendor/Reviews';
import CateringProfessionalCTA from '@/components/Home/CateringProfessionalCTA';
import UserInfoSection from '@/components/Vendor/UserInfoSection';
import { getVendorProfile, VendorProfileData, GalleryImage } from '@/api/user/public.api';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;
  const [vendorData, setVendorData] = useState<VendorProfileData | null>(null);
  const [setupImages, setSetupImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!vendorId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getVendorProfile(vendorId);
        
        if (response.success) {
          const vendor = response.data.vendor;
          setVendorData(vendor);
          
          // Filter and set all setup category images
          const setupGalleryImages = response.data.gallery.filter(img => img.category === 'setup');
          setSetupImages(setupGalleryImages);
        } else {
          setError('Failed to load vendor details');
        }
      } catch (err) {
        console.error('Error fetching vendor:', err);
        setError('Failed to load vendor details');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [vendorId]);

  // Check if user is logged in
  const isUserLoggedIn = (): boolean => {
    const accessToken = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');
    return !!(accessToken && userRole === 'user');
  };

  // Handle inquiry button click - check login status
  const handleInquiryClick = (e: any) => {
    if (!isUserLoggedIn()) {
      // Redirect to customer signin
      router.push('/auth/customer/signin');
      return false;
    }
    // Allow the inquiry modal to open if user is logged in
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading vendor details...</p>
      </div>
    );
  }

  if (error || !vendorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || 'Vendor not found'}</p>
      </div>
    );
  }

  return (
    <div>
      <VendorDetailsPage vendor={vendorData} setupImages={setupImages} />
      {/* <UserInfoSection vendor={vendorData} /> */}
      <ReviewsSection vendorId={vendorId} />
      <CateringProfessionalCTA />
    </div>
  );
};

export default Page;