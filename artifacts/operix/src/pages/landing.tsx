import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight, Activity, Shield, Zap, Workflow, Users, Key } from "lucide-react";

export default function LandingPage() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-white/5 bg-background/80 backdrop-blur-lg z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={`${basePath}/logo.svg`} alt="Operix" className="h-6" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Operix AI Engine now in beta
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              The Operating System for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Roblox Groups
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Precise, powerful, and commanding. Gain total control over your group's staff operations with AI-driven intelligence and automated workflows.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/sign-up" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Start Building <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="#features" className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                Explore Features
              </Link>
            </div>
          </motion.div>

          {/* Hero Image / Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-card/50 shadow-2xl p-2 backdrop-blur-sm"
          >
            <div className="rounded-lg overflow-hidden border border-white/5 bg-background">
              {/* Mockup Header */}
              <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
              </div>
              {/* Mockup Body */}
              <div className="p-6 grid grid-cols-3 gap-6 h-[400px]">
                <div className="col-span-2 space-y-4">
                  <div className="h-32 rounded-lg border border-white/5 bg-muted/20 p-4">
                    <div className="h-4 w-32 bg-white/10 rounded mb-4" />
                    <div className="flex items-end gap-4 h-16">
                      <div className="w-8 bg-primary/40 rounded-t h-full" />
                      <div className="w-8 bg-primary/60 rounded-t h-3/4" />
                      <div className="w-8 bg-primary/80 rounded-t h-1/2" />
                      <div className="w-8 bg-primary rounded-t h-full" />
                      <div className="w-8 bg-primary/70 rounded-t h-5/6" />
                    </div>
                  </div>
                  <div className="h-48 rounded-lg border border-white/5 bg-muted/20 p-4">
                    <div className="h-4 w-24 bg-white/10 rounded mb-4" />
                    <div className="space-y-3">
                      <div className="h-8 bg-white/5 rounded w-full" />
                      <div className="h-8 bg-white/5 rounded w-full" />
                      <div className="h-8 bg-white/5 rounded w-3/4" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-full rounded-lg border border-white/5 bg-muted/20 p-4">
                    <div className="h-4 w-40 bg-white/10 rounded mb-6" />
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 shrink-0" />
                        <div className="space-y-2 w-full">
                          <div className="h-3 bg-white/10 rounded w-full" />
                          <div className="h-3 bg-white/10 rounded w-2/3" />
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-red-500/20 shrink-0" />
                        <div className="space-y-2 w-full">
                          <div className="h-3 bg-white/10 rounded w-full" />
                          <div className="h-3 bg-white/10 rounded w-4/5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/30 blur-2xl -z-10 opacity-50" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-white/5 bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Command Center Capabilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to scale your staff operations without losing control of quality or security.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Activity, title: "Live Activity Tracking", desc: "Monitor staff sessions, game presence, and actions in real-time. Never wonder who is active." },
              { icon: Shield, title: "Case Management", desc: "A robust ticketing system for staff reports, evidence collection, and automated punishments." },
              { icon: Zap, title: "AI-Powered Insights", desc: "Our engine automatically detects anomalies, suggests promotions, and flags inactivity." },
              { icon: Workflow, title: "Automation Engine", desc: "Build visual rules to automatically demote inactive staff, or reward high performers." },
              { icon: Users, title: "Staff Directory", desc: "A comprehensive database of all personnel with historical records, ranks, and performance scores." },
              { icon: Key, title: "Enterprise Security", desc: "Role-based access control ensures your data is only visible to the right management tiers." }
            ].map((feat, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-card p-6 hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feat.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={`${basePath}/logo.svg`} alt="Operix" className="h-5 grayscale opacity-50" />
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Operix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
