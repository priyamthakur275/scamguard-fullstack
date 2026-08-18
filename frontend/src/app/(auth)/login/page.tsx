import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your ScamGuard account</p>
      </div>
      <Suspense fallback={<div className="h-[400px] w-full animate-pulse rounded-xl bg-muted/50" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
