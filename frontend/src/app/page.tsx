"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Lock, ScanSearch, ShieldAlert, Sparkles, Zap, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { FullPageSpinner } from "@/components/ui/spinner";
import { motion, Variants } from "framer-motion";
import { Card } from "@/components/ui/card";

const FEATURES = [
  {
    icon: ScanSearch,
    title: "Real-time Analysis",
    description: "Score any SMS, email, or chat message for scam risk in milliseconds with high precision.",
  },
  {
    icon: Sparkles,
    title: "Explainable AI",
    description: "See exactly which words and phrases drove the model's verdict for complete transparency.",
  },
  {
    icon: BarChart3,
    title: "Trend Analytics",
    description: "Track scam patterns across everything you've analyzed over time in beautiful dashboards.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <FullPageSpinner />;
  if (isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col selection:bg-primary/20">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-background/60 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <ShieldAlert className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">ScamGuard</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Button onClick={() => router.push("/register")} size="sm" className="hidden sm:flex">
            Get started
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <section className="relative px-6 pt-32 pb-24 lg:pt-48 lg:pb-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          <motion.div 
            className="mx-auto flex max-w-5xl flex-col items-center text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
              <Zap className="h-4 w-4" />
              <span>Enterprise-grade NLP & Machine Learning</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="mb-8 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Catch scams before <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                they catch you
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
            >
              Protect your business and customers with real-time, explainable AI.
              Flag phishing attempts, OTP scams, and fraudulent alerts instantly.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Button size="lg" className="h-14 px-8 text-base shadow-premium" onClick={() => router.push("/register")}>
                Start analyzing for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-background/50 backdrop-blur-sm" onClick={() => router.push("/login")}>
                View live demo
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* AI Workflow Visualization Section */}
        <section className="border-t border-white/5 bg-muted/30 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Intelligent Threat Detection</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Our advanced models break down every message to understand intent and assess risk with unprecedented accuracy.</p>
            </div>
            
            <motion.div 
              className="grid gap-8 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <motion.div key={title} variants={itemVariants}>
                  <Card className="glass group relative overflow-hidden p-8 h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-foreground">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{description}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Trust & Security Section */}
        <section className="px-6 py-24">
          <motion.div 
            className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-card/30 p-8 shadow-premium backdrop-blur-xl md:p-16 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-risk-low/10 px-3 py-1 text-sm font-medium text-risk-low">
                <ShieldCheck className="h-4 w-4" />
                Enterprise Security
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl">Your data is locked down</h2>
              <p className="text-lg text-muted-foreground">
                We employ industry-standard encryption, JWT-secured accounts, and strict data retention policies to ensure your privacy is never compromised.
              </p>
              <ul className="grid gap-3 sm:grid-cols-2 text-left">
                {['End-to-end encryption', 'SOC2 Compliant', 'Zero data retention', 'Role-based access'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-foreground font-medium">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative flex-1 w-full max-w-sm lg:max-w-none aspect-square">
              <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
              <div className="relative h-full w-full rounded-2xl border border-white/10 bg-background/50 backdrop-blur-md p-8 shadow-2xl flex items-center justify-center">
                 <Lock className="h-32 w-32 text-primary/80" />
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-background px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">ScamGuard © 2026</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Built with FastAPI, scikit-learn, and Next.js.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
