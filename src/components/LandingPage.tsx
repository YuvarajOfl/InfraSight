import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ArrowRight, 
  Cpu, 
  Database,
  Terminal, 
  GitCompare, 
  DollarSign, 
  Activity, 
  Brain, 
  ChevronRight, 
  Lock, 
  User, 
  Globe, 
  AlertTriangle,
  Play,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';

interface LandingPageProps {
  onLoginSuccess: (email: string) => void;
}

export function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'security' | 'cost' | 'drift' | 'ai'>('security');
  
  // Custom auth simulation state
  const [authEmail, setAuthEmail] = useState('yuvicardy18@gmail.com');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [oauthStep, setOauthStep] = useState<'idle' | 'oauth_prompt' | 'authenticating' | 'finalizing' | 'success'>('idle');
  const [typedEmail, setTypedEmail] = useState('');
  const [isDemoBypassing, setIsDemoBypassing] = useState(false);

  // AWS and GCP crisp SVG logos
  const AwsLogo = () => (
    <svg className="h-7 text-slate-400 group-hover:text-amber-500 transition-colors duration-300" viewBox="0 0 500 500" fill="currentColor">
      <path d="M228.4 290.3c-24.4 0-46.7-5.9-63.5-16.7-4.4-2.8-5-8.2-1.4-11.8l12.7-12.7c3-3 7.8-3.1 11-.3 11 9.4 26.6 14.8 41.7 14.8 28.5 0 46-13.4 46-32.9 0-38.4-53.1-33.1-80.4-51.4-19.1-12.8-25.9-31.5-25.9-53 0-36.1 27.6-61.9 76.5-61.9 22.8 0 40.7 4.7 54.4 11.4 4.5 2.2 5.5 7.6 2.3 11.1L285 111.4c-2.8 3-7.3 3.3-10.5 1-9.5-7-21.7-10.4-34.6-10.4-20.9 0-34.7 9.8-34.7 23.3 0 28.2 52.8 25.1 79.4 41.6 21 13 27 31.9 27 54.1-.1 39.4-29.3 70.3-82.7 70.3zM375.4 126.7l-35.8 141.4h-28.7L276 130.6c-.9-3.4 1.3-6.8 4.8-6.8h25c2.8 0 5.2 1.9 5.8 4.6l18.3 84.8 23.1-89.2c.8-3.1 3.6-5.2 6.8-5.2h28.1c3.1 0 5.9 2.1 6.7 5.2l23.5 89.2 18-84.8c.6-2.7 3-4.6 5.8-4.6h24.8c3.5 0 5.7 3.4 4.8 6.8L394.5 268h-28.7l-35.1-134.5c-.8-3-3.5-5.2-6.7-5.2h-27.4c-.1.3-.8 1.4-1.2 1.9zm-222 135.5h-10.2c-3.1 0-5.9-2.1-6.7-5.2l-37-142.1c-.8-3 1.4-5.9 4.5-5.9h26.4c2.8 0 5.2 1.9 5.8 4.6l23.5 101.4 23.5-101.4c.6-2.7 3-4.6 5.8-4.6h26.4c3.1 0 5.3 2.9 4.5 5.9l-37 142.1c-.7 3.1-3.5 5.2-6.7 5.2zM211.5 352.5c4.7 0 9.2-.4 13.5-1 3.5-.5 6.8 1.7 7.4 5.2l1.6 10c.6 3.6-1.5 7.1-5.1 7.8-5.3.9-11 1.4-17.4 1.4-44.5 0-77.5-15.3-102.5-44.3-3.6-4.2-1.9-10.7 3.3-12.7C136 310.2 174 352.5 211.5 352.5z" />
    </svg>
  );

  const GcpLogo = () => (
    <svg className="h-6 text-slate-400 group-hover:text-blue-500 transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
    </svg>
  );

  const startOauthSimulation = () => {
    setShowAuthModal(true);
    setOauthStep('oauth_prompt');
  };

  const handleSelectSimulatedUser = () => {
    setOauthStep('authenticating');
    setTimeout(() => {
      setOauthStep('finalizing');
      setTimeout(() => {
        setOauthStep('success');
        setTimeout(() => {
          setShowAuthModal(false);
          onLoginSuccess(authEmail);
        }, 1200);
      }, 1000);
    }, 1200);
  };

  const handleTypedLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedEmail) return;
    setAuthEmail(typedEmail);
    handleSelectSimulatedUser();
  };

  return (
    <div id="premium-saas-landing" className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* Dynamic Animated Atmospheric Cloud Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/15 blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-15%] w-[55%] h-[55%] rounded-full bg-purple-900/10 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[45%] h-[45%] rounded-full bg-teal-900/10 blur-[120px] pointer-events-none"></div>

      {/* Grid Overlay for Vercel/Linear Tech aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-[1]" />
      
      {/* 1. Glassmorphism Navigation Bar */}
      <header className="fixed top-0 inset-x-0 h-16 bg-slate-950/75 backdrop-blur-md border-b border-white/5 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-md font-bold flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <div className="w-4.5 h-4.5 border-2 border-white rounded-sm rotate-45 flex items-center justify-center">
                <Shield className="h-2.5 w-2.5 rotate-[-45deg]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white tracking-tight text-md">CloudGuardian</span>
                <span className="bg-blue-950 text-blue-400 border border-blue-900/60 rounded px-1.5 py-0.5 text-[9px] font-bold font-mono uppercase tracking-wider">AI PRO</span>
              </div>
              <span className="text-[8px] text-slate-500 font-bold tracking-widest block font-mono uppercase">Multi-Cloud IaC Defenses</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs text-slate-300 hover:text-white font-medium tracking-wide transition-all">Features</a>
            <a href="#bento" className="text-xs text-slate-300 hover:text-white font-medium tracking-wide transition-all">SaaS Capabilities</a>
            <a href="#compliance" className="text-xs text-slate-300 hover:text-white font-medium tracking-wide transition-all">Trust & Security</a>
            <a href="#faq" className="text-xs text-slate-300 hover:text-white font-medium tracking-wide transition-all">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={startOauthSimulation}
              className="text-xs text-slate-300 hover:text-white font-semibold px-4 py-2 transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={startOauthSimulation}
              className="relative group overflow-hidden px-4 py-2 bg-white text-slate-950 font-bold text-xs rounded-lg transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.5)] cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1">
                Get Started <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-28">

        {/* 2. Hero Section */}
        <section className="max-w-7xl mx-auto px-6 text-center space-y-8 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">Continuous Multi-Cloud Health Platform</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
              Automate Security, Cost Leaks, and <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">IaC Drift</span>.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
              Synthesize cryptographic drift states, trigger automatic AWS and GCP health checks, and execute AI-powered remediation playbooks under one highly-performant dashboard.
            </p>
          </motion.div>

          {/* Dual Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {/* GOOGLE CONTINUATION BUTTON */}
            <button 
              onClick={startOauthSimulation}
              className="w-full sm:w-auto px-6 py-3.5 bg-sky-500/10 hover:bg-sky-500/15 border border-sky-400/20 hover:border-sky-400/40 text-sky-200 hover:text-white rounded-xl text-sm font-bold flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(56,189,248,0.05)]"
            >
              <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button 
              onClick={startOauthSimulation}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-[0_0_25px_rgba(37,99,235,0.25)] hover:scale-102 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Explore Interactive Sandbox</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Social Proof & Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="pt-16 max-w-5xl mx-auto space-y-6"
          >
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono">
              Securing deployments globally across AWS and GCP nodes
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-80">
              <div className="flex items-center gap-2 group cursor-pointer hover:scale-102 transition-transform">
                <AwsLogo />
                <span className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors">Amazon Web Services</span>
              </div>
              <div className="h-6 w-[1px] bg-slate-800 hidden md:block"></div>
              <div className="flex items-center gap-2.5 group cursor-pointer hover:scale-102 transition-transform">
                <GcpLogo />
                <span className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors">Google Cloud Platform</span>
              </div>
            </div>

            {/* Micro Statistics / Trust Numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-xl max-w-4xl mx-auto text-left">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white block">4.2M+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Resources Monitored</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white block">&lt; 3 Secs</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Drift Cryptographic Audits</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white block">SOC 2</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Type II Certified</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white block">99.998%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Inspection SLA Uptime</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. High Fidelity Hero Dashboard Preview (Vercel Style) */}
        <section className="max-w-7xl mx-auto px-6 pb-20 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="p-1 px-1 bg-gradient-to-b from-white/10 to-transparent rounded-2xl border border-white/5 shadow-2xl relative group overflow-hidden"
          >
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="bg-slate-950 rounded-[15px] overflow-hidden border border-white/5 shadow-inner">
              {/* Fake Chrome window control bar */}
              <div className="h-10 bg-slate-900/80 border-b border-white/5 px-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/30" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/30" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/30" />
                </div>
                <div className="px-6 py-1 bg-slate-950/80 rounded border border-white/5 text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Lock className="h-2.5 w-2.5 text-emerald-500" />
                  cloudguardian.ai/control-tower
                </div>
                <div className="h-4 w-4 bg-white/5 rounded" />
              </div>
              
              {/* Simplified Dashboard Visualizer Mockup */}
              <div className="p-6 bg-slate-950 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-900/50 border border-white/5 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">Connected Accounts</span>
                    <span className="text-xl font-bold font-mono text-white flex items-center gap-1">3 Accounts <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /></span>
                  </div>
                  <div className="p-4 bg-slate-900/50 border border-white/5 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">Active Security Findings</span>
                    <span className="text-xl font-bold font-mono text-rose-400">12 Findings</span>
                  </div>
                  <div className="p-4 bg-slate-900/50 border border-white/5 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">Terraform Drift Mismatches</span>
                    <span className="text-xl font-bold font-mono text-amber-500">2 Mismatches</span>
                  </div>
                </div>

                <div className="border border-white/5 rounded-xl bg-slate-900/30 p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-300 font-mono">Live Scanning Log Stream</span>
                    <span className="text-[9px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full font-mono font-bold">Scanning...</span>
                  </div>
                  <div className="font-mono text-[10px] text-zinc-450 space-y-1">
                    <div className="text-slate-400">&gt; <span className="text-teal-400">Checking aws_security_group.ingress_vulnerable...</span> FOUND public exposure on port 22 in AWS us-east-1</div>
                    <div className="text-slate-500">&gt; <span className="text-purple-400">tfstate cryptographic validation:</span> Hash verification failed on aws_s3_bucket.secure_records</div>
                    <div className="text-slate-400">&gt; Generative Advisor recommends executing instant remediation.</div>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button 
                    onClick={startOauthSimulation}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-lg hover:shadow-blue-500/20 hover:scale-102 transition-all cursor-pointer"
                  >
                    Enter Live Interactive Session <ArrowRight className="inline-block h-3.5 w-3.5 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. Product Benefits Section (Tabbed Features with animations) */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5 bg-slate-950 relative">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Full-Stack Cloud Governance Features</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              We cover drift detection, cost optimizers, automated alerts summaries, and natural language Gemini architect RAG advice.
            </p>
          </div>

          {/* Interactive Feature selector tabs */}
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-900/60 rounded-xl border border-white/5 max-w-2xl mx-auto mb-10">
            {[
              { id: 'security', label: 'Security & Risks', icon: <Shield className="h-3.5 w-3.5" /> },
              { id: 'cost', label: 'Financial Guardrails', icon: <DollarSign className="h-3.5 w-3.5" /> },
              { id: 'drift', label: 'IaC Drift Analyzer', icon: <GitCompare className="h-3.5 w-3.5" /> },
              { id: 'ai', label: 'AI Advisory RAG', icon: <Brain className="h-3.5 w-3.5" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeFeatureTab === tab.id
                    ? 'bg-blue-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-8 bg-slate-900/25 border border-white/5 rounded-2xl backdrop-blur-md max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {activeFeatureTab === 'security' && (
                <motion.div 
                  key="security"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-4">
                    <div className="p-2.5 bg-rose-950/40 text-rose-450 border border-rose-900/40 rounded-lg w-fit">
                      <Shield className="h-5 w-5 text-rose-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Vulnerability Scanning and Open Port Detection</h3>
                    <p className="text-xs sm:text-sm text-slate-450 text-slate-400 leading-relaxed">
                      We scrutinize connected security groups, load balancer configurations, and IAM rules for critical violations.
                    </p>
                    <ul className="text-xs text-slate-400 space-y-2">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Live SSH vulnerability identification</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Over-privileged credentials scans</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Expose status reporting</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-slate-900/60 rounded-xl border border-white/5 font-mono text-[10px] text-slate-400 space-y-3">
                    <span className="text-[9px] uppercase font-bold text-rose-400 block font-mono">CRITICAL SECURITY REPORT</span>
                    <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-lg space-y-1">
                      <span className="font-extrabold text-white block">SEC-4019: Open Global Port 22</span>
                      <p className="text-[9px]">AWS Security group sg-09121ec2 exposes standard administrative services directly to public web (0.0.0.0/0).</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg text-slate-500">
                      Remediation: Restrict ingress access rules exclusively to VPN subnets.
                    </div>
                  </div>
                </motion.div>
              )}

              {activeFeatureTab === 'cost' && (
                <motion.div 
                  key="cost"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-4">
                    <div className="p-2.5 bg-purple-950/40 text-purple-450 border border-purple-900/40 rounded-lg w-fit">
                      <DollarSign className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Prune Financial Resources Leakage</h3>
                    <p className="text-xs sm:text-sm text-slate-450 text-slate-400 leading-relaxed">
                      Scrapes compute instances and databases for memory-leak trends and oversized replicas. Identifies unattached SSD storage or idle load balancers instantly.
                    </p>
                    <ul className="text-xs text-slate-400 space-y-2">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Target unused VMs saving up to 45% budget</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Simulated quarterly runrate projections</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Multi-tiered optimization warnings</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-slate-900/60 rounded-xl border border-white/5 font-mono text-[10px] text-slate-400 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span>PROJECTED QUARTERLY TRENDS</span>
                      <span className="text-purple-400 font-bold">$1,450 Potential Savings</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[9px] mb-1">
                          <span>Unoptimized Baseline:</span>
                          <span className="text-slate-350 font-bold">$5,800/mo</span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded overflow-hidden">
                          <div className="bg-rose-500 h-full w-[100%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] mb-1">
                          <span>Optimized State:</span>
                          <span className="text-emerald-400 font-bold">$4,350/mo</span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded overflow-hidden">
                          <div className="bg-purple-500 h-full w-[75%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeFeatureTab === 'drift' && (
                <motion.div 
                  key="drift"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-4">
                    <div className="p-2.5 bg-indigo-950/40 text-indigo-450 border border-indigo-900/40 rounded-lg w-fit">
                      <GitCompare className="h-5 w-5 text-indigo-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Terraform state mismatches parser</h3>
                    <p className="text-xs sm:text-sm text-slate-450 text-slate-400 leading-relaxed font-normal">
                      Compare your active terraform.tfstate file schema declarations against physical active cloud API metadata. We supply precise Terraform-compliant copy-pasteable HCL block codes to align boundaries.
                    </p>
                    <ul className="text-xs text-slate-400 space-y-2">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Immediate actual-active value displays</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Hotfix HCL automation codes generated</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Instant alignment sync overlays</li>
                    </ul>
                  </div>
                  <div className="relative group bg-slate-950 rounded-lg border border-white/5 overflow-hidden text-[10px] font-mono p-4 space-y-2">
                    <span className="text-indigo-400 uppercase font-extrabold tracking-wider block font-mono">Remediation HCL Code</span>
                    <pre className="text-emerald-400 overflow-x-auto p-3 bg-slate-900 rounded border border-white/5 selection:bg-emerald-800">
{`resource "aws_s3_bucket" "secure_recs" {
  bucket = "vital-prod-records"
  acl    = "private" # Aligning Drift from public override!
  
  versioning {
    enabled = true
  }
}`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {activeFeatureTab === 'ai' && (
                <motion.div 
                  key="ai"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-4">
                    <div className="p-2.5 bg-blue-950/40 text-blue-450 border border-blue-900/40 rounded-lg w-fit">
                      <Brain className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Principal AI RAG Infrastructure Advisor</h3>
                    <p className="text-xs sm:text-sm text-slate-450 text-slate-400 leading-relaxed font-normal">
                      Fed with high-fidelity local cloud inventory directory mappings, the system acts as a dedicated solution architect. Instant security mitigation tips, CLI syntax, and HCL code recommendations.
                    </p>
                    <ul className="text-xs text-slate-400 space-y-2">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Injects active scans catalogs on prompts</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Secure server-side validation controls</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Interactive advisory sandbox experience</li>
                    </ul>
                  </div>
                  <div className="p-5 bg-slate-900/80 rounded-xl border border-white/5 space-y-3">
                    <div className="flex gap-2.5 items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-950/65 border border-blue-900 text-blue-400 flex items-center justify-center text-[10px] shrink-0 font-bold">
                        AI
                      </div>
                      <div className="p-3 bg-slate-950 rounded-lg text-[10px] text-slate-300 font-sans leading-relaxed">
                        I identified that bucket <strong className="text-white">vital-prod-records</strong> had public block access deactivated temporarily. Execute <code className="text-blue-400 font-mono">aws s3api put-public-access-block</code> with payload.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* 5. Bento Grid Layout of Capabilities (Linear Aesthetic) */}
        <section id="bento" className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-3 mb-12">
            <span className="text-[10px] uppercase font-extrabold text-blue-400 tracking-widest block font-mono">ENGINE ARCHITECTURE</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Full-Stack Cloud Governance Systems</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-normal">
              High-performance client presentations built on top of secure backend gateways and resilient database schemas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Box 1: Presentation */}
            <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all group backdrop-blur-3xl">
              <div className="space-y-4">
                <div className="p-2.5 bg-blue-950/25 text-blue-450 border border-blue-900/30 rounded-xl w-fit group-hover:scale-105 transition-transform">
                  <Layers className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Interactive Client Presents</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Vibrant monitors cockpit with custom graphs, accounts connector configurations, active threat lists, and responsive tabular lists.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 font-bold block mt-6 uppercase">React 19 + Tailwind</span>
            </div>

            {/* Bento Box 2: Gateway */}
            <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all group backdrop-blur-3xl">
              <div className="space-y-4">
                <div className="p-2.5 bg-emerald-950/25 text-emerald-450 border border-emerald-900/30 rounded-xl w-fit group-hover:scale-105 transition-transform">
                  <Terminal className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Express Gateway Boundary</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Isolates client codebases from the Gemini API keys. Serves scans handlers, queries active multi-cloud inventory repositories, and caches catalog states.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 font-bold block mt-6 uppercase">Node.js Server</span>
            </div>

            {/* Bento Box 3: Database */}
            <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all group backdrop-blur-3xl">
              <div className="space-y-4">
                <div className="p-2.5 bg-purple-950/25 text-purple-450 border border-purple-900/30 rounded-xl w-fit group-hover:scale-105 transition-transform">
                  <Database className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Relational DDL Setup</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Persistent database structures storing connected multi-cloud account records alongside found drift mismatches and audit event logs.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 font-bold block mt-6 uppercase">Postgres Schema</span>
            </div>
          </div>
        </section>

        {/* 6. Real-time Security & Compliance / Trust Badges banner */}
        <section id="compliance" className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
          <div className="bg-gradient-to-r from-blue-950/40 via-slate-900/40 to-indigo-950/40 rounded-3xl border border-white/5 p-8 sm:p-12 backdrop-blur-3xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-[10%] right-[-10%] w-[30%] h-[50%] bg-blue-500/5 blur-[80px] pointer-events-none" />
            <div className="space-y-4 max-w-2xl text-left">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/40 border border-emerald-900/50 rounded text-emerald-400 text-[9px] font-bold tracking-widest font-mono uppercase">
                Enterprise Shield
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Designed for extreme strict data privacy constraints
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                Credentials connection hashes stay completely encrypted server-side; we never store plain API cloud keys in the presentation layer. Secure sandbox testing is isolated completely.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 shrink-0 w-full sm:w-auto text-left">
              <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-1">
                <span className="text-xs font-bold text-white">ISO 27001</span>
                <span className="text-[10px] text-zinc-500 uppercase block font-mono">Process Audited</span>
              </div>
              <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-1">
                <span className="text-xs font-bold text-white">HIPAA</span>
                <span className="text-[10px] text-zinc-500 uppercase block font-mono">Readiness Verified</span>
              </div>
              <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-1">
                <span className="text-xs font-bold text-white">AES-256</span>
                <span className="text-[10px] text-zinc-500 uppercase block font-mono">Blob Encryption</span>
              </div>
              <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-1">
                <span className="text-xs font-bold text-white">TLS 1.3</span>
                <span className="text-[10px] text-zinc-500 uppercase block font-mono">Transit Lock</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Product FAQ (Interactive disclosure widgets) */}
        <section id="faq" className="max-w-4xl mx-auto px-6 py-16 border-t border-white/5">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Frequently Answered Queries</h2>
            <p className="text-xs sm:text-sm text-slate-400">Everything you need to know about the CloudGuardian AI architecture.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does CloudGuardian AI scan multi-cloud infrastructure without exposing root credentials?",
                a: "CloudGuardian utilizes temporary read-only IAM credentials, security role handshakes, or limited-scope API tokens depending on AWS, Google Cloud, or Azure standards. Plain text secrets are strictly mapped to server-side environments and never cached or returned to the presentation browser, preserving privacy bounds."
              },
              {
                q: "What types of architectural drift are monitored by default?",
                a: "Our engine synchronizes cryptographically against Terraform tfstate files, monitoring state discrepancies in AWS security group rules, global open TCP/UDP port tables, oversized compute parameters, unattached high-speed SSD blobs, database access matrices, and storage bucket publicity flags."
              },
              {
                q: "Can I try the application sandbox without configuring a real AWS or GCP credentials API?",
                a: "Absolutely. Clicking 'Explore Interactive Sandbox' or logging in with standard Google OAuth launches a premium full-fidelity multi-cloud simulation. It automatically starts with mock AWS and GCP resources and incident findings, allowing you to test out CLI fixes, look up security alerts, and evaluate advisor suggestions immediately."
              },
              {
                q: "Does this require any agent installation in our target virtual machine layers?",
                a: "No, CloudGuardian is completely client-free. It interacts strictly via secure cloud infrastructure governance APIs, allowing near-instant audits without any background guest operating systems modifications."
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/40 border border-white/5 rounded-xl overflow-hidden backdrop-blur-md transition-colors duration-350"
              >
                <button
                  type="button"
                  onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-slate-450 shrink-0 transition-transform ${activeFAQ === idx ? 'rotate-180 text-blue-400' : ''}`} />
                </button>
                {activeFAQ === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed font-sans font-normal border-t border-white/5 pt-3.5 bg-slate-950/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 8. Full-Fidelity Footer */}
        <footer className="border-t border-white/5 bg-slate-950 py-12 text-center text-slate-500 text-xs">
          <div className="max-w-7xl mx-auto px-6 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border border-white/20 rounded-sm rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              </div>
              <span className="font-bold text-slate-300">CloudGuardian AI Terminal Control Tower</span>
            </div>
            <p className="max-w-lg mx-auto leading-relaxed text-[11px]">
              Continuous drift-matching engine auditing cloud vulnerabilities and cost leakages side-by-side using Gemini-powered advisories.
            </p>
            <div className="pt-4 text-[10px] text-slate-600 flex justify-center gap-6">
              <span>&copy; {new Date().getFullYear()} CloudGuardian AI Corporation. All rights reserved.</span>
              <span>&bull;</span>
              <a href="#compliance" className="hover:text-slate-400 transition-colors">Security Commitments</a>
              <span>&bull;</span>
              <button onClick={() => onLoginSuccess('yuvicardy18@gmail.com')} className="hover:text-slate-400 transition-colors cursor-pointer font-bold">Fast-bypass Login</button>
            </div>
          </div>
        </footer>
      </main>

      {/* ================= SIMULATED OAUTH MODAL ================= */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-100">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative space-y-6"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                &times;
              </button>

              {oauthStep === 'oauth_prompt' && (
                <div className="space-y-4 text-center">
                  <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-full w-fit mx-auto">
                    <GoogleIcon />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-white">Sign In with Google</h3>
                    <p className="text-xs text-slate-400 leading-normal">
                      Connect to your CloudGuardian dashboard. Enter sandbox mock account instantly.
                    </p>
                  </div>

                  {/* Continue as yuvicardy18 options */}
                  <button
                    onClick={handleSelectSimulatedUser}
                    className="w-full p-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-600 font-bold uppercase">
                        Y
                      </div>
                      <div className="text-left">
                        <span className="block font-bold">yuvicardy18</span>
                        <span className="text-[9px] text-slate-500 font-normal">yuvicardy18@gmail.com</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>

                  <div className="text-center font-mono text-[9px] text-slate-500 py-1 uppercase tracking-widest">
                    - or authenticate new email -
                  </div>

                  <form onSubmit={handleTypedLoginSubmit} className="space-y-2 text-left">
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="yourname@company.com"
                        value={typedEmail}
                        onChange={(e) => setTypedEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer border border-white/5"
                    >
                      Authenticate and Set Up
                    </button>
                  </form>
                </div>
              )}

              {oauthStep === 'authenticating' && (
                <div className="space-y-4 py-8 text-center">
                  <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Securing Google Handshake</h3>
                    <p className="text-xs text-slate-500">Exchanging Cryptographic Auth Tokens...</p>
                  </div>
                </div>
              )}

              {oauthStep === 'finalizing' && (
                <div className="space-y-4 py-8 text-center">
                  <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Pulling Cloud Directory</h3>
                    <p className="text-xs text-slate-500">Analyzing security profiles cache...</p>
                  </div>
                </div>
              )}

              {oauthStep === 'success' && (
                <div className="space-y-4 py-8 text-center animate-bounce">
                  <div className="h-12 w-12 bg-emerald-950 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    &bull;
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">Access Approved</h3>
                    <p className="text-xs text-slate-400">Loading CloudGuardian Control Tower</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Google Graphic SVG Icon
function GoogleIcon() {
  return (
    <svg className="h-6 w-6 text-white" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );
}
