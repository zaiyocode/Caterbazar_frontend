"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { 
  LayoutDashboard, User, Building2, Image, CreditCard, 
  Star, ShoppingBag, Settings, FileText, MessageSquare 
} from 'lucide-react';

interface MobileMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileMenu({ activeTab, onTabChange }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

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
    // { id: 'orders', label: 'Orders & Bookings', icon: ShoppingBag },
    // { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 overflow-y-auto h-full">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Menu</h2>
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
