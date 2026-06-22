import React from 'react';
import { User, LogOut, Mail, Shield } from 'lucide-react';

export default function Profile() {
  const user = {
    full_name: 'Customer',
    email: 'you@example.com',
    role: 'user',
  };

  return (
    <div className="px-5 pt-6 pb-28">
      <h1 className="text-3xl font-display font-bold text-foreground mb-6">Profile</h1>
      <div className="rounded-3xl bg-card border border-border p-6 shadow-soft text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{user.full_name}</h2>
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          <p className="inline-flex items-center gap-2 justify-center"><Mail className="w-4 h-4" /> {user.email}</p>
          <p className="inline-flex items-center gap-2 justify-center"><Shield className="w-4 h-4" /> {user.role}</p>
        </div>
      </div>
      <button className="mt-6 w-full rounded-3xl border border-destructive/30 bg-white/80 py-4 text-sm font-semibold text-destructive shadow-soft hover:bg-destructive/5">
        <LogOut className="inline-block w-4 h-4 mr-2" /> Sign out
      </button>
    </div>
  );
}
