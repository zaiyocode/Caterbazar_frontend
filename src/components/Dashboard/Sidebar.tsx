"use client";

import React from 'react';
import { 
  LayoutDashboard, User, Building2, Image, CreditCard, 
  Star, ShoppingBag, Headphones, FileText, MessageSquare 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'registration', label: 'Business Registration', icon: FileText },
    { id: 'business', label: 'Business Details', icon: Building2 },
    { id: 'gallery', label: 'Gallery Management', icon: Image },
    { id: 'subscription', label: 'Subscription Plan', icon: CreditCard },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
  ];

  return (
    <div className="w-72 shrink-0 hidden lg:block">
      <div className="rounded-2xl border border-orange-200 p-4 sticky top-6">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm lg:text-base">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vendor Support */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          {/* <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
            <span className="text-sm lg:text-base">Vendor Support</span>
            <Headphones className="w-5 h-5" />
          </button> */}
          <p className="text-xs text-gray-600 text-center mt-3">
            or send mail at{' '}
            <a href="mailto:support@caterbazar.com" className="text-orange-500 hover:underline">
              support@caterbazar.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
