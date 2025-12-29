"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, Package, 
  Calendar, MapPin, User, Building2, 
  Clock, CheckCircle, X, AlertCircle, Phone, MessageCircle, Info
} from 'lucide-react';
import { getAllOrders, Order, OrderSummary, Pagination } from '@/api/superadmin/orders.api';

interface TotalOrdersManagementProps {
  isAdminPanel?: boolean;
}

export default function TotalOrdersManagement({ isAdminPanel = false }: TotalOrdersManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders data
  useEffect(() => {
    fetchOrders();
  }, [statusFilter, eventTypeFilter, dateRangeFilter, sortBy, currentPage]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchOrders();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllOrders({
        page: currentPage,
        limit: 10,
        status: statusFilter || undefined,
        eventType: eventTypeFilter || undefined,
        dateRange: dateRangeFilter || undefined,
        search: searchTerm || undefined,
        sortBy: sortBy,
      });

      if (response.success) {
        setOrders(response.data.orders);
        setSummary(response.data.summary);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string | null | undefined) => {
    // Handle null or undefined
    if (!timeString) return 'N/A';
    
    // Handle ISO date strings
    if (timeString.includes('T')) {
      return new Date(timeString).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    // Handle HH:mm format
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'converted': return 'bg-green-100 text-green-800';
      case 'confirmed':
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'converted': return <CheckCircle className="w-4 h-4" />;
      case 'confirmed':
      case 'contacted': return <Package className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled':
      case 'rejected': return <X className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading && !orders.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Order Details Modal Component
  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${detailsModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailsModalOpen(false)} />
        
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className={`bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
            detailsModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{selectedOrder.orderId}</h2>
                <p className="text-orange-100 text-sm mt-1">Order Details</p>
              </div>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</label>
                    <p className="text-gray-900 font-medium mt-1">{selectedOrder.customer.name}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</label>
                    <p className="text-gray-900 font-medium mt-1">{selectedOrder.customer.email}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</label>
                    <p className="text-gray-900 font-medium mt-1">{selectedOrder.customer.phone}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</label>
                    <p className="text-gray-900 font-medium mt-1 capitalize">{selectedOrder.status}</p>
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-orange-500" />
                  Vendor Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</label>
                    <p className="text-gray-900 font-medium mt-1">{selectedOrder.vendor.name}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Business Type</label>
                    <p className="text-gray-900 font-medium mt-1">{selectedOrder.vendor.businessName || 'N/A'}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Business Name</label>
                    <p className="text-gray-900 font-medium mt-1">{selectedOrder.vendor.businessName || 'N/A'}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</label>
                    <p className="text-gray-900 font-medium mt-1 text-sm">{selectedOrder.vendor.email}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Viewed Status
                    </label>
                    <p className="text-gray-900 font-medium mt-1">
                      {selectedOrder.viewedByVendor ? (
                        <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Viewed</span>
                      ) : (
                        <span className="text-gray-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Not Viewed</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-500" />
                  Order Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Date</label>
                    <p className="text-gray-900 font-medium mt-1">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Time</label>
                    <p className="text-gray-900 font-medium mt-1">{formatTime(selectedOrder.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Event Information */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  Event Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Event Type</label>
                    <p className="text-gray-900 font-medium mt-1 capitalize">{selectedOrder.eventType}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Event Date</label>
                    <p className="text-gray-900 font-medium mt-1">{selectedOrder.eventDate}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Event Time</label>
                    <p className="text-gray-900 font-medium mt-1">{selectedOrder.eventTime}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Number of Guests</label>
                    <p className="text-gray-900 font-medium mt-1">{selectedOrder.guests} Guests</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Food Preference</label>
                    <p className="text-gray-900 font-medium mt-1 capitalize">
                      <span className={`inline-block px-3 py-1 rounded text-sm ${
                        selectedOrder.foodPreference === 'veg' 
                          ? 'bg-green-100 text-green-700' 
                          : selectedOrder.foodPreference === 'non-veg'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {selectedOrder.foodPreference === 'veg' ? '🌱 Veg' : selectedOrder.foodPreference === 'non-veg' ? '🍖 Non-Veg' : '🍽️ Both'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Location */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  Event Location
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</label>
                    <p className="text-gray-900 font-medium mt-1">{selectedOrder.eventLocation.address}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">City</label>
                      <p className="text-gray-900 font-medium mt-1">{selectedOrder.eventLocation.city}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">State</label>
                      <p className="text-gray-900 font-medium mt-1">{selectedOrder.eventLocation.state}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Pincode</label>
                      <p className="text-gray-900 font-medium mt-1">{selectedOrder.eventLocation.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Details */}
              {!isAdminPanel && (
                <div className="border-b pb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-500" />
                    Amount Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</label>
                      <p className="text-gray-900 font-bold text-lg mt-1">{formatAmount(selectedOrder.amount.total)}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Per Plate</label>
                      <p className="text-gray-900 font-bold text-lg mt-1">{formatAmount(selectedOrder.amount.perPlate)}</p>
                    </div>
                    {selectedOrder.amount.breakdown && (
                      <>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Veg</label>
                          <p className="text-gray-900 font-bold text-lg mt-1">{formatAmount(selectedOrder.amount.breakdown.veg)}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Non-Veg</label>
                          <p className="text-gray-900 font-bold text-lg mt-1">{formatAmount(selectedOrder.amount.breakdown.nonVeg)}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Message */}
              {selectedOrder.message && (
                <div className="border-b pb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-orange-500" />
                    Customer Message
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-gray-900">{selectedOrder.message}</p>
                  </div>
                </div>
              )}

              {/* Vendor Response */}
              {selectedOrder.vendorResponse && (
                <div className="pb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-red-500" />
                    Vendor Response
                  </h3>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-gray-900">{selectedOrder.vendorResponse.message}</p>
                    <p className="text-xs text-gray-600 mt-2">
                      Responded on: {formatDate(selectedOrder.vendorResponse.respondedAt)} at {formatTime(selectedOrder.vendorResponse.respondedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="sticky bottom-0 bg-gray-50 border-t p-6 flex justify-end">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* Order Details Modal */}
      <OrderDetailsModal />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Total Orders Management</h2>
          <p className="text-gray-600 mt-1">Monitor and manage all platform orders</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-64"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Events</option>
            <option value="wedding">Wedding</option>
            <option value="engagement">Engagement</option>
            <option value="reception">Reception</option>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="corporate">Corporate</option>
            <option value="conference">Conference</option>
            <option value="seminar">Seminar</option>
            <option value="product_launch">Product Launch</option>
            <option value="team_building">Team Building</option>
            <option value="festival">Festival</option>
            <option value="religious">Religious</option>
            <option value="farewell">Farewell</option>
            <option value="reunion">Reunion</option>
            <option value="other">Other</option>
          </select>

          <select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_90_days">Last 90 Days</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="createdAt">Latest First</option>
            <option value="-createdAt">Oldest First</option>
            <option value="amount">Amount: Low to High</option>
            <option value="-amount">Amount: High to Low</option>
            <option value="eventDate">Event Date</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900">{summary.totalOrders.toLocaleString()}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{summary.pending.toLocaleString()}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Contacted</p>
                <p className="text-2xl font-bold text-blue-900">{summary.contacted.toLocaleString()}</p>
              </div>
              <Phone className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Converted</p>
                <p className="text-2xl font-bold text-green-900">{summary.converted.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-900">{summary.rejected.toLocaleString()}</p>
              </div>
              <X className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{summary.cancelled.toLocaleString()}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[220px]">Order Details</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[280px]">Customer & Vendor</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[250px]">Event Info</th>
              {!isAdminPanel && (
                <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[200px]">Amount & Status</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={isAdminPanel ? 3 : 4} className="py-12 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => {
                  setSelectedOrder(order);
                  setDetailsModalOpen(true);
                }}>
                  <td className="py-5 px-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-orange-600 text-sm hover:underline">{order.orderId}</h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">Ordered: {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">Event: {order.eventDate} at {order.eventTime}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-5 px-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-medium text-gray-900 truncate">{order.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{order.customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600 truncate font-medium">{order.vendor.businessName || order.vendor.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600 truncate">
                          {order.eventLocation.city}, {order.eventLocation.state}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-5 px-6">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-900 capitalize">{order.eventType}</p>
                      <p className="text-xs text-gray-600">{order.guests} Guests</p>
                      <span className={`inline-block text-xs px-2 py-1 rounded ${
                        order.foodPreference === 'veg' 
                          ? 'bg-green-100 text-green-700' 
                          : order.foodPreference === 'non-veg'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {order.foodPreference === 'veg' ? '🌱 Veg' : order.foodPreference === 'non-veg' ? '🍖 Non-Veg' : '🍽️ Both'}
                      </span>
                      {order.viewedByVendor && (
                        <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit">
                          <Eye className="w-3 h-3" />
                          <span>Viewed</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {!isAdminPanel && (
                    <td className="py-5 px-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{formatAmount(order.amount.total)}</p>
                          <p className="text-xs text-gray-500">{formatAmount(order.amount.perPlate)}/plate</p>
                          {order.amount.breakdown && (
                            <div className="text-xs text-gray-500 mt-1">
                              {order.amount.breakdown.veg > 0 && <span>Veg: {formatAmount(order.amount.breakdown.veg)}<br /></span>}
                              {order.amount.breakdown.nonVeg > 0 && <span>Non-Veg: {formatAmount(order.amount.breakdown.nonVeg)}</span>}
                            </div>
                          )}
                        </div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {pagination.showing}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current page
              if (
                page === 1 ||
                page === pagination.pages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentPage === page
                        ? 'bg-orange-500 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return <span key={page} className="px-2 text-gray-400">...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.pages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
