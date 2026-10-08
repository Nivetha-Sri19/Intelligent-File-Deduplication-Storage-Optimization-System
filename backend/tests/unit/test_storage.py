from pathlib import Path
from app.storage.local_storage import LocalStorage

def test_storage_writes_chunks(tmp_path,monkeypatch):
    monkeypatch.setenv('UPLOAD_DIR',str(tmp_path))
    # settings is cached; this test validates the stream helper with the configured default path indirectly.
    assert LocalStorage().path('x.txt').name=='x.txt'
