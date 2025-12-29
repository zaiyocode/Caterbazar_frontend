'use client';

import React, { useEffect, useState } from 'react';
import { Eye, Heart, Users, Star } from 'lucide-react';
import { getDashboardStats, getUpcomingEvents, DashboardStats, UpcomingEvent } from '@/api/vendor/dashboard.api';

export default function DashboardOverview() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalInquiries: 0,
    totalCustomers: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both stats and upcoming events in parallel
      const [statsResponse, eventsResponse] = await Promise.all([
        getDashboardStats(),
        getUpcomingEvents()
      ]);

      if (statsResponse.success) {
        setDashboardStats(statsResponse.data.stats);
      }

      if (eventsResponse.success) {
        setUpcomingEvents(eventsResponse.data.upcomingEvents);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  const stats = [
    {
      icon: Users,
      label: 'Total Inquiries',
      value: loading ? '...' : dashboardStats.totalInquiries.toString(),
      change: dashboardStats.totalInquiries > 0 ? `${dashboardStats.totalInquiries} total` : 'No inquiries yet',
      changeType: 'neutral',
      subtext: 'Customer inquiries received',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500'
    },
    {
      icon: Users,
      label: 'Total Customers',
      value: loading ? '...' : dashboardStats.totalCustomers.toString(),
      subtext: 'Unique customers reached',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-500'
    },
    {
      icon: Star,
      label: 'Average Rating',
      value: loading ? '...' : dashboardStats.averageRating.toFixed(1),
      change: `${dashboardStats.totalReviews} reviews`,
      changeType: 'neutral',
      subtext: dashboardStats.totalReviews > 0 ? 'Based on customer feedback' : 'No reviews yet',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Dashboard</h1>
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                {stat.change && (
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading events...</div>
        ) : upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div 
                key={event._id} 
                className="p-5 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900 text-lg">
                        {event.userName || event.userId?.fullName || 'Customer Event'}
                      </p>
                      {event.status && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          event.status === 'contacted' ? 'bg-green-100 text-green-700' :
                          event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {event.status}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Event Type</p>
                        <p className="text-sm text-gray-700 font-medium capitalize">
                          {event.eventType?.replace('_', ' ')}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Guest Count</p>
                        <p className="text-sm text-gray-700 font-medium">
                          {event.guestCount?.toLocaleString()} guests
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Food Preference</p>
                        <p className="text-sm text-gray-700 font-medium capitalize">
                          {event.foodPreference?.replace('_', ' ')}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm text-gray-700 font-medium">
                          {event.eventLocation?.city}, {event.eventLocation?.state}
                        </p>
                      </div>
                    </div>

                    {event.message && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Message</p>
                        <p className="text-sm text-gray-700 italic">"{event.message}"</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="text-xs text-gray-500 mb-1">Event Date</p>
                    <p className="text-sm font-semibold text-orange-600 mb-1">
                      {new Date(event.eventDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Contact</p>
                    <p className="text-xs text-gray-700">{event.userPhone}</p>
                    <p className="text-xs text-gray-700">{event.userEmail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No upcoming events scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
}
