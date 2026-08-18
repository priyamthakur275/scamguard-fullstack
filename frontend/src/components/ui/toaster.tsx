"use client";

import { CheckCircle2, X, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "animate-fade-in flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-lg",
            t.variant === "success" && "border-risk-low/30",
            t.variant === "error" && "border-destructive/30",
          )}
        >
          {t.variant === "success" && <CheckCircle2 className="h-5 w-5 shrink-0 text-risk-low" />}
          {t.variant === "error" && <XCircle className="h-5 w-5 shrink-0 text-destructive" />}
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{t.title}</p>
            {t.description && <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
