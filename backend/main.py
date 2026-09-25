import secrets
from datetime import datetime

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from schemas import MeetingCreate, JoinMeeting
from database import Base, engine, get_db
import models


Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_meeting_code(db: Session) -> str:
    while True:
        code = str(secrets.randbelow(900_000_000) + 100_000_000)

        existing_meeting = (
            db.query(models.Meeting)
            .filter(models.Meeting.meeting_code == code)
            .first()
        )

        if existing_meeting is None:
            return code


@app.get("/")
def home():
    return {"message": "Zoom Clone API is running!"}


@app.post("/api/meetings")
def create_meeting(
    meeting: MeetingCreate,
    db: Session = Depends(get_db)
):
    new_meeting = models.Meeting(
        meeting_code=generate_meeting_code(db),
        title=meeting.title,
        description=meeting.description,
        host_name="Arnav",
        scheduled_at=meeting.scheduled_at,
        duration_minutes=meeting.duration_minutes,
        status="scheduled"
    )

    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)

    return {
        "message": "Meeting created",
        "meeting_code": new_meeting.meeting_code,
        "title": new_meeting.title,
        "description": new_meeting.description,
        "duration_minutes": new_meeting.duration_minutes,
        "scheduled_at": new_meeting.scheduled_at
    }

@app.get("/api/meetings")
def get_meetings(
    type: str = "upcoming",
    db: Session = Depends(get_db)
):
    if type == "upcoming":
        meetings = (
            db.query(models.Meeting)
            .filter(
                models.Meeting.scheduled_at.is_not(None),
                models.Meeting.scheduled_at >= datetime.now()
            )
            .order_by(models.Meeting.scheduled_at.asc())
            .all()
        )

    elif type == "recent":
        meetings = (
            db.query(models.Meeting)
            .filter(
                models.Meeting.scheduled_at.is_not(None),
                models.Meeting.scheduled_at < datetime.now()
            )
            .order_by(models.Meeting.scheduled_at.desc())
            .all()
        )

    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid meeting type"
        )

    return [
        {
            "meeting_code": meeting.meeting_code,
            "title": meeting.title,
            "description": meeting.description,
            "host_name": meeting.host_name,
            "scheduled_at": meeting.scheduled_at,
            "duration_minutes": meeting.duration_minutes,
            "status": meeting.status
        }
        for meeting in meetings
    ]


@app.get("/api/meetings/{meeting_code}")
def get_meeting(meeting_code: str, db: Session = Depends(get_db)):
    meeting = (
        db.query(models.Meeting)
        .filter(models.Meeting.meeting_code == meeting_code)
        .first()
    )

    if meeting is None:
        raise HTTPException(status_code=404, detail="Meeting not found")

    return {
        "meeting_code": meeting.meeting_code,
        "title": meeting.title,
        "description": meeting.description,
        "host_name": meeting.host_name,
        "scheduled_at": meeting.scheduled_at,
        "duration_minutes": meeting.duration_minutes,
        "status": meeting.status
    }


@app.post("/api/meetings/{meeting_code}/join")
def join_meeting(
    meeting_code: str,
    payload: JoinMeeting,
    db: Session = Depends(get_db)
):
    meeting = (
        db.query(models.Meeting)
        .filter(models.Meeting.meeting_code == meeting_code)
        .first()
    )

    if meeting is None:
        raise HTTPException(status_code=404, detail="Meeting not found")

    participant = models.Participant(
        meeting_id=meeting.id,
        display_name=payload.display_name,
        is_host=payload.display_name.strip().lower() == meeting.host_name.strip().lower()
    )

    db.add(participant)
    db.commit()

    return {
        "message": "Joined meeting",
        "meeting_code": meeting.meeting_code,
        "display_name": payload.display_name
    }