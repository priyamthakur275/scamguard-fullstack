import type { Metadata } from "next";
import { BatchScanner } from "./batch-scanner";

export const metadata: Metadata = { title: "Analyze Message" };

export default function AnalyzePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analyze a message</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload files or paste text (SMS, email, URL, etc.) to check for scam and phishing patterns.
        </p>
      </div>
      <BatchScanner />
    </div>
  );
}
