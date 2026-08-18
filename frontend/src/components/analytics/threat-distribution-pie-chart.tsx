"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisResult } from "@/types";

interface Props {
  entries: AnalysisResult[];
}

const COLORS: Record<string, string> = {
  legitimate: "hsl(var(--risk-low))",
  spam: "hsl(var(--risk-medium))",
  phishing: "hsl(var(--risk-high))",
  scam: "hsl(var(--risk-critical))",
};

export function ThreatDistributionPieChart({ entries }: Props) {
  const data = useMemo(() => {
    const counts = entries.reduce((acc, curr) => {
      acc[curr.verdict] = (acc[curr.verdict] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [entries]);

  if (data.length === 0) return null;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Verdict Distribution (Pie)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#cbd5e1"} className="hover:opacity-80 transition-opacity" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background) / 0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid hsl(var(--border) / 0.5)",
                  borderRadius: "0.75rem",
                  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.36)",
                }}
                itemStyle={{ color: "hsl(var(--foreground))", textTransform: "capitalize" }}
              />
              <Legend formatter={(value) => <span className="capitalize">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
