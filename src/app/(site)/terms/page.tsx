'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Shield, Gavel } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: 'By using this website, you acknowledge that you have read, understood, and agreed to these Terms & Conditions. If you do not agree, please stop using the platform immediately.',
    },
    {
      title: 'Nature of the Platform',
      icon: Shield,
      content: 'Cater Bazar is an online marketplace that connects users with caterers and event service providers, allows caterers to showcase services, menus, and pricing, and helps users compare, enquire, and book catering services. We are not a catering company, and we do not provide catering services directly.',
    },
    {
      title: 'User Responsibilities',
      icon: AlertCircle,
      content: 'By using our website, you agree to provide accurate information when submitting inquiries, use the platform only for lawful purposes, not misrepresent your identity or intention, and not attempt unauthorized access, data scraping, or misuse of platform data. You are responsible for ensuring your communication and conduct remain respectful and lawful.',
    },
    {
      title: 'Vendor (Caterer) Responsibilities',
      icon: Gavel,
      content: 'Vendors listed on Cater Bazar must provide accurate and updated business information, maintain service quality, hygiene, and professionalism, deliver the services they promised to customers, and not use the platform for fraudulent or misleading activities. Cater Bazar reserves the right to suspend or remove vendors violating these terms.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Terms & Conditions</h1>
          <p className="text-sm sm:text-base lg:text-lg text-orange-100">
            Welcome to Cater Bazar. Please read these Terms & Conditions carefully before using our platform.
          </p>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Welcome to Cater Bazar ("we", "our", "us"). By accessing or using our website, services, or vendor listings, you agree to comply with the following Terms & Conditions.
          </p>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* Section 1: Acceptance of Terms */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              By using this website, you acknowledge that you have read, understood, and agreed to these Terms & Conditions. If you do not agree, please stop using the platform immediately.
            </p>
          </div>

          {/* Section 2: Nature of the Platform */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">2. Nature of the Platform</h2>
            <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
              Cater Bazar is an online marketplace that:
            </p>
            <ul className="space-y-2 mb-4 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Connects users with caterers and event service providers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Allows caterers to showcase services, menus, and pricing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Helps users compare, enquire, and book catering services</span>
              </li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              We are not a catering company, and we do not provide catering services directly.
            </p>
          </div>

          {/* Section 3: User Responsibilities */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
              By using our website, you agree:
            </p>
            <ul className="space-y-2 mb-4 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">To provide accurate information when submitting inquiries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">To use the platform only for lawful purposes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">To not misrepresent your identity or intention</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">To not attempt unauthorized access, data scraping, or misuse of platform data</span>
              </li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              You are responsible for ensuring your communication and conduct remain respectful and lawful.
            </p>
          </div>

          {/* Section 4: Vendor Responsibilities */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">4. Vendor (Caterer) Responsibilities</h2>
            <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
              Vendors listed on Cater Bazar must:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Provide accurate and updated business information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Maintain service quality, hygiene, and professionalism</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Deliver the services they promised to customers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Not use the platform for fraudulent or misleading activities</span>
              </li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
              Cater Bazar reserves the right to suspend or remove vendors violating these terms.
            </p>
          </div>

          {/* Section 5: Booking & Payment Terms */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-red-500">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">5. Booking & Payment Terms</h2>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-3">orange
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Cater Bazar does not handle payments between users and caterers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">All pricing, negotiations, and payments occur directly between both parties</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Cater Bazar is not responsible for disputes, non-performance, delays, cancellations, or payment issues</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700 text-sm sm:text-base">Users are advised to verify caterer credentials before booking</span>
              </li>
            </ul>
          </div>

          {/* Additional Sections */}
          <div className="space-y-8 sm:space-y-10">
            {/* Section 6 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">6. Communication Policy</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
                When you submit an inquiry, your details (name, phone, event details, etc.) may be shared with relevant caterers so they can respond.
              </p>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                You may receive calls, messages, or WhatsApp responses from vendors or our team.
              </p>
            </div>

            {/* Section 7 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                All content on this website—including logos, text, designs, graphics, and layout—is the property of Cater Bazar. You may not:
              </p>
              <ul className="space-y-2 ml-4 mb-4">
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Copy, reproduce, distribute, or modify our content</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Use our content for commercial purposes without written permission</span>
                </li>
              </ul>
            </div>

            {/* Section 8 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                Cater Bazar is a facilitator and does not guarantee:
              </p>
              <ul className="space-y-2 ml-4 mb-4">
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Food quality</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Service delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Pricing accuracy</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Caterer availability or vendor professionalism</span>
                </li>
              </ul>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 font-semibold">
                We are not liable for losses arising from bookings, service disputes, event mismanagement by vendors, or damages caused by caterers or third parties.
              </p>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Your engagement with caterers is at your own discretion and responsibility.
              </p>
            </div>

            {/* Section 9 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">9. Third-Party Links</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Our website may contain links to external sites. We are not responsible for their content, policies, or practices.
              </p>
            </div>

            {/* Section 10 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">10. Termination of Access</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                We may suspend or terminate access to users or vendors who:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Violate these Terms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Engage in fraud, abuse, or illegal activity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 text-sm sm:text-base">Misuse platform features</span>
                </li>
              </ul>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
                This can be done without prior notice.
              </p>
            </div>

            {/* Section 11 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">11. Privacy</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Your use of the platform is also governed by our <a href="/privacy" className="text-orange-600 hover:text-orange-700 font-semibold">Privacy Policy</a>, which explains how we collect and handle personal data.
              </p>
            </div>

            {/* Section 12 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">12. Modification of Terms</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Cater Bazar may update these Terms & Conditions at any time. Continued use of the platform implies acceptance of the updated terms.
              </p>
            </div>

            {/* Section 13 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                These Terms & Conditions are governed by the laws of India. All disputes shall be handled under the jurisdiction of relevant courts in India.
              </p>
            </div>

            {/* Section 14 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-l-4 border-orange-500">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">14. Contact Us</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                For questions or concerns regarding these Terms, please reach out:
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
        </div>
      </section>
    </div>
  );
}
