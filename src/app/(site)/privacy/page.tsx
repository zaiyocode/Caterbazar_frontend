'use client';

import React from 'react';
import { Lock, Eye, Share2, Cookie, Shield, Users, FileText, AlertCircle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Privacy Policy</h1>
          <p className="text-sm sm:text-base lg:text-lg text-orange-100">
            Welcome to Cater Bazar. We value your trust and are committed to protecting your personal information.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            This Privacy Policy explains how we collect, use, store, and safeguard data when you visit our website or use our services.
          </p>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* Section 1: Information We Collect */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">1. Information We Collect</h2>
            </div>

            {/* Personal Information */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">A. Personal Information</h3>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Name</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Email address</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Phone number</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Event details (date, location, type of event)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Queries submitted through forms or WhatsApp</span>
                </li>
              </ul>
            </div>

            {/* Non-Personal Information */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">B. Non-Personal Information</h3>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Browser type and device information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">IP address</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Cookies and usage analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Pages visited on our website</span>
                </li>
              </ul>
            </div>

            {/* Vendor Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">C. Vendor Information</h3>
              <p className="text-gray-700 text-sm sm:text-base mb-3">If you register as a caterer/vendor, we may collect:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Business name</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Contact details</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Service information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Verification documents</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2: How We Use Your Information */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
            </div>
            <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
              Your information is used to provide a smooth and personalized experience:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">To connect users with caterers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">To respond to inquiries and provide quotations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">To improve website functionality and user experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">To send updates, service notifications, and promotional offers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">To verify and onboard vendors</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">To maintain safety, trust, and platform integrity</span>
              </li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-6 font-semibold text-orange-700">
              We never sell or misuse your personal information.
            </p>
          </div>

          {/* Section 3: Sharing of Information */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-6">
              <Share2 className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">3. Sharing of Information</h2>
            </div>
            <p className="text-gray-700 text-sm sm:text-base mb-6 leading-relaxed">
              We may share your details only in the following cases:
            </p>

            {/* With Caterers */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">A. With Caterers/Vendors</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                To help you receive quotations, service details, or event-related support.
              </p>
            </div>

            {/* With Service Providers */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">B. With Service Providers</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                For website hosting, analytics, customer support, and marketing (if applicable).
              </p>
            </div>

            {/* Legal Reasons */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">C. Legal Reasons</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                If required to comply with law, legal processes, or government requests.
              </p>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
                No information is shared externally without a valid purpose.
              </p>
            </div>
          </div>

          {/* Section 4: Cookies & Tracking */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-6">
              <Cookie className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">4. Cookies & Tracking Technologies</h2>
            </div>
            <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
              Our website uses cookies to:
            </p>
            <ul className="space-y-2 ml-4 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Improve loading speed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Track user preferences</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Analyze browsing patterns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Enhance website performance</span>
              </li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              You can disable cookies anytime through your browser settings.
            </p>
          </div>

          {/* Section 5: Data Security */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">5. Data Security</h2>
            </div>
            <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
              We use industry-standard security measures to protect your data from:
            </p>
            <ul className="space-y-2 ml-4 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Unauthorised access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Alteration</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Disclosure</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Destruction</span>
              </li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              However, no online system is 100% secure; we strive to maintain the highest safety standards.
            </p>
          </div>

          {/* Section 6: Your Rights */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">6. Your Rights</h2>
            </div>
            <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
              You may request:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Access to the personal data we hold</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Correction of inaccurate information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Deletion of your personal data</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Opt-out from promotional communications</span>
              </li>
            </ul>
          </div>

          {/* Section 7: Third-Party Links */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">7. Third-Party Links</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Our website may contain links to external websites. We are not responsible for their content or privacy practices.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Please review their policies before sharing your information.
            </p>
          </div>

          {/* Section 8: Children's Privacy */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">8. Children's Privacy</h2>
            </div>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
              Our services are not intended for individuals under 18 years.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              We do not knowingly collect data from minors.
            </p>
          </div>

          {/* Section 9: Changes to This Policy */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">9. Changes to This Policy</h2>
            </div>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              We may update this Privacy Policy periodically. The updated version will be posted here with a new "Last Updated" date.
            </p>
          </div>

          {/* Section 10: Contact Us */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">10. Contact Us</h2>
            </div>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
              For questions regarding this Privacy Policy or your data rights, please contact:
            </p>
            <div className="space-y-3 ml-4">
              <p className="text-gray-700 text-sm sm:text-base">
                <span className="font-semibold">📧 Email:</span> info@caterbazar.com
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                <span className="font-semibold">📞 Phone:</span> +91 123 456 7890
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                <span className="font-semibold">📍 Address:</span> 123 Business Street, Mumbai, Maharashtra 400001
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
