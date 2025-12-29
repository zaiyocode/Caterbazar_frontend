'use client';

import React, { useState } from 'react';
import { Check, X, Star } from 'lucide-react';

export default function SubscriptionPlan() {
  const [billingType, setBillingType] = useState<'monthly' | 'annual'>('annual');
  const [scale, setScale] = useState(200); // events per month

  const getScaleLabel = (value: number) => {
    if (value <= 100) return 'Small (1-100 events/mo)';
    if (value <= 300) return 'Medium (101-300 events/mo)';
    return 'Large (301+ events/mo)';
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Subscription Plan</h1>
      
      {/* <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm sm:text-base font-medium text-gray-700">Billing:</span>
            <button
              onClick={() => setBillingType('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                billingType === 'monthly'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingType('annual')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                billingType === 'annual'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Annual
            </button>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              Save 20%
            </span>
          </div>
        </div>
      </div> */}

      {/* Choose Your Plan */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
        Choose Your Plan
      </h2>

      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg  relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-full">
              <Star className="w-4 h-4 fill-white" />
              Your Current Plan
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">Free Plan</h3>
          <div className="mb-6">
            <p className="text-4xl sm:text-5xl font-bold text-gray-900">
              ₹0
              <span className="text-lg text-gray-600 font-normal">/year</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">Forever Free</p>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Up to 5 menu listings</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Basic profile page</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Email support (48hr response)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Standard booking calendar</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Basic inquiry management</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-400">Priority support</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-400">Analytics dashboard</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-400">Featured placement</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-400">Unlimited listings</span>
            </li>
          </ul>

          <button className="w-full py-3 sm:py-4 bg-green-100 text-green-700 rounded-lg font-semibold text-base sm:text-lg">
            Active Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-orange-500 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 text-white text-sm font-semibold rounded-full">
              <Star className="w-4 h-4 fill-white" />
              Most Popular
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-4">Premium</h3>
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <p className="text-lg text-gray-400 line-through">₹17,988</p>
            </div>
            <p className="text-4xl sm:text-5xl font-bold text-gray-900">
              ₹14,999
              <span className="text-lg text-gray-600 font-normal">/year</span>
            </p>
            <p className="text-sm text-green-600 font-medium mt-1">Save 17% annually</p>
            <p className="text-sm text-gray-600">Billed Annually</p>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Unlimited menu listings</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Featured profile placement</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Priority support 24/7</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Advanced booking calendar</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Analytics dashboard</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Unlimited inquiries</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Custom branding</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Faster payouts (24-48hrs)</span>
            </li>
            {/* <li className="flex items-start gap-3">
              <X className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-400">API access</span>
            </li> */}
          </ul>

          <button className="w-full py-3 sm:py-4 bg-orange-500 text-white rounded-lg font-semibold text-base sm:text-lg hover:bg-orange-600 transition-colors">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}
