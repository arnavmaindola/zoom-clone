from datetime import datetime, timedelta

from database import SessionLocal, Base, engine
import models
from main import generate_meeting_code


Base.metadata.create_all(bind=engine)


def seed_database():
    db = SessionLocal()

    try:
        existing_meeting = db.query(models.Meeting).first()

        if existing_meeting:
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
            title="Previous Project Meeting",
            description="Previous project discussion.",
            host_name="Arnav",
            scheduled_at=datetime.now() - timedelta(days=2),
            duration_minutes=45,
            status="ended"
        )

        db.add_all([
            upcoming_1,
            upcoming_2,
            recent_1
        ])

        db.commit()

        print("Database seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()