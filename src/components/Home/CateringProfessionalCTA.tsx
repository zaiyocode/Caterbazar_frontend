import React from "react";
import Link from "next/link";

export default function CateringProfessionalCTA() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-linear-to-r from-orange-500 via-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl px-6 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10 md:py-12 lg:py-16 relative overflow-hidden">
          {/* Decorative Food Icons */}
          <div className="absolute left-4 sm:left-6 lg:left-8 bottom-4 sm:bottom-6 lg:bottom-8 opacity-20 hidden sm:block">
            <svg
              width="80"
              height="80"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white sm:w-20 sm:h-20 lg:w-28 lg:h-28"
            >
              <path
                d="M40 20 L50 40 L60 20 M40 40 L60 40 M40 60 L60 60 M35 60 L35 100 M65 60 L65 100 M30 100 L70 100"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="absolute right-4 sm:right-6 lg:right-8 top-4 sm:top-6 lg:top-8 opacity-20 hidden sm:block">
            <svg
              width="70"
              height="70"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white sm:w-16 sm:h-16 lg:w-24 lg:h-24"
            >
              <ellipse cx="50" cy="30" rx="35" ry="15" stroke="currentColor" strokeWidth="4" />
              <ellipse cx="50" cy="50" rx="35" ry="15" stroke="currentColor" strokeWidth="4" />
              <line x1="50" y1="65" x2="50" y2="85" stroke="currentColor" strokeWidth="4" />
              <ellipse cx="50" cy="85" rx="20" ry="8" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
              Are you a catering professional?
            </h2>
            <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Join Caterbazar and grow your business online.
            </p>
            <Link
              href="/auth/vendor/businessRegistration"
              className="inline-block bg-white text-orange-500 hover:bg-gray-100 px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-3.5 md:py-4 rounded-full font-bold text-sm sm:text-base lg:text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              List Your Catering Business
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
