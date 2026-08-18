"use client";

import { useEffect, useState, useCallback } from "react";
import { getHistory, submitFeedback } from "@/lib/api/messages";
import { useToast } from "@/hooks/use-toast";
import { HistoryTable } from "@/components/history/history-table";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalysisResult } from "@/types";

export default function HistoryPage() {
  const [entries, setEntries] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getHistory()
      .then(setEntries)
      .catch(() => setError("Could not load your history. Please try again."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleFeedback = useCallback(async (predictionId: string, isAccurate: boolean) => {
    try {
      const updated = await submitFeedback(predictionId, isAccurate);
      setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      toast({ title: "Thanks for the feedback!", variant: "success" });
    } catch {
      toast({ title: "Could not save feedback", variant: "error" });
    }
  }, [toast]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Prediction history</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A record of every message you&apos;ve analyzed, saved to your account.
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        !error && <HistoryTable entries={entries} onFeedback={handleFeedback} />
      )}
    </div>
  );
}
