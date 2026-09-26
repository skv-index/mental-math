'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type SignOutButtonProps = {
  variant?: 'icon' | 'full';
};

export default function SignOutButton({ variant = 'icon' }: SignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    if (loading) return;
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.replace('/login');
      router.refresh();
      setLoading(false);
    }
  }

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background: 'linear-gradient(135deg, #FF6B6B 0%, #F472B6 100%)',
          boxShadow: '0 4px 16px rgba(255,107,107,0.35)',
        }}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} strokeWidth={2.5} />}
        {loading ? 'Signing out…' : 'Log out'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      title="Log out"
      aria-label="Log out"
      className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        background: 'rgba(255,107,107,0.10)',
        color: '#FF6B6B',
        border: '1px solid rgba(255,107,107,0.25)',
      }}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} strokeWidth={2.5} />}
    </button>
  );
}
