import React from 'react';
import { Truck } from 'lucide-react';

const vehicleLabels = {
  bakkie: 'Bakkie',
  single_cab: 'Single Cab',
  double_cab: 'Double Cab',
  '1_ton_truck': '1 Ton Truck',
  '2_ton_truck': '2 Ton Truck',
  '4_ton_truck': '4 Ton Truck',
  '8_ton_truck': '8 Ton Truck',
};

export function getVehicleLabel(type) {
  return vehicleLabels[type] || type;
}

export default function VehicleBadge({ type, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground ${className}`}>
      <Truck className="w-3 h-3" />
      {getVehicleLabel(type)}
    </span>
  );
}
