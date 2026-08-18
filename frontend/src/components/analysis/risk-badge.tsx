import { Badge } from "@/components/ui/badge";
import { riskLevelLabel } from "@/lib/utils";
import type { RiskLevel } from "@/types";

const VARIANT_MAP = {
  low: "success",
  medium: "warning",
  high: "destructive",
} as const;

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <Badge variant={VARIANT_MAP[level] ?? "default"}>{riskLevelLabel(level)}</Badge>;
}
