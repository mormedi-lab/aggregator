class MockSession:
    def __init__(self, return_value=None):
        self.return_value = return_value

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

    def run(self, query, **parameters):
        # Mock the behavior of running a query
        return self.return_value

    def read_transaction(self, func, *args, **kwargs):
        # Mock the behavior of a read transaction
        return self.return_value

    def write_transaction(self, func, *args, **kwargs):
        # Mock the behavior of a write transaction
        return func(MockTransaction(), *args, **kwargs)


class MockTransaction:
    def __init__(self, return_value=None):
        self.return_value = return_value

    def run(self, query, **parameters):
        # Mock the behavior of running a query in a transaction
        return MockResult(self.return_value)


class MockResult:
    def __init__(self, return_value=None):
        self.return_value = return_value

    def single(self):
        return self.return_value

    def __iter__(self):
        return iter(self.return_value)
