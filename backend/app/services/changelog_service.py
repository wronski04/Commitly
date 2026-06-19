import uuid
from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Changelog, Project
from app.services import llm_service


async def list_changelogs(
    db: AsyncSession, user_id: uuid.UUID, project_id: uuid.UUID
) -> Sequence[Changelog]:
    result = await db.scalars(
        select(Changelog)
        .join(Project, Changelog.project_id == Project.id)
        .where(Project.id == project_id, Project.user_id == user_id)
        .order_by(Changelog.created_at.desc())
    )
    return result.all()


async def generate_changelog(
    db: AsyncSession,
    project: Project,
    raw_input: str,
    tone: str,
    version_tag: str | None,
) -> Changelog:
    content = await llm_service.generate_changelog(raw_input, tone, version_tag)
    title = version_tag or "Changelog"
    changelog = Changelog(
        project_id=project.id,
        title=title,
        raw_input=raw_input,
        content=content,
        tone=tone,
        version_tag=version_tag,
    )
    db.add(changelog)
    await db.commit()
    await db.refresh(changelog)
    return changelog


async def get_changelog(
    db: AsyncSession, user_id: uuid.UUID, changelog_id: uuid.UUID
) -> Changelog | None:
    """Return the changelog only if it belongs to one of the user's projects."""
    return await db.scalar(
        select(Changelog)
        .join(Project, Changelog.project_id == Project.id)
        .where(Changelog.id == changelog_id, Project.user_id == user_id)
    )


async def update_changelog(
    db: AsyncSession, changelog: Changelog, title: str, content: str
) -> Changelog:
    changelog.title = title
    changelog.content = content
    await db.commit()
    await db.refresh(changelog)
    return changelog


async def delete_changelog(db: AsyncSession, changelog: Changelog) -> None:
    await db.delete(changelog)
    await db.commit()
