"use client";

import { useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const ScanTabs = dynamic(() => import("@/components/dashboard/scan-tabs").then(mod => mod.ScanTabs), { ssr: false });
const VerdictCard = dynamic(() => import("@/components/analysis/verdict-card").then(mod => mod.VerdictCard), { ssr: false });
import { scanFile, submitFeedback } from "@/lib/api/messages";
import { ApiError } from "@/lib/api/client";
import { useToast } from "@/hooks/use-toast";
import type { AnalysisResult } from "@/types";
import { Alert } from "@/components/ui/alert";

interface ScanItem {
  id: string;
  file?: File;
  text?: string;
  inputType: string;
  status: "pending" | "scanning" | "done" | "error";
  result?: AnalysisResult;
  error?: string;
}

export const BatchScanner = memo(function BatchScanner() {
  const { toast } = useToast();
  const [items, setItems] = useState<ScanItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScan = useCallback(async (texts: string[], files: File[], inputType: string) => {
    const newItems: ScanItem[] = [];
    
    texts.forEach((text) => {
      newItems.push({
        id: crypto.randomUUID(),
        text,
        inputType,
        status: "pending",
      });
    });

    files.forEach((file) => {
      newItems.push({
        id: crypto.randomUUID(),
        file,
        inputType,
        status: "pending",
      });
    });

    if (newItems.length === 0) return;

    setItems(newItems);
    setIsScanning(true);
    setCurrentIndex(0);

    for (let i = 0; i < newItems.length; i++) {
      setCurrentIndex(i);
      const item = newItems[i]!;
      
      setItems((prev) => 
        prev.map((p, idx) => idx === i ? { ...p, status: "scanning" } : p)
      );

      try {
        const result = await scanFile(item.file || null, item.text || null, item.inputType);
        setItems((prev) => 
          prev.map((p, idx) => idx === i ? { ...p, status: "done", result } : p)
        );
      } catch (err) {
        let errorMessage = "An error occurred during analysis.";
        if (err instanceof ApiError) {
          errorMessage = err.message;
        }
        setItems((prev) => 
          prev.map((p, idx) => idx === i ? { ...p, status: "error", error: errorMessage } : p)
        );
      }
    }

    setIsScanning(false);
    toast({ title: "Scanning complete", variant: "default" });
  }, [toast]);

  const handleFeedback = useCallback(async (itemId: string, predictionId: string, isAccurate: boolean) => {
    try {
      const updated = await submitFeedback(predictionId, isAccurate);
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId && item.result
            ? { ...item, result: updated }
            : item
        )
      );
      toast({ title: "Thanks for the feedback!", variant: "success" });
    } catch {
      toast({ title: "Could not save feedback", variant: "error" });
    }
  }, [toast]);

  return (
    <div className="flex flex-col gap-8">
      <ScanTabs onScan={handleScan} isScanning={isScanning} />

      {isScanning && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden bg-card/40 backdrop-blur-md border border-primary/30 text-primary px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center justify-between"
        >
          <div className="flex items-center gap-3 relative z-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 animate-pulse-glow">
              <span className="h-3 w-3 rounded-full bg-primary animate-ping" />
            </div>
            <span className="font-semibold tracking-wide">AI Engine Analyzing...</span>
          </div>
          <span className="text-sm font-medium relative z-10 opacity-80">
            Item {currentIndex + 1} of {items.length}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </motion.div>
      )}

      {items.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight border-b pb-2">Results</h2>
          <div className="flex flex-col gap-8">
            <AnimatePresence>
              {items.map((item) => {
                if (item.status === "pending" || item.status === "scanning") {
                  return null;
                }

                return (
                  <motion.div 
                    key={item.id} 
                    className="flex flex-col gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md inline-block w-fit">
                      Input: {item.file ? item.file.name : item.text ? (item.text.length > 50 ? item.text.substring(0, 50) + "..." : item.text) : "Unknown"}
                    </div>
                    
                    {item.status === "error" && (
                      <Alert variant="error">{item.error}</Alert>
                    )}
                    
                    {item.status === "done" && item.result && (
                      <VerdictCard 
                        result={item.result} 
                        onFeedback={(isAccurate) => handleFeedback(item.id, item.result!.id, isAccurate)} 
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
});
