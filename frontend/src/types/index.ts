// ---- Auth / Users (app_service) ----------------------------------------

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  preferences?: Record<string, unknown>;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

// ---- Prediction (ml_service, via app_service proxy) ---------------------

export type Verdict = "legitimate" | "spam" | "phishing" | "scam";
export type RiskLevel = "low" | "medium" | "high";
export type ThreatLevel = "very_low" | "low" | "medium" | "high" | "critical";

export interface FeatureContribution {
  token: string;
  weight: number;
}

/** Result of a message analysis, persisted server-side by app_service
 * (backend/app_service/api/v1/messages.py) rather than in localStorage.
 */
export interface AnalysisResult {
  id: string;
  text: string;
  input_type?: string | null;
  verdict: Verdict;
  scam_probability: number;
  risk_level: RiskLevel;
  scam_category: string | null;
  confidence_score: number;
  threat_score: number;
  top_contributing_tokens: FeatureContribution[];
  model_name: string;
  model_version: string;
  latency_ms: number;
  user_feedback: boolean | null;
  created_at: string;
  ai_explanation?: string | null;
  executive_summary?: string | null;
  technical_explanation?: string | null;
  threat_level?: ThreatLevel | null;
  risk_breakdown?: Record<string, number> | null;
  recommended_actions?: string[] | null;
  highlighted_entities?: {
    urls?: string[];
    emails?: string[];
    phones?: string[];
    upi_ids?: string[];
    shortened_links?: string[];
    crypto_wallets?: string[];
  } | null;
  similar_patterns?: Array<{ title: string; description: string }> | null;
}

// ---- API error shape (matches both app_service and ml_service) ----------

export interface ApiErrorBody {
  error_code: string;
  message: string;
  details?: unknown;
}
