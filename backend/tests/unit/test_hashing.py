from pathlib import Path
from app.services.hashing_service import HashingService

def test_same_content_same_hash(tmp_path:Path):
    a=tmp_path/'a.txt'; b=tmp_path/'different-name.txt'; data=b'enterprise deduplication test'
    a.write_bytes(data); b.write_bytes(data)
    service=HashingService()
    assert service.calculate(a,4)==service.calculate(b,4)

def test_different_content_different_hash(tmp_path:Path):
    a=tmp_path/'a'; b=tmp_path/'b'; a.write_bytes(b'one'); b.write_bytes(b'two')
    service=HashingService(); assert service.calculate(a,2)!=service.calculate(b,2)
