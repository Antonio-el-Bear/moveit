import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Truck, Users, Calendar, Clock, Package, MessageSquare } from 'lucide-react';
import VehicleBadge from '@/components/moveit/VehicleBadge';
import DistanceMap from '@/components/moveit/DistanceMap';
import { loadSettings, saveBooking, applyDiscount } from '@/lib/appStorage';
import { getPayFastProcessUrl, buildPayFastPayload } from '@/lib/payfast';
import { calculateDistance, addressToCoords } from '@/lib/distance';

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
    location: { lat: -26.205, lon: 28.047 },
    bio: 'Fast and careful with every move.',
    has_helpers: true,
  },
  {
    id: 'd2',
    name: 'Lerato Nkosi',
    phone: '071 234 5678',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=faces&fit=crop&w=200&h=200',
    vehicle_type: 'single_cab',
    vehicle_description: 'Nissan NP200 2021 Silver',
    hourly_rate: 250,
    base_rate: 380,
    rating: 4.8,
    total_moves: 89,
    is_available: true,
    location_area: 'Sandton',
    location: { lat: -26.109, lon: 28.055 },
    bio: 'Reliable service with helpful staff.',
    has_helpers: false,
  },
  {
    id: 'd3',
    name: 'Sipho Dlamini',
    phone: '071 345 6789',
    photo_url: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?crop=faces&fit=crop&w=200&h=200',
    vehicle_type: '2_ton_truck',
    vehicle_description: 'Isuzu NQR 2018 Blue',
    hourly_rate: 520,
    base_rate: 620,
    rating: 4.7,
    total_moves: 76,
    is_available: false,
    location_area: 'Pretoria North',
    location: { lat: -25.736, lon: 28.243 },
    bio: 'Heavy duty moves handled with care.',
    has_helpers: true,
  },
];

const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function BookDriver() {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const driver = useMemo(() => driverSeed.find((item) => item.id === driverId), [driverId]);
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    pickup_address: '',
    dropoff_address: '',
    move_description: '',
    move_date: '',
    move_time: '',
    estimated_hours: 2,
    needs_helpers: false,
    offer_price: '',
    notes: '',
  });

  const settings = loadSettings();

  const suggestedOffer = useMemo(() => {
    if (!driver) return 0;
    return Math.max(driver.base_rate, driver.base_rate + driver.hourly_rate * 1 - 100);
  }, [driver]);

  const estimatedCost = useMemo(() => {
    if (!driver) return 0;
    return driver.base_rate + driver.hourly_rate * Math.max(0, form.estimated_hours - 1);
  }, [driver, form.estimated_hours]);

  const amountDue = useMemo(() => {
    return applyDiscount(Number(form.offer_price) || estimatedCost, settings.discountPercent);
  }, [form.offer_price, estimatedCost, settings.discountPercent]);

  const distance = useMemo(() => {
    if (!form.pickup_address || !driver?.location) return null;
    const pickupCoords = addressToCoords(form.pickup_address);
    return calculateDistance(driver.location.lat, driver.location.lon, pickupCoords.lat, pickupCoords.lon);
  }, [form.pickup_address, driver]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!driver) return;
    if (!form.customer_name || !form.customer_phone || !form.pickup_address || !form.dropoff_address || !form.move_date) {
      window.alert('Please fill in the required fields.');
      return;
    }

    if (!settings.appEnabled) {
      window.alert('Booking is currently disabled in admin settings. Please try again later.');
      return;
    }

    const booking = {
      id: `b-${Date.now()}`,
      driver_id: driver.id,
      driver_name: driver.name,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      pickup_address: form.pickup_address,
      dropoff_address: form.dropoff_address,
      move_description: form.move_description,
      move_date: form.move_date,
      move_time: form.move_time,
      estimated_hours: form.estimated_hours,
      estimated_cost: Number(form.offer_price) || estimatedCost,
      amount_due: amountDue,
      discount_percent: settings.discountPercent,
      payment_method: 'PayFast',
      payment_status: 'pending',
      status: 'pending',
      needs_helpers: form.needs_helpers,
      notes: form.notes,
      created_at: new Date().toISOString(),
      fixed_price: !!form.offer_price,
    };

    saveBooking(booking);

    const payload = buildPayFastPayload(settings.payfast, booking);
    const payFastForm = document.createElement('form');
    payFastForm.method = 'POST';
    payFastForm.action = getPayFastProcessUrl(settings.payfast.environment);
    payFastForm.target = '_blank';

    Object.entries(payload).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      payFastForm.appendChild(input);
    });

    document.body.appendChild(payFastForm);
    payFastForm.submit();
    document.body.removeChild(payFastForm);

    window.alert('Your booking is saved and a PayFast payment window has been opened.');
    navigate('/my-bookings');
  };

  if (!driver) {
    return (
      <div className="px-5 pt-6">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground mb-6 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="rounded-3xl bg-card border border-border p-8 text-center text-muted-foreground">Driver not found.</div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-10">
      <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground mb-6 inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="rounded-3xl bg-card border border-border p-5 shadow-soft mb-6">
        <div className="flex items-center gap-4">
          <img src={driver.photo_url} alt={driver.name} className="w-16 h-16 rounded-3xl object-cover" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">{driver.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{driver.vehicle_description}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">R{driver.base_rate}</p>
                <p className="text-[11px] text-muted-foreground">+ R{driver.hourly_rate}/hr</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <VehicleBadge type={driver.vehicle_type} />
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-primary text-primary" /> {driver.rating}
              </span>
            </div>
          </div>
        </div>
      </div>

      {form.pickup_address && (
        <div className="mb-6">
          <DistanceMap
            driverLocation={driver.location}
            pickupLocation={addressToCoords(form.pickup_address)}
            distance={distance}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl bg-card border border-border p-5 shadow-soft space-y-5">
          <h3 className="font-display text-lg font-semibold text-foreground">Booking details</h3>
          <div className="grid gap-4">
            <label className="space-y-2 text-sm">
              <span className="font-medium">Your name *</span>
              <input
                value={form.customer_name}
                onChange={(e) => setForm((prev) => ({ ...prev, customer_name: e.target.value }))}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
                placeholder="Full name"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Phone number *</span>
              <input
                value={form.customer_phone}
                onChange={(e) => setForm((prev) => ({ ...prev, customer_phone: e.target.value }))}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
                placeholder="071 234 5678"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Pickup address *</span>
              <input
                value={form.pickup_address}
                onChange={(e) => setForm((prev) => ({ ...prev, pickup_address: e.target.value }))}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
                placeholder="Where should the truck collect from?"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Drop-off address *</span>
              <input
                value={form.dropoff_address}
                onChange={(e) => setForm((prev) => ({ ...prev, dropoff_address: e.target.value }))}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
                placeholder="Where should the goods be delivered?"
              />
            </label>
          </div>
        </div>

        <div className="rounded-3xl bg-card border border-border p-5 shadow-soft space-y-5">
          <h3 className="font-display text-lg font-semibold text-foreground">Move info</h3>
          <div className="grid gap-4">
            <label className="space-y-2 text-sm">
              <span className="font-medium">What are you moving?</span>
              <textarea
                value={form.move_description}
                onChange={(e) => setForm((prev) => ({ ...prev, move_description: e.target.value }))}
                className="w-full min-h-[100px] rounded-3xl border border-border bg-background px-4 py-3 outline-none resize-none"
                placeholder="e.g. 2-seater couch, fridge, 5 boxes"
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-2 text-sm">
                <span className="font-medium">Date *</span>
                <input
                  type="date"
                  value={form.move_date}
                  onChange={(e) => setForm((prev) => ({ ...prev, move_date: e.target.value }))}
                  className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-medium">Time slot</span>
                <select
                  value={form.move_time}
                  onChange={(e) => setForm((prev) => ({ ...prev, move_time: e.target.value }))}
                  className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
                >
                  <option value="">Choose a time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-2 text-sm">
                <span className="font-medium">Estimated hours</span>
                <select
                  value={form.estimated_hours}
                  onChange={(e) => setForm((prev) => ({ ...prev, estimated_hours: Number(e.target.value) }))}
                  className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                    <option key={hours} value={hours}>{hours} hour{hours > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-medium">Offer a fixed price</span>
                <input
                  type="number"
                  value={form.offer_price}
                  onChange={(e) => setForm((prev) => ({ ...prev, offer_price: e.target.value }))}
                  className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
                  placeholder={`Suggested R${suggestedOffer}`}
                />
              </label>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-3xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">Normal cost</p>
                <p>R{estimatedCost}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Suggested lower offer</p>
                <p>R{suggestedOffer}</p>
              </div>
            </div>
            <label className="space-y-2 text-sm flex flex-col">
              <span className="font-medium">Additional notes</span>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full min-h-[90px] rounded-3xl border border-border bg-background px-4 py-3 outline-none resize-none"
                placeholder="Stairs, narrow access, fragile items..."
              />
            </label>
            <label className="inline-flex items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.needs_helpers}
                onChange={(e) => setForm((prev) => ({ ...prev, needs_helpers: e.target.checked }))}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              I need extra loading helpers
            </label>
          </div>
        </div>

        <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Base rate</span>
            <span>R{driver.base_rate}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
            <span>Hourly rate</span>
            <span>R{driver.hourly_rate} x {Math.max(0, form.estimated_hours - 1)} hrs</span>
          </div>
          <div className="my-3 h-px bg-border" />
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Estimated total</span>
            <span className="text-primary">R{estimatedCost}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">If you enter a fixed price, the driver will see your offer alongside the normal estimate.</p>
        </div>

        <div className="rounded-3xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">PayFast checkout</p>
          <p className="mt-2">You will be redirected to PayFast to complete payment for R{amountDue}. Use sandbox mode for testing or update the admin PayFast settings before checkout.</p>
        </div>
        <button type="submit" className="w-full rounded-3xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary/90">
          Pay with PayFast
        </button>
      </form>
    </div>
  );
}
