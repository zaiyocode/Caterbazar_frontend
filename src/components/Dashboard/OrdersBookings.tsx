import React, { useState } from 'react';
import { Search, ChevronDown, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

export default function OrdersBookings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('All Event Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('Last 30 Days');
  const [currentPage, setCurrentPage] = useState(1);

  const bookings = [
    {
      id: '#ORD-2023-1234',
      customer: {
        name: 'Rajesh Kumar',
        phone: '+91-98XXX-XXXX',
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      eventType: 'Wedding',
      eventDate: '15/02/2025',
      eventTime: '7:00 PM',
      guests: 250,
      amount: '₹25,000',
      perPlate: '₹100',
      status: 'Pending'
    },
    {
      id: '#ORD-2023-4578',
      customer: {
        name: 'Priya Sharma',
        phone: '+91-97XXX-XXXX',
        avatar: 'https://i.pravatar.cc/150?img=45'
      },
      eventType: 'Birthday',
      eventDate: '17/02/2025',
      eventTime: '6:30 PM',
      guests: 80,
      amount: '₹15,000',
      perPlate: '₹188',
      status: 'Confirmed'
    },
    {
      id: '#ORD-2023-7891',
      customer: {
        name: 'Amit Patel',
        phone: '+91-96XXX-XXXX',
        avatar: 'https://i.pravatar.cc/150?img=33'
      },
      eventType: 'Corporate',
      eventDate: '20/02/2025',
      eventTime: '12:00 PM',
      guests: 150,
      amount: '₹22,500',
      perPlate: '₹150',
      status: 'Confirmed'
    },
    {
      id: '#ORD-2023-5623',
      customer: {
        name: 'Sneha Reddy',
        phone: '+91-95XXX-XXXX',
        avatar: 'https://i.pravatar.cc/150?img=28'
      },
      eventType: 'Anniversary',
      eventDate: '22/02/2025',
      eventTime: '8:00 PM',
      guests: 100,
      amount: '₹18,000',
      perPlate: '₹180',
      status: 'Pending'
    },
    {
      id: '#ORD-2023-9087',
      customer: {
        name: 'Vikram Singh',
        phone: '+91-94XXX-XXXX',
        avatar: 'https://i.pravatar.cc/150?img=51'
      },
      eventType: 'Wedding',
      eventDate: '25/02/2025',
      eventTime: '7:30 PM',
      guests: 300,
      amount: '₹45,000',
      perPlate: '₹150',
      status: 'Confirmed'
    },
    {
      id: '#ORD-2023-3421',
      customer: {
        name: 'Neha Gupta',
        phone: '+91-93XXX-XXXX',
        avatar: 'https://i.pravatar.cc/150?img=38'
      },
      eventType: 'Birthday',
      eventDate: '28/02/2025',
      eventTime: '5:00 PM',
      guests: 60,
      amount: '₹12,000',
      perPlate: '₹200',
      status: 'Pending'
    },
    {
      id: '#ORD-2023-6754',
      customer: {
        name: 'Arjun Mehta',
        phone: '+91-92XXX-XXXX',
        avatar: 'https://i.pravatar.cc/150?img=15'
      },
      eventType: 'Corporate',
      eventDate: '03/03/2025',
      eventTime: '1:00 PM',
      guests: 200,
      amount: '₹30,000',
      perPlate: '₹150',
      status: 'Confirmed'
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Orders & Bookings</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your catering orders and track earnings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-green-500 text-white rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
            Premium Active - 30 days remaining
          </div>
          <button className="text-blue-500 hover:text-blue-600 font-semibold text-sm sm:text-base whitespace-nowrap">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">4</div>
              <p className="text-sm sm:text-base text-gray-600">Upcoming Events</p>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              +20%
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">₹68,500</div>
              <p className="text-sm sm:text-base text-gray-600">Total Revenue</p>
            </div>
            <div className="flex items-center gap-1 text-red-600 text-sm font-semibold">
              <TrendingDown className="w-4 h-4" />
              -5%
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Report Link */}
      <div className="mb-6">
        <button className="text-blue-500 hover:text-blue-600 font-semibold text-sm sm:text-base">
          View Revenue Report
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Search */}
          <div className="lg:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer, event, or order ID"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Event Type Filter */}
          <div className="relative">
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base bg-white appearance-none"
            >
              <option>All Event Types</option>
              <option>Wedding</option>
              <option>Birthday</option>
              <option>Corporate</option>
              <option>Anniversary</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base bg-white appearance-none"
            >
              <option>All Status</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm sm:text-base bg-white appearance-none"
            >
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
              <option>All Time</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <button className="text-blue-500 hover:text-blue-600 font-semibold text-sm">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">All Orders</h2>
          <p className="text-sm text-gray-600">Showing 1-7 of 15</p>
        </div>

        {/* Mobile View - Cards */}
        <div className="lg:hidden divide-y divide-gray-200">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={booking.customer.avatar}
                  alt={booking.customer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="text-sm font-semibold text-blue-600">{booking.id}</p>
                      <p className="text-sm font-semibold text-gray-900">{booking.customer.name}</p>
                      <p className="text-xs text-gray-600">{booking.customer.phone}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      booking.status === 'Confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status === 'Confirmed' ? '✓ Confirmed' : '● Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium mb-2">
                    {booking.eventType}
                  </span>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{booking.eventDate}</span>
                  </div>
                  <p className="text-xs text-gray-600">{booking.eventTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{booking.guests} Guests</p>
                  <p className="text-lg font-bold text-orange-500">{booking.amount}</p>
                  <p className="text-xs text-gray-600">Per Plate: {booking.perPlate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Order ID
                </th>
                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Customer
                </th>
                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Event Type
                </th>
                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Event Date
                </th>
                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Guests
                </th>
                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Amount
                </th>
                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <p className="text-sm font-semibold text-blue-600">{booking.id}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={booking.customer.avatar}
                        alt={booking.customer.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{booking.customer.name}</p>
                        <p className="text-xs text-gray-600 whitespace-nowrap">{booking.customer.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-medium ${
                      booking.eventType === 'Wedding'
                        ? 'bg-purple-100 text-purple-700'
                        : booking.eventType === 'Birthday'
                        ? 'bg-pink-100 text-pink-700'
                        : booking.eventType === 'Corporate'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {booking.eventType}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-900 whitespace-nowrap">{booking.eventDate}</p>
                        <p className="text-xs text-gray-600 whitespace-nowrap">{booking.eventTime}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <p className="text-sm font-semibold text-gray-900">{booking.guests}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-bold text-orange-500 whitespace-nowrap">{booking.amount}</p>
                      <p className="text-xs text-gray-600 whitespace-nowrap">Per Plate: {booking.perPlate}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${
                      booking.status === 'Confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status === 'Confirmed' ? '✓' : '●'} {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-orange-500 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
