import React from 'react';

const statusConfig = {
  pending: { label: 'Pending', classes: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', classes: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'In Progress', classes: 'bg-primary/15 text-primary' },
  completed: { label: 'Completed', classes: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-100 text-red-800' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.classes}`}>
      {config.label}
    </span>
  );
}
