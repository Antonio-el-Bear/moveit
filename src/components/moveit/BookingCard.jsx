import React from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function BookingCard({ booking }) {
  const formattedDate = booking.move_date ? format(new Date(booking.move_date), 'dd MMM yyyy') : '—';

  return (
    <Link to={`/booking/${booking.id}`} className="block">
      <div className="bg-card rounded-3xl border border-border p-4 shadow-soft hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-base font-semibold text-card-foreground truncate">{booking.driver_name || 'Driver'}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
              {booking.move_time && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {booking.move_time}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <span className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0" />
            <p className="truncate">{booking.pickup_address}</p>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
            <p className="truncate">{booking.dropoff_address}</p>
          </div>
        </div>

        {booking.estimated_cost && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground truncate">{booking.move_description?.substring(0, 40) || 'Move details'}</span>
            <span className="font-display font-bold text-primary">R{booking.estimated_cost}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
