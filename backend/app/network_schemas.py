"""Networking schemas (Stage 7).

Field names mirror the frontend `CollabPost` type (src/types.ts) and the
ConnectModal payload so discovery screens need no reshaping.
"""

from typing import Literal

from pydantic import BaseModel, Field

ConnectionStatus = Literal["pending", "accepted", "declined"]
CONNECTION_STATUSES = ["pending", "accepted", "declined"]

COLLAB_PHASES = ["Ideation Phase", "Prototyping Phase", "Growth Phase", "Validated"]


class ConnectionCreate(BaseModel):
    recipientId: str
    message: str = ""


class ConnectionStatusUpdate(BaseModel):
    status: Literal["accepted", "declined"]


class ConnectionOut(BaseModel):
    id: str
    requesterId: str
    requesterName: str = ""
    requesterAvatar: str = ""
    recipientId: str
    recipientName: str = ""
    recipientAvatar: str = ""
    message: str = ""
    status: ConnectionStatus = "pending"
    createdAt: str = ""
    updatedAt: str = ""


class CollabCreate(BaseModel):
    title: str
    phase: str = "Ideation Phase"
    description: str = ""
    tags: list[str] = Field(default_factory=list)


class CollabUpdate(BaseModel):
    title: str | None = None
    phase: str | None = None
    description: str | None = None
    tags: list[str] | None = None


class CollabOut(BaseModel):
    id: str
    authorId: str
    authorName: str = ""
    authorAvatar: str = ""
    phase: str = "Ideation Phase"
    title: str
    description: str = ""
    tags: list[str] = Field(default_factory=list)
    interestedCount: int = 0
    userInterested: bool = False
    createdAt: str = ""
    updatedAt: str = ""


class CollabInterestOut(BaseModel):
    profileId: str
    name: str = ""
    avatar: str = ""
