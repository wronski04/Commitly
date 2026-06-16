import uuid
from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Project


async def list_projects(db: AsyncSession, user_id: uuid.UUID) -> Sequence[Project]:
    result = await db.scalars(
        select(Project)
        .where(Project.user_id == user_id)
        .order_by(Project.created_at.desc())
    )
    return result.all()


async def create_project(
    db: AsyncSession, user_id: uuid.UUID, name: str, description: str | None
) -> Project:
    project = Project(user_id=user_id, name=name, description=description)
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


async def get_project(
    db: AsyncSession, user_id: uuid.UUID, project_id: uuid.UUID
) -> Project | None:
    """Return the project only if it belongs to the given user, else None."""
    return await db.scalar(
        select(Project).where(
            Project.id == project_id, Project.user_id == user_id
        )
    )


async def delete_project(db: AsyncSession, project: Project) -> None:
    await db.delete(project)
    await db.commit()
