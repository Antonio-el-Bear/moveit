import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto pb-28">
        <Outlet />
      </div>
      <Navbar />
    </div>
  );
}
