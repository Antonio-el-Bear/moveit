import React, { useEffect, useState } from 'react';
import { Shield, Zap, Save, CheckCircle, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadSettings, saveSettings, loadBookings, applyDiscount } from '@/lib/appStorage';

export default function AdminPanel() {
  const [settings, setSettings] = useState(loadSettings());
  const [saved, setSaved] = useState(false);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // protect admin panel behind session flag
    const auth = sessionStorage.getItem('moveit-admin-auth');
    if (!auth) {
      navigate('/admin/login');
      return;
    }
    setBookings(loadBookings());
  }, []);

  const activeCount = bookings.filter((booking) => ['pending', 'confirmed', 'in_progress'].includes(booking.status)).length;
  const completedCount = bookings.filter((booking) => booking.status === 'completed').length;
  const cancelledCount = bookings.filter((booking) => booking.status === 'cancelled').length;

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handlePayFastChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      payfast: {
        ...prev.payfast,
        [field]: value,
      },
    }));
  };

  const handleAdminPass = (value) => {
    setSettings((prev) => ({ ...prev, admin_passphrase: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    saveSettings(settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const goToBookings = () => {
    navigate('/admin/bookings');
  };

  return (
    <div className="px-5 pt-6 pb-28 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Shield className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Admin panel</h1>
          <p className="text-sm text-muted-foreground mt-1">Control app access, discounts, and PayFast sandbox settings.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <p className="text-sm text-muted-foreground">App status</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{settings.appEnabled ? 'Enabled' : 'Disabled'}</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <p className="text-sm text-muted-foreground">Discount</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{settings.discountPercent}%</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <p className="text-sm text-muted-foreground">Pending moves</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{activeCount}</p>
          <p className="text-xs text-muted-foreground mt-2">Completed {completedCount} · Cancelled {cancelledCount}</p>
          <button onClick={goToBookings} className="mt-3 w-full rounded-2xl border border-border px-3 py-2 text-sm">Manage bookings</button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 rounded-3xl border border-border bg-card p-5 shadow-soft">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">App controls</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium">App enabled</span>
              <select
                value={settings.appEnabled ? 'enabled' : 'disabled'}
                onChange={(e) => handleChange('appEnabled', e.target.value === 'enabled')}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Default discount</span>
              <input
                type="number"
                value={settings.discountPercent}
                onChange={(e) => handleChange('discountPercent', Math.max(0, Math.min(100, Number(e.target.value))))}
                min="0"
                max="100"
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
                placeholder="0"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Settings2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">PayFast sandbox</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium">Environment</span>
              <select
                value={settings.payfast.environment}
                onChange={(e) => handlePayFastChange('environment', e.target.value)}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
              >
                <option value="sandbox">Sandbox</option>
                <option value="live">Live</option>
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Merchant ID</span>
              <input
                value={settings.payfast.merchant_id}
                onChange={(e) => handlePayFastChange('merchant_id', e.target.value)}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
                placeholder="Merchant ID"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Merchant key</span>
              <input
                value={settings.payfast.merchant_key}
                onChange={(e) => handlePayFastChange('merchant_key', e.target.value)}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
                placeholder="Merchant key"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Return URL</span>
              <input
                value={settings.payfast.return_url}
                onChange={(e) => handlePayFastChange('return_url', e.target.value)}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Cancel URL</span>
              <input
                value={settings.payfast.cancel_url}
                onChange={(e) => handlePayFastChange('cancel_url', e.target.value)}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Notify URL</span>
              <input
                value={settings.payfast.notify_url}
                onChange={(e) => handlePayFastChange('notify_url', e.target.value)}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Admin passphrase</span>
              <input
                value={settings.admin_passphrase}
                onChange={(e) => handleAdminPass(e.target.value)}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
                placeholder="Set admin passphrase"
              />
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          <div className="font-medium text-foreground">Sandbox note</div>
          <p className="mt-2">Bookings using PayFast will use the current sandbox settings. For a real deployment, replace sandbox credentials with live merchant values and handle PayFast notifications on a backend server.</p>
        </div>

        <button type="submit" className="w-full rounded-3xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-soft">
          Save admin settings
        </button>

        {saved && (
          <div className="rounded-3xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">Settings saved.</div>
        )}
      </form>
    </div>
  );
}
