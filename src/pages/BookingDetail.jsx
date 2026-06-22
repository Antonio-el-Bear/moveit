import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Package, Users, MessageSquare, Phone, Star } from 'lucide-react';
import StatusBadge from '@/components/moveit/StatusBadge';
import VehicleBadge from '@/components/moveit/VehicleBadge';

export default function BookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(`booking-${bookingId}`);
    if (stored) setBooking(JSON.parse(stored));
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="px-5 pt-6">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground mb-6 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="rounded-3xl bg-card border border-border p-8 text-center text-muted-foreground">Booking not found.</div>
      </div>
    );
  }

  const handleStatusUpdate = (status) => {
    const updated = { ...booking, status };
    setBooking(updated);
    window.localStorage.setItem(`booking-${booking.id}`, JSON.stringify(updated));
  };

  return (
    <div className="px-5 pt-6 pb-28 space-y-6">
      <button onClick={() => navigate('/my-bookings')} className="text-sm text-muted-foreground inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> My bookings
      </button>
      <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Booking details</h1>
            <p className="text-sm text-muted-foreground mt-1">Status: <span className="font-semibold text-foreground">{booking.status.replace('_', ' ')}</span></p>
          </div>
          <StatusBadge status={booking.status} />
        </div>
        <div className="mt-6 space-y-4">
          <div className="rounded-3xl border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">{booking.driver_name[0]}</div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{booking.driver_name}</p>
                <VehicleBadge type={booking.vehicle_type || 'bakkie'} />
              </div>
              <a href={`tel:${booking.customer_phone}`} className="ml-auto rounded-3xl border border-border px-4 py-3 text-sm text-muted-foreground hover:bg-card">
                <Phone className="inline-block w-4 h-4 mr-2" /> Call
              </a>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-border p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2.5 h-2.5 rounded-full bg-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Pickup</p>
                <p className="text-sm font-medium text-foreground">{booking.pickup_address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2.5 h-2.5 rounded-full bg-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Drop-off</p>
                <p className="text-sm font-medium text-foreground">{booking.dropoff_address}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {booking.move_date}
              </div>
              <div className="inline-flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {booking.move_time || '—'}
              </div>
            </div>
            {booking.move_description && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4 mt-1" />
                <span>{booking.move_description}</span>
              </div>
            )}
            {booking.notes && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4 mt-1" />
                <span>{booking.notes}</span>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-border p-4 bg-card">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Estimated cost</span>
              <span className="font-semibold text-foreground">R{booking.estimated_cost}</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{booking.fixed_price ? 'Fixed offer submitted' : 'Standard estimate'}</div>
          </div>

          {booking.status === 'pending' && (
            <button
              onClick={() => handleStatusUpdate('cancelled')}
              className="w-full rounded-3xl bg-red-500 py-4 text-sm font-semibold text-white shadow-soft hover:bg-red-600"
            >
              Cancel booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
