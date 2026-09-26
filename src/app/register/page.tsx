'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  User as UserIcon,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  Brain,
  Target,
  Rocket,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export type MascotEmotion = 'excited' | 'happy' | 'thinking' | 'celebrating' | 'confident' | 'winking';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Compute password strength score (0 to 4)
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
      case 3:
        return { score: 3, label: 'Strong', color: 'bg-[#FBBF24]', text: 'text-amber-700' };
      case 4:
        return { score: 4, label: 'Excellent', color: 'bg-emerald-500', text: 'text-emerald-600' };
      default:
        return { score: 0, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    }
  };

  const strength = calculatePasswordStrength(password);

  // Derive dynamic mascot emotion based on interaction lifecycle
  const getMascotEmotion = (): MascotEmotion => {
    if (isSuccess) return 'celebrating';
    if (loading) return 'thinking';
    if (error) return 'confident';
    if (password || name || email) return 'happy';
    return 'excited';
  };

  const currentEmotion = getMascotEmotion();

  // Helper text for mascot speech bubble
  const getMascotSpeech = () => {
    if (isSuccess) return 'Woohoo! Welcome to MentalMath!';
    if (loading) return 'Setting up your learning path...';
    if (error) return "No problem, let's fix that!";
    if (password.length > 0 && strength.score >= 3) return 'Nice strong password!';
    if (name) return `Great to meet you, ${name.split(' ')[0]}!`;
    return 'Ready to unlock your brain potential?';
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsShaking(false);
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 600);
  }

  return (
    <div className="w-full bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-[#7C4DFF]/20">
      
      {/* ========================================================================= */}
      {/* FIRST FOLD: 100vh MAIN HERO & REGISTRATION CONTAINER                      */}
      {/* ========================================================================= */}
      <div className="w-full min-h-screen lg:h-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* ------------------------------------------------------------------------- */}
        {/* LEFT PANEL: SPACIOUS BRAND & GROWTH HERO (55% on desktop)                 */}
        {/* ------------------------------------------------------------------------- */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col justify-between p-10 xl:p-14 overflow-hidden bg-gradient-to-br from-[#5B21B6] via-[#7C4DFF] to-[#EC4899] text-white">
          
          {/* Ambient Lighting & Glow Orbs */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse" />
            <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-[#F472B6]/25 blur-3xl" />
            <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-[#22D3EE]/25 blur-3xl" />
          </div>

          {/* Decorative Floating Math Symbols */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none opacity-15 font-mono text-3xl font-bold">
            <span className="absolute top-[10%] left-[12%] animate-float" style={{ animationDelay: '0s' }}>+</span>
            <span className="absolute top-[30%] right-[15%] animate-float" style={{ animationDelay: '1.4s' }}>×</span>
            <span className="absolute top-[52%] left-[8%] animate-float" style={{ animationDelay: '2.2s' }}>÷</span>
            <span className="absolute top-[72%] right-[10%] animate-float" style={{ animationDelay: '0.6s' }}>√</span>
            <span className="absolute top-[85%] left-[20%] animate-float" style={{ animationDelay: '1.8s' }}>²</span>
            <span className="absolute top-[38%] left-[48%] animate-float" style={{ animationDelay: '3.0s' }}>%</span>
            <span className="absolute top-[78%] left-[58%] animate-float" style={{ animationDelay: '2.4s' }}>=</span>
          </div>

          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2.5 bg-white/10 hover:bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 transition-all duration-200"
            >
              <div className="relative w-7 h-7">
                <Image
                  src="/mascot-excited.png"
                  alt="MentalMath Brand"
                  fill
                  sizes="28px"
                  loading="eager"
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Mental<span className="text-[#FBBF24]">Math</span>
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
              Start Your Free Account
            </span>
          </div>

          {/* Center Hero Showcase */}
          <div className="relative z-10 my-auto py-6 max-w-xl mx-auto flex flex-col items-center text-center">
            
            {/* Mascot Showcase with Glowing Backdrop */}
            <div className="relative mb-6 group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FBBF24]/40 via-[#F472B6]/40 to-[#22D3EE]/40 blur-2xl scale-125 transition-transform duration-500 group-hover:scale-135" />
              
              <div className="relative w-40 h-40 xl:w-48 xl:h-48 animate-float transition-all duration-300">
                <Image
                  src={`/mascot-${currentEmotion}.png`}
                  alt={`Brain Mascot (${currentEmotion})`}
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 1280px) 160px, 192px"
                  className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] transition-all duration-300"
                />
              </div>

              {/* Dynamic Mascot Speech Bubble */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-slate-900 font-bold text-xs px-4 py-1.5 rounded-full shadow-lg border border-purple-100 whitespace-nowrap flex items-center gap-1.5 animate-fade-up">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                {getMascotSpeech()}
              </div>
            </div>

            {/* Growth Headline & Value Proposition */}
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
              Start Your Journey to <span className="text-[#FBBF24]">Faster Thinking.</span>
            </h1>
            <p className="text-white/85 text-sm xl:text-base leading-relaxed mb-6 max-w-md font-medium">
              Join thousands of learners unlocking rapid calculation skills, mental agility, and daily brain fitness.
            </p>

            {/* Learning Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left mb-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#22D3EE] shrink-0" />
                <span>Free forever to start</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-white">
                <Target className="w-4 h-4 text-[#FBBF24] shrink-0" />
                <span>Adaptive practice</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-white">
                <Rocket className="w-4 h-4 text-[#F472B6] shrink-0" />
                <span>Rapid progress</span>
              </div>
            </div>

            {/* Illustrative Curriculum Preview Cards */}
            <div className="w-full grid grid-cols-3 gap-3 pt-3 border-t border-white/15">
              
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#7C4DFF]/30 flex items-center justify-center mb-1.5">
                  <Brain className="w-4 h-4 text-[#FBBF24]" />
                </div>
                <span className="text-xs font-bold text-white">10 Core</span>
                <span className="text-[10px] text-white/70 font-medium">Math Methods</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#F472B6]/30 flex items-center justify-center mb-1.5">
                  <Zap className="w-4 h-4 text-[#22D3EE]" />
                </div>
                <span className="text-xs font-bold text-white">Daily</span>
                <span className="text-[10px] text-white/70 font-medium">Practice Drills</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#22C55E]/20 flex items-center justify-center mb-1.5">
                  <Target className="w-4 h-4 text-[#22C55E]" />
                </div>
                <span className="text-xs font-bold text-white">Personalized</span>
                <span className="text-[10px] text-white/70 font-medium">Skill Tracking</span>
              </div>

            </div>

          </div>

          {/* Left Panel Hero Footer Tag */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white/70 pt-4 border-t border-white/10">
            <span>© {new Date().getFullYear()} MentalMath Inc.</span>
            <span>Build Your Brain Fitness</span>
          </div>

        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* RIGHT PANEL: REGISTRATION CARD (45% on desktop)                           */}
        {/* ------------------------------------------------------------------------- */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center p-6 sm:p-8 lg:p-10 relative bg-[#F8FAFC] overflow-y-auto">
          
          {/* Background Ambient Blobs */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C4DFF]/[0.06] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F472B6]/[0.05] rounded-full blur-3xl" />
          </div>

          {/* Mobile Header (Mobile only) */}
          <div className="lg:hidden flex items-center justify-between mb-6 pb-3 border-b border-slate-200/80">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-7 h-7">
                <Image
                  src="/mascot-excited.png"
                  alt="MentalMath"
                  fill
                  sizes="28px"
                  loading="eager"
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Mental<span className="text-[#7C4DFF]">Math</span>
              </span>
            </Link>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#7C4DFF]/10 text-[#7C4DFF]">
              Register
            </span>
          </div>

          {/* Form Container */}
          <div className="my-auto w-full max-w-md mx-auto relative z-10">

            {/* Registration Card */}
            <div
              className={`bg-white rounded-[28px] p-6 sm:p-8 border border-[#7C4DFF]/15 shadow-[0_12px_40px_rgba(124,77,255,0.08)] transition-transform duration-200 ${
                isShaking ? 'animate-shake' : ''
              }`}
            >
              
              {/* Card Header & Mascot */}
              <div className="flex flex-col items-center text-center mb-5">
                
                {/* Mobile Mascot Avatar */}
                <div className="lg:hidden relative w-14 h-14 mb-2 animate-float">
                  <Image
                    src={`/mascot-${currentEmotion}.png`}
                    alt="Brain Mascot"
                    fill
                    sizes="56px"
                    className="object-contain drop-shadow-md"
                  />
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Start learning today ✨
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
                  Create your free account to track your progress
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs sm:text-sm font-medium flex items-start gap-2 animate-fade-in"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1">{error}</div>
                </div>
              )}

              {/* Success Banner */}
              {isSuccess && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-medium flex items-center gap-2 animate-fade-in"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Account created! Setting up your dashboard...</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleRegister} className="space-y-3.5">
                
                {/* Full Name Input */}
                <div>
                  <label htmlFor="register-name" className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7C4DFF] transition-colors pointer-events-none">
                      <UserIcon size={17} />
                    </div>
                    <input
                      id="register-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:border-[#7C4DFF] focus:ring-4 focus:ring-[#7C4DFF]/12"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="register-email" className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7C4DFF] transition-colors pointer-events-none">
                      <Mail size={17} />
                    </div>
                    <input
                      id="register-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:border-[#7C4DFF] focus:ring-4 focus:ring-[#7C4DFF]/12"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="register-password" className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7C4DFF] transition-colors pointer-events-none">
                      <Lock size={17} />
                    </div>
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:border-[#7C4DFF] focus:ring-4 focus:ring-[#7C4DFF]/12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]/20"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2 space-y-1 animate-fade-in">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Password strength:</span>
                        <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1 w-full">
                        <div className={`h-full rounded-full transition-colors duration-300 ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
                        <div className={`h-full rounded-full transition-colors duration-300 ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
                        <div className={`h-full rounded-full transition-colors duration-300 ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
                        <div className={`h-full rounded-full transition-colors duration-300 ${strength.score >= 4 ? strength.color : 'bg-slate-200'}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  id="register-submit"
                  type="submit"
                  disabled={loading || isSuccess}
                  className="w-full mt-2 py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#7C4DFF] via-[#8B5CF6] to-[#EC4899] hover:from-[#6D38FF] hover:to-[#DB2777] shadow-[0_4px_16px_rgba(124,77,255,0.35)] hover:shadow-[0_6px_22px_rgba(124,77,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-[#7C4DFF]/30"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Account created!</span>
                    </>
                  ) : (
                    <>
                      <span>Create account</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

              </form>

              {/* Trust Indicators (Positioned directly beneath the Create Account button) */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px] sm:text-[11px] font-semibold text-slate-500">
                <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <ShieldCheck size={13} className="text-[#22C55E]" />
                  <span>Secure Auth</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <Zap size={13} className="text-[#FBBF24]" />
                  <span>Free to Start</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <Smartphone size={13} className="text-[#7C4DFF]" />
                  <span>Sync Devices</span>
                </div>
              </div>

              {/* Bottom Login Prompt */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 text-center">
                <p className="text-xs sm:text-sm text-slate-500 font-normal">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-bold text-[#7C4DFF] hover:text-[#6D38FF] transition-colors focus:outline-none focus:underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECONDARY FOOTER CONTENT (Below the fold)                                 */}
      {/* ========================================================================= */}
      <footer className="w-full bg-slate-900 text-slate-400 py-8 px-6 sm:px-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-wide">MentalMath</span>
            <span className="text-slate-500">•</span>
            <span>© {new Date().getFullYear()} MentalMath Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="text-[#7C4DFF] hover:text-[#9B72FF] font-semibold transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}