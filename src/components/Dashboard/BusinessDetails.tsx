import React, { useState, useEffect } from "react";
import {
  Upload,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Image as ImageIcon,
  Check,
  ChevronsUpDown,
} from "lucide-react";

import {
  getVendorProfile,
  deleteFSSAICertificate,
} from "@/api/vendor/business.api";
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

// All available localities across India
const LOCALITIES = [
  "Agra",
  "Ahmedabad",
  "Angul",
  "Balangir",
  "Balasore",
  "Bangalore",
  "Bargarh",
  "Baripada",
  "Berhampur",
  "Bhadrak",
  "Bhawanipatna",
  "Bhubaneswar",
  "Chandigarh",
  "Chennai",
  "Cuttack",
  "Delhi NCR",
  "Deogarh",
  "Dhenkanal",
  "Goa",
  "Gunupur",
  "Gurgaon",
  "Hyderabad",
  "Indore",
  "Jagatsinghpur",
  "Jaipur",
  "Jajpur",
  "Jeypore",
  "Jharsuguda",
  "Jim Corbett",
  "Kanpur",
  "Kendrapara",
  "Keonjhar",
  "Khordha",
  "Kochi",
  "Kolkata",
  "Koraput",
  "Lucknow",
  "Malkangiri",
  "Mumbai",
  "Nabarangpur",
  "Nayagarh",
  "Nuapada",
  "Paralakhemundi",
  "Phulbani",
  "Pune",
  "Puri",
  "Rayagada",
  "Rourkela",
  "Sambalpur",
  "Sonepur",
  "Sundargarh",
  "Talcher",
  "Titlagarh",
  "Udaipur",
];

export default function BusinessDetails() {
  const [formData, setFormData] = useState({
    yearOfEstablishment: "",
    yearsInBusiness: "",
    teamSize: "",
    minGuests: "",
    maxGuests: "",
    idealBookingTime: "",
    vendorCategory: "food_catering",
    country: "India",
    state: "",
    locality: "",
    pin: "",
    vegPrice: "",
    nonVegPrice: "",
    weeksInAdvance: "",
    operationalRadius: "",
  });

  const [serviceSpecialization, setServiceSpecialization] = useState({
    multiCuisine: true,
    jainCateringOnly: false,
    chaatStreetFood: false,
    smallSizeGathering: false,
    drinksOnly: false,
  });

  const [cuisineOptions, setCuisineOptions] = useState({
    northIndian: true,
    southIndian: false,
    chinese: false,
    greek: false,
    lebanese: false,
    thai: false,
    desserts: false,
    bengali: false,
    gujarati: false,
    rajasthani: false,
    goab: false,
    maharashtrian: false,
  });

  const [menuUploads, setMenuUploads] = useState({
    starters: false,
    vegMainCourse: true,
    nonVegMainCourse: true,
    dessertsDrinks: true,
  });

  const [others, setOthers] = useState({
    fssaiCertified: true,
  });

  const [refundType, setRefundType] = useState("no_refund");

  const [policyDetails, setPolicyDetails] = useState("");

  const [languages, setLanguages] = useState({
    hindi: false,
    english: false,
    odia: false,
    telugu: false,
    marathi: false,
    kannada: false,
    bengali: false,
    gujarati: false,
    tamil: false,
    malayalam: false,
    punjabi: false,
    urdu: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Options for dropdowns
  const teamSizeOptions = [
    { value: "", label: "Select team size" },
    { value: "1-10", label: "1-10" },
    { value: "11-50", label: "11-50" },
    { value: "51-200", label: "51-200" },
    { value: "200+", label: "200+" },
  ];

  const vendorCategoryOptions = [
    { value: "", label: "Select Vendor Category" },
    { value: "full_catering", label: "Full Catering" },
    { value: "snacks_and_starter", label: "Snacks & Starter" },
    { value: "dessert_and_sweet", label: "Dessert & Sweet" },
    { value: "beverage", label: "Beverage" },
    { value: "paan", label: "Paan" },
    { value: "water", label: "Water" },
    { value: "other", label: "Other" },
  ];

  const stateOptions = [
    { value: "", label: "Select State" },
    {
      value: "Andaman and Nicobar Islands",
      label: "Andaman and Nicobar Islands",
    },
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
    { value: "Assam", label: "Assam" },
    { value: "Bihar", label: "Bihar" },
    { value: "Chhattisgarh", label: "Chhattisgarh" },
    { value: "Chandigarh", label: "Chandigarh" },
    {
      value: "Dadra and Nagar Haveli and Daman and Diu",
      label: "Dadra and Nagar Haveli and Daman and Diu",
    },
    { value: "Delhi", label: "Delhi" },
    { value: "Goa", label: "Goa" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Haryana", label: "Haryana" },
    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
    { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
    { value: "Jharkhand", label: "Jharkhand" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Kerala", label: "Kerala" },
    { value: "Ladakh", label: "Ladakh" },
    { value: "Lakshadweep", label: "Lakshadweep" },
    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Manipur", label: "Manipur" },
    { value: "Meghalaya", label: "Meghalaya" },
    { value: "Mizoram", label: "Mizoram" },
    { value: "Nagaland", label: "Nagaland" },
    { value: "Odisha", label: "Odisha" },
    { value: "Punjab", label: "Punjab" },
    { value: "Puducherry", label: "Puducherry" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Sikkim", label: "Sikkim" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Telangana", label: "Telangana" },
    { value: "Tripura", label: "Tripura" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Uttarakhand", label: "Uttarakhand" },
    { value: "West Bengal", label: "West Bengal" },
  ];

  const localityOptions = [
    { value: "", label: "Select Locality" },
    ...LOCALITIES.map((locality) => ({ value: locality, label: locality })),
  ];

  // Validation state for required fields
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Combobox open states
  const [teamSizeOpen, setTeamSizeOpen] = useState(false);
  const [vendorCategoryOpen, setVendorCategoryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [localityOpen, setLocalityOpen] = useState(false);

  // FSSAI certificate state
  const [fssaiCertificate, setFssaiCertificate] = useState<{
    url: string | null;
    uploadedAt: string | null;
    isVerified: boolean;
  }>({ url: null, uploadedAt: null, isVerified: false });
  const [uploadingFSSAI, setUploadingFSSAI] = useState(false);

  // Pending FSSAI certificate to upload
  const [pendingFSSAI, setPendingFSSAI] = useState<{
    file: File | null;
    preview: string | null;
  }>({ file: null, preview: null });

  // Fetch vendor profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getVendorProfile();
        const profile = response.data.profile;

        // Map backend data to form fields
        setFormData({
          yearOfEstablishment:
            profile.businessInfo.yearOfEstablishment?.toString() || "",
          yearsInBusiness:
            profile.businessInfo.yearsInBusiness?.toString() || "",
          teamSize: profile.businessInfo.teamSize?.toString() || "",
          minGuests: profile.capacity.minGuests?.toString() || "",
          maxGuests: profile.capacity.maxGuests?.toString() || "",
          idealBookingTime:
            profile.capacity.advanceBookingTime?.toString() || "",
          vendorCategory: profile.capacity.vendorCategory || "food_catering",
          country: profile.address.country || "India",
          state: profile.address.state || "",
          locality: profile.address.locality || "",
          pin: profile.address.pincode || "",
          vegPrice: profile.pricing.vegPricePerPlate?.toString() || "",
          nonVegPrice: profile.pricing.nonVegPricePerPlate?.toString() || "",
          weeksInAdvance:
            profile.operations.weeksAdvanceBooking?.toString() || "",
          operationalRadius:
            profile.operations.operationalRadius?.toString() || "",
        });

        // Map service specialization
        const servicesMap: Record<string, string> = {
          multi_cuisine: "multiCuisine",
          jain_catering: "jainCateringOnly",
          chaat_street_food: "chaatStreetFood",
          small_gathering: "smallSizeGathering",
          drinks_only: "drinksOnly",
        };
        const newServiceSpec: any = {
          multiCuisine: false,
          jainCateringOnly: false,
          chaatStreetFood: false,
          smallSizeGathering: false,
          drinksOnly: false,
        };
        profile.pricing.servicesSpecialization?.forEach((service: string) => {
          const key = servicesMap[service];
          if (key) newServiceSpec[key] = true;
        });
        setServiceSpecialization(newServiceSpec);

        // Map cuisine options
        const cuisineMap: Record<string, string> = {
          north_indian: "northIndian",
          south_indian: "southIndian",
          chinese: "chinese",
          greek: "greek",
          lebanese: "lebanese",
          thai: "thai",
          desserts: "desserts",
          bengali: "bengali",
          gujarati: "gujarati",
          rajasthani: "rajasthani",
          goan: "goab",
          maharashtrian: "maharashtrian",
        };
        const newCuisines: any = {
          northIndian: false,
          southIndian: false,
          chinese: false,
          greek: false,
          lebanese: false,
          thai: false,
          desserts: false,
          bengali: false,
          gujarati: false,
          rajasthani: false,
          goab: false,
          maharashtrian: false,
        };
        profile.pricing.cuisineOptions?.forEach((cuisine: string) => {
          const key = cuisineMap[cuisine];
          if (key) newCuisines[key] = true;
        });
        setCuisineOptions(newCuisines);

        // Map languages
        const languageMap: Record<string, string> = {
          hindi: "hindi",
          english: "english",
          odia: "odia",
          telugu: "telugu",
          marathi: "marathi",
          kannada: "kannada",
          bengali: "bengali",
          gujarati: "gujarati",
          tamil: "tamil",
          malayalam: "malayalam",
          punjabi: "punjabi",
          urdu: "urdu",
        };
        const newLanguages: any = {
          hindi: false,
          english: false,
          odia: false,
          telugu: false,
          marathi: false,
          kannada: false,
          bengali: false,
          gujarati: false,
          tamil: false,
          malayalam: false,
          punjabi: false,
          urdu: false,
        };
        profile.operations.languagesSpoken?.forEach((lang: string) => {
          const key = languageMap[lang];
          if (key) newLanguages[key] = true;
        });
        setLanguages(newLanguages);

        // Set cancellation policy
        setRefundType(profile.cancellationPolicy.policyType || "no_refund");
        setPolicyDetails(profile.cancellationPolicy.policyDetails || "");

        // Set FSSAI certificate if exists
        if (profile.fssaiCertificate?.url) {
          setFssaiCertificate({
            url: profile.fssaiCertificate.url,
            uploadedAt: profile.fssaiCertificate.uploadedAt,
            isVerified: false,
          });
          setOthers((prev) => ({ ...prev, fssaiCertified: true }));
        }

        // Set edit mode since data was successfully loaded
        setIsEditMode(true);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load business details");
        // Set edit mode to false if no data exists
        setIsEditMode(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Validation helper function
  const validateRequiredFields = (): boolean => {
    const errors: Record<string, string> = {};
    const requiredFields = [
      "yearOfEstablishment",
      "yearsInBusiness",
      "teamSize",
      "minGuests",
      "maxGuests",
      "vendorCategory",
      "country",
      "state",
      "locality",
      "pin",
      "vegPrice",
    ];

    // Only require nonVegPrice for full_catering and other categories
    if (
      formData.vendorCategory === "full_catering" ||
      formData.vendorCategory === "other"
    ) {
      requiredFields.push("nonVegPrice");
    }

    requiredFields.forEach((field) => {
      const value = formData[field as keyof typeof formData]?.toString().trim();
      if (!value) {
        errors[field] = "This field is required";
      } else {
        // Validate field-specific formats
        if (field === "yearOfEstablishment" || field === "yearsInBusiness") {
          if (!/^\d+$/.test(value)) {
            errors[field] = "Please enter a valid number";
          }
        } else if (field === "minGuests" || field === "maxGuests") {
          if (!/^\d+$/.test(value)) {
            errors[field] = "Please enter a valid number";
          } else if (field === "minGuests" && parseInt(value) < 0) {
            errors[field] = "Minimum guests cannot be negative";
          } else if (field === "maxGuests" && parseInt(value) < 0) {
            errors[field] = "Maximum guests cannot be negative";
          }
        } else if (field === "pin") {
          if (!/^\d{5,6}$/.test(value)) {
            errors[field] = "Pin code must be 5-6 digits";
          }
        } else if (field === "vegPrice" || field === "nonVegPrice") {
          if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            errors[field] = "Please enter a valid price";
          } else if (parseFloat(value) < 0) {
            errors[field] = "Price cannot be negative";
          }
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Field validation helper
  const validateField = (name: string, value: string): string => {
    if (!value.trim()) {
      return "This field is required";
    }

    switch (name) {
      case "yearOfEstablishment":
      case "yearsInBusiness":
        if (!/^\d+$/.test(value)) return "Please enter a valid number";
        if (parseInt(value) < 0) return "Value cannot be negative";
        if (
          name === "yearOfEstablishment" &&
          parseInt(value) > new Date().getFullYear()
        ) {
          return "Year cannot be in the future";
        }
        break;
      case "minGuests":
      case "maxGuests":
        if (!/^\d+$/.test(value)) return "Please enter a valid number";
        if (parseInt(value) < 0) return "Value cannot be negative";
        break;
      case "pin":
        if (!/^\d{5,6}$/.test(value)) return "Pin code must be 5-6 digits";
        break;
      case "vegPrice":
      case "nonVegPrice":
        if (!/^\d+(\.\d{1,2})?$/.test(value))
          return "Please enter a valid price";
        if (parseFloat(value) < 0) return "Price cannot be negative";
        break;
      case "locality":
        if (!value.trim()) return "Please select a locality";
        if (!LOCALITIES.includes(value))
          return "Please select a valid locality from the list";
        break;
    }

    return "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Validate field and update errors
    if (value.trim()) {
      const fieldError = validateField(name, value);
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (fieldError) {
          newErrors[name] = fieldError;
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    } else if (validationErrors[name]) {
      // Clear error when field is empty
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (category: string, field: string) => {
    if (category === "service") {
      setServiceSpecialization((prev) => ({
        ...prev,
        [field]: !prev[field as keyof typeof prev],
      }));
    } else if (category === "cuisine") {
      setCuisineOptions((prev) => ({
        ...prev,
        [field]: !prev[field as keyof typeof prev],
      }));
    } else if (category === "menu") {
      setMenuUploads((prev) => ({
        ...prev,
        [field]: !prev[field as keyof typeof prev],
      }));
    } else if (category === "others") {
      setOthers((prev) => ({
        ...prev,
        [field]: !prev[field as keyof typeof prev],
      }));
    } else if (category === "language") {
      setLanguages((prev) => ({
        ...prev,
        [field]: !prev[field as keyof typeof prev],
      }));
    }
  };

  const handleFSSAIUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid file (JPG, PNG, PDF)");
      setTimeout(() => setError(""), 15000);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      setTimeout(() => setError(""), 15000);
      return;
    }

    // Create preview URL (for images only)
    const preview = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;

    // Store file for later upload
    setPendingFSSAI({ file, preview });
    setSuccess("FSSAI certificate added. Click Save to upload.");
    setTimeout(() => setSuccess(""), 15000);

    // Reset file input
    e.target.value = "";
  };

  const handleDeleteFSSAI = async () => {
    if (!confirm("Are you sure you want to delete the FSSAI certificate?"))
      return;

    setUploadingFSSAI(true);
    setError("");
    setSuccess("");

    try {
      await deleteFSSAICertificate();

      // Clear from state
      setFssaiCertificate({ url: null, uploadedAt: null, isVerified: false });
      setOthers((prev) => ({ ...prev, fssaiCertified: false }));
      setSuccess("FSSAI certificate deleted successfully!");
      setTimeout(() => setSuccess(""), 15000);
    } catch (err: any) {
      console.error("Error deleting FSSAI certificate:", err);
      setError(err.message || "Failed to delete FSSAI certificate");
      setTimeout(() => setError(""), 15000);
    } finally {
      setUploadingFSSAI(false);
    }
  };

  const handleRemovePendingFSSAI = () => {
    if (pendingFSSAI.preview) {
      URL.revokeObjectURL(pendingFSSAI.preview);
    }
    setPendingFSSAI({ file: null, preview: null });
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    // Validate required fields before saving
    if (!validateRequiredFields()) {
      setError(
        "Please fill in all required fields (marked with *) with valid values"
      );
      setTimeout(() => setError(""), 15000);
      setSaving(false);
      return;
    }

    setSaving(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Please login to continue");
      }

      // Prepare form data
      const formDataToSend = new FormData();

      // Add basic fields (only if they have values)
      if (formData.yearOfEstablishment) {
        formDataToSend.append(
          "yearOfEstablishment",
          formData.yearOfEstablishment
        );
      }
      if (formData.yearsInBusiness) {
        formDataToSend.append("yearsInBusiness", formData.yearsInBusiness);
      }
      if (formData.teamSize) {
        formDataToSend.append("teamSize", formData.teamSize);
      }
      if (formData.minGuests) {
        formDataToSend.append("minGuests", formData.minGuests);
      }
      if (formData.maxGuests) {
        formDataToSend.append("maxGuests", formData.maxGuests);
      }
      if (formData.idealBookingTime) {
        formDataToSend.append("advanceBookingTime", formData.idealBookingTime);
      }
      if (formData.vendorCategory) {
        formDataToSend.append("vendorCategory", formData.vendorCategory);
      }
      if (formData.country) {
        formDataToSend.append("country", formData.country);
      }
      if (formData.state) {
        formDataToSend.append("state", formData.state);
      }
      if (formData.locality) {
        formDataToSend.append("locality", formData.locality);
      }
      if (formData.pin) {
        formDataToSend.append("pincode", formData.pin);
      }
      if (formData.vegPrice) {
        formDataToSend.append("vegPricePerPlate", formData.vegPrice);
      }
      if (formData.nonVegPrice) {
        formDataToSend.append("nonVegPricePerPlate", formData.nonVegPrice);
      }
      if (formData.weeksInAdvance) {
        formDataToSend.append("weeksAdvanceBooking", formData.weeksInAdvance);
      }
      if (formData.operationalRadius) {
        formDataToSend.append("operationalRadius", formData.operationalRadius);
      }

      // Map service specialization to backend format
      const serviceMap: Record<string, string> = {
        multiCuisine: "multi_cuisine",
        jainCateringOnly: "jain_catering",
        chaatStreetFood: "chaat_street_food",
        smallSizeGathering: "small_gathering",
        drinksOnly: "drinks_only",
      };
      const selectedServices = Object.entries(serviceSpecialization)
        .filter(([_, value]) => value)
        .map(([key, _]) => serviceMap[key]);
      if (selectedServices.length > 0) {
        selectedServices.forEach((service) => {
          formDataToSend.append("servicesSpecialization[]", service);
        });
      }

      // Map cuisine options to backend format
      const cuisineMap: Record<string, string> = {
        northIndian: "north_indian",
        southIndian: "south_indian",
        chinese: "chinese",
        greek: "greek",
        lebanese: "lebanese",
        thai: "thai",
        desserts: "desserts",
        bengali: "bengali",
        gujarati: "gujarati",
        rajasthani: "rajasthani",
        goab: "goan",
        maharashtrian: "maharashtrian",
      };
      const selectedCuisines = Object.entries(cuisineOptions)
        .filter(([_, value]) => value)
        .map(([key, _]) => cuisineMap[key]);
      if (selectedCuisines.length > 0) {
        selectedCuisines.forEach((cuisine) => {
          formDataToSend.append("cuisineOptions[]", cuisine);
        });
      }

      // Map languages to backend format
      const selectedLanguages = Object.entries(languages)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);
      if (selectedLanguages.length > 0) {
        selectedLanguages.forEach((language) => {
          formDataToSend.append("languagesSpoken[]", language);
        });
      }

      // Add cancellation policy
      if (refundType) {
        formDataToSend.append("policyType", refundType);
      }
      if (policyDetails) {
        formDataToSend.append("policyDetails", policyDetails);
      }

      // Add FSSAI certificate if pending
      if (pendingFSSAI.file) {
        formDataToSend.append("fssaiCertificate", pendingFSSAI.file);
      }

      // Make API request
      const response = await fetch(`${API_BASE_URL}/vendors/profile/business`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update business details");
      }

      // Update FSSAI certificate state if it was uploaded
      if (pendingFSSAI.file && result.data?.profile?.fssaiCertificate) {
        setFssaiCertificate({
          url: result.data.profile.fssaiCertificate.url,
          uploadedAt: result.data.profile.fssaiCertificate.uploadedAt,
          isVerified: result.data.profile.fssaiCertificate.isVerified || false,
        });
        setOthers((prev) => ({ ...prev, fssaiCertified: true }));

        // Clear pending FSSAI
        if (pendingFSSAI.preview) {
          URL.revokeObjectURL(pendingFSSAI.preview);
        }
        setPendingFSSAI({ file: null, preview: null });
      }

      setSuccess("Business details updated successfully!");
      setTimeout(() => setSuccess(""), 15000);
    } catch (err: any) {
      console.error("Error saving business details:", err);
      setError(err.message || "Failed to save business details");
      setTimeout(() => setError(""), 15000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Business Details
      </h1>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
        Manage your catering business information
      </p>

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

      <div className="rounded-xl p-4 sm:p-6 border border-gray-200">
        {/* Business Information */}
        <div className="mb-8">
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
                name="yearOfEstablishment"
                value={formData.yearOfEstablishment}
                onChange={handleInputChange}
                placeholder="2019"
                min="1900"
                max={new Date().getFullYear()}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base ${
                  validationErrors.yearOfEstablishment
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.yearOfEstablishment && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.yearOfEstablishment}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Years in Business <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="yearsInBusiness"
                value={formData.yearsInBusiness}
                onChange={handleInputChange}
                placeholder="6"
                min="0"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base ${
                  validationErrors.yearsInBusiness
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.yearsInBusiness && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.yearsInBusiness}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Team Size <span className="text-red-500">*</span>
              </label>
              <Popover open={teamSizeOpen} onOpenChange={setTeamSizeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={teamSizeOpen}
                    className={`w-full justify-between h-9 sm:h-11 text-sm sm:text-base font-normal text-gray-600 bg-white hover:bg-gray-50 border-gray-300 ${
                      validationErrors.teamSize ? "border-red-500" : ""
                    }`}
                  >
                    {formData.teamSize
                      ? teamSizeOptions.find(
                          (option) => option.value === formData.teamSize
                        )?.label
                      : "Select team size"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0 bg-white border-gray-300 shadow-none"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search team size..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No team size found.</CommandEmpty>
                      <CommandGroup>
                        {teamSizeOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                              handleInputChange({
                                target: {
                                  name: "teamSize",
                                  value:
                                    currentValue === formData.teamSize
                                      ? ""
                                      : currentValue,
                                },
                              } as any);
                              setTeamSizeOpen(false);
                            }}
                          >
                            {option.label}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                formData.teamSize === option.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {validationErrors.teamSize && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.teamSize}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Capacity & Booking */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Capacity & Booking
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Minimum Guests You Cater To{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="minGuests"
                value={formData.minGuests}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                min="1"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base ${
                  validationErrors.minGuests
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.minGuests && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.minGuests}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Maximum Guests You Can Cater To{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleInputChange}
                placeholder="e.g., 500"
                min="1"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base ${
                  validationErrors.maxGuests
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.maxGuests && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.maxGuests}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Vendor Category <span className="text-red-500">*</span>
            </label>
            <Popover
              open={vendorCategoryOpen}
              onOpenChange={setVendorCategoryOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={vendorCategoryOpen}
                  className={`w-full justify-between shadow-none h-9 sm:h-12 text-sm sm:text-base font-normal text-gray-600 bg-gray-50 border-gray-300 ${
                    validationErrors.vendorCategory ? "border-red-500" : ""
                  }`}
                >
                  {formData.vendorCategory
                    ? vendorCategoryOptions.find(
                        (option) => option.value === formData.vendorCategory
                      )?.label
                    : "Select Vendor Category"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-full p-0 bg-white border-gray-300 shadow-none"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder="Search vendor category..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No vendor category found.</CommandEmpty>
                    <CommandGroup>
                      {vendorCategoryOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue) => {
                            handleInputChange({
                              target: {
                                name: "vendorCategory",
                                value:
                                  currentValue === formData.vendorCategory
                                    ? ""
                                    : currentValue,
                              },
                            } as any);
                            setVendorCategoryOpen(false);
                          }}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              formData.vendorCategory === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {validationErrors.vendorCategory && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.vendorCategory}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="India"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base ${
                  validationErrors.country
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.country}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <Popover open={stateOpen} onOpenChange={setStateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={stateOpen}
                    className={`w-full justify-between shadow-none h-9 sm:h-12 text-sm sm:text-base font-normal text-gray-600 bg-gray-50 border-gray-300 ${
                      validationErrors.state ? "border-red-500" : ""
                    }`}
                  >
                    {formData.state
                      ? stateOptions.find(
                          (option) => option.value === formData.state
                        )?.label
                      : "Select State"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0 bg-white border-gray-300 shadow-none"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search state..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No state found.</CommandEmpty>
                      <CommandGroup>
                        {stateOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                              handleInputChange({
                                target: {
                                  name: "state",
                                  value:
                                    currentValue === formData.state
                                      ? ""
                                      : currentValue,
                                },
                              } as any);
                              setStateOpen(false);
                            }}
                          >
                            {option.label}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                formData.state === option.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {validationErrors.state && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.state}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Locality <span className="text-red-500">*</span>
              </label>
              <Popover open={localityOpen} onOpenChange={setLocalityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={localityOpen}
                    className={`w-full justify-between shadow-none h-9 sm:h-12 text-sm sm:text-base font-normal text-gray-600 bg-gray-50 border-gray-300 ${
                      validationErrors.locality ? "border-red-500" : ""
                    }`}
                  >
                    {formData.locality
                      ? localityOptions.find(
                          (option) => option.value === formData.locality
                        )?.label
                      : "Select Locality"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0 bg-white border-gray-300 shadow-none"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search locality..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No locality found.</CommandEmpty>
                      <CommandGroup>
                        {localityOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                              handleInputChange({
                                target: {
                                  name: "locality",
                                  value:
                                    currentValue === formData.locality
                                      ? ""
                                      : currentValue,
                                },
                              } as any);
                              setLocalityOpen(false);
                            }}
                          >
                            {option.label}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                formData.locality === option.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {validationErrors.locality && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.locality}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Pin <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pin"
                value={formData.pin}
                onChange={handleInputChange}
                placeholder="751024"
                pattern="\d{5,6}"
                maxLength={6}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base ${
                  validationErrors.pin ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.pin && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.pin}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Pricing Details
          </h2>

          {/* Veg/Non-Veg Pricing - Only for Full Catering and Other */}
          {(formData.vendorCategory === "full_catering" ||
            formData.vendorCategory === "other") && (
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Starting Per Plate Price (Vegetarian){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="vegPrice"
                  value={formData.vegPrice}
                  onChange={handleInputChange}
                  placeholder="200"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base ${
                    validationErrors.vegPrice
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.vegPrice && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.vegPrice}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Starting Per Plate Price (Non-Vegetarian){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="nonVegPrice"
                  value={formData.nonVegPrice}
                  onChange={handleInputChange}
                  placeholder="300"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base ${
                    validationErrors.nonVegPrice
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.nonVegPrice && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.nonVegPrice}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Unified Pricing - For other vendor categories */}
          {formData.vendorCategory !== "full_catering" &&
            formData.vendorCategory !== "other" &&
            formData.vendorCategory && (
              <div className="mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Starting Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="vegPrice"
                    value={formData.vegPrice}
                    onChange={handleInputChange}
                    placeholder="200"
                    min="0"
                    step="0.01"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base ${
                      validationErrors.vegPrice
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {validationErrors.vegPrice && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.vegPrice}
                    </p>
                  )}
                </div>
              </div>
            )}

          {/* Service Specialization - Only for Full Catering */}
          {(formData.vendorCategory === "full_catering" ||
            formData.vendorCategory === "other") && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Service Specialization (What Type of Caterer Are You)
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceSpecialization.multiCuisine}
                    onChange={() =>
                      handleCheckboxChange("service", "multiCuisine")
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Multi-Cuisine</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceSpecialization.jainCateringOnly}
                    onChange={() =>
                      handleCheckboxChange("service", "jainCateringOnly")
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Jain Catering Only
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceSpecialization.chaatStreetFood}
                    onChange={() =>
                      handleCheckboxChange("service", "chaatStreetFood")
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Chaat & Street Food Only
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceSpecialization.smallSizeGathering}
                    onChange={() =>
                      handleCheckboxChange("service", "smallSizeGathering")
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Small Size Gathering Only
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceSpecialization.drinksOnly}
                    onChange={() =>
                      handleCheckboxChange("service", "drinksOnly")
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Drinks Only</span>
                </label>
              </div>
            </div>
          )}

          {/* Cuisine Options - Only for Full Catering */}
          {(formData.vendorCategory === "full_catering" ||
            formData.vendorCategory === "other") && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Cuisine Options (Which of the following cuisines do you offer)
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cuisineOptions.northIndian}
                    onChange={() =>
                      handleCheckboxChange("cuisine", "northIndian")
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">North Indian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cuisineOptions.southIndian}
                    onChange={() =>
                      handleCheckboxChange("cuisine", "southIndian")
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">South Indian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cuisineOptions.chinese}
                    onChange={() => handleCheckboxChange("cuisine", "chinese")}
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Chinese</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cuisineOptions.greek}
                    onChange={() => handleCheckboxChange("cuisine", "greek")}
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Greek</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cuisineOptions.lebanese}
                    onChange={() => handleCheckboxChange("cuisine", "lebanese")}
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Lebanese</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cuisineOptions.thai}
                    onChange={() => handleCheckboxChange("cuisine", "thai")}
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Thai</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cuisineOptions.desserts}
                    onChange={() => handleCheckboxChange("cuisine", "desserts")}
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Desserts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cuisineOptions.bengali}
                    onChange={() => handleCheckboxChange("cuisine", "bengali")}
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Bengali</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cuisineOptions.gujarati}
                    onChange={() => handleCheckboxChange("cuisine", "gujarati")}
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Gujarati</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cuisineOptions.rajasthani}
                    onChange={() =>
                      handleCheckboxChange("cuisine", "rajasthani")
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Rajasthani</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cuisineOptions.goab}
                    onChange={() => handleCheckboxChange("cuisine", "goab")}
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Goab</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cuisineOptions.maharashtrian}
                    onChange={() =>
                      handleCheckboxChange("cuisine", "maharashtrian")
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Maharashtrian</span>
                </label>
              </div>
            </div>
          )}

          {/* Other Catering Services - Show for Snacks & Starter, Dessert & Sweet, Paan, Beverage, Water, and Other */}
          {(formData.vendorCategory === "snacks_and_starter" ||
            formData.vendorCategory === "dessert_and_sweet" ||
            formData.vendorCategory === "paan" ||
            formData.vendorCategory === "water" ||
            formData.vendorCategory === "beverage") && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {formData.vendorCategory === "snacks_and_starter"
                  ? "Snacks & Starter Service Details"
                  : formData.vendorCategory === "dessert_and_sweet"
                  ? "Dessert & Sweet Service Details"
                  : formData.vendorCategory === "paan"
                  ? "Paan Service Details"
                  : formData.vendorCategory === "beverage"
                  ? "Beverage Service Details"
                  : formData.vendorCategory === "water"
                  ? "Water Service Details"
                  : "Other Service Details"}
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                You have selected{" "}
                {formData.vendorCategory === "snacks_and_starter"
                  ? "Snacks & Starter"
                  : formData.vendorCategory === "dessert_and_sweet"
                  ? "Dessert & Sweet"
                  : formData.vendorCategory === "paan"
                  ? "Paan"
                  : formData.vendorCategory === "beverage"
                  ? "Beverage"
                  : formData.vendorCategory === "water"
                  ? "Water"
                  : "Other"}{" "}
                service. This category does not require service specialization
                or specific cuisine options selection.
              </p>
              <div className="p-3 bg-white border border-blue-200 rounded text-xs text-gray-700">
                <strong>Note:</strong> For{" "}
                {formData.vendorCategory === "snacks_and_starter"
                  ? "Snacks & Starter"
                  : formData.vendorCategory === "dessert_and_sweet"
                  ? "Dessert & Sweet"
                  : formData.vendorCategory === "paan"
                  ? "Paan"
                  : formData.vendorCategory === "beverage"
                  ? "Beverage"
                  : formData.vendorCategory === "water"
                  ? "Water"
                  : "Other"}{" "}
                services, customers will see your overall pricing and
                availability. Please ensure your pricing reflects the
                appropriate rate for your service model.
              </div>
            </div>
          )}
        </div>

        {/* FSSAI Certificate */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            FSSAI Certificate
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload your FSSAI certificate (max 10MB, JPG/PNG)
          </p>

          {fssaiCertificate.url ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      Certificate Uploaded
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    Uploaded:{" "}
                    {new Date(
                      fssaiCertificate.uploadedAt || ""
                    ).toLocaleDateString()}
                  </p>
                  <a
                    href={fssaiCertificate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-orange-500 hover:text-orange-600 underline"
                  >
                    View Certificate
                  </a>
                </div>
                <button
                  onClick={handleDeleteFSSAI}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : pendingFSSAI.file ? (
            <div className="border-2 border-orange-300 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      Certificate Pending Upload
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {pendingFSSAI.file.name} (
                    {(pendingFSSAI.file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                  {pendingFSSAI.preview && (
                    <img
                      src={pendingFSSAI.preview}
                      alt="FSSAI Preview"
                      className="w-32 h-32 object-cover rounded-lg mt-2"
                    />
                  )}
                  <p className="text-xs text-orange-600 mt-2">
                    Click "Save Business Details" to upload this certificate
                  </p>
                </div>
                <button
                  onClick={handleRemovePendingFSSAI}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <label className="inline-flex w-full sm:w-auto px-4 py-2.5 border-2 border-orange-500 text-orange-500 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors items-center justify-center gap-2 cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                onChange={handleFSSAIUpload}
                className="hidden"
                disabled={uploadingFSSAI}
              />
              {uploadingFSSAI ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploadingFSSAI ? "Uploading..." : "Upload Certificate"}
            </label>
          )}
        </div>

        {/* Cancellation Policy */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Cancellation Policy
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Refund Type (Select one)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="refundType"
                  value="no_refund"
                  checked={refundType === "no_refund"}
                  onChange={(e) => setRefundType(e.target.value)}
                  className="w-4 h-4 text-orange-500"
                />
                <span className="text-sm text-gray-700">No Refund Offered</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="refundType"
                  value="partial_refund"
                  checked={refundType === "partial_refund"}
                  onChange={(e) => setRefundType(e.target.value)}
                  className="w-4 h-4 text-orange-500"
                />
                <span className="text-sm text-gray-700">Partial Refund</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="refundType"
                  value="full_refund"
                  checked={refundType === "full_refund"}
                  onChange={(e) => setRefundType(e.target.value)}
                  className="w-4 h-4 text-orange-500"
                />
                <span className="text-sm text-gray-700">
                  Full Refund Offered
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Policy Details / Terms and Conditions
            </label>
            <textarea
              value={policyDetails}
              onChange={(e) => setPolicyDetails(e.target.value)}
              placeholder="Please describe in detail - eg No refunds within a month of the wedding day or 50% amount refundable"
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base resize-none"
            />
          </div>
        </div>

        {/* Languages Spoken */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Languages Spoken
          </h2>
          <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={languages.hindi}
                onChange={() => handleCheckboxChange("language", "hindi")}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">Hindi</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={languages.english}
                onChange={() => handleCheckboxChange("language", "english")}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">English</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={languages.odia}
                onChange={() => handleCheckboxChange("language", "odia")}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">Odia</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={languages.telugu}
                onChange={() => handleCheckboxChange("language", "telugu")}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">Telugu</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={languages.marathi}
                onChange={() => handleCheckboxChange("language", "marathi")}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">Marathi</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={languages.kannada}
                onChange={() => handleCheckboxChange("language", "kannada")}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">Kannada</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={languages.bengali}
                onChange={() => handleCheckboxChange("language", "bengali")}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">Bengali</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={languages.gujarati}
                onChange={() => handleCheckboxChange("language", "gujarati")}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">Gujarati</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={languages.tamil}
                onChange={() => handleCheckboxChange("language", "tamil")}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">Tamil</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={languages.malayalam}
                onChange={() => handleCheckboxChange("language", "malayalam")}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">Malayalam</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={languages.punjabi}
                onChange={() => handleCheckboxChange("language", "punjabi")}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">Punjabi</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={languages.urdu}
                onChange={() => handleCheckboxChange("language", "urdu")}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">Urdu</span>
            </label>
          </div>
        </div>

        {/* Additional Fields */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Weeks in advance for booking?
            </label>
            <input
              type="number"
              name="weeksInAdvance"
              value={formData.weeksInAdvance}
              onChange={handleInputChange}
              placeholder="5"
              min="0"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Operational Radius (km)
            </label>
            <input
              type="number"
              name="operationalRadius"
              value={formData.operationalRadius}
              onChange={handleInputChange}
              placeholder="30"
              min="0"
              step="0.5"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base"
            />
            <p className="text-xs text-gray-500 mt-1">
              Service coverage area from your base location
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-500 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isEditMode ? "Updating..." : "Saving..."}</span>
              </>
            ) : isEditMode ? (
              "Update Business Details"
            ) : (
              "Save Business Details"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
