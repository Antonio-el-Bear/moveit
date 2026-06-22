import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Truck, Search, ClipboardList, User, Shield } from 'lucide-react';

const navItems = [
  { path: '/', icon: Search, label: 'Find' },
  { path: '/my-bookings', icon: ClipboardList, label: 'Bookings' },
  { path: '/driver-dashboard', icon: Truck, label: 'Drive' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="max-w-lg mx-auto flex items-center justify-around py-3 px-4">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
