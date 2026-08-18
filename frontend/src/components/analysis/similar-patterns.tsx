"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

interface SimilarPatternsProps {
  patterns: Array<{ title: string; description: string }> | null | undefined;
}

export function SimilarPatterns({ patterns }: SimilarPatternsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!patterns || patterns.length === 0) return null;

  return (
    <div className="rounded-lg border border-border/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
        type="button"
      >
        <span className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-risk-medium" />
          Similar Scam Patterns
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className="flex flex-col gap-3 border-t border-border/50 px-4 py-3">
          {patterns.map((pattern, i) => (
            <div key={i}>
              <p className="text-sm font-medium text-foreground">{pattern.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{pattern.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
