'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name.trim() },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1521] px-4">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#5EEAD4 1px, transparent 1px), linear-gradient(90deg, #5EEAD4 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="card-surface relative w-full max-w-sm p-6 sm:p-8">
        <div className="mb-6 text-center">
          <Link href="/" className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#EDF1F7]">
            Mental<span className="text-[#FFB020]">Math</span>
          </Link>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-xl font-semibold text-[#EDF1F7]">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-[#8B96AB]">Start practicing in under a minute.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-[#FF6B6B]/30 bg-[#FF6B6B]/10 px-3 py-2 text-xs text-[#FF6B6B]">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B96AB]" />
            <input
              type="text"
              required
              placeholder="Display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              className="w-full rounded-lg border border-[#5EEAD4]/10 bg-[#0F1521] py-2.5 pl-10 pr-3 text-sm text-[#EDF1F7] outline-none focus:border-[#5EEAD4]/50"
            />
          </div>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B96AB]" />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#5EEAD4]/10 bg-[#0F1521] py-2.5 pl-10 pr-3 text-sm text-[#EDF1F7] outline-none focus:border-[#5EEAD4]/50"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B96AB]" />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="w-full rounded-lg border border-[#5EEAD4]/10 bg-[#0F1521] py-2.5 pl-10 pr-3 text-sm text-[#EDF1F7] outline-none focus:border-[#5EEAD4]/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFB020] py-2.5 text-sm font-semibold text-[#0F1521] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#8B96AB]">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[#5EEAD4] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}