import pytest

from ml_service.services.prediction_service import EmptyMessageError, PredictionRequest


class TestPredictionServiceIntegration:
    def test_empty_text_raises(self, prediction_service):
        with pytest.raises(EmptyMessageError):
            prediction_service.predict(PredictionRequest(text=""))

    def test_whitespace_only_text_raises(self, prediction_service):
        with pytest.raises(EmptyMessageError):
            prediction_service.predict(PredictionRequest(text="   "))

    def test_result_has_all_required_fields(self, prediction_service):
        result = prediction_service.predict(
            PredictionRequest(text="Urgent! Verify your bank account now.")
        )
        assert result.verdict in {"legitimate", "spam", "phishing", "scam"}
        assert 0.0 <= result.scam_probability <= 1.0
        assert result.risk_level in {"low", "medium", "high"}
        assert 0.0 <= result.confidence_score <= 1.0
        assert 0.0 <= result.threat_score <= 1.0
        assert result.latency_ms >= 0.0
        assert result.model_name
        assert result.model_version

    def test_legitimate_message_is_not_flagged_high_risk(self, prediction_service):
        result = prediction_service.predict(
            PredictionRequest(text="Hey, are we still on for lunch this Friday?")
        )
        assert result.risk_level in {"low", "medium"}

    def test_latency_is_recorded_and_reasonable(self, prediction_service):
        result = prediction_service.predict(PredictionRequest(text="Hello there"))
        # A classical TF-IDF model should score in low milliseconds, not
        # seconds -- this guards against an accidental O(n^2) regression.
        assert result.latency_ms < 1000
