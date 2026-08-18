"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { AlertTriangle, BarChart3, ScanSearch, ShieldAlert } from "lucide-react";
import { getHistory } from "@/lib/api/messages";
import { StatCard } from "@/components/analytics/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { formatPercent } from "@/lib/utils";
import type { AnalysisResult } from "@/types";

const ChartSkeleton = () => <Skeleton className="h-64 w-full" />;

const VerdictDistributionChart = dynamic(
  () => import("@/components/analytics/verdict-distribution-chart").then((m) => m.VerdictDistributionChart),
  { ssr: false, loading: ChartSkeleton },
);

const RiskTrendChart = dynamic(
  () => import("@/components/analytics/risk-trend-chart").then((m) => m.RiskTrendChart),
  { ssr: false, loading: ChartSkeleton },
);

const ThreatDistributionPieChart = dynamic(
  () => import("@/components/analytics/threat-distribution-pie-chart").then((m) => m.ThreatDistributionPieChart),
  { ssr: false, loading: ChartSkeleton },
);

type TimeFilter = "24h" | "7d" | "30d" | "all";

export default function AnalyticsPage() {
  const [allEntries, setAllEntries] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  useEffect(() => {
    getHistory()
      .then(setAllEntries)
      .catch(() => setError("Could not load analytics. Please try again."))
      .finally(() => setIsLoading(false));
  }, []);

  const entries = useMemo(() => {
    if (timeFilter === "all") return allEntries;
    const now = new Date();
    const cutoff = new Date();
    if (timeFilter === "24h") cutoff.setHours(now.getHours() - 24);
    if (timeFilter === "7d") cutoff.setDate(now.getDate() - 7);
    if (timeFilter === "30d") cutoff.setDate(now.getDate() - 30);
    
    return allEntries.filter(e => new Date(e.created_at) >= cutoff);
  }, [allEntries, timeFilter]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <Alert variant="error">{error}</Alert>
      </div>
    );
  }

  if (allEntries.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <EmptyState
          icon={BarChart3}
          title="Nothing to analyze yet"
          description="Once you've scored a few messages, trends and breakdowns will appear here."
          actionHref="/analyze"
          actionLabel="Analyze a message"
        />
      </div>
    );
  }

  const scamCount = entries.filter((e) => e.verdict !== "legitimate").length;
  const highRiskRate = entries.length > 0 ? entries.filter((e) => e.risk_level === "high").length / entries.length : 0;
  const avgThreatScore = entries.length > 0 ? entries.reduce((sum, e) => sum + e.threat_score, 0) / entries.length : 0;

  const categoryCounts = entries.reduce<Record<string, number>>((acc, e) => {
    if (e.scam_category) acc[e.scam_category] = (acc[e.scam_category] ?? 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "None";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Trends across {entries.length} analyzed messages.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border/50">
          {(["24h", "7d", "30d", "all"] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                timeFilter === filter 
                  ? "bg-background text-foreground shadow-sm font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter === "24h" ? "24h" : filter === "7d" ? "7 Days" : filter === "30d" ? "30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total analyzed" value={String(entries.length)} icon={ScanSearch} />
        <StatCard label="Flagged as scam/spam" value={String(scamCount)} icon={ShieldAlert} accent="destructive" />
        <StatCard label="High-risk rate" value={formatPercent(highRiskRate)} icon={AlertTriangle} accent="warning" />
        <StatCard label="Avg. threat score" value={formatPercent(avgThreatScore)} icon={BarChart3} accent="success" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ThreatDistributionPieChart entries={entries} />
        <VerdictDistributionChart entries={entries} />
        <RiskTrendChart entries={entries} />
      </div>

      <p className="text-sm text-muted-foreground">
        Most common scam category: <span className="font-medium text-foreground">{topCategory}</span>
      </p>
    </div>
  );
}
