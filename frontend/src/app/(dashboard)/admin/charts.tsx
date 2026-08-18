"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const dailyScansData = [
  { name: "Mon", scans: 400 },
  { name: "Tue", scans: 300 },
  { name: "Wed", scans: 550 },
  { name: "Thu", scans: 200 },
  { name: "Fri", scans: 450 },
  { name: "Sat", scans: 350 },
  { name: "Sun", scans: 600 },
];

const threatDistributionData = [
  { name: "Phishing", value: 400 },
  { name: "Spam", value: 300 },
  { name: "Malware", value: 300 },
  { name: "Safe", value: 2000 },
];

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

export function DailyScansChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailyScansData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="var(--muted-foreground)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="var(--muted-foreground)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}`} 
          />
          <Tooltip 
            cursor={{ fill: "var(--muted)" }}
            contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "6px" }}
          />
          <Bar dataKey="scans" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ThreatDistributionChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={threatDistributionData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {threatDistributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "6px" }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
