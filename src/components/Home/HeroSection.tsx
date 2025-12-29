"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  MapPin,
  Utensils,
  ArrowRight,
  CheckCircle,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { TypewriterEffect } from "../ui/typewriter-effect";
import { getHeroImages, HeroImage } from "@/api/user/public.api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function HeroSection() {
  const [vendorType, setVendorType] = useState("");
  const [locality, setLocality] = useState("");
  const [caterbazarChoice, setCaterbazarChoice] = useState(false);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [vendorTypeOpen, setVendorTypeOpen] = useState(false);
  const [localityOpen, setLocalityOpen] = useState(false);

  const vendorTypes = [
    { value: "full_catering", label: "Full Catering" },
    { value: "snacks_and_starter", label: "Snacks & Starter" },
    { value: "dessert_and_sweet", label: "Dessert & Sweets" },
    { value: "beverage", label: "Beverage" },
    { value: "paan", label: "Paan" },
    { value: "water", label: "Water" },
    { value: "other", label: "Other" },
  ];

  const localities = [
    { value: "Agra", label: "Agra" },
    { value: "Ahmedabad", label: "Ahmedabad" },
    { value: "Angul", label: "Angul" },
    { value: "Balangir", label: "Balangir" },
    { value: "Balasore", label: "Balasore" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Bargarh", label: "Bargarh" },
    { value: "Baripada", label: "Baripada" },
    { value: "Berhampur", label: "Berhampur" },
    { value: "Bhadrak", label: "Bhadrak" },
    { value: "Bhawanipatna", label: "Bhawanipatna" },
    { value: "Bhubaneswar", label: "Bhubaneswar" },
    { value: "Chandigarh", label: "Chandigarh" },
    { value: "Chennai", label: "Chennai" },
    { value: "Cuttack", label: "Cuttack" },
    { value: "Delhi NCR", label: "Delhi NCR" },
    { value: "Deogarh", label: "Deogarh" },
    { value: "Dhenkanal", label: "Dhenkanal" },
    { value: "Goa", label: "Goa" },
    { value: "Gunupur", label: "Gunupur" },
    { value: "Gurgaon", label: "Gurgaon" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Indore", label: "Indore" },
    { value: "Jagatsinghpur", label: "Jagatsinghpur" },
    { value: "Jaipur", label: "Jaipur" },
    { value: "Jajpur", label: "Jajpur" },
    { value: "Jeypore", label: "Jeypore" },
    { value: "Jharsuguda", label: "Jharsuguda" },
    { value: "Jim Corbett", label: "Jim Corbett" },
    { value: "Kanpur", label: "Kanpur" },
    { value: "Kendrapara", label: "Kendrapara" },
    { value: "Keonjhar", label: "Keonjhar" },
    { value: "Khordha", label: "Khordha" },
    { value: "Kochi", label: "Kochi" },
    { value: "Kolkata", label: "Kolkata" },
    { value: "Koraput", label: "Koraput" },
    { value: "Lucknow", label: "Lucknow" },
    { value: "Malkangiri", label: "Malkangiri" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Nabarangpur", label: "Nabarangpur" },
    { value: "Nayagarh", label: "Nayagarh" },
    { value: "Nuapada", label: "Nuapada" },
    { value: "Paralakhemundi", label: "Paralakhemundi" },
    { value: "Phulbani", label: "Phulbani" },
    { value: "Pune", label: "Pune" },
    { value: "Puri", label: "Puri" },
    { value: "Rayagada", label: "Rayagada" },
    { value: "Rourkela", label: "Rourkela" },
    { value: "Sambalpur", label: "Sambalpur" },
    { value: "Sonepur", label: "Sonepur" },
    { value: "Sundargarh", label: "Sundargarh" },
    { value: "Talcher", label: "Talcher" },
    { value: "Titlagarh", label: "Titlagarh" },
    { value: "Udaipur", label: "Udaipur" },
  ];

  useEffect(() => {
    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  const fetchHeroImages = async () => {
    try {
      const response = await getHeroImages();
      if (response.success && response.data.heroImages.length > 0) {
        setHeroImages(response.data.heroImages);
      }
    } catch (error) {
      console.error("Error fetching hero images:", error);
    } finally {
      setLoading(false);
    }
  };

  const words = [
    {
      text: "One",
      className: "text-orange-500",
    },
    {
      text: "Bazar",
      className: "text-orange-500",
    },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (vendorType) params.append("vendorCategory", vendorType);
    if (locality) params.append("locality", locality);
    if (caterbazarChoice) params.append("caterbazarChoice", "true");

    const queryString = params.toString();
    const url = queryString ? `/vendors?${queryString}` : "/vendors";

    window.location.href = url;
  };

  return (
    <div className="min-h-auto bg-linear-to-br from-orange-50 via-white to-orange-50">
      <div className="container pb-20 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6 sm:space-y-8">
            {/* Heading */}
            <div>
              <div className="mb-3 sm:mb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  India’s 1st Cater Bazar - Top Caters{" "}
                  <TypewriterEffect
                    words={words}
                    className="inline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
                  />
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                From weddings to corporate events, explore verified caterers
                offering custom menus and seamless service.
              </p>
            </div>
          </div>

          {/* Right Side - Image with Search Card */}
          <div className="relative">
            {/* Background Image */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              {loading ? (
                <div className="w-full h-[400px] sm:h-[450px] lg:h-[550px] bg-gray-200 animate-pulse"></div>
              ) : (
                <img
                  src={
                    heroImages[currentImageIndex]?.imageUrl ||
                    "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={
                    heroImages[currentImageIndex]?.title ||
                    "Chefs preparing food"
                  }
                  className="w-full h-[400px] sm:h-[450px] lg:h-[550px] object-cover transition-opacity duration-500"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>

              {/* Search Card Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  {/* Vendor Type Combobox */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Vendor Type
                    </label>
                    <Popover open={vendorTypeOpen} onOpenChange={setVendorTypeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={vendorTypeOpen}
                          className="w-full justify-between shadow-none h-9 sm:h-10 text-xs sm:text-sm font-normal text-gray-600 bg-white hover:bg-gray-50 border-gray-300"
                        >
                          <div className="flex items-center gap-2">
                            <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            {vendorType
                              ? vendorTypes.find((type) => type.value === vendorType)?.label
                              : "Select Vendor"}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 bg-white border-gray-300 shadow-none" align="start">
                        <Command>
                          <CommandInput placeholder="Search vendor type..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No vendor type found.</CommandEmpty>
                            <CommandGroup>
                              {vendorTypes.map((type) => (
                                <CommandItem
                                  key={type.value}
                                  value={type.value}
                                  onSelect={(currentValue) => {
                                    setVendorType(currentValue === vendorType ? "" : currentValue)
                                    setVendorTypeOpen(false)
                                  }}
                                >
                                  {type.label}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      vendorType === type.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Locality Combobox */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Locality
                    </label>
                    <Popover open={localityOpen} onOpenChange={setLocalityOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={localityOpen}
                          className="w-full justify-between shadow-none h-9 sm:h-10 text-xs sm:text-sm font-normal text-gray-600 bg-white hover:bg-gray-50 border-gray-300"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            {locality
                              ? localities.find((loc) => loc.value === locality)?.label
                              : "Select Location"}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 bg-white border-gray-300 shadow-none" align="start">
                        <Command>
                          <CommandInput placeholder="Search location..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No location found.</CommandEmpty>
                            <CommandGroup>
                              {localities.map((loc) => (
                                <CommandItem
                                  key={loc.value}
                                  value={loc.value}
                                  onSelect={(currentValue) => {
                                    setLocality(currentValue === locality ? "" : currentValue)
                                    setLocalityOpen(false)
                                  }}
                                >
                                  {loc.label}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      locality === loc.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Caterbazar Choice Checkbox and Search Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={caterbazarChoice}
                      onChange={(e) => setCaterbazarChoice(e.target.checked)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label className="ml-2 text-xs sm:text-sm text-gray-700 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                      Caterbazar Choice
                    </label>
                  </div>

                  <button
                    onClick={handleSearch}
                    className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-900 hover:bg-orange-800 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    Search
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
