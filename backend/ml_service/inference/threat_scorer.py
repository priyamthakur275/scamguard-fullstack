"""Threat score and scam-category inference (step 18).

The classical TF-IDF models output a single scalar: P(scam). They do not
natively output a scam *category* (OTP scam, banking, lottery, ...) or a
discrete risk level. This module derives both from the raw probability
plus a small, explicit, versioned keyword-signal taxonomy -- the same
"urgency indicators, fake rewards, malicious links" signal groups named
in the report's Proposed System section. This keeps category inference
transparent and auditable, rather than another opaque model.
"""
from dataclasses import dataclass, field


@dataclass(frozen=True)
class ThreatScoreConfig:
    low_risk_ceiling: float = 0.4
    medium_risk_ceiling: float = 0.7


# Each category maps to a set of *stemmed* signal tokens (matching the
# same stemming rules ml_common.preprocessing.tokenizer applies), so
# category inference runs on the identically-preprocessed token list the
# model itself scored.
_CATEGORY_SIGNALS: dict[str, frozenset[str]] = {
    "phishing": frozenset({"__url__", "click", "login", "secure", "link", "verify", "password", "credential"}),
    "investment_scam": frozenset({"invest", "profit", "return", "stock", "trading", "forex", "double", "guaranteed"}),
    "job_scam": frozenset({"job", "hiring", "salary", "work", "earn", "income", "vacancy", "recruitment"}),
    "lottery_scam": frozenset({"win", "won", "prize", "lottery", "gift", "reward", "claim", "congratulations"}),
    "upi_scam": frozenset({"upi", "gpay", "phonepe", "paytm", "scan", "qr", "collect", "request"}),
    "banking_fraud": frozenset({"bank", "account", "payment", "transaction", "fund", "loan", "credit", "debit"}),
    "identity_theft": frozenset({"aadhaar", "pan", "kyc", "identity", "verification", "document", "ssn", "passport"}),
    "romance_scam": frozenset({"love", "dear", "darling", "heart", "relationship", "lonely", "marry", "beautiful"}),
    "crypto_scam": frozenset({"crypto", "bitcoin", "ethereum", "wallet", "blockchain", "token", "nft", "mining"}),
    "fake_delivery": frozenset({"delivery", "package", "shipment", "tracking", "parcel", "courier", "order", "dispatch"}),
    "subscription_scam": frozenset({"subscription", "renew", "expire", "membership", "cancel", "auto", "charge", "billing"}),
    "government_scam": frozenset({"government", "tax", "refund", "irs", "customs", "penalty", "compliance", "notice"}),
    "loan_scam": frozenset({"loan", "emi", "interest", "approved", "disburse", "repay", "borrow", "mortgage"}),
}

_URGENCY_SIGNALS: frozenset[str] = frozenset(
    {"urgent", "immediate", "immediately", "now", "today", "final", "expire", "suspend", "block"}
)


@dataclass(frozen=True)
class ThreatAssessment:
    threat_score: float
    risk_level: str
    scam_category: str | None
    matched_signal_count: int


class ThreatScorer:
    """Derives risk level and category from the model's probability plus
    a transparent, rule-based signal count over the preprocessed tokens.
    """

    def __init__(self, config: ThreatScoreConfig | None = None):
        self._config = config or ThreatScoreConfig()

    def assess(self, scam_probability: float, tokens: list[str]) -> ThreatAssessment:
        token_set = set(tokens)

        urgency_hits = len(token_set & _URGENCY_SIGNALS)
        category_scores = {
            category: len(token_set & signals) for category, signals in _CATEGORY_SIGNALS.items()
        }
        total_category_hits = sum(category_scores.values())

        # Urgency language amplifies the base model probability -- a
        # message the model already flags as borderline-scam, combined
        # with explicit urgency pressure tactics, is treated as more
        # threatening than the raw probability alone suggests. Capped at
        # +0.15 so this heuristic layer can nudge, never override, the
        # underlying model's judgment.
        urgency_boost = min(urgency_hits * 0.05, 0.15)
        threat_score = min(scam_probability + urgency_boost, 1.0)

        risk_level = self._risk_level_for(threat_score)
        scam_category = self._best_category(category_scores) if scam_probability >= 0.5 else None

        return ThreatAssessment(
            threat_score=round(threat_score, 4),
            risk_level=risk_level,
            scam_category=scam_category,
            matched_signal_count=urgency_hits + total_category_hits,
        )

    def _risk_level_for(self, threat_score: float) -> str:
        if threat_score < self._config.low_risk_ceiling:
            return "low"
        if threat_score < self._config.medium_risk_ceiling:
            return "medium"
        return "high"

    @staticmethod
    def _best_category(category_scores: dict[str, int]) -> str | None:
        best_category, best_count = max(category_scores.items(), key=lambda item: item[1])
        return best_category if best_count > 0 else None
