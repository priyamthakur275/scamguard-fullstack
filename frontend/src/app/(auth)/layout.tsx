import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">ScamGuard</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
