import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/moveit/AppLayout';
import Home from '@/pages/Home';
import BookDriver from '@/pages/BookDriver';
import MyBookings from '@/pages/MyBookings';
import BookingDetail from '@/pages/BookingDetail';
import DriverDashboard from '@/pages/DriverDashboard';
import Profile from '@/pages/Profile';
import AdminPanel from '@/pages/AdminPanel';
import AdminLogin from '@/pages/AdminLogin';
import PayFastReturn from '@/pages/PayFastReturn';
import AdminBookings from '@/pages/AdminBookings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="book/:driverId" element={<BookDriver />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="booking/:bookingId" element={<BookingDetail />} />
        <Route path="driver-dashboard" element={<DriverDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="admin/bookings" element={<AdminBookings />} />
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="payfast/return" element={<PayFastReturn />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
