import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminInsights = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/admin/dashboard');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-700 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">FixItNow Admin</h1>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="hover:bg-blue-600 px-4 py-2 rounded transition"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="hover:bg-red-600 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600 text-lg">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-700 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">FixItNow Admin</h1>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="hover:bg-blue-600 px-4 py-2 rounded transition"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="hover:bg-red-600 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600 text-lg">No analytics data available</div>
        </div>
      </div>
    );
  }

  const maxBookings = Math.max(...(analytics.topServices || []).map(s => s.bookingCount || 0), 1);
  const maxProviderBookings = Math.max(...(analytics.topProviders || []).map(p => p.bookingCount || 0), 1);
  const maxLocationBookings = Math.max(...(analytics.locationTrends || []).map(l => l.bookingCount || 0), 1);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FixItNow Admin</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="hover:bg-blue-600 px-4 py-2 rounded transition"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">📊 Analytics Dashboard</h2>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm uppercase font-semibold">Total Bookings</div>
            <div className="text-4xl font-bold text-blue-600 mt-2">
              {analytics.metrics?.totalBookings || 0}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm uppercase font-semibold">Total Revenue</div>
            <div className="text-4xl font-bold text-green-600 mt-2">
              ₹{(analytics.metrics?.totalRevenue || 0).toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm uppercase font-semibold">Active Services</div>
            <div className="text-4xl font-bold text-purple-600 mt-2">
              {analytics.metrics?.activeServices || 0}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm uppercase font-semibold">Avg Rating</div>
            <div className="text-4xl font-bold text-yellow-600 mt-2">
              {analytics.metrics?.avgRating ? analytics.metrics.avgRating.toFixed(2) : 'N/A'} ★
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">🏆 Most Booked Services</h3>
          <div className="space-y-4">
            {(analytics.topServices || []).map((service, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700 truncate">
                  {service.title}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-blue-500 h-full flex items-center justify-end pr-3 transition-all"
                    style={{ width: `${(service.bookingCount / maxBookings) * 100}%` }}
                  >
                    {service.bookingCount > 0 && (
                      <span className="text-white text-sm font-semibold">{service.bookingCount}</span>
                    )}
                  </div>
                </div>
                <div className="w-12 text-right text-sm text-gray-600">{service.bookingCount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Providers */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">⭐ Top Providers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Provider</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bookings</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {(analytics.topProviders || []).map((provider, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800 font-medium">{provider.name}</td>
                    <td className="py-3 px-4">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {provider.avgRating.toFixed(2)} ★
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{provider.bookingCount}</td>
                    <td className="py-3 px-4 text-green-600 font-bold">
                      ₹{provider.totalEarnings.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Location Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">📍 Location Trends</h3>
          <div className="space-y-4">
            {(analytics.locationTrends || []).map((location, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700 truncate">
                  {location.location}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-green-500 h-full flex items-center justify-end pr-3 transition-all"
                    style={{ width: `${(location.bookingCount / maxLocationBookings) * 100}%` }}
                  >
                    {location.bookingCount > 0 && (
                      <span className="text-white text-sm font-semibold">{location.bookingCount}</span>
                    )}
                  </div>
                </div>
                <div className="w-12 text-right text-sm text-gray-600">{location.bookingCount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInsights;
