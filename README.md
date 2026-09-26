
# Meet — Video Conferencing Platform

  

A Zoom-inspired full-stack video conferencing platform built as an SDE Fullstack assignment. The project focuses on core meeting-management workflows — creating, scheduling, and joining meetings — with a UI modeled closely on Zoom's dashboard and meeting room experience.

  

## Overview

  

Meet implements the core assignment requirements: an instant meeting flow, a scheduling flow, meeting join with validation, and a Zoom-styled dashboard showing upcoming and recent meetings. Authentication is included as a lightweight demo layer on top of these core features, using a hardcoded account and browser session storage rather than production-grade auth.

  

## Features

  

- Demo login/logout with a session-protected dashboard

- Time-aware dashboard greeting (Good morning / afternoon / evening) using the logged-in username

- Password visibility toggle on the login page

- Instant meeting creation with a unique, randomly generated 9-digit meeting code

- Shareable meeting links derived from the meeting code

- Redirect to the meeting room immediately after meeting creation

- Join a meeting by meeting ID or by invite link

- Display name entry before joining

- Meeting existence validation on join

- Schedule meetings with title, description, date/time, and duration

- Upcoming Meetings and Recent Meetings sections on the dashboard

- Recent meetings show an "Ended" status and can be reopened via "Join again"

- Participant records stored in the database, with host identification

- Zoom-inspired dashboard and meeting room UI

- Responsive frontend layout

- Frontend and backend deployed separately, communicating via a configurable API URL

  

**Not implemented (see [Scope & Limitations](#scope--limitations)):** real multi-user WebRTC video/audio, persistent chat, screen sharing, recording, production-grade authentication, and real remote participant media control.

  

## Tech Stack

  

**Frontend**

- Next.js (App Router)

- React

- TypeScript

- Tailwind CSS

- Lucide React (icons)

  

**Backend**

- Python

- FastAPI

- SQLAlchemy

- Pydantic

  

**Database**

- SQLite

  

**Deployment**

- Vercel (frontend)

- Render (backend)

  

## Architecture

  

The frontend is a Next.js single-page-application-style app that communicates with a FastAPI backend over REST/JSON. SQLAlchemy is used as the ORM layer on top of SQLite.

  

```

Next.js (Vercel) → REST/JSON → FastAPI (Render) → SQLAlchemy → SQLite

```

  

All backend requests from the frontend go through a single API module (`frontend/lib/api.ts`), which reads the backend base URL from an environment variable rather than hardcoding it per component.

  

## Database Design

  

Two related models:

  

**`meetings`**

  

| Field | Description |

|---|---|

| `id` | Internal auto-incrementing primary key |

| `meeting_code` | Unique, public-facing identifier used to join a meeting |

| `title` | Meeting title |

| `description` | Meeting description |

| `host_name` | Name of the meeting host |

| `scheduled_at` | Nullable; set for scheduled meetings, null for instant meetings |

| `duration_minutes` | Planned meeting duration |

| `status` | Meeting state, e.g. scheduled / ended |

| `created_at` | Record creation timestamp |

  

**`participants`**

  

| Field | Description |

|---|---|

| `id` | Primary key |

| `meeting_id` | Foreign key referencing `meetings.id` |

| `display_name` | Name entered when joining |

| `is_host` | Whether this participant is the meeting host |

| `joined_at` | Join timestamp |

| `left_at` | Nullable leave timestamp |

  

**Key design decision:** the internal database primary key (`id`) is kept separate from the public-facing `meeting_code`, avoiding exposure of a sequential database ID as the public meeting identifier. Meeting invite links are constructed from `meeting_code` on the frontend rather than stored as a separate database field.

  

Participants have a many-to-one relationship with meetings: one meeting can have multiple participant records.

  

## API

  

| Method | Endpoint  | Description |

| GET | `/` | Basic API health/status message |

| POST | `/api/meetings` | Creates a meeting (instant or scheduled, based on `scheduled_at`) |

| GET | `/api/meetings?type=upcoming` | Returns upcoming meetings |

| GET | `/api/meetings?type=recent` | Returns recent/past meetings |

| GET | `/api/meetings/{meeting_code}` | Retrieves a meeting by its public code |

| POST | `/api/meetings/{meeting_code}/join` | Adds a participant after validating the meeting exists |

  

Interactive API docs are available locally at `http://localhost:8000/docs`.

  

## Local Setup

  

**Backend**

  

Requires Python 3.12.x.

  

```bash

cd  backend

python  -m  venv  .venv

.\.venv\Scripts\activate

pip  install  fastapi  uvicorn  sqlalchemy

uvicorn  main:app  --reload

```

  

Backend runs at `http://localhost:8000`.

  

**Frontend**

  

Requires Node.js / npm.

  

```bash

cd  frontend

npm  install

npm  run  dev

```

  

Frontend runs at `http://localhost:3000`.

  

## Environment Variables

  

The frontend reads the backend URL from:

  

```

NEXT_PUBLIC_API_URL=http://localhost:8000

```

  

In production, this variable is set on Vercel to point to the deployed Render backend URL.

  

## Demo Credentials

  

| Username | Password |

|---|---|

| `Arnav` | `arnav123` |

  

This is intentionally simple demo/mock authentication implemented with browser `sessionStorage`. It is **not** production-grade authentication and credentials are visible in client-side code — this is expected and acceptable for the scope of this assignment.

  

## Deployment

  

-  **Frontend:** Vercel

-  **Backend:** Render

  

The frontend communicates with the Render-hosted FastAPI backend via `NEXT_PUBLIC_API_URL`. CORS is configured in FastAPI to allow the deployed frontend's origin.

  

> Note: the backend runs on a free-tier Render instance, which may sleep after inactivity. The first request after a period of inactivity can take longer than usual while the service cold-starts.

  

## Engineering Decisions

  

-  **Separate `meeting_code` from internal `id`** — avoids exposing a sequential database primary key as the public meeting identifier.

-  **One creation endpoint for instant and scheduled meetings** — `scheduled_at` determines whether a meeting is immediate or scheduled, avoiding duplicate endpoints for near-identical logic.

-  **Relational participant model** — participants are separate records linked to meetings via a foreign key, rather than being embedded in the meeting record, allowing multiple participants per meeting.

-  **Centralized frontend API layer** — all backend calls go through `frontend/lib/api.ts` instead of scattering base URLs and fetch logic across components.

-  **SQLite** — zero-configuration and appropriate for the scope and timeline of this assignment.

-  **Seeded database** — ensures the deployed dashboard has meaningful demonstration data out of the box.

-  **Real WebRTC intentionally scoped out** — see below.

  

## Scope & Limitations

  

Given the assignment's roughly one-day timeline, priority was placed on reliably completing the core meeting-management workflows (create, schedule, join, validate, display) rather than building real-time media infrastructure.

  

As a result, the following are **not** implemented:

  

- Real multi-user WebRTC video/audio conferencing

- Persistent chat

- Screen sharing

- Meeting recording

- Production-grade authentication

- Real remote participant media control (e.g. an actual "Mute All" affecting other users' audio)

  

Full WebRTC-based conferencing would require additional real-time infrastructure — a signaling mechanism, peer connection negotiation, and ICE/STUN/TURN handling for NAT traversal — which was deprioritized in favor of completing and polishing the assignment's core functional requirements.

  

## Project Structure

  

```

zoom-clone/

├── backend/

│ ├── database.py # SQLAlchemy engine, SessionLocal, get_db()

│ ├── main.py # FastAPI app, CORS, routes, meeting code generation

│ ├── models.py # Meeting and Participant models

│ ├── schemas.py # Pydantic request models (MeetingCreate, JoinMeeting)

│ ├── seed.py # Seeds demo meeting data

│

├── frontend/

│ ├── app/

│ │ ├── (workplace)/

│ │ │ └── page.tsx

│ │ ├── login/

│ │ │ └── page.tsx

│ │ ├── join/

│ │ ├── meeting/

│ │ └── schedule/

│ ├── components/

│ │ ├── Navbar.tsx

│ │ ├── MeetingCard.tsx

│ │ └── ...

│ ├── lib/

│ │ └── api.ts

│ └── ...

│

└── README.md

```
