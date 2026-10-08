from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.file import File
from app.models.file_hash import FileHash
from app.models.duplicate_group import DuplicateGroup
from app.repositories.duplicate_repository import DuplicateRepository


class DuplicateService:
    def __init__(self):
        self.repo = DuplicateRepository()

    def rebuild_for_hash(
        self,
        db: Session,
        owner_id: UUID,
        group_hash: str,
    ):
        files = db.scalars(
            select(File)
            .join(FileHash)
            .where(
                File.owner_id == owner_id,
                FileHash.hash_value == group_hash,
                File.deleted_at.is_(None),
                File.status == "ready",
            )
            .order_by(
                File.uploaded_at.asc(),
                File.id.asc(),
            )
        ).all()

        file_ids = [file.id for file in files]

        if file_ids:
            db.execute(
                delete(DuplicateGroup).where(
                    DuplicateGroup.group_hash == group_hash,
                    DuplicateGroup.file_id.in_(file_ids),
                )
            )

        if len(files) < 2:
            db.flush()
            return

        original = files[0]

        total = sum(file.size_bytes for file in files)
        savings = total - original.size_bytes

        for file in files:
            db.add(
                DuplicateGroup(
                    file_id=file.id,
                    group_hash=group_hash,
                    is_original=file.id == original.id,
                    storage_consumed_bytes=total,
                    potential_savings_bytes=savings,
                )
            )

        db.flush()

    def groups(
        self,
        db: Session,
        owner_id: UUID,
    ):
        hashes = self.repo.get_group_hashes(db, owner_id)

        result = []

        for group_hash in hashes:
            members = self.repo.get_members_for_hash(
                db,
                owner_id,
                group_hash,
            )

            if len(members) < 2:
                continue

            files = [member.file for member in members]

            total = sum(
                file.size_bytes
                for file in files
            )

            original = next(
                (
                    file
                    for member, file in zip(members, files)
                    if member.is_original
                ),
                files[0],
            )

            result.append(
                {
                    "group_hash": group_hash,
                    "files": members,
                    "storage_consumed_bytes": total,
                    "potential_savings_bytes": (
                        total - original.size_bytes
                    ),
                }
            )

        return result