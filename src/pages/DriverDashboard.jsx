import React, { useEffect, useMemo, useState } from 'react';
import { Truck, Plus, ToggleRight, ToggleLeft, CheckCircle, XCircle, Clock, Star } from 'lucide-react';
import { loadBookings, saveBooking } from '@/lib/appStorage';

const driverSeed = [
  {
    id: 'd1',
    name: 'Thabo Molefe',
    phone: '071 123 4567',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=faces&fit=crop&w=200&h=200',
    vehicle_type: 'bakkie',
    vehicle_description: 'Toyota Hilux 2019 White',
    hourly_rate: 280,
    base_rate: 420,
    rating: 4.9,
    total_moves: 124,
    is_available: true,
    location_area: 'Johannesburg CBD',
    bio: 'Fast and careful with every move.',
    has_helpers: true,
  },
];

export default function DriverDashboard() {
  const [driver, setDriver] = useState(driverSeed[0]);
  const [showRegister, setShowRegister] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    vehicle_type: 'bakkie',
    vehicle_description: '',
    hourly_rate: 250,
    base_rate: 350,
    location_area: '',
    bio: '',
    has_helpers: false,
  });

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(loadBookings());
  }, []);

  const active = useMemo(() => bookings.filter((booking) => ['confirmed', 'in_progress'].includes(booking.status)), [bookings]);
  const pending = useMemo(() => bookings.filter((booking) => booking.status === 'pending'), [bookings]);
  const completed = useMemo(() => bookings.filter((booking) => booking.status === 'completed'), [bookings]);

  const toggleAvailability = () => setDriver((prev) => ({ ...prev, is_available: !prev.is_available }));

  const updateBookingStatus = (id, status) => {
    setBookings((prev) => {
      const next = prev.map((booking) => (booking.id === id ? { ...booking, status } : booking));
      const updated = next.find((booking) => booking.id === id);
      if (updated) saveBooking(updated);
      return next;
    });
  };

  const handleRegister = () => {
    if (!form.name || !form.phone) {
      window.alert('Please fill in your name and phone number.');
      return;
    }

    setDriver({
      ...driver,
      ...form,
      id: 'd-new',
      rating: 5.0,
      total_moves: 0,
      is_available: true,
    });
    setShowRegister(false);
  };

  return (
    <div className="px-5 pt-6 pb-28 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Driver dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your profile and booking requests.</p>
        </div>
        <button
          onClick={() => setShowRegister((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
        >
          <Plus className="w-4 h-4" /> {showRegister ? 'Close' : 'Register'}
        </button>
      </div>

      {showRegister && (
        <div className="rounded-3xl bg-card border border-border p-5 shadow-soft space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Register your vehicle</h2>
          <div className="grid gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Full name"
              className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
            />
            <input
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone number"
              className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
            />
            <input
              value={form.vehicle_description}
              onChange={(e) => setForm((prev) => ({ ...prev, vehicle_description: e.target.value }))}
              placeholder="Vehicle description"
              className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="number"
                value={form.base_rate}
                onChange={(e) => setForm((prev) => ({ ...prev, base_rate: Number(e.target.value) }))}
                placeholder="Base rate"
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
              />
              <input
                type="number"
                value={form.hourly_rate}
                onChange={(e) => setForm((prev) => ({ ...prev, hourly_rate: Number(e.target.value) }))}
                placeholder="Hourly rate"
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
              />
            </div>
            <input
              value={form.location_area}
              onChange={(e) => setForm((prev) => ({ ...prev, location_area: e.target.value }))}
              placeholder="Operation area"
              className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
            />
            <textarea
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
              placeholder="About your service"
              className="w-full min-h-[100px] rounded-3xl border border-border bg-background px-4 py-3 outline-none resize-none"
            />
            <label className="inline-flex items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.has_helpers}
                onChange={(e) => setForm((prev) => ({ ...prev, has_helpers: e.target.checked }))}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              Can provide helpers?
            </label>
            <button
              onClick={handleRegister}
              className="w-full rounded-3xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              Save profile
            </button>
          </div>
        </div>
      )}

      <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">{driver.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{driver.vehicle_description}</p>
          </div>
          <button onClick={toggleAvailability} className="inline-flex items-center gap-2 rounded-3xl border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/50">
            {driver.is_available ? <><ToggleRight className="w-5 h-5 text-green-600" /> Online</> : <><ToggleLeft className="w-5 h-5 text-muted-foreground" /> Offline</>}
          </button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-border bg-muted/50 p-4 text-center">
            <p className="text-2xl font-display font-bold text-foreground">{driver.total_moves}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">Moves</p>
          </div>
          <div className="rounded-3xl border border-border bg-muted/50 p-4 text-center">
            <p className="text-2xl font-display font-bold text-primary">{driver.rating?.toFixed(1)}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">Rating</p>
          </div>
          <div className="rounded-3xl border border-border bg-muted/50 p-4 text-center">
            <p className="text-2xl font-display font-bold text-foreground">R{driver.hourly_rate}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">Hourly</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Incoming requests</h2>
          {!pending.length ? (
            <div className="rounded-3xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">No new requests yet.</div>
          ) : (
            <div className="space-y-4">
              {pending.map((booking) => (
                <div key={booking.id} className="rounded-3xl border border-border p-4 bg-card">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{booking.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{booking.pickup_address} → {booking.dropoff_address}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">R{booking.estimated_cost}</span>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => updateBookingStatus(booking.id, 'confirmed')} className="flex-1 rounded-3xl bg-primary py-3 text-sm font-semibold text-primary-foreground">Accept</button>
                    <button onClick={() => updateBookingStatus(booking.id, 'cancelled')} className="flex-1 rounded-3xl border border-border py-3 text-sm font-semibold text-foreground">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Active moves</h2>
          {!active.length ? (
            <div className="rounded-3xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">No active moves.</div>
          ) : (
            <div className="space-y-4">
              {active.map((booking) => (
                <div key={booking.id} className="rounded-3xl border border-border p-4 bg-card">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{booking.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{booking.pickup_address} → {booking.dropoff_address}</p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="mt-4 flex gap-3">
                    {booking.status === 'confirmed' ? (
                      <button onClick={() => updateBookingStatus(booking.id, 'in_progress')} className="flex-1 rounded-3xl bg-primary py-3 text-sm font-semibold text-primary-foreground">Start move</button>
                    ) : (
                      <button onClick={() => updateBookingStatus(booking.id, 'completed')} className="flex-1 rounded-3xl bg-green-500 py-3 text-sm font-semibold text-white">Complete move</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Completed moves</h2>
          {!completed.length ? (
            <div className="rounded-3xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">No completed moves yet.</div>
          ) : (
            <div className="space-y-4">
              {completed.map((booking) => (
                <div key={booking.id} className="rounded-3xl border border-border p-4 bg-card flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{booking.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{booking.move_date}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>R{booking.estimated_cost}</p>
                    {booking.rating && <p className="inline-flex items-center gap-1"><Star className="w-4 h-4 fill-primary text-primary" />{booking.rating}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
