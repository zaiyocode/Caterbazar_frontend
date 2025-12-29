'use client';

import React from 'react';
import { CheckCircle, Users, Globe, Heart, Zap, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className=" text-black py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">About Us</h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8">
            India's 1st Marketplace for Trusted Caterers
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-black leading-relaxed">
            At Cater Bazar, we believe great food makes every celebration unforgettable. From weddings and corporate events to home gatherings and festive celebrations, the right catering partner can transform moments into memories. That's why we created India's first dedicated catering marketplace, a single platform where you can discover, compare, and book the best caterers across the country.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                To simplify the catering search process and make event planning faster, smarter, and stress-free for both customers and caterers.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                To become India's largest and most trusted catering marketplace, empowering every event big or small with exceptional food and service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              We've created a platform that works for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {/* Why Choose Card 1 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 sm:p-7 border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Verified & Trusted Vendors</h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base">
                We onboard only background-checked, reliable caterers who meet quality standards.
              </p>
            </div>

            {/* Why Choose Card 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 sm:p-7 border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">One Marketplace for All</h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base">
                Wedding catering, birthday parties, corporate events, house gatherings—everything in one place.
              </p>
            </div>

            {/* Why Choose Card 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 sm:p-7 border-l-4 border-purple-500">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Direct Communication</h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base">
                Connect instantly with caterers via WhatsApp, Message or call—No middlemen involved.
              </p>
            </div>

            {/* Why Choose Card 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 sm:p-7 border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Transparent & Budget-Friendly</h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base">
                Compare menus, prices, cuisines, and reviews before making a choice.
              </p>
            </div>

            {/* Why Choose Card 5 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 sm:p-7 border-l-4 border-red-500 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Nationwide Coverage</h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base">
                From metros to small towns, we list caterers across all major cities in India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Customers & Caterers Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            {/* For Customers */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5">
                For Customers
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                We help you find caterers who match your taste, theme, and budget—ensuring your event feels special, seamless, and stress-free.
              </p>
            </div>

            {/* For Caterers */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5">
                For Caterers
              </h3>
              <div className="text-gray-700 text-sm sm:text-base space-y-2 sm:space-y-3">
                <p className="font-semibold">Cater Bazar helps vendors grow with:</p>
                <ul className="space-y-1.5 sm:space-y-2 ml-4">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>More visibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Quality customer leads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Zero middleman barriers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>A professional platform to showcase services</span>
                  </li>
                </ul>
                <p className="font-semibold text-green-600 mt-3 sm:mt-4">Your success is our success.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className=" text-black py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            Join Us on This Journey
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-black leading-relaxed mb-8 sm:mb-10">
            Cater Bazar is more than a platform, it's a community of food lovers, event planners, families, and professional caterers working together to create extraordinary celebrations.
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-black leading-relaxed mb-8 sm:mb-10">
            Whether you're planning your next event or offering top-class catering services, we're here to help every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <a
              href="/vendors"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Find Caterers
            </a>
            <a
              href="/auth/vendor/signin"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-orange-700 text-white font-bold rounded-lg hover:bg-orange-800 transition-colors text-sm sm:text-base border-2 border-white"
            >
              Join as Caterer
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
