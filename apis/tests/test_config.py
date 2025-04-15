import os

import pytest
from app.config import load_conf


def test_load_conf():
    os.environ["MY_VAR"] = "test_value"
    assert load_conf("MY_VAR") == "test_value"
    # Clean up after test
    os.environ.pop("MY_VAR")

def test_load_conf_missing():
    with pytest.raises(ValueError) as excinfo:
        load_conf("MISSING_VAR")
    assert str(excinfo.value) == "Configuration MISSING_VAR not found in the environment variables."