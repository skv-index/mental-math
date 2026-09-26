import Link from 'next/link';
import Image from 'next/image';
import { Shield, Lock, Eye, Database, Globe, Mail, ChevronRight } from 'lucide-react';
import { QuickNav } from '@/components/QuickNav';

export const metadata = {
  title: 'Privacy Policy — MentalMath',
  description: 'Learn how MentalMath collects, uses, and protects your personal data.',
};

const SECTIONS = [
  {
    id: 'information-we-collect',
    icon: Database,
    color: '#7C4DFF',
    grad: 'linear-gradient(135deg,#7C4DFF,#A855F7)',
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Account Information',
        text: 'When you register, we collect your name and email address. This is the minimum required to create your account, track your progress, and personalise your learning experience.',
      },
      {
        subtitle: 'Practice & Progress Data',
        text: 'We record the questions you attempt, your answers, time taken, accuracy rates, streak counts, and stage completion status. This data exists solely to calculate your XP, generate analytics, and improve our adaptive difficulty algorithm.',
      },
      {
        subtitle: 'Device & Usage Information',
        text: 'We collect anonymised information about your browser type, operating system, and session duration to diagnose bugs and improve platform performance. No persistent device fingerprinting is performed.',
      },
    ],
  },
  {
    id: 'how-we-use',
    icon: Eye,
    color: '#22D3EE',
    grad: 'linear-gradient(135deg,#22D3EE,#7C4DFF)',
    title: 'How We Use Your Information',
    content: [
      {
        subtitle: 'Deliver the Service',
        text: 'Your account data is used to authenticate you, save your progress across sessions, compute leaderboard rankings, and display personalised dashboards.',
      },
      {
        subtitle: 'Improve Learning Algorithms',
        text: 'Aggregated, anonymised practice data helps us tune question difficulty, surface the most effective strategy orderings, and improve the 5-stage mastery system.',
      },
      {
        subtitle: 'Communications',
        text: 'We may send transactional emails such as account verification, password resets, and streak reminders. You can unsubscribe from non-essential communications at any time from your account settings.',
      },
    ],
  },
  {
    id: 'data-sharing',
    icon: Globe,
    color: '#F472B6',
    grad: 'linear-gradient(135deg,#F472B6,#A855F7)',
    title: 'Data Sharing & Third Parties',
    content: [
      {
        subtitle: 'We Do Not Sell Your Data',
        text: 'MentalMath does not sell, rent, or trade your personal information to third parties for marketing purposes — ever.',
      },
      {
        subtitle: 'Service Providers',
        text: 'We use Supabase for database hosting and authentication, and Vercel for deployment infrastructure. These providers process data on our behalf under strict data processing agreements and are bound by confidentiality obligations.',
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose information when required by law, court order, or to protect the rights, property, or safety of MentalMath, our users, or the public.',
      },
    ],
  },
  {
    id: 'data-security',
    icon: Lock,
    color: '#22C55E',
    grad: 'linear-gradient(135deg,#22C55E,#22D3EE)',
    title: 'Data Security',
    content: [
      {
        subtitle: 'Encryption',
        text: 'All data is transmitted over HTTPS/TLS. Passwords are hashed using industry-standard bcrypt and are never stored in plaintext.',
      },
      {
        subtitle: 'Access Controls',
        text: 'Database access is restricted by row-level security policies. Only your own account data is accessible to your authenticated session.',
      },
      {
        subtitle: 'Incident Response',
        text: 'In the unlikely event of a data breach affecting your personal information, we will notify affected users within 72 hours of becoming aware of the incident.',
      },
    ],
  },
  {
    id: 'your-rights',
    icon: Shield,
    color: '#FBBF24',
    grad: 'linear-gradient(135deg,#FBBF24,#FB923C)',
    title: 'Your Rights',
    content: [
      {
        subtitle: 'Access & Portability',
        text: 'You have the right to request a copy of all personal data we hold about you at any time. Contact us at privacy@mentalmath.app and we will provide an export within 30 days.',
      },
      {
        subtitle: 'Correction & Deletion',
        text: 'You can update your name and email from your profile settings. You can permanently delete your account — and all associated data — at any time from the Settings page. Deletion is irreversible.',
      },
      {
        subtitle: 'Opt-Out',
        text: 'You can opt out of non-essential communications via your account settings. Opting out of transactional emails (e.g., password reset) is not possible as they are required for account security.',
      },
    ],
  },
  {
    id: 'contact',
    icon: Mail,
    color: '#A855F7',
    grad: 'linear-gradient(135deg,#A855F7,#F472B6)',
    title: 'Contact Us',
    content: [
      {
        subtitle: 'Privacy Questions',
        text: 'For any questions, concerns, or requests related to your privacy or this policy, please email us at privacy@mentalmath.app. We aim to respond to all privacy-related enquiries within 5 business days.',
      },
      {
        subtitle: 'Policy Updates',
        text: 'We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date below and, for material changes, notify you via email or an in-app banner. Continued use of MentalMath after changes constitutes acceptance of the revised policy.',
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.4) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 -left-40 h-[400px] w-[400px] rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.4) 0%, transparent 70%)' }} />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/88 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8">
              <Image src="/mascot-happy.png" alt="MentalMath" fill sizes="32px" className="object-contain" />
            </div>
            <span className="font-[family-name:var(--font-display)] text-lg font-800 text-[#111827]">
              Mental<span style={{ color: '#7C4DFF' }}>Math</span>
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-sm font-600 text-[#4B5563] hover:text-[#7C4DFF] transition-colors">
            <ChevronRight size={14} className="rotate-180" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-700 uppercase tracking-wider mb-4"
            style={{ background: 'rgba(124,77,255,0.10)', color: '#7C4DFF', border: '1px solid rgba(124,77,255,0.20)' }}>
            <Shield size={13} /> Legal
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-900 text-[#111827] sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-base text-[#6B7280] max-w-xl mx-auto">
            We believe in radical transparency. Here is exactly what data we collect, why we collect it, and how it is protected.
          </p>
          <p className="mt-3 text-xs text-[#9CA3AF]">Last Updated: July 31, 2025 · Effective immediately</p>
        </div>

        {/* Quick nav */}
        <QuickNav sections={SECTIONS.map((s) => ({ id: s.id, color: s.color, title: s.title }))} />

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.id} id={section.id}
                className="rounded-[24px] overflow-hidden bg-white border border-slate-200/80 shadow-sm">
                {/* Section header */}
                <div className="flex items-center gap-4 p-6 border-b border-slate-100"
                  style={{ background: `linear-gradient(135deg, ${section.color}08, transparent)` }}>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                    style={{ background: section.grad, boxShadow: `0 6px 16px ${section.color}35` }}>
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-800 text-[#111827]">
                    {section.title}
                  </h2>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  {section.content.map((item) => (
                    <div key={item.subtitle} className="flex gap-3">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: section.color }} />
                      <div>
                        <h3 className="text-sm font-700 text-[#111827] mb-1">{item.subtitle}</h3>
                        <p className="text-sm leading-relaxed text-[#6B7280]">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 rounded-2xl p-6 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(124,77,255,0.06), rgba(244,114,182,0.06))', border: '1px solid rgba(124,77,255,0.15)' }}>
          <p className="text-sm text-[#4B5563]">
            Questions about this policy? Email us at{' '}
            <a href="mailto:privacy@mentalmath.app" className="font-700 text-[#7C4DFF] hover:underline">
              privacy@mentalmath.app
            </a>
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link href="/terms" className="font-600 text-[#7C4DFF] hover:underline">Terms of Service →</Link>
            <span className="text-slate-300">|</span>
            <Link href="/" className="font-600 text-[#4B5563] hover:text-[#111827]">← Back to MentalMath</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
