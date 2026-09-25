from datetime import datetime, timedelta
from database import SessionLocal, Base, engine
import models
from main import generate_meeting_code

Base.metadata.create_all(bind=engine)


def seed_database():
    db = SessionLocal()

    try:
        # Find the old test meetings
        past_meetings = (
            db.query(models.Meeting)
            .filter(models.Meeting.title == "Past Meeting")
            .order_by(models.Meeting.id)
            .all()
        )

        if past_meetings:
            realistic_meetings = [
                ("Project Kickoff", 1, 14, 0, 60),
                ("Team Sync", 3, 11, 30, 30),
                ("Internship Discussion", 5, 16, 0, 45),
                ("Weekly Planning", 7, 10, 0, 30),
            ]

            for meeting, (title, days_ago, hour, minute, duration) in zip(
                past_meetings, realistic_meetings
            ):
                meeting.title = title
                meeting.description = f"{title} meeting."
                meeting.scheduled_at = (
                    datetime.now()
                    - timedelta(days=days_ago)
                ).replace(
                    hour=hour,
                    minute=minute,
                    second=0,
                    microsecond=0
                )
                meeting.duration_minutes = duration
                meeting.status = "ended"

            db.commit()
            print("Updated old test meetings with realistic past meetings.")
            return

        # If the database is completely empty, create initial seed data
        if db.query(models.Meeting).first():
            print("Database already contains meetings. Skipping seed.")
            return

        upcoming_1 = models.Meeting(
            meeting_code=generate_meeting_code(db),
            title="Project Discussion",
            description="Discussion about the project implementation.",
            host_name="Arnav",
            scheduled_at=datetime.now() + timedelta(days=2),
            duration_minutes=60,
            status="scheduled"
        )

        upcoming_2 = models.Meeting(
            meeting_code=generate_meeting_code(db),
            title="Team Sync",
            description="Weekly team progress meeting.",
            host_name="Arnav",
            scheduled_at=datetime.now() + timedelta(days=4),
            duration_minutes=30,
            status="scheduled"
        )

        recent_1 = models.Meeting(
            meeting_code=generate_meeting_code(db),
            title="Project Kickoff",
            description="Project kickoff meeting.",
            host_name="Arnav",
            scheduled_at=datetime.now() - timedelta(days=1),
            duration_minutes=60,
            status="ended"
        )

        recent_2 = models.Meeting(
            meeting_code=generate_meeting_code(db),
            title="Team Sync",
            description="Team progress meeting.",
            host_name="Arnav",
            scheduled_at=datetime.now() - timedelta(days=3),
            duration_minutes=30,
            status="ended"
        )

        db.add_all([
            upcoming_1,
            upcoming_2,
            recent_1,
            recent_2
        ])

        db.commit()
        print("Database seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()