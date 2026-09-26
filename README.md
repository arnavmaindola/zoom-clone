# Zoom Clone - Video Conferencing Platform

A Zoom-inspired full-stack video conferencing platform developed as an SDE Fullstack assignment. The application focuses on creating, joining, scheduling, and managing meetings through a professional web interface.

## Features

- Demo login and logout
- Time-based personalized dashboard greeting
- Instant meeting creation
- Unique meeting IDs and shareable meeting links
- Join meetings using a meeting ID
- Display name when joining a meeting
- Schedule meetings for a future date and time
- Upcoming meetings dashboard
- Recent meetings with `Ended` status
- `Join again` for previous meetings
- Participant records stored in the database
- Zoom-inspired responsive user interface

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript

### Backend
- Python
- FastAPI
- SQLAlchemy

### Database
- SQLite

### Deployment
- Vercel — Frontend
- Render — Backend

## Demo Credentials

- **Username:** `Arnav`
- **Password:** `arnav123`

The application uses a simple demo authentication flow with browser session storage. This is intended for assignment evaluation and is not production-grade authentication.

## Local Setup

### Backend

Open a terminal and run:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy
uvicorn main:app --reload
