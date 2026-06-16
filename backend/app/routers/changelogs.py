import re
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import PlainTextResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import CurrentUser
from app.schemas.changelog import (
    ChangelogGenerate,
    ChangelogResponse,
    ChangelogUpdate,
)
from app.services import changelog_service, project_service

router = APIRouter(tags=["changelogs"])


@router.get(
    "/projects/{project_id}/changelogs",
    response_model=list[ChangelogResponse],
)
async def list_changelogs(
    project_id: uuid.UUID,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
) -> list[ChangelogResponse]:
    project = await project_service.get_project(db, current_user.id, project_id)
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    changelogs = await changelog_service.list_changelogs(
        db, current_user.id, project_id
    )
    return [ChangelogResponse.model_validate(c) for c in changelogs]


@router.post(
    "/projects/{project_id}/changelogs/generate",
    response_model=ChangelogResponse,
    status_code=status.HTTP_201_CREATED,
)
async def generate_changelog(
    project_id: uuid.UUID,
    body: ChangelogGenerate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
) -> ChangelogResponse:
    project = await project_service.get_project(db, current_user.id, project_id)
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    changelog = await changelog_service.generate_changelog(
        db, project, body.raw_input, body.tone.value, body.version_tag
    )
    return ChangelogResponse.model_validate(changelog)


@router.get("/changelogs/{changelog_id}", response_model=ChangelogResponse)
async def get_changelog(
    changelog_id: uuid.UUID,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
) -> ChangelogResponse:
    changelog = await changelog_service.get_changelog(
        db, current_user.id, changelog_id
    )
    if changelog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Changelog not found"
        )
    return ChangelogResponse.model_validate(changelog)


@router.patch("/changelogs/{changelog_id}", response_model=ChangelogResponse)
async def update_changelog(
    changelog_id: uuid.UUID,
    body: ChangelogUpdate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
) -> ChangelogResponse:
    changelog = await changelog_service.get_changelog(
        db, current_user.id, changelog_id
    )
    if changelog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Changelog not found"
        )
    changelog = await changelog_service.update_changelog(
        db, changelog, body.title, body.content
    )
    return ChangelogResponse.model_validate(changelog)


@router.get(
    "/changelogs/{changelog_id}/export",
    response_class=PlainTextResponse,
    responses={200: {"content": {"text/markdown": {}}}},
)
async def export_changelog(
    changelog_id: uuid.UUID,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
) -> PlainTextResponse:
    changelog = await changelog_service.get_changelog(
        db, current_user.id, changelog_id
    )
    if changelog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Changelog not found"
        )
    slug = re.sub(r"[^a-z0-9]+", "-", changelog.title.lower()).strip("-") or "changelog"
    return PlainTextResponse(
        content=changelog.content,
        media_type="text/markdown",
        headers={"Content-Disposition": f'attachment; filename="{slug}.md"'},
    )


@router.delete(
    "/changelogs/{changelog_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_changelog(
    changelog_id: uuid.UUID,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
) -> None:
    changelog = await changelog_service.get_changelog(
        db, current_user.id, changelog_id
    )
    if changelog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Changelog not found"
        )
    await changelog_service.delete_changelog(db, changelog)
