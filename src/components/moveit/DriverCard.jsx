import React from 'react';
import { Star, MapPin, Users } from 'lucide-react';
import VehicleBadge from './VehicleBadge';
import { Link } from 'react-router-dom';

export default function DriverCard({ driver }) {
  return (
    <div className="group bg-card rounded-3xl border border-border p-4 shadow-soft hover:shadow-xl transition-all duration-300">
      <div className="flex gap-4">
        <div className="relative shrink-0">
          <img
            src={driver.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face'}
            alt={driver.name}
            className="w-16 h-16 rounded-3xl object-cover"
          />
          {driver.is_available && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-semibold text-card-foreground truncate">{driver.name}</h3>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span>{driver.rating?.toFixed(1) || '—'}</span>
                <span className="text-xs">({driver.total_moves} moves)</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-display font-bold text-primary">R{driver.base_rate}</p>
              <p className="text-[11px] text-muted-foreground">base · R{driver.hourly_rate}/hr</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <VehicleBadge type={driver.vehicle_type} />
            {driver.has_helpers && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Users className="w-3 h-3" /> Helpers available
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{driver.location_area}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground truncate">{driver.vehicle_description}</p>
        <Link to={`/book/${driver.id}`} className="inline-flex">
          <button className="rounded-2xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
}
