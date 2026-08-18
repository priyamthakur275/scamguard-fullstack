import { Brain, Terminal } from "lucide-react";

interface AIExplanationProps {
  explanation?: string | null;
  executiveSummary?: string | null;
  technicalExplanation?: string | null;
}

export function AIExplanation({
  explanation,
  executiveSummary,
  technicalExplanation,
}: AIExplanationProps) {
  if (!explanation && !executiveSummary && !technicalExplanation) return null;

  if (executiveSummary || technicalExplanation) {
    return (
      <div className="space-y-4">
        {executiveSummary && (
          <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <Brain className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h4 className="mb-1 text-sm font-semibold text-foreground">Executive Summary</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{executiveSummary}</p>
            </div>
          </div>
        )}
        {technicalExplanation && (
          <div className="flex gap-3 rounded-lg border border-muted-foreground/20 bg-muted/30 p-4">
            <Terminal className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <h4 className="mb-1 text-sm font-semibold text-foreground">Technical Details</h4>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap font-mono">{technicalExplanation}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <Brain className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <h4 className="mb-1 text-sm font-semibold text-foreground">AI Analysis</h4>
        <p className="text-sm leading-relaxed text-muted-foreground">{explanation}</p>
      </div>
    </div>
  );
}
