import React, { useEffect, useState } from 'react';
import { loadBookings, saveBooking } from '@/lib/appStorage';
import { useNavigate } from 'react-router-dom';

export default function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(loadBookings());
  }, []);

  const updateStatus = (id, status) => {
    const next = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(next);
    const updated = next.find((b) => b.id === id);
    if (updated) saveBooking(updated);
  };

  const removeBooking = (id) => {
    // remove from localStorage
    window.localStorage.removeItem(`booking-${id}`);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="px-5 pt-6 pb-28">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Manage bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">View, update status, or remove bookings stored locally.</p>
        </div>
        <div>
          <button onClick={() => navigate('/admin')} className="rounded-3xl border border-border px-4 py-2">Back</button>
        </div>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="rounded-3xl bg-card border border-border p-6 text-center text-sm text-muted-foreground">No bookings found</div>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="rounded-3xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-foreground">{b.customer_name} — {b.driver_name}</div>
                  <div className="text-sm text-muted-foreground">{b.pickup_address} → {b.dropoff_address}</div>
                  <div className="mt-2 text-sm text-muted-foreground">R{b.estimated_cost} · Created {new Date(b.created_at).toLocaleString()}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)} className="rounded-2xl border border-border bg-background px-3 py-2 text-sm">
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="in_progress">in_progress</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => removeBooking(b.id)} className="rounded-2xl border border-red-300 px-3 py-2 text-sm text-red-600">Delete</button>
                    <button onClick={() => saveBooking(b)} className="rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground">Save</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
