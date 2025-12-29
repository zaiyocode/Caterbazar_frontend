"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Star, Loader2 } from "lucide-react";
import { searchVendors, VendorData } from '@/api/user/public.api';
import { useRouter } from 'next/navigation';

const vendorTypes = [
  { label: "All", value: "" },
  { label: "Full Catering", value: "full_catering" },
  { label: "Snacks & Starter", value: "snacks_and_starter" },
  { label: "Dessert & Sweet", value: "dessert_and_sweet" },
  { label: "Beverage", value: "beverage" },
  { label: "Paan", value: "paan" },
  { label: "Water", value: "water" },
  { label: "Other", value: "other" },
];

export default function TopRatedCaterers() {
  const router = useRouter();
  const [activeVendorType, setActiveVendorType] = useState("");
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaterbazarChoice();
  }, [activeVendorType]);

  const fetchCaterbazarChoice = async () => {
    setLoading(true);
    try {
      const params: any = {
        caterbazarChoice: true,
        page: 1,
        limit: 20,
      };

      if (activeVendorType) {
        params.vendorCategory = activeVendorType;
      }

      const response = await searchVendors(params);
      if (response.success) {
        setVendors(response.data.vendors);
      }
    } catch (error) {
      console.error('Error fetching Caterbazar Choice vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVendorImage = (vendor: VendorData) => {
    // First, try to get setup category image from gallery
    const setupImage = vendor.gallery?.find(img => img.category === 'setup');
    if (setupImage) {
      return setupImage.url;
    }
    
    // Fallback to profile photo
    if (vendor.profilePhoto) {
      return vendor.profilePhoto;
    }
    
    // Placeholder image when no image is available
    return 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
  };

  return (
    <section className="bg-linear-to-br from-amber-950 via-amber-900 to-amber-950 py-8 sm:py-10 lg:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
              Top-Rated Caterers <span className="italic font-serif text-orange-400">Handpicked</span> for You
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">From intimate gatherings to grand celebrations, we make every event truly memorable.</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6 overflow-x-auto pb-2   sm:mx-0 sm:px-0 hide-scrollbar">
          {vendorTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setActiveVendorType(type.value)}
              className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium whitespace-nowrap transition-all ${
                activeVendorType === type.value
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white/10 text-gray-200 border border-gray-500/50 hover:border-orange-500 hover:bg-white/20"
              }`}
            >
              {type.label}
            </button>
          ))}
          <button 
            onClick={() => router.push('/vendors')}
            className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full bg-white text-gray-800 font-medium whitespace-nowrap hover:bg-gray-100 transition-colors flex items-center gap-1 shadow-md"
          >
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Caterers Cards - Scrollable */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">No Caterbazar Choice vendors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 sm:mx-0 sm:px-0 hide-scrollbar">
            <div className="flex gap-3 sm:gap-4 lg:gap-5">
              {vendors.map((vendor, index) => (
                <div
                  key={vendor?.userId?._id}
                  onClick={() => router.push(`/vendors/${vendor?.userId?._id}`)}
                  className="shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(25%-15px)] bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-40 sm:h-44 lg:h-48 overflow-hidden">
                    <img
                      src={getVendorImage(vendor)}
                      alt={vendor.userId.fullName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
                    {vendor.isCaterbazarChoice && (
                      <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 shadow-lg">
                        <span className="text-white">★</span>
                        Caterbazar Choice
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-900 text-sm sm:text-base">
                          {vendor.stats.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        ({vendor.stats.totalReviews} {vendor.stats.totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>

                    {/* Name & Location */}
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {vendor.businessRegistrationId?.brandName || vendor.userId.fullName}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm mb-3 line-clamp-1 flex items-center gap-1">
                      <span className="text-gray-400">📍</span>
                      {vendor.address.locality}, {vendor.address.state}
                    </p>

                    {/* Price & Booking */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-gray-500 text-[10px] sm:text-xs mb-0.5">Starting from</p>
                        <p className="text-xl sm:text-2xl font-bold text-orange-600">₹{vendor.pricing.vegPricePerPlate}</p>
                        <p className="text-gray-500 text-[10px] sm:text-xs">Per Plate</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/vendors/${vendor?.userId?._id}`);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold transition-all text-xs sm:text-sm whitespace-nowrap shadow-md hover:shadow-lg"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}      
      </div>
    </section>
  );
}
