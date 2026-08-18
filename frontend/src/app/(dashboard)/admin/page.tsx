"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Users, ShieldAlert, Activity, Cpu } from "lucide-react";
import { motion, Variants } from "framer-motion";

const AdminChart = dynamic(() => import("@/components/dashboard/admin-chart"), { ssr: false });

const mockData = [
  { name: 'Mon', scans: 140 },
  { name: 'Tue', scans: 310 },
  { name: 'Wed', scans: 220 },
  { name: 'Thu', scans: 427 },
  { name: 'Fri', scans: 518 },
  { name: 'Sat', scans: 323 },
  { name: 'Sun', scans: 234 },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock role check simulation
    const checkAdmin = async () => {
      // In a real app this would be a /users/me call or checking a token claim
      setTimeout(() => {
        setIsAdmin(true); 
        setLoading(false);
      }, 500);
    };
    checkAdmin();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground text-sm">Verifying access...</p>
      </div>
    </div>
  );
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-destructive/10 border border-destructive text-destructive px-8 py-6 rounded-xl flex flex-col items-center gap-3">
          <ShieldAlert className="h-10 w-10" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-sm">You need administrator privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Overview</h1>
        <p className="text-muted-foreground">Monitor system health, usage statistics, and threat distributions.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Users", value: "1,245", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Total Scans", value: "45.2k", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10" },
          { title: "System Health", value: "99.9%", icon: Activity, color: "text-green-500", bg: "bg-green-500/10" },
          { title: "AI Usage", value: "85%", icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10" }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <span className="text-3xl font-bold relative z-10">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-8 h-[400px] flex flex-col shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Daily Scans</h2>
          <p className="text-sm text-muted-foreground">Number of messages scanned over the last 7 days</p>
        </div>
        <div className="flex-1 w-full min-h-0">
          <AdminChart data={mockData} />
        </div>
      </motion.div>
    </motion.div>
  );
}
