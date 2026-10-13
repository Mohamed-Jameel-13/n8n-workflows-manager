import { Link } from "react-router";
import { Zap, ArrowRight, Terminal, Globe, BarChart2, Lock, CheckCircle, Github, Twitter, Command, LayoutDashboard, GitBranch, Activity, Search, Bell, XCircle } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Unified Dashboard",
    description: "Monitor all your automations — n8n, WhatsApp, cron — from a single control panel. No tab switching.",
  },
  {
    icon: Zap,
    title: "One-Click Runs",
    description: "Trigger any workflow instantly. Schedule, test, and run automations without touching a terminal.",
  },
  {
    icon: BarChart2,
    title: "Deep Logs",
    description: "Full execution history with timestamps, status codes, and error traces for every automation run.",
  },
  {
    icon: Lock,
    title: "API-First",
    description: "Every action is available via REST API. Integrate AutoFlow into your existing toolchain in minutes.",
  },
];

const steps = [
  { step: "01", title: "Connect", description: "Link your automation tools. n8n, WhatsApp Business, or custom cron jobs." },
  { step: "02", title: "Configure", description: "Set triggers, schedules, and conditions from a clean visual interface." },
  { step: "03", title: "Control", description: "Monitor, debug, and optimize — all from your dashboard." },
];

export function LandingPage() {
  return (
    <div className="landing-bg landing-font" style={{ color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="landing-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Navbar */}
        <nav 
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300"
          style={{
            background: 'rgba(17, 17, 17, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Logo (Left-most) */}
          <div className="flex items-center gap-2 flex-1" style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.04em' }}>
            <Zap size={24} color="#a3e635" fill="#a3e635" />
            AutoFlow
          </div>

          {/* Navigation Links (Center) */}
          <div className="hidden md:flex gap-6 absolute left-1/2 -translate-x-1/2">
            <a href="#about" className="glass-nav-link" style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em', cursor: 'pointer' }}>
              About
            </a>
            <a href="#features" className="glass-nav-link" style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em', cursor: 'pointer' }}>
              Features
            </a>
            <a href="#pricing" className="glass-nav-link" style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em', cursor: 'pointer' }}>
              Pricing
            </a>
          </div>

          {/* Login (Right-most) */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <Link to="/login" className="glass-nav-link" style={{ fontSize: '16px', fontWeight: 600 }}>Login</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div id="about" className="flex items-center justify-center relative w-full p-4 my-24">
          <div className="relative flex flex-col items-center justify-center w-full max-w-5xl">
            <h1 
              className="text-center"
              style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '24px', color: '#fff' }}
            >
              Automate your workflows<br />without the headache
            </h1>
            <p className="text-center mb-12" style={{ fontSize: '1.25rem', color: '#9CA3AF', maxWidth: '600px', lineHeight: 1.6 }}>
              Connect n8n, WhatsApp, and cron jobs. Trigger, monitor, and debug from one unified dashboard.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 mb-16">
              <Link to="/signup" className="glass-button glass-button-primary" style={{ padding: '12px 32px', fontSize: '16px' }}>
                Start for free
              </Link>
              <Link to="/dashboard" className="glass-button" style={{ padding: '12px 32px', fontSize: '16px' }}>
                View Dashboard
              </Link>
            </div>

            {/* Dashboard Interface Component Preview */}
            <div className="glass-card w-full rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              {/* Fake Mac Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              
              {/* Fake App Body */}
              <div className="flex" style={{ height: '400px' }}>
                {/* Fake Sidebar */}
                <div className="w-64 border-r border-white/10 p-4 hidden md:flex flex-col gap-1" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-2 mb-6 px-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a3e635, #65a30d)' }}>
                      <Zap size={14} color="#000" fill="#000" />
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>AutoFlow</span>
                  </div>
                  <div className="px-3 py-2 rounded-lg mb-0.5 flex items-center gap-3" style={{ backgroundColor: 'rgba(163,230,53,0.15)', color: '#a3e635', fontSize: '13px', fontWeight: 500 }}>
                    <LayoutDashboard size={15} /> Dashboard
                  </div>
                  <div className="px-3 py-2 rounded-lg mb-0.5 flex items-center gap-3" style={{ color: '#9CA3AF', fontSize: '13px' }}>
                    <Zap size={15} /> Automations
                  </div>
                  <div className="px-3 py-2 rounded-lg mb-0.5 flex items-center gap-3" style={{ color: '#9CA3AF', fontSize: '13px' }}>
                    <GitBranch size={15} /> Workflows
                  </div>
                  <div className="px-3 py-2 rounded-lg mb-0.5 flex items-center gap-3" style={{ color: '#9CA3AF', fontSize: '13px' }}>
                    <Activity size={15} /> Activity
                  </div>
                  <div className="mt-auto px-3 py-2 flex items-center gap-2 rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a3e635, #65a30d)', color: '#000', fontSize: '10px', fontWeight: 700 }}>JD</div>
                    <div className="flex flex-col">
                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#F9FAFB', lineHeight: 1.2 }}>John Doe</span>
                      <span style={{ fontSize: '10px', color: '#6B7280', lineHeight: 1.2 }}>Pro plan</span>
                    </div>
                  </div>
                </div>
                
                {/* Fake Main Content */}
                <div className="flex-1 p-6 flex flex-col gap-6" style={{ backgroundColor: 'transparent' }}>
                  {/* Top Bar */}
                  <div className="flex justify-between items-center">
                    <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>Dashboard</div>
                    <div className="flex gap-3">
                      <div className="px-3 py-1.5 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Search size={12} color="#9CA3AF" />
                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Search...</span>
                      </div>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                        <Bell size={13} color="#9CA3AF" />
                      </div>
                    </div>
                  </div>
                  
                  {/* KPI Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="glass-card p-3 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={14} color="#a3e635" />
                        <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>Total Auto...</span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>6</div>
                    </div>
                    <div className="glass-card p-3 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={14} color="#22C55E" />
                        <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>Enabled</span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>5</div>
                    </div>
                    <div className="glass-card p-3 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity size={14} color="#8B5CF6" />
                        <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>24h Runs</span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>47</div>
                    </div>
                    <div className="glass-card p-3 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle size={14} color="#EF4444" />
                        <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>Failed</span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>3</div>
                    </div>
                  </div>

                  {/* Activity Row */}
                  <div className="glass-card flex-1 p-4 rounded-xl flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#F9FAFB' }}>Recent Activity</span>
                      <span style={{ fontSize: '11px', color: '#a3e635', fontWeight: 500 }}>View all ↗</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          <span style={{ fontSize: '12px', color: '#E5E7EB' }}>WhatsApp Customer Support</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '10px', backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>Success</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          <span style={{ fontSize: '12px', color: '#E5E7EB' }}>Slack Notification Bot</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '10px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>Failed</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          <span style={{ fontSize: '12px', color: '#E5E7EB' }}>Database Backup Scheduler</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '10px', backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>Success</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="px-8 py-24" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 48, fontWeight: 700, color: '#F9FAFB', letterSpacing: '-0.04em', marginBottom: 14 }}>
              everything you need
            </h2>
            <p style={{ fontSize: 18, color: '#9CA3AF', maxWidth: 480, margin: '0 auto', letterSpacing: '-0.02em' }}>
              From one-off scripts to complex multi-step workflows.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="glass-card p-8">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <Icon size={24} color="#fff" />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 600, color: '#F9FAFB', marginBottom: 12, letterSpacing: '-0.02em' }}>{feature.title}</h3>
                  <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.65 }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="px-8 py-24" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 48, fontWeight: 700, color: '#F9FAFB', letterSpacing: '-0.04em' }}>
              three easy steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 glass-card p-12">
            {steps.map((step) => (
              <div key={step.step} className="relative">
                <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.2)', fontWeight: 800, letterSpacing: '-0.05em', marginBottom: 12 }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 600, color: '#F9FAFB', marginBottom: 10, letterSpacing: '-0.02em' }}>{step.title}</h3>
                <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.65 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-8 py-24" style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 48, fontWeight: 700, color: '#F9FAFB', letterSpacing: '-0.04em', marginBottom: 12 }}>
              transparent pricing
            </h2>
            <p style={{ fontSize: 18, color: '#9CA3AF' }}>No surprises. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Starter */}
            <div className="glass-card p-8">
              <div style={{ fontSize: 16, fontWeight: 600, color: '#9CA3AF', marginBottom: 16, letterSpacing: '-0.02em' }}>STARTER</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 56, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.04em' }}>$0</span>
                <span style={{ fontSize: 16, color: '#9CA3AF' }}>/month</span>
              </div>
              <p style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 32 }}>For individuals and small projects.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
                {['Up to 5 automations', '1,000 runs/month', 'Community support', 'Basic logs'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={18} color="#a3e635" />
                    <span style={{ fontSize: 16, color: '#E5E7EB' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="glass-button w-full">get started</Link>
            </div>

            {/* Pro */}
            <div className="glass-card p-8" style={{ border: '1px solid rgba(163, 230, 53, 0.4)', boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(163, 230, 53, 0.2)' }}>
              <div className="flex items-center gap-3 mb-4">
                <span style={{ fontSize: 16, fontWeight: 600, color: '#9CA3AF', letterSpacing: '-0.02em' }}>PRO</span>
                <span className="px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(163, 230, 53, 0.2)', color: '#a3e635', fontSize: 12, fontWeight: 700 }}>Most Popular</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 56, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.04em' }}>$29</span>
                <span style={{ fontSize: 16, color: '#9CA3AF' }}>/month</span>
              </div>
              <p style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 32 }}>For teams running production automations.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
                {['Unlimited automations', '100k runs/month', 'Priority support', 'Deep logs', 'API access'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={18} color="#a3e635" />
                    <span style={{ fontSize: 16, color: '#E5E7EB' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="glass-button glass-button-primary w-full">
                start pro trial
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-12 mt-12" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-2" style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.04em' }}>
              <Zap size={20} color="#a3e635" fill="#a3e635" />
              AutoFlow
            </div>

            <div className="flex items-center gap-6">
              {['Docs', 'Changelog', 'Status'].map((item) => (
                <a key={item} href="#" className="glass-nav-link" style={{ fontSize: 16 }}>
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <a href="#" className="glass-nav-link"><Github size={20} /></a>
              <a href="#" className="glass-nav-link"><Twitter size={20} /></a>
              <a href="#" className="glass-nav-link"><Terminal size={20} /></a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
