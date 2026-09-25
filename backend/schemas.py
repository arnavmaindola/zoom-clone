from datetime import datetime

from pydantic import BaseModel


class MeetingCreate(BaseModel):
    title: str
    description: str
    duration_minutes: int
    scheduled_at: datetime | None = None


class JoinMeeting(BaseModel):
    display_name: str