import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import BookingCard from '@/components/moveit/BookingCard';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = Object.keys(window.localStorage)
      .filter((key) => key.startsWith('booking-'))
      .map((key) => JSON.parse(window.localStorage.getItem(key)));
    setBookings(stored);
  }, []);

  const active = useMemo(() => bookings.filter((booking) => ['pending', 'confirmed', 'in_progress'].includes(booking.status)), [bookings]);
  const past = useMemo(() => bookings.filter((booking) => ['completed', 'cancelled'].includes(booking.status)), [bookings]);

  return (
    <div className="px-5 pt-6 pb-28">
      <div className="mb-5">
        <h1 className="text-3xl font-display font-bold text-foreground">My bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your current and past moves.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-3xl bg-card border border-border p-10 text-center text-muted-foreground">
          <ClipboardList className="mx-auto mb-4 h-12 w-12" />
          <p className="font-semibold text-foreground">No bookings yet</p>
          <p className="mt-2 text-sm">Find a driver and book your first move.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">Active ({active.length})</h2>
            {active.length === 0 ? (
              <p className="rounded-3xl bg-card border border-border p-6 text-center text-sm text-muted-foreground">No active bookings</p>
            ) : (
              <div className="space-y-4">{active.map((booking) => <BookingCard key={booking.id} booking={booking} />)}</div>
            )}
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">Past ({past.length})</h2>
            {past.length === 0 ? (
              <p className="rounded-3xl bg-card border border-border p-6 text-center text-sm text-muted-foreground">No past bookings</p>
            ) : (
              <div className="space-y-4">{past.map((booking) => <BookingCard key={booking.id} booking={booking} />)}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
