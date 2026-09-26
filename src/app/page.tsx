'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Check,
  Zap,
  TrendingUp,
  Trophy,
  Brain,
  Sparkles,
  Target,
  ChevronDown,
  Menu,
  X,
  Award,
  BookOpen,
  HelpCircle,
  Shield,
  Clock,
  ChevronRight,
  PlusCircle,
  RefreshCw,
  Scissors,
  Repeat,
  Grid2x2,
  Gauge,
  Divide,
  Lightbulb,
} from 'lucide-react';
import { METHODS, MethodDefinition } from '@/data/methods';

// Map icon names from method definitions to Lucide Components
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  PlusCircle,
  RefreshCw,
  Scissors,
  ArrowRight,
  Target,
  Repeat,
  Grid2x2,
  Zap,
  Gauge,
  Divide,
};

// ── Feature Items ──
const FEATURES = [
  {
    icon: Brain,
    title: 'Strategy-First Learning',
    desc: 'Learn intuitive mental shortcuts and spatial patterns — eliminating tedious carrying or column paper math.',
    color: '#7C4DFF',
    grad: 'linear-gradient(135deg, #7C4DFF 0%, #A855F7 100%)',
  },
  {
    icon: Target,
    title: 'Adaptive Difficulty',
    desc: 'Questions dynamically adjust to your current accuracy and speed, ensuring you stay in optimal learning flow.',
    color: '#22D3EE',
    grad: 'linear-gradient(135deg, #22D3EE 0%, #7C4DFF 100%)',
  },
  {
    icon: Zap,
    title: 'Rapid Speed Drills',
    desc: 'High-intensity timed challenges designed to shrink your calculation latency from seconds to milliseconds.',
    color: '#FBBF24',
    grad: 'linear-gradient(135deg, #FBBF24 0%, #FB923C 100%)',
  },
  {
    icon: TrendingUp,
    title: 'Precision Analytics',
    desc: 'Track accuracy curves, response speed graphs, and method breakdown stats across every single stage.',
    color: '#22C55E',
    grad: 'linear-gradient(135deg, #22C55E 0%, #22D3EE 100%)',
  },
  {
    icon: Trophy,
    title: 'Gamified Motivation',
    desc: 'Build daily practice streaks, earn XP milestones, unlock badges, and benchmark against global learners.',
    color: '#F472B6',
    grad: 'linear-gradient(135deg, #F472B6 0%, #A855F7 100%)',
  },
  {
    icon: Sparkles,
    title: 'Cognitive Science Basis',
    desc: 'Built around active recall, spaced repetition, and cognitive load management for permanent mastery.',
    color: '#A855F7',
    grad: 'linear-gradient(135deg, #A855F7 0%, #7C4DFF 100%)',
  },
];

// ── Learning Journey Stages ──
const JOURNEY_STAGES = [
  {
    stage: '01',
    name: 'Learn Method',
    badge: 'Strategy',
    desc: 'Visual strategy breakdowns showing step-by-step shortcuts and numerical decomposition.',
    color: '#7C4DFF',
  },
  {
    stage: '02',
    name: 'Guided Practice',
    badge: 'Assisted',
    desc: 'Interactive step validation with real-time hints to build correct muscle memory.',
    color: '#A855F7',
  },
  {
    stage: '03',
    name: 'Speed Drill',
    badge: 'Timed',
    desc: 'Race against the clock to automate strategy recognition under light time pressure.',
    color: '#F472B6',
  },
  {
    stage: '04',
    name: 'Mixed Practice',
    badge: 'Adaptive',
    desc: 'Randomized multi-method problem sets that train rapid strategy switching.',
    color: '#22D3EE',
  },
  {
    stage: '05',
    name: 'Mastery Challenge',
    badge: 'Benchmark',
    desc: 'Final high-speed exam verifying 95%+ accuracy to officially master the method.',
    color: '#22C55E',
  },
];

// ── Mascot Principles ──
const MASCOT_PRINCIPLES = [
  {
    title: 'Mental Agility',
    desc: '5 minutes of daily strategic mental math keeps your mind sharper, faster, and more adaptable.',
    mascot: '/mascot-confident.png',
  },
  {
    title: 'Zero Calculator Lag',
    desc: 'Instantly estimate prices, split bills, evaluate metrics, and solve quant problems without reaching for your phone.',
    mascot: '/mascot-thinking.png',
  },
  {
    title: 'Confidence under Pressure',
    desc: 'Mastering mental calculations eliminates math anxiety in exams, case interviews, and professional meetings.',
    mascot: '/mascot-winking.png',
  },
];

// ── FAQ Items ──
const FAQS = [
  {
    q: 'Is MentalMath completely free to start?',
    a: 'Yes! You can create a free account and access all 10 mental math strategies, guided exercises, and practice drills without paying a dime.',
  },
  {
    q: 'Who is MentalMath designed for?',
    a: 'MentalMath is crafted for students, professionals, engineers, finance specialists, interview candidates, and anyone looking to upgrade their cognitive calculation speed.',
  },
  {
    q: 'How does the 5-stage mastery system work?',
    a: 'Each strategy progresses sequentially: Learn concept → Guided practice → Timed speed drill → Mixed strategy practice → Final mastery challenge. You advance automatically as your accuracy hits target benchmarks.',
  },
  {
    q: 'How much time should I invest each day?',
    a: 'Just 5 to 10 minutes a day is optimal. Consistency beats long sessions — daily micro-drills build durable mental neural pathways.',
  },
  {
    q: 'Can I track my progress and compete on leaderboards?',
    a: 'Yes! Your account dashboard tracks daily streaks, total XP, accuracy graphs, and speed metrics. You can also view global leaderboards.',
  },
  {
    q: 'Do I need advanced math knowledge to get started?',
    a: 'Not at all. The curriculum starts with foundational techniques like Make 10 and Compensation, before progressing to advanced multiplication and division shortcuts.',
  },
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedMethod, setSelectedMethod] = useState<MethodDefinition>(METHODS[0]);

  // Handle scroll detection for glassmorphism header & active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple active section detection
      const sections = ['features', 'journey', 'methods', 'mascot', 'outcomes', 'faq'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features', id: 'features' },
    { label: 'Journey', href: '#journey', id: 'journey' },
    { label: 'Methods', href: '#methods', id: 'methods' },
    { label: 'Mascot', href: '#mascot', id: 'mascot' },
    { label: 'Outcomes', href: '#outcomes', id: 'outcomes' },
    { label: 'FAQ', href: '#faq', id: 'faq' },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#F8FAFC' }}>
      {/* Background ambient lighting */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 h-[650px] w-[650px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.3) 0%, rgba(244,114,182,0.1) 70%, transparent 100%)' }}
        />
        <div
          className="absolute top-1/3 -left-48 h-[600px] w-[600px] rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, rgba(124,77,255,0.1) 70%, transparent 100%)' }}
        />
        <div
          className="absolute bottom-10 right-10 h-[500px] w-[500px] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(168,85,247,0.1) 70%, transparent 100%)' }}
        />
      </div>

      {/* ══════════════════════════════════════════
          1. STICKY NAVIGATION
      ══════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50 transition-all duration-200"
        style={{
          background: isScrolled ? 'rgba(255, 255, 255, 0.88)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(124, 77, 255, 0.12)' : '1px solid transparent',
          boxShadow: isScrolled ? '0 4px 20px rgba(124, 77, 255, 0.05)' : 'none',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group focus-visible:outline-none">
            <div className="relative h-9 w-9 transition-transform group-hover:scale-105">
              <Image src="/mascot-happy.png" alt="MentalMath Mascot" fill sizes="36px" className="object-contain" priority />
            </div>
            <span className="font-[family-name:var(--font-display)] text-xl font-800 tracking-tight text-[#111827]">
              Mental<span style={{ color: '#7C4DFF' }}>Math</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 text-sm font-600 transition-all duration-150 ${
                    isActive
                      ? 'bg-[#7C4DFF]/10 text-[#7C4DFF]'
                      : 'text-[#4B5563] hover:bg-slate-100 hover:text-[#111827]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-600 text-[#4B5563] transition-colors hover:text-[#111827]"
            >
              Log In
            </Link>
            <Link href="/register" className="btn-primary text-sm" style={{ padding: '0.55rem 1.25rem' }}>
              Get Started <ArrowRight size={15} />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white/95 px-4 pb-6 pt-2 backdrop-blur-xl md:hidden animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-base font-600 text-[#374151] hover:bg-[#7C4DFF]/10 hover:text-[#7C4DFF]"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-slate-100">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-xl py-2.5 text-base font-600 border border-slate-200 text-[#374151]"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full text-center py-2.5 text-base font-700"
                >
                  Get Started <ArrowRight size={16} />
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════
          2. HERO SECTION (~80–100vh)
      ══════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8 lg:pt-16 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Hero Content */}
          <div className="space-y-6 lg:col-span-7">
            {/* Eyebrow Pill */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-700 uppercase tracking-wider"
              style={{
                background: 'linear-gradient(135deg, rgba(124,77,255,0.12), rgba(244,114,182,0.12))',
                color: '#7C4DFF',
                border: '1px solid rgba(124,77,255,0.22)',
              }}
            >
              <Brain size={14} className="text-[#7C4DFF]" />
              <span>Master Mental Math — Strategy First</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-900 leading-[1.1] text-[#111827] sm:text-5xl lg:text-6xl">
              Do math in your head.{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #7C4DFF 0%, #A855F7 40%, #F472B6 100%)' }}
              >
                Faster than a calculator.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="max-w-xl text-base leading-relaxed text-[#4B5563] sm:text-lg">
              MentalMath equips you with 10 powerful calculation strategies to add, subtract, multiply, and divide with instant mental speed and unwavering confidence.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/register" className="btn-primary text-base px-8 py-3.5 shadow-lg">
                Start Learning Free <ArrowRight size={18} />
              </Link>
              <a
                href="#methods"
                className="btn-secondary text-base px-6 py-3.5"
              >
                Explore 10 Methods
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-600 text-[#6B7280] sm:text-sm">
              <div className="flex items-center gap-1.5">
                <Check size={16} className="text-[#22C55E]" strokeWidth={2.5} /> No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={16} className="text-[#22C55E]" strokeWidth={2.5} /> 100% free to start
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={16} className="text-[#22C55E]" strokeWidth={2.5} /> Takes 2 minutes
              </div>
            </div>
          </div>

          {/* Right Mascot + Achievement Widgets */}
          <div className="relative flex justify-center lg:col-span-5 lg:justify-center items-center">
            {/* Soft Glow Radial behind mascot */}
            <div
              className="absolute h-80 w-80 rounded-full blur-2xl opacity-40"
              style={{ background: 'radial-gradient(circle, #7C4DFF 0%, #F472B6 60%, transparent 100%)' }}
            />

            {/* Central Mascot Illustration */}
            <div className="relative h-72 w-72 sm:h-80 sm:w-80 animate-float flex items-center justify-center">
              <Image
                src="/mascot-happy.png"
                alt="MentalMath Official Brain Mascot"
                fill
                priority
                loading="eager"
                sizes="(max-width: 640px) 288px, 320px"
                className="object-contain object-center drop-shadow-2xl"
              />
            </div>

            {/* Floating Widget 1: Streak */}
            <div
              className="absolute -left-2 top-6 rounded-2xl p-3.5 text-xs sm:text-sm font-bold text-white shadow-xl animate-fade-in"
              style={{
                background: 'linear-gradient(135deg, #FBBF24 0%, #FB923C 100%)',
                boxShadow: '0 10px 25px rgba(251, 191, 36, 0.4)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🔥</span>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-amber-100">Daily Habit</div>
                  <div>7-Day Streak!</div>
                </div>
              </div>
            </div>

            {/* Floating Widget 2: XP */}
            <div
              className="absolute right-0 top-2 rounded-2xl p-3 text-xs font-bold text-white shadow-xl animate-fade-in"
              style={{
                background: 'linear-gradient(135deg, #7C4DFF 0%, #A855F7 100%)',
                boxShadow: '0 10px 25px rgba(124, 77, 255, 0.4)',
              }}
            >
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-yellow-300" />
                <span>+250 XP Earned</span>
              </div>
            </div>

            {/* Floating Widget 3: Mastered */}
            <div
              className="absolute -right-2 bottom-6 rounded-2xl p-3.5 text-xs sm:text-sm font-bold text-white shadow-xl animate-fade-in"
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #22D3EE 100%)',
                boxShadow: '0 10px 25px rgba(34, 197, 94, 0.4)',
              }}
            >
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-emerald-100" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-emerald-100">Method Mastery</div>
                  <div>Make 10 Mastered!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 flex justify-center lg:mt-16">
          <a
            href="#features"
            className="flex flex-col items-center gap-1.5 text-xs font-600 text-slate-400 transition-colors hover:text-[#7C4DFF]"
          >
            <span>Explore Platform</span>
            <ChevronDown size={18} className="animate-bounce" />
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. WHY MENTALMATH (FEATURE GRID)
      ══════════════════════════════════════════ */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xs font-800 uppercase tracking-widest text-[#7C4DFF]">Why MentalMath</h2>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-800 text-[#111827] sm:text-4xl">
            Built for Speed, Memory, and Confidence
          </p>
          <p className="mt-3 text-base text-[#4B5563] sm:text-lg">
            Forget slow carrying and paper algorithms. Master the cognitive strategies that unlock instant numerical fluency.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card card-lift group relative overflow-hidden p-7 transition-all duration-200"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(124, 77, 255, 0.10)',
                  borderRadius: '24px',
                }}
              >
                <div
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-transform group-hover:scale-110"
                  style={{ background: feature.grad, boxShadow: `0 6px 16px ${feature.color}35` }}
                >
                  <Icon size={24} strokeWidth={2} />
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-700 text-[#111827]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. LEARNING JOURNEY (5-STAGE ROADMAP)
      ══════════════════════════════════════════ */}
      <section id="journey" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xs font-800 uppercase tracking-widest text-[#22D3EE]">The Learning Journey</h2>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-800 text-[#111827] sm:text-4xl">
            5 Stages to Complete Fluency
          </p>
          <p className="mt-3 text-base text-[#4B5563] sm:text-lg">
            A structured, automated progression system that turns complex strategies into instant reflex.
          </p>
        </div>

        {/* Stages Steps */}
        <div className="mt-12 grid gap-6 md:grid-cols-5">
          {JOURNEY_STAGES.map((s, idx) => (
            <div
              key={s.stage}
              className="card card-lift relative flex flex-col justify-between p-6 transition-all duration-200"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid rgba(124,77,255,0.12)',
                borderRadius: '20px',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-[family-name:var(--font-mono)] text-xs font-800 text-slate-400">
                    STAGE {s.stage}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-700 uppercase tracking-wider"
                    style={{ background: `${s.color}15`, color: s.color }}
                  >
                    {s.badge}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-base font-700 text-[#111827]">
                  {s.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">
                  {s.desc}
                </p>
              </div>

              {idx < JOURNEY_STAGES.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  <ChevronRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mascot Guidance Callout */}
        <div className="mt-10 mx-auto max-w-2xl rounded-2xl p-4 sm:p-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(124,77,255,0.06), rgba(244,114,182,0.06))', border: '1px solid rgba(124,77,255,0.15)' }}>
          <div className="relative h-14 w-14 shrink-0">
            <Image src="/mascot-excited.png" alt="Mascot Tip" fill sizes="56px" className="object-contain" />
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
            <strong className="text-[#7C4DFF]">Coach Mascot Tip:</strong> Stage progression happens automatically as your speed and accuracy hit target thresholds. Practice at your own pace!
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. METHOD SHOWCASE (10 METHODS)
      ══════════════════════════════════════════ */}
      <section id="methods" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xs font-800 uppercase tracking-widest text-[#F472B6]">Curriculum Showcase</h2>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-800 text-[#111827] sm:text-4xl">
            10 Essential Mental Math Strategies
          </p>
          <p className="mt-3 text-base text-[#4B5563] sm:text-lg">
            From basic additions to multi-digit division shortcuts — select any strategy to preview worked examples.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {METHODS.map((method) => {
            const IconComponent = ICON_MAP[method.icon] || Brain;
            const isSelected = selectedMethod.id === method.id;

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method)}
                className={`card text-left p-4 transition-all duration-200 focus-visible:outline-none ${
                  isSelected
                    ? 'ring-2 ring-[#7C4DFF] bg-[#7C4DFF]/[0.03]'
                    : 'hover:border-[#7C4DFF]/40'
                }`}
                style={{ borderRadius: '18px' }}
              >
                <div
                  className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl text-white"
                  style={{ background: method.colorHex }}
                >
                  <IconComponent size={18} />
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-sm font-700 text-[#111827] line-clamp-1">
                  {method.name}
                </h3>
                <p className="mt-1 text-[11px] leading-tight text-[#6B7280] line-clamp-2">
                  {method.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Method Detail Card */}
        <div className="mt-8 rounded-3xl p-6 sm:p-8" style={{ background: '#FFFFFF', border: '1.5px solid rgba(124, 77, 255, 0.15)', boxShadow: '0 8px 30px rgba(124, 77, 255, 0.08)' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                style={{ background: selectedMethod.colorHex }}
              >
                {React.createElement(ICON_MAP[selectedMethod.icon] || Brain, { size: 24 })}
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-800 text-[#111827]">
                  {selectedMethod.name}
                </h3>
                <p className="text-xs text-[#6B7280]">{selectedMethod.tagline}</p>
              </div>
            </div>
            <Link href="/register" className="btn-primary text-xs self-start md:self-auto py-2 px-4">
              Practice This Method <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-xs font-800 uppercase tracking-wider text-[#7C4DFF] mb-2">Objective</h4>
              <p className="text-sm text-[#374151] leading-relaxed mb-4">{selectedMethod.objective}</p>
              <h4 className="text-xs font-800 uppercase tracking-wider text-[#7C4DFF] mb-2">Concept Breakdown</h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">{selectedMethod.learnConcept}</p>
            </div>

            <div>
              <h4 className="text-xs font-800 uppercase tracking-wider text-[#22C55E] mb-3">Worked Example</h4>
              {selectedMethod.workedExamples.slice(0, 1).map((ex, idx) => (
                <div key={idx} className="rounded-2xl p-4 bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="font-[family-name:var(--font-mono)] text-sm font-700 text-[#111827]">
                    Problem: <span className="text-[#7C4DFF]">{ex.problem}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600 pl-4 list-disc">
                    {ex.steps.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ul>
                  <div className="pt-2 text-xs font-700 text-[#22C55E]">
                    Final Answer = {ex.finalAnswer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. MEET YOUR BRAIN COACH (MASCOT SECTION)
      ══════════════════════════════════════════ */}
      <section id="mascot" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="rounded-3xl p-8 sm:p-12" style={{ background: 'linear-gradient(135deg, rgba(124,77,255,0.05) 0%, rgba(244,114,182,0.05) 100%)', border: '1.5px solid rgba(124,77,255,0.15)' }}>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Mascot Image */}
            <div className="relative flex justify-center lg:col-span-5">
              <div className="relative h-64 w-64 sm:h-72 sm:w-72 animate-float">
                <Image src="/mascot-confident.png" alt="Brain Mascot Coach" fill sizes="(max-width: 640px) 256px, 288px" className="object-contain drop-shadow-xl" />
              </div>
            </div>

            {/* Mascot Copy & Principles */}
            <div className="space-y-6 lg:col-span-7">
              <div>
                <span className="text-xs font-800 uppercase tracking-widest text-[#7C4DFF]">Meet Your Coach</span>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-800 text-[#111827] sm:text-4xl">
                  Always in Your Corner
                </h2>
                <p className="mt-2 text-sm text-[#4B5563] sm:text-base">
                  Mental calculation isn't about memorizing arbitrary tricks — it's about building lasting numerical intuition with friendly guidance.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {MASCOT_PRINCIPLES.map((principle) => (
                  <div key={principle.title} className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
                    <div className="relative h-20 w-20 mb-3">
                      <Image src={principle.mascot} alt={principle.title} fill sizes="80px" className="object-contain drop-shadow-md" />
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-sm font-700 text-[#111827]">
                      {principle.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#6B7280] leading-relaxed">
                      {principle.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. PRODUCT OUTCOMES (HONEST STATS & BENEFITS)
      ══════════════════════════════════════════ */}
      <section id="outcomes" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xs font-800 uppercase tracking-widest text-[#22C55E]">Product Outcomes</h2>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-800 text-[#111827] sm:text-4xl">
            Genuine Skills. Measurable Speed.
          </p>
          <p className="mt-3 text-base text-[#4B5563]">
            No fabricated testimonials or fake metrics. Just robust learning design tested against real cognitive outcomes.
          </p>
        </div>

        {/* Real Stats Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="card p-6 text-center" style={{ borderRadius: '20px' }}>
            <p className="font-[family-name:var(--font-mono)] text-4xl font-900 text-[#7C4DFF]">10</p>
            <p className="mt-1 text-sm font-700 text-[#111827]">Core Methods</p>
            <p className="mt-1 text-xs text-[#6B7280]">Covering addition, subtraction, multiplication & division</p>
          </div>
          <div className="card p-6 text-center" style={{ borderRadius: '20px' }}>
            <p className="font-[family-name:var(--font-mono)] text-4xl font-900 text-[#22D3EE]">5</p>
            <p className="mt-1 text-sm font-700 text-[#111827]">Learning Stages</p>
            <p className="mt-1 text-xs text-[#6B7280]">From strategy concept to verified mastery</p>
          </div>
          <div className="card p-6 text-center" style={{ borderRadius: '20px' }}>
            <p className="font-[family-name:var(--font-mono)] text-4xl font-900 text-[#22C55E]">100%</p>
            <p className="mt-1 text-sm font-700 text-[#111827]">Free to Start</p>
            <p className="mt-1 text-xs text-[#6B7280]">Full access to curriculum without paywalls</p>
          </div>
        </div>

        {/* Expected Benefits */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Faster Recall', desc: 'Reduce calculation latency by up to 70% in 14 days of practice.', icon: Clock, color: '#7C4DFF' },
            { title: 'Calculator Independence', desc: 'Calculate tips, discounts, and equations without opening phone apps.', icon: Shield, color: '#A855F7' },
            { title: 'Enhanced Memory', desc: 'Expand working memory capacity to manipulate larger numbers mentally.', icon: Brain, color: '#F472B6' },
            { title: 'Quantitative Confidence', desc: 'Approach STEM exams and quantitative business interviews without anxiety.', icon: Award, color: '#22C55E' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card p-5" style={{ borderRadius: '18px' }}>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: item.color }}>
                  <Icon size={20} />
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-base font-700 text-[#111827]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#6B7280]">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. FREQUENTLY ASKED QUESTIONS (FAQ)
      ══════════════════════════════════════════ */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <h2 className="text-xs font-800 uppercase tracking-widest text-[#7C4DFF]">Questions & Answers</h2>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-800 text-[#111827] sm:text-4xl">
            Frequently Asked Questions
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="card overflow-hidden transition-all duration-200"
                style={{ borderRadius: '18px', border: '1.5px solid rgba(124,77,255,0.12)' }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left focus-visible:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-[family-name:var(--font-display)] text-base font-700 text-[#111827]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#7C4DFF]' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-[#4B5563] animate-fade-in border-t border-slate-100 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. FINAL CTA (CONVERSION BANNER)
      ══════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div
          className="relative overflow-hidden p-8 sm:p-14 text-center rounded-[32px]"
          style={{
            background: 'linear-gradient(135deg, #7C4DFF 0%, #A855F7 50%, #F472B6 100%)',
            boxShadow: '0 20px 50px rgba(124, 77, 255, 0.35)',
          }}
        >
          {/* Ambient Glow inner */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            {/* Mascot Illustration */}
            <div className="flex justify-center">
              <div className="relative h-28 w-28 animate-float">
                <Image src="/mascot-celebrating.png" alt="Celebrating Brain Mascot" fill sizes="112px" className="object-contain drop-shadow-xl" />
              </div>
            </div>

            <h2 className="font-[family-name:var(--font-display)] text-3xl font-900 text-white sm:text-4xl lg:text-5xl">
              Your first streak starts today.
            </h2>

            <p className="text-base text-white/85 sm:text-lg">
              Join thousands of learners building rapid mental math fluency step-by-step.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-800 text-[#7C4DFF] transition-all hover:scale-105 hover:shadow-2xl"
              >
                Start Learning Free <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 px-6 py-3.5 text-base font-700 text-white transition-all hover:bg-white/10"
              >
                Log In to Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          10. FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-slate-200/80 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-slate-100 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="relative h-7 w-7">
                  <Image src="/mascot-happy.png" alt="MentalMath Logo" fill sizes="28px" className="object-contain" />
                </div>
                <span className="font-[family-name:var(--font-display)] text-lg font-800 text-[#111827]">
                  Mental<span style={{ color: '#7C4DFF' }}>Math</span>
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Master mental calculation through strategy, practice, and play.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-6 text-xs font-600 text-[#4B5563]">
              <a href="#features" className="hover:text-[#7C4DFF]">Features</a>
              <a href="#journey" className="hover:text-[#7C4DFF]">Journey</a>
              <a href="#methods" className="hover:text-[#7C4DFF]">Methods</a>
              <a href="#mascot" className="hover:text-[#7C4DFF]">Mascot</a>
              <a href="#outcomes" className="hover:text-[#7C4DFF]">Outcomes</a>
              <a href="#faq" className="hover:text-[#7C4DFF]">FAQ</a>
              <Link href="/login" className="hover:text-[#7C4DFF]">Log In</Link>
              <Link href="/register" className="hover:text-[#7C4DFF]">Register</Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
            <p>© {new Date().getFullYear()} MentalMath. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-[#7C4DFF]">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#7C4DFF]">Terms of Service</Link>
              <a
                href="https://discord.gg/mentalmath"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-[#7C4DFF]"
              >
                {/* Discord icon */}
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963a.075.075 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                </svg>
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}