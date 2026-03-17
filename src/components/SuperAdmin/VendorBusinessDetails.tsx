'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  ChevronsUpDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getVendorById } from '@/api/superadmin/vendor.api';
import { updateVendorBusinessDetails } from '@/api/superadmin/vendorManagement.api';
import type { Vendor } from '@/api/superadmin/vendor.api';

interface VendorBusinessDetailsProps {
  vendorId: string;
  isOpen: boolean;
  onClose: () => void;
}

const LOCALITIES = [
  'Agra', 'Ahmedabad', 'Angul', 'Balangir', 'Balasore', 'Bangalore', 'Bargarh', 'Baripada',
  'Berhampur', 'Bhadrak', 'Bhawanipatna', 'Bhubaneswar', 'Chandigarh', 'Chennai', 'Cuttack',
  'Delhi NCR', 'Deogarh', 'Dhenkanal', 'Goa', 'Gunupur', 'Gurgaon', 'Hyderabad', 'Indore',
  'Jagatsinghpur', 'Jaipur', 'Jajpur', 'Jeypore', 'Jharsuguda', 'Jim Corbett', 'Kanpur',
  'Kendrapara', 'Keonjhar', 'Khordha', 'Kochi', 'Kolkata', 'Koraput', 'Lucknow', 'Malkangiri',
  'Mumbai', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Paralakhemundi', 'Phulbani', 'Pune', 'Puri',
  'Rayagada', 'Rourkela', 'Sambalpur', 'Sonepur', 'Sundargarh', 'Talcher', 'Titlagarh', 'Udaipur',
];

const STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Puducherry', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const VENDOR_CATEGORIES = [
  { value: 'full_catering', label: 'Full Catering' },
  { value: 'snacks_and_starter', label: 'Snacks & Starter' },
  { value: 'dessert_and_sweet', label: 'Dessert & Sweet' },
  { value: 'beverage', label: 'Beverage' },
  { value: 'paan', label: 'Paan' },
  { value: 'water', label: 'Water' },
  { value: 'other', label: 'Other' },
];

const SERVICE_SPECIALIZATIONS = [
  { value: 'multi_cuisine', label: 'Multi Cuisine' },
  { value: 'jain_catering', label: 'Jain Catering' },
  { value: 'chaat_street_food', label: 'Chaat Street Food' },
  { value: 'small_gathering', label: 'Small Gathering' },
  { value: 'drinks_only', label: 'Drinks Only' },
  { value: 'corporate_catering', label: 'Corporate Catering' },
  { value: 'wedding_catering', label: 'Wedding Catering' },
  { value: 'birthday_parties', label: 'Birthday Parties' },
  { value: 'traditional_catering', label: 'Traditional Catering' },
];

const CUISINE_OPTIONS = [
  { value: 'north_indian', label: 'North Indian' },
  { value: 'south_indian', label: 'South Indian' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'greek', label: 'Greek' },
  { value: 'lebanese', label: 'Lebanese' },
  { value: 'thai', label: 'Thai' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'rajasthani', label: 'Rajasthani' },
  { value: 'goan', label: 'Goan' },
  { value: 'maharashtrian', label: 'Maharashtrian' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'continental', label: 'Continental' },
  { value: 'italian', label: 'Italian' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'american', label: 'American' },
  { value: 'fusion', label: 'Fusion' },
];

const LANGUAGES = [
  { value: 'hindi', label: 'Hindi' },
  { value: 'english', label: 'English' },
  { value: 'odia', label: 'Odia' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'malayalam', label: 'Malayalam' },
];

const CANCELLATION_POLICIES = [
  { value: 'no_refund', label: 'No Refund' },
  { value: 'partial_refund', label: 'Partial Refund' },
  { value: 'full_refund', label: 'Full Refund' },
];

export default function VendorBusinessDetails({
  vendorId,
  isOpen,
  onClose,
}: VendorBusinessDetailsProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    yearOfEstablishment: '',
    yearsInBusiness: '',
    teamSize: '',
    minGuests: '',
    maxGuests: '',
    advanceBookingTime: '',
    vendorCategory: '',
    country: 'India',
    state: '',
    locality: '',
    pincode: '',
    vegPricePerPlate: '',
    nonVegPricePerPlate: '',
    weeksAdvanceBooking: '',
    operationalRadius: '',
    policyType: 'no_refund',
    policyDetails: '',
    servicesSpecialization: [] as string[],
    cuisineOptions: [] as string[],
    languagesSpoken: [] as string[],
  });

  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && vendorId) {
      fetchVendorDetails();
    }
  }, [isOpen, vendorId]);

  const fetchVendorDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getVendorById(vendorId);
      if (response.success) {
        const v = response.data.vendor;
        setVendor(v);

        setFormData({
          yearOfEstablishment: v.businessInfo?.yearOfEstablishment?.toString() || '',
          yearsInBusiness: v.businessInfo?.yearsInBusiness?.toString() || '',
          teamSize: v.businessInfo?.teamSize || '',
          minGuests: v.capacity?.minGuests?.toString() || '',
          maxGuests: v.capacity?.maxGuests?.toString() || '',
          advanceBookingTime: v.capacity?.advanceBookingTime || '',
          vendorCategory: v.capacity?.vendorCategory || '',
          country: v.address?.country || 'India',
          state: v.address?.state || '',
          locality: v.address?.locality || '',
          pincode: v.address?.pincode || '',
          vegPricePerPlate: v.pricing?.vegPricePerPlate?.toString() || '',
          nonVegPricePerPlate: v.pricing?.nonVegPricePerPlate?.toString() || '',
          weeksAdvanceBooking: v.operations?.weeksAdvanceBooking?.toString() || '',
          operationalRadius: v.operations?.operationalRadius?.toString() || '',
          policyType: v.cancellationPolicy?.policyType || 'no_refund',
          policyDetails: v.cancellationPolicy?.policyDetails || '',
          servicesSpecialization: v.pricing?.servicesSpecialization || [],
          cuisineOptions: v.pricing?.cuisineOptions || [],
          languagesSpoken: v.operations?.languagesSpoken || [],
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleMultiSelect = (field: string, value: string) => {
    setFormData(prev => {
      const array = prev[field as keyof typeof formData] as string[];
      if (array.includes(value)) {
        return {
          ...prev,
          [field]: array.filter(item => item !== value),
        };
      } else {
        return {
          ...prev,
          [field]: [...array, value],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateVendorBusinessDetails(vendorId, {
        yearOfEstablishment: formData.yearOfEstablishment ? parseInt(formData.yearOfEstablishment) : undefined,
        yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : undefined,
        teamSize: formData.teamSize || undefined,
        minGuests: formData.minGuests ? parseInt(formData.minGuests) : undefined,
        maxGuests: formData.maxGuests ? parseInt(formData.maxGuests) : undefined,
        advanceBookingTime: formData.advanceBookingTime || undefined,
        vendorCategory: formData.vendorCategory || undefined,
        country: formData.country,
        state: formData.state || undefined,
        locality: formData.locality || undefined,
        pincode: formData.pincode || undefined,
        vegPricePerPlate: formData.vegPricePerPlate ? parseInt(formData.vegPricePerPlate) : undefined,
        nonVegPricePerPlate: formData.nonVegPricePerPlate ? parseInt(formData.nonVegPricePerPlate) : undefined,
        weeksAdvanceBooking: formData.weeksAdvanceBooking ? parseInt(formData.weeksAdvanceBooking) : undefined,
        operationalRadius: formData.operationalRadius ? parseInt(formData.operationalRadius) : undefined,
        policyType: formData.policyType,
        policyDetails: formData.policyDetails || undefined,
        servicesSpecialization: formData.servicesSpecialization,
        cuisineOptions: formData.cuisineOptions,
        languagesSpoken: formData.languagesSpoken,
      });

      if (response.success) {
        setSuccess('Business details updated successfully!');
        setTimeout(() => {
          setSuccess('');
        }, 2000);
        setTimeout(() => {
          onClose();
        }, 2500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update business details');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[90%] md:w-[85%] bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-orange-500 to-red-500 text-white p-6 flex items-center justify-between border-b">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Vendor Business Details</h1>
            <p className="text-sm text-orange-100 mt-1">Manage vendor catering business information</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="p-4 sm:p-6">
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

            <form onSubmit={handleSubmit} className="rounded-xl p-4 sm:p-6 border border-gray-200 space-y-8">
            {/* Business Information */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Business Information
              </h2>
              <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Year of Establishment <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="2019"
                    value={formData.yearOfEstablishment}
                    onChange={(e) => handleInputChange('yearOfEstablishment', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Years in Business <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="6"
                    value={formData.yearsInBusiness}
                    onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Team Size <span className="text-red-500">*</span>
                  </label>
                  <Popover open={openDropdowns['teamSize']} onOpenChange={(o) => setOpenDropdowns({...openDropdowns, teamSize: o})}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-9 sm:h-11 text-sm sm:text-base font-normal text-gray-600 bg-white hover:bg-gray-50 border-gray-300 ${
                          false ? 'border-red-500' : ''
                        }`}
                      >
                        {formData.teamSize || 'Select team size'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-white border-gray-300 shadow-none" align="start">
                      <Command>
                        <CommandInput placeholder="Search team size..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No team size found.</CommandEmpty>
                          <CommandGroup>
                            {['1-10', '11-50', '51-200', '200+'].map((size) => (
                              <CommandItem
                                key={size}
                                value={size}
                                onSelect={() => {
                                  handleInputChange('teamSize', size);
                                  setOpenDropdowns({...openDropdowns, teamSize: false});
                                }}
                              >
                                {size}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Capacity & Booking */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Capacity & Booking
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Minimum Guests <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.minGuests}
                    onChange={(e) => handleInputChange('minGuests', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Maximum Guests <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 500"
                    value={formData.maxGuests}
                    onChange={(e) => handleInputChange('maxGuests', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base border-gray-300"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Vendor Category <span className="text-red-500">*</span>
                </label>
                <Popover open={openDropdowns['vendorCategory']} onOpenChange={(o) => setOpenDropdowns({...openDropdowns, vendorCategory: o})}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between shadow-none h-9 sm:h-12 text-sm sm:text-base font-normal text-gray-600 bg-gray-50 border-gray-300"
                    >
                      {VENDOR_CATEGORIES.find(c => c.value === formData.vendorCategory)?.label || 'Select Category'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-white border-gray-300 shadow-none" align="start">
                    <Command>
                      <CommandInput placeholder="Search category..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {VENDOR_CATEGORIES.map((cat) => (
                            <CommandItem
                              key={cat.value}
                              value={cat.value}
                              onSelect={() => {
                                handleInputChange('vendorCategory', cat.value);
                                setOpenDropdowns({...openDropdowns, vendorCategory: false});
                              }}
                            >
                              {cat.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="India"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <Popover open={openDropdowns['state']} onOpenChange={(o) => setOpenDropdowns({...openDropdowns, state: o})}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between shadow-none h-9 sm:h-12 text-sm sm:text-base font-normal text-gray-600 bg-gray-50 border-gray-300"
                      >
                        {formData.state || 'Select State'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-white border-gray-300 shadow-none" align="start">
                      <Command>
                        <CommandInput placeholder="Search state..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No state found.</CommandEmpty>
                          <CommandGroup>
                            {STATES.map((state) => (
                              <CommandItem
                                key={state}
                                value={state}
                                onSelect={() => {
                                  handleInputChange('state', state);
                                  setOpenDropdowns({...openDropdowns, state: false});
                                }}
                              >
                                {state}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Locality <span className="text-red-500">*</span>
                  </label>
                  <Popover open={openDropdowns['locality']} onOpenChange={(o) => setOpenDropdowns({...openDropdowns, locality: o})}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between shadow-none h-9 sm:h-12 text-sm sm:text-base font-normal text-gray-600 bg-gray-50 border-gray-300"
                      >
                        {formData.locality || 'Select Locality'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-white border-gray-300 shadow-none" align="start">
                      <Command>
                        <CommandInput placeholder="Search locality..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No locality found.</CommandEmpty>
                          <CommandGroup>
                            {LOCALITIES.map((loc) => (
                              <CommandItem
                                key={loc}
                                value={loc}
                                onSelect={() => {
                                  handleInputChange('locality', loc);
                                  setOpenDropdowns({...openDropdowns, locality: false});
                                }}
                              >
                                {loc}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="751024"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Details */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Pricing Details
              </h2>

              {/* Veg/Non-Veg Pricing - Only for Full Catering and Other */}
              {(formData.vendorCategory === 'full_catering' || formData.vendorCategory === 'other') && (
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Veg Price Per Plate <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 200"
                      value={formData.vegPricePerPlate}
                      onChange={(e) => handleInputChange('vegPricePerPlate', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Non-Veg Price Per Plate <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 300"
                      value={formData.nonVegPricePerPlate}
                      onChange={(e) => handleInputChange('nonVegPricePerPlate', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>
              )}

              {/* Unified Pricing - For other vendor categories */}
              {formData.vendorCategory !== 'full_catering' && formData.vendorCategory !== 'other' && formData.vendorCategory && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Starting Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 200"
                    value={formData.vegPricePerPlate}
                    onChange={(e) => handleInputChange('vegPricePerPlate', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base"
                  />
                </div>
              )}
            </div>

            {/* Services & Cuisines - Only for Full Catering */}
            {(formData.vendorCategory === 'full_catering' || formData.vendorCategory === 'other') && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                  Services & Cuisines
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Service Specializations
                    </label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {SERVICE_SPECIALIZATIONS.map((service) => (
                        <label key={service.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.servicesSpecialization.includes(service.value)}
                            onChange={() => toggleMultiSelect('servicesSpecialization', service.value)}
                            className="w-4 h-4 text-orange-500 rounded"
                          />
                          <span className="text-sm text-gray-700">{service.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Cuisine Options
                    </label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {CUISINE_OPTIONS.map((cuisine) => (
                        <label key={cuisine.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.cuisineOptions.includes(cuisine.value)}
                            onChange={() => toggleMultiSelect('cuisineOptions', cuisine.value)}
                            className="w-4 h-4 text-orange-500 rounded"
                          />
                          <span className="text-sm text-gray-700">{cuisine.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Operations Section */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Operations
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Languages Spoken
                  </label>
                  <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {LANGUAGES.map((lang) => (
                      <label key={lang.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.languagesSpoken.includes(lang.value)}
                          onChange={() => toggleMultiSelect('languagesSpoken', lang.value)}
                          className="w-4 h-4 text-orange-500 rounded"
                        />
                        <span className="text-sm text-gray-700">{lang.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Weeks Advance Booking
                    </label>
                    <input
                      type="number"
                      placeholder="5"
                      value={formData.weeksAdvanceBooking}
                      onChange={(e) => handleInputChange('weeksAdvanceBooking', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Operational Radius (km)
                    </label>
                    <input
                      type="number"
                      placeholder="30"
                      value={formData.operationalRadius}
                      onChange={(e) => handleInputChange('operationalRadius', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base"
                    />
                    <p className="text-xs text-gray-500 mt-1">Service coverage area from base location</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Cancellation Policy
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Policy Type
                  </label>
                  <Popover open={openDropdowns['policyType']} onOpenChange={(o) => setOpenDropdowns({...openDropdowns, policyType: o})}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between shadow-none h-9 sm:h-12 text-sm sm:text-base font-normal text-gray-600 bg-gray-50 border-gray-300"
                      >
                        {CANCELLATION_POLICIES.find(p => p.value === formData.policyType)?.label || 'Select Policy'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-white border-gray-300 shadow-none" align="start">
                      <Command>
                        <CommandInput placeholder="Search policy..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No policy found.</CommandEmpty>
                          <CommandGroup>
                            {CANCELLATION_POLICIES.map((policy) => (
                              <CommandItem
                                key={policy.value}
                                value={policy.value}
                                onSelect={() => {
                                  handleInputChange('policyType', policy.value);
                                  setOpenDropdowns({...openDropdowns, policyType: false});
                                }}
                              >
                                {policy.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Policy Details
                  </label>
                  <textarea
                    placeholder="Describe policy details..."
                    value={formData.policyDetails}
                    onChange={(e) => handleInputChange('policyDetails', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2 text-sm sm:text-base font-semibold"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Details'
                )}
              </button>
            </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
