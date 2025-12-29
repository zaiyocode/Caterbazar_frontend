"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, MessageCircle, DollarSign } from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Verified Vendors",
    description: "Only trusted and background-checked caterers onboarded.",
    details: [
      "Only trusted and background-checked caterers are onboarded.",
      "Every caterer meets strict quality and hygiene standards.",
      "We ensure you get reliable professionals who make your event seamless.",
      "Enjoy peace of mind knowing your catering is in expert hands."
    ]
  },
  {
    icon: MessageCircle,
    title: "Direct WhatsApp Enquiry",
    description: "Chat instantly — no middleman, no waiting.",
    details: [
      "Chat instantly with caterers, no middleman, no waiting.",
      "Get real-time responses and personalized quotes directly.",
      "Discuss menus, services, and packages easily over WhatsApp.",
      "Save time and plan your event effortlessly with instant support."
    ]
  },
  {
    icon: DollarSign,
    title: "Budget-Friendly Options",
    description: "Compare packages and pick what fits your budget.",
    details: [
      "Compare catering packages and pick what fits your budget.",
      "Enjoy premium services without overspending.",
      "Flexible options let you customize menus and services as you like.",
      "Get the best value without compromising on quality or experience."
    ]
  },
];

export default function WhyChooseCaterbazar() {
  const router = useRouter();

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            Why Choose Caterbazar
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Fast discovery, verified vendors, and pricing that fits.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 lg:p-8 shadow-md hover:shadow-xl transition-shadow text-center"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-orange-500 text-orange-500 mb-4 sm:mb-5 lg:mb-6">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-5">
                  {feature.description}
                </p>

                {/* Learn More Button */}
                <button 
                  onClick={() => router.push("/about")}
                  className="px-4 sm:px-6 py-2 text-orange-500 text-xs sm:text-sm font-semibold rounded-lg hover:bg-orange-200 cursor-pointer transition-colors"
                >
                  Learn More
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
