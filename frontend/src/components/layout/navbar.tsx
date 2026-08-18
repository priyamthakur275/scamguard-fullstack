"use client";

import { Menu, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6"
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 md:hidden">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <span className="font-semibold">ScamGuard</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user && (
          <div className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm sm:flex">
            <span className="h-2 w-2 rounded-full bg-risk-low" aria-hidden="true" />
            <span className="max-w-[180px] truncate text-foreground">{user.email}</span>
          </div>
        )}
      </div>
    </motion.header>
  );
}
