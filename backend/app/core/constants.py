from enum import StrEnum
class FileStatus(StrEnum):
    PENDING='pending'; PROCESSING='processing'; READY='ready'; FAILED='failed'; DELETED='deleted'
class UserRole(StrEnum): USER='user'; ADMIN='admin'
class AuditAction(StrEnum):
    REGISTER='register'; LOGIN='login'; LOGOUT='logout'; FILE_UPLOAD='file_upload'; FILE_DOWNLOAD='file_download'; FILE_DELETE='file_delete'; FILE_HASHED='file_hashed'; DUPLICATE_DETECTED='duplicate_detected'
class DeletionStatus(StrEnum): REQUESTED='requested'; COMPLETED='completed'; FAILED='failed'
