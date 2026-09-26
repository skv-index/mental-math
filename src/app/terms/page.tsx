import Link from 'next/link';
import Image from 'next/image';
import { FileText, UserCheck, AlertTriangle, Ban, Scale, RefreshCw, Mail, ChevronRight } from 'lucide-react';
import { QuickNav } from '@/components/QuickNav';

export const metadata = {
  title: 'Terms of Service — MentalMath',
  description: 'Read the Terms of Service that govern your use of the MentalMath platform.',
};

const SECTIONS = [
  {
    id: 'acceptance',
    icon: UserCheck,
    color: '#7C4DFF',
    grad: 'linear-gradient(135deg,#7C4DFF,#A855F7)',
    title: 'Acceptance of Terms',
    content: [
      {
        subtitle: 'Agreement to Terms',
        text: 'By accessing or using MentalMath ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. These terms apply to all users, including visitors, registered users, and premium subscribers.',
      },
      {
        subtitle: 'Age Requirement',
        text: 'You must be at least 13 years of age to use MentalMath. If you are under 18, you represent that your parent or legal guardian has reviewed and agreed to these Terms on your behalf. We do not knowingly collect personal data from children under 13.',
      },
      {
        subtitle: 'Updates to Terms',
        text: 'We may revise these Terms at any time. When we do, we will update the "Last Updated" date and notify registered users via email or in-app notification for material changes. Continued use of the Service after changes constitutes your acceptance.',
      },
    ],
  },
  {
    id: 'your-account',
    icon: FileText,
    color: '#22D3EE',
    grad: 'linear-gradient(135deg,#22D3EE,#7C4DFF)',
    title: 'Your Account',
    content: [
      {
        subtitle: 'Account Responsibility',
        text: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to immediately notify us at support@mentalmath.app of any unauthorised use of your account. MentalMath is not liable for any losses resulting from unauthorised access caused by your failure to safeguard your credentials.',
      },
      {
        subtitle: 'Accurate Information',
        text: 'You agree to provide accurate, current, and complete information during registration and to keep this information up to date. Using a false identity or impersonating another person is grounds for immediate account termination.',
      },
      {
        subtitle: 'One Account Per Person',
        text: 'Each person may maintain only one free account. Creating multiple accounts to circumvent limitations, earn duplicate rewards, or manipulate leaderboard rankings is prohibited and may result in all associated accounts being permanently suspended.',
      },
    ],
  },
  {
    id: 'acceptable-use',
    icon: Scale,
    color: '#22C55E',
    grad: 'linear-gradient(135deg,#22C55E,#22D3EE)',
    title: 'Acceptable Use',
    content: [
      {
        subtitle: 'Permitted Use',
        text: 'MentalMath is provided for personal, non-commercial educational use. You may use the platform to learn mental math strategies, track your practice progress, and compete on public leaderboards.',
      },
      {
        subtitle: 'Learning Integrity',
        text: 'You agree to complete practice sessions honestly. Using automated tools, scripts, bots, or any means to artificially inflate your score, accuracy, or XP is a violation of these Terms and undermines the learning experience for all users.',
      },
      {
        subtitle: 'Content Standards',
        text: 'If the platform ever includes user-generated content (e.g., comments or forum posts), you agree not to post content that is offensive, defamatory, harassing, or that infringes upon another\'s intellectual property rights.',
      },
    ],
  },
  {
    id: 'prohibited',
    icon: Ban,
    color: '#F472B6',
    grad: 'linear-gradient(135deg,#F472B6,#A855F7)',
    title: 'Prohibited Activities',
    content: [
      {
        subtitle: 'Technical Abuse',
        text: 'You may not attempt to probe, scan, or test the vulnerability of our systems; use the Service in any manner that could overload, damage, or impair our servers; or attempt to gain unauthorised access to any portion of the platform or its related systems.',
      },
      {
        subtitle: 'Reverse Engineering',
        text: 'You may not decompile, reverse engineer, disassemble, or attempt to derive the source code of any proprietary part of MentalMath, including our question generation algorithms and adaptive difficulty engine.',
      },
      {
        subtitle: 'Commercial Exploitation',
        text: 'You may not sell, resell, rent, or sublicense access to the Service. Creating derivative works, data scraping for commercial use, or using the platform\'s content to train machine learning models without explicit written consent is prohibited.',
      },
    ],
  },
  {
    id: 'intellectual-property',
    icon: AlertTriangle,
    color: '#FBBF24',
    grad: 'linear-gradient(135deg,#FBBF24,#FB923C)',
    title: 'Intellectual Property',
    content: [
      {
        subtitle: 'Our Content',
        text: 'All content on MentalMath — including the question bank, worked examples, mascot illustrations, UI design, strategy documentation, and source code — is the exclusive intellectual property of MentalMath and is protected by copyright and trade secret laws.',
      },
      {
        subtitle: 'Your Data',
        text: 'You retain ownership of any personal data you provide. By using the Service, you grant MentalMath a limited, non-exclusive licence to process your practice data for the sole purpose of delivering and improving the educational Service.',
      },
      {
        subtitle: 'Feedback',
        text: 'Any feedback, suggestions, or ideas you submit to us may be used by MentalMath without restriction or compensation. We are not obligated to keep such feedback confidential.',
      },
    ],
  },
  {
    id: 'termination',
    icon: RefreshCw,
    color: '#A855F7',
    grad: 'linear-gradient(135deg,#A855F7,#7C4DFF)',
    title: 'Termination & Suspension',
    content: [
      {
        subtitle: 'By You',
        text: 'You may delete your account at any time from the Settings page. Upon deletion, all your personal data including progress history, XP, and streak records will be permanently and irreversibly removed from our systems within 30 days.',
      },
      {
        subtitle: 'By MentalMath',
        text: 'We reserve the right to suspend or terminate your account at our sole discretion, without prior notice, if we determine that you have violated these Terms. We may also discontinue the Service entirely with 30 days notice to registered users.',
      },
      {
        subtitle: 'Effect of Termination',
        text: 'Upon termination, your right to use the Service ceases immediately. Provisions of these Terms that by their nature should survive termination (including intellectual property, limitation of liability, and dispute resolution) will continue to apply.',
      },
    ],
  },
  {
    id: 'contact',
    icon: Mail,
    color: '#22D3EE',
    grad: 'linear-gradient(135deg,#22D3EE,#7C4DFF)',
    title: 'Contact & Disputes',
    content: [
      {
        subtitle: 'Contact Us First',
        text: 'If you have a dispute with MentalMath, please contact us at legal@mentalmath.app before pursuing any formal proceedings. We are committed to resolving disputes fairly and promptly through direct communication.',
      },
      {
        subtitle: 'Limitation of Liability',
        text: 'To the maximum extent permitted by law, MentalMath is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service, including loss of data or learning progress.',
      },
      {
        subtitle: 'Governing Law',
        text: 'These Terms are governed by and construed in accordance with applicable law. Any disputes that cannot be resolved informally will be subject to binding arbitration, with the exception of claims that may be brought in small claims court.',
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="relative min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.4) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 -left-40 h-[400px] w-[400px] rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.4) 0%, transparent 70%)' }} />
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
            style={{ background: 'rgba(244,114,182,0.10)', color: '#F472B6', border: '1px solid rgba(244,114,182,0.20)' }}>
            <FileText size={13} /> Legal
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-900 text-[#111827] sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-base text-[#6B7280] max-w-xl mx-auto">
            These terms govern your use of MentalMath. Please read them carefully — they are written in plain language so you can actually understand them.
          </p>
          <p className="mt-3 text-xs text-[#9CA3AF]">Last Updated: July 31, 2025 · Effective immediately</p>
        </div>

        {/* Quick summary */}
        <div className="mb-10 rounded-2xl p-6 border border-[#22C55E]/20 bg-[#22C55E]/04"
          style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.04), rgba(34,211,238,0.04))', border: '1px solid rgba(34,197,94,0.20)' }}>
          <p className="text-xs font-800 uppercase tracking-widest text-[#22C55E] mb-2">TL;DR — The Short Version</p>
          <ul className="space-y-1.5 text-sm text-[#4B5563]">
            <li className="flex items-start gap-2"><span className="text-[#22C55E] font-700 mt-0.5">✓</span> Use MentalMath honestly and for personal learning only.</li>
            <li className="flex items-start gap-2"><span className="text-[#22C55E] font-700 mt-0.5">✓</span> Do not use bots, scripts, or tricks to inflate your scores.</li>
            <li className="flex items-start gap-2"><span className="text-[#22C55E] font-700 mt-0.5">✓</span> You can delete your account and all your data at any time.</li>
            <li className="flex items-start gap-2"><span className="text-[#22C55E] font-700 mt-0.5">✓</span> We own the platform content; you own your personal data.</li>
          </ul>
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
          style={{ background: 'linear-gradient(135deg, rgba(244,114,182,0.06), rgba(124,77,255,0.06))', border: '1px solid rgba(244,114,182,0.15)' }}>
          <p className="text-sm text-[#4B5563]">
            Legal questions? Email us at{' '}
            <a href="mailto:legal@mentalmath.app" className="font-700 text-[#F472B6] hover:underline">
              legal@mentalmath.app
            </a>
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link href="/privacy" className="font-600 text-[#7C4DFF] hover:underline">Privacy Policy →</Link>
            <span className="text-slate-300">|</span>
            <Link href="/" className="font-600 text-[#4B5563] hover:text-[#111827]">← Back to MentalMath</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
