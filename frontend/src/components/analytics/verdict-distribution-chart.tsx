"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisResult } from "@/types";

const COLORS: Record<string, string> = {
  legitimate: "#22c55e",
  spam: "#eab308",
  phishing: "#f97316",
  scam: "#ef4444",
};

export function VerdictDistributionChart({ entries }: { entries: AnalysisResult[] }) {
  const counts = entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.verdict] = (acc[entry.verdict] ?? 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([verdict, count]) => ({ verdict, count }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verdict distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="verdict" tick={{ fontSize: 12 }} stroke="currentColor" className="text-muted-foreground" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="currentColor" className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card) / 0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid hsl(var(--border) / 0.5)",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.36)",
                color: "hsl(var(--foreground))"
              }}
              cursor={{ fill: "hsl(var(--muted)/0.4)" }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={1500} animationEasing="ease-out">
              {data.map((entry) => (
                <Cell key={entry.verdict} fill={COLORS[entry.verdict] ?? "#6366f1"} className="hover:opacity-80 transition-opacity" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
