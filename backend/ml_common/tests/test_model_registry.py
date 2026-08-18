import joblib
import pytest

from ml_common.domain.value_objects import ModelMetrics
from ml_common.registry.model_registry import ModelNotFoundError, ModelRegistry


@pytest.fixture()
def sample_metrics() -> ModelMetrics:
    return ModelMetrics(
        accuracy=0.9, precision=0.88, recall=0.85, f1=0.865, roc_auc=0.93, false_positive_rate=0.05
    )


@pytest.fixture()
def fake_artifacts(tmp_path):
    model_path = tmp_path / "model.joblib"
    vectorizer_path = tmp_path / "vectorizer.joblib"
    joblib.dump({"kind": "fake-model"}, model_path)
    joblib.dump({"kind": "fake-vectorizer"}, vectorizer_path)
    return str(model_path), str(vectorizer_path)


class TestModelRegistry:
    def test_register_creates_a_non_production_version(self, tmp_path, fake_artifacts, sample_metrics):
        registry = ModelRegistry(root_dir=str(tmp_path / "artifacts"))
        model_path, vectorizer_path = fake_artifacts

        info = registry.register("svm", "v1", model_path, vectorizer_path, sample_metrics)

        assert info.model_name == "svm"
        assert info.version == "v1"
        assert info.is_production is False

    def test_get_production_before_promotion_raises(self, tmp_path, fake_artifacts, sample_metrics):
        registry = ModelRegistry(root_dir=str(tmp_path / "artifacts"))
        model_path, vectorizer_path = fake_artifacts
        registry.register("svm", "v1", model_path, vectorizer_path, sample_metrics)

        with pytest.raises(ModelNotFoundError):
            registry.get_production("svm")

    def test_promote_makes_version_the_production_version(
        self, tmp_path, fake_artifacts, sample_metrics
    ):
        registry = ModelRegistry(root_dir=str(tmp_path / "artifacts"))
        model_path, vectorizer_path = fake_artifacts
        registry.register("svm", "v1", model_path, vectorizer_path, sample_metrics)

        registry.promote("svm", "v1")
        production = registry.get_production("svm")

        assert production.version == "v1"
        assert production.is_production is True

    def test_promoting_new_version_demotes_previous(self, tmp_path, fake_artifacts, sample_metrics):
        registry = ModelRegistry(root_dir=str(tmp_path / "artifacts"))
        model_path, vectorizer_path = fake_artifacts

        registry.register("svm", "v1", model_path, vectorizer_path, sample_metrics)
        registry.register("svm", "v2", model_path, vectorizer_path, sample_metrics)

        registry.promote("svm", "v1")
        registry.promote("svm", "v2")

        v1 = registry.get_version("svm", "v1")
        v2 = registry.get_version("svm", "v2")

        assert v1.is_production is False
        assert v2.is_production is True

    def test_promote_unknown_version_raises(self, tmp_path):
        registry = ModelRegistry(root_dir=str(tmp_path / "artifacts"))
        with pytest.raises(ModelNotFoundError):
            registry.promote("svm", "does-not-exist")

    def test_list_versions_returns_all_registered_versions(
        self, tmp_path, fake_artifacts, sample_metrics
    ):
        registry = ModelRegistry(root_dir=str(tmp_path / "artifacts"))
        model_path, vectorizer_path = fake_artifacts

        registry.register("svm", "v1", model_path, vectorizer_path, sample_metrics)
        registry.register("svm", "v2", model_path, vectorizer_path, sample_metrics)

        versions = {v.version for v in registry.list_versions("svm")}
        assert versions == {"v1", "v2"}

    def test_resolve_artifact_paths_returns_loadable_paths(
        self, tmp_path, fake_artifacts, sample_metrics
    ):
        registry = ModelRegistry(root_dir=str(tmp_path / "artifacts"))
        model_path, vectorizer_path = fake_artifacts

        info = registry.register("svm", "v1", model_path, vectorizer_path, sample_metrics)
        resolved_model_path, resolved_vectorizer_path = registry.resolve_artifact_paths(info)

        assert joblib.load(resolved_model_path) == {"kind": "fake-model"}
        assert joblib.load(resolved_vectorizer_path) == {"kind": "fake-vectorizer"}

    def test_registering_same_version_twice_overwrites(
        self, tmp_path, fake_artifacts, sample_metrics
    ):
        registry = ModelRegistry(root_dir=str(tmp_path / "artifacts"))
        model_path, vectorizer_path = fake_artifacts

        registry.register("svm", "v1", model_path, vectorizer_path, sample_metrics)
        registry.register("svm", "v1", model_path, vectorizer_path, sample_metrics)

        versions = registry.list_versions("svm")
        assert len(versions) == 1
