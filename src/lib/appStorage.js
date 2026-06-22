const STORAGE_KEY_SETTINGS = 'moveit-settings';

const defaultSettings = () => ({
  appEnabled: true,
  discountPercent: 0,
  payfast: {
    environment: 'sandbox',
    merchant_id: '10000100',
    merchant_key: '46f0cd694581a',
    return_url: `${window.location.origin}/payfast/return`,
    cancel_url: `${window.location.origin}/`,
    notify_url: `${window.location.origin}/api/payfast/notify`,
  },
  admin_passphrase: 'admin',
});

export function loadSettings() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!stored) return defaultSettings();
    return { ...defaultSettings(), ...JSON.parse(stored) };
  } catch (error) {
    return defaultSettings();
  }
}

export function saveSettings(settings) {
  window.localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

export function resetAdminPassphrase() {
  const current = loadSettings();
  saveSettings({ ...current, admin_passphrase: defaultSettings().admin_passphrase });
}

export function loadBookings() {
  return Object.keys(window.localStorage)
    .filter((key) => key.startsWith('booking-'))
    .map((key) => JSON.parse(window.localStorage.getItem(key)))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export function loadBooking(id) {
  const raw = window.localStorage.getItem(`booking-${id}`);
  return raw ? JSON.parse(raw) : null;
}

export function saveBooking(booking) {
  window.localStorage.setItem(`booking-${booking.id}`, JSON.stringify(booking));
}

export function applyDiscount(amount, discountPercent) {
  const discount = Math.max(0, Math.min(100, discountPercent));
  return Number((amount * (1 - discount / 100)).toFixed(2));
}
