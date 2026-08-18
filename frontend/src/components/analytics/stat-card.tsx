"use client";

import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "default" | "success" | "warning" | "destructive";
}

const accentClasses = {
  default: "bg-primary/10 text-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]",
  success: "bg-risk-low/10 text-risk-low shadow-[0_0_15px_rgba(34,197,94,0.5)]",
  warning: "bg-risk-medium/10 text-risk-medium shadow-[0_0_15px_rgba(234,179,8,0.5)]",
  destructive: "bg-risk-high/10 text-risk-high shadow-[0_0_15px_rgba(239,68,68,0.5)]",
};

function Counter({ value }: { value: string }) {
  const numValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const hasPercent = value.includes("%");
  const isDash = value === "—";
  
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) => 
    hasPercent ? `${latest.toFixed(1)}%` : Math.round(latest).toString()
  );

  useEffect(() => {
    if (isDash || isNaN(numValue)) return;
    const controls = animate(count, numValue, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [numValue, isDash, count]);

  if (isDash || isNaN(numValue)) return <>{value}</>;

  return <motion.span>{display}</motion.span>;
}

export function StatCard({ label, value, icon: Icon, accent = "default" }: StatCardProps) {
  return (
    <Card className="glass-panel overflow-hidden relative group">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110", accentClasses[accent])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold text-foreground"><Counter value={value} /></p>
        </div>
      </CardContent>
    </Card>
  );
}
