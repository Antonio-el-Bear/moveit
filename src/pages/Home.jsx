import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Truck } from 'lucide-react';
import DriverCard from '@/components/moveit/DriverCard';

const driverSeed = [
  {
    id: 'd1',
    name: 'Thabo Molefe',
    phone: '071 123 4567',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=faces&fit=crop&w=200&h=200',
    vehicle_type: 'bakkie',
    vehicle_description: 'Toyota Hilux 2019 White',
    vehicle_photo_url: '',
    hourly_rate: 280,
    base_rate: 420,
    rating: 4.9,
    total_moves: 124,
    is_available: true,
    location_area: 'Johannesburg CBD',
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
    vehicle_photo_url: '',
    hourly_rate: 250,
    base_rate: 380,
    rating: 4.8,
    total_moves: 89,
    is_available: true,
    location_area: 'Sandton',
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
    vehicle_photo_url: '',
    hourly_rate: 520,
    base_rate: 620,
    rating: 4.7,
    total_moves: 76,
    is_available: false,
    location_area: 'Pretoria North',
    bio: 'Heavy duty moves handled with care.',
    has_helpers: true,
  },
];

const vehicleFilters = [
  { value: 'all', label: 'All Vehicles' },
  { value: 'bakkie', label: 'Bakkie' },
  { value: 'single_cab', label: 'Single Cab' },
  { value: 'double_cab', label: 'Double Cab' },
  { value: '1_ton_truck', label: '1 Ton Truck' },
  { value: '2_ton_truck', label: '2 Ton Truck' },
  { value: '4_ton_truck', label: '4 Ton Truck' },
  { value: '8_ton_truck', label: '8 Ton Truck' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('all');

  const drivers = useMemo(() => {
    return driverSeed.filter((driver) => {
      const matchesSearch =
        !search ||
        driver.name.toLowerCase().includes(search.toLowerCase()) ||
        driver.location_area.toLowerCase().includes(search.toLowerCase());
      const matchesVehicle = vehicleFilter === 'all' || driver.vehicle_type === vehicleFilter;
      return matchesSearch && matchesVehicle;
    });
  }, [search, vehicleFilter]);

  return (
    <div className="px-5 pt-6 pb-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-11 h-11 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground shadow-soft">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">MoveIt</h1>
            <p className="text-sm text-muted-foreground mt-1">Book trucks and bakkies for your next move.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or area"
            className="w-full rounded-3xl border border-border bg-card px-12 py-3 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {vehicleFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setVehicleFilter(filter.value)}
              className={`rounded-3xl px-4 py-3 text-xs font-semibold transition ${
                vehicleFilter === filter.value ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {drivers.length ? (
          drivers.map((driver) => <DriverCard key={driver.id} driver={driver} />)
        ) : (
          <div className="rounded-3xl bg-card border border-border p-8 text-center text-muted-foreground">
            No drivers match your search.
          </div>
        )}
      </div>
    </div>
  );
}
