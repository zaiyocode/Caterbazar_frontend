"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VendorDetailsPage from '@/components/Vendor/VendorProduct';
import ReviewsSection from '@/components/Vendor/Reviews';
import CateringProfessionalCTA from '@/components/Home/CateringProfessionalCTA';
import UserInfoSection from '@/components/Vendor/UserInfoSection';
import { getVendorProfile, VendorProfileData, GalleryImage } from '@/api/user/public.api';
import dynamic from 'next/dynamic';

// Import vendors search page for locality patterns
const VendorsSearchPage = dynamic(() => import('../page'), { ssr: false });

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string[];
  
  // Determine URL pattern and extract vendor ID
  let vendorId: string;
  let isLocalityPattern = false;
  
  if (slug.length === 1) {
    // Single segment: either /vendors/{id} or /vendors/catering-services-in-{city}
    const segment = slug[0];
    if (segment.startsWith('catering-services-in-')) {
      isLocalityPattern = true;
      vendorId = '';
    } else {
      vendorId = segment;
    }
  } else if (slug.length === 4) {
    // New SEO format: /vendors/{locality}/{category}/{brandname}/{id}
    vendorId = slug[3]; // Last segment is the ID
  } else {
    // Invalid URL format
    vendorId = '';
  }
  
  const [vendorData, setVendorData] = useState<VendorProfileData | null>(null);
  const [setupImages, setSetupImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip vendor fetching for locality patterns
    if (isLocalityPattern) return;
    
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
  }, [vendorId, router, isLocalityPattern]);

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

  // If it's a locality pattern, render the vendors search page
  if (isLocalityPattern) {
    return <VendorsSearchPage />;
  }

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