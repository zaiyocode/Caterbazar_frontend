"use client";

import React, { useState } from 'react';
import { 
  Users, UserCheck, Image, ShoppingBag, Menu, X, Shield, FileCheck 
} from 'lucide-react';

interface AdminMobileMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminMobileMenu({ activeTab, onTabChange }: AdminMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'vendors', label: 'Vendor Management', icon: Users },
    { id: 'business-registrations', label: 'Business Registrations', icon: FileCheck },
    { id: 'customers', label: 'Customer Management', icon: UserCheck },
    // { id: 'hero-images', label: 'Hero Image Management', icon: Image },
    { id: 'total-orders', label: 'Total Orders', icon: ShoppingBag }
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute inset-x-4 top-4 bottom-4 bg-white rounded-2xl p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Sales Admin</h2>
                  <p className="text-sm text-gray-600">Platform Control</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items */}
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
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
