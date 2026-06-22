import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveBooking, loadBooking } from '@/lib/appStorage';

function parseQuery(qs) {
  const p = {};
  const params = new URLSearchParams(qs);
  for (const [k, v] of params.entries()) p[k] = v;
  return p;
}

export default function PayFastReturn() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Processing payment result...');

  useEffect(() => {
    const params = parseQuery(window.location.search);
    // PayFast usually returns m_payment_id (our booking id) and payment_status
    const bookingId = params.m_payment_id || params['m_payment_id'];
    const paymentStatus = params.payment_status || params['payment_status'] || params.payment_status || params.status || null;

    if (!bookingId) {
      setMessage('Missing booking id in return parameters.');
      return;
    }

    const booking = loadBooking(bookingId);
    if (!booking) {
      setMessage(`Booking ${bookingId} not found.`);
      return;
    }

    // Map common PayFast statuses to our payment_status and booking status
    let newPaymentStatus = booking.payment_status || 'pending';
    let newBookingStatus = booking.status || 'pending';
    if (paymentStatus) {
      const ps = paymentStatus.toLowerCase();
      if (ps.includes('complete') || ps.includes('complete')) {
        newPaymentStatus = 'paid';
        if (booking.status === 'pending') newBookingStatus = 'confirmed';
      } else if (ps.includes('failed') || ps.includes('cancel')) {
        newPaymentStatus = 'failed';
        newBookingStatus = 'pending';
      } else {
        newPaymentStatus = paymentStatus;
      }
    }

    const updated = { ...booking, payment_status: newPaymentStatus, status: newBookingStatus };
    saveBooking(updated);

    setMessage(`Payment status: ${newPaymentStatus}. Booking ${updated.id} updated.`);

    // After short delay navigate to booking detail or my-bookings
    setTimeout(() => {
      navigate(`/booking/${bookingId}`);
    }, 1800);
  }, [navigate]);

  return (
    <div className="px-5 pt-6 pb-28">
      <div className="rounded-3xl bg-card border border-border p-8 text-center">
        <h1 className="text-xl font-semibold text-foreground">PayFast result</h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
