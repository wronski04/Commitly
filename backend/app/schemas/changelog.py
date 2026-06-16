import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class Tone(str, Enum):
    technical = "technical"
    user_friendly = "user_friendly"


class ChangelogGenerate(BaseModel):
    raw_input: str = Field(min_length=1)
    tone: Tone
    version_tag: str | None = Field(default=None, max_length=50)


class ChangelogUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1)


class ChangelogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    project_id: uuid.UUID
    title: str
    raw_input: str
    content: str
    tone: str
    version_tag: str | None
    created_at: datetime
    updated_at: datetime
