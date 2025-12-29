"use client";

import { useEffect } from 'react';

// Client-side component to sync localStorage with cookies for middleware access
export default function AuthCookieSync() {
  useEffect(() => {
    const syncAuthCookies = () => {
      // Check if user is authenticated
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Get role from different possible storage keys
      let userRole = localStorage.getItem('userRole') || 
                    localStorage.getItem('role') ||
                    null;
      
      // If we have vendor data, extract role from it
      if (!userRole) {
        const vendorData = localStorage.getItem('vendorData');
        if (vendorData) {
          try {
            const vendor = JSON.parse(vendorData);
            userRole = vendor.role;
          } catch (e) {
            console.error('Error parsing vendor data:', e);
          }
        }
      }
      
      // If we have user data, extract role from it
      if (!userRole) {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            userRole = user.role;
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      }
      
      if (accessToken && refreshToken && userRole) {
        // Set cookies for middleware access
        document.cookie = `accessToken=${accessToken}; path=/; secure; samesite=strict; max-age=86400`; // 1 day
        document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict; max-age=604800`; // 7 days
        document.cookie = `userRole=${userRole}; path=/; secure; samesite=strict; max-age=86400`; // 1 day
      } else {
        // Clear cookies if not authenticated
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    };
    
    // Sync cookies on component mount
    syncAuthCookies();
    
    // Listen for auth state changes and sync cookies
    const handleAuthStateChange = () => {
      syncAuthCookies();
    };
    
    window.addEventListener('authStateChanged', handleAuthStateChange);
    
    // Also sync on storage changes (in case user logs out in another tab)
    window.addEventListener('storage', handleAuthStateChange);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange);
      window.removeEventListener('storage', handleAuthStateChange);
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}