"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisResult } from "@/types";

export function RiskTrendChart({ entries }: { entries: AnalysisResult[] }) {
  const data = [...entries]
    .reverse()
    .slice(-30)
    .map((entry, index) => ({
      index: index + 1,
      probability: Math.round(entry.scam_probability * 100),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent scam-probability trend</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="index" tick={{ fontSize: 12 }} stroke="currentColor" className="text-muted-foreground" />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              className="text-muted-foreground"
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Scam probability"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card) / 0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid hsl(var(--border) / 0.5)",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.36)",
                color: "hsl(var(--foreground))"
              }}
            />
            <Line 
              type="monotone" 
              dataKey="probability" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 6, strokeWidth: 0, fill: "#ef4444", className: "animate-pulse" }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
