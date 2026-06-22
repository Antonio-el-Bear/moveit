import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { loadSettings, resetAdminPassphrase } from '@/lib/appStorage';

export default function AdminLogin() {
  const navigate = useNavigate();
  const settings = loadSettings();
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pass === settings.admin_passphrase) {
      sessionStorage.setItem('moveit-admin-auth', '1');
      navigate('/admin');
    } else {
      setError('Invalid passphrase');
      setInfo('');
    }
  };

  const handleReset = () => {
    resetAdminPassphrase();
    setInfo('Admin passphrase has been reset to the default value. Use admin123 to sign in.');
    setError('');
    setPass('');
  };

  return (
    <div className="px-5 pt-6 pb-28">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Lock className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Admin login</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter the admin passphrase to continue.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl bg-card border border-border p-5 shadow-soft space-y-4 max-w-md">
        <label className="space-y-2 text-sm">
          <span className="font-medium">Passphrase</span>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
          />
        </label>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {info && <div className="text-sm text-emerald-600">{info}</div>}
        <div className="flex flex-col gap-3">
          <button type="submit" className="rounded-3xl bg-primary py-3 text-sm font-semibold text-primary-foreground">Sign in</button>
          <button type="button" onClick={() => navigate('/')} className="rounded-3xl border border-border py-3 text-sm font-semibold">Cancel</button>
          <button type="button" onClick={handleReset} className="rounded-3xl border border-border bg-muted/50 py-3 text-sm font-semibold text-foreground">Reset passphrase to default</button>
        </div>
      </form>
    </div>
  );
}
