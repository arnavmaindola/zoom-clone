"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Video } from "lucide-react";
import { ApiError, getMeeting, joinMeeting } from "@/lib/api";
import { digitsOnly, formatMeetingCode, saveDisplayName, USER_NAME } from "@/lib/format";

export default function JoinPage() {
  const router = useRouter();
  const [meetingId, setMeetingId] = useState("");
  const [displayName, setDisplayName] = useState(USER_NAME);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    const code = digitsOnly(meetingId);
    const name = displayName.trim();

    if (!code) {
      setError("Enter a meeting ID.");
      return;
    }

    if (!name) {
      setError("Enter your display name.");
      return;
    }

    setLoading(true);

    try {
      await getMeeting(code);
      await joinMeeting(code, name);
      saveDisplayName(name);
      router.push(`/meeting/${code}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError("We couldn't find a meeting with that ID.");
      } else {
        setError("We couldn't join that meeting. Please try again.");
      }
      setLoading(false);
    }
  }

  return (
    <div className="form-card">
      <div className="icon-circle icon-blue" style={{ margin: "0 auto 4px" }}>
        <Video size={22} />
      </div>
      <h1 style={{ textAlign: "center" }}>Join a meeting</h1>
      <p className="subcopy" style={{ textAlign: "center", marginBottom: 24 }}>
        Enter the meeting ID and the name you want others to see.
      </p>

      <form onSubmit={handleSubmit}>
        {error ? <div className="inline-error">{error}</div> : null}

        <div className="field">
          <label htmlFor="meetingId">Meeting ID</label>
          <input
            id="meetingId"
            value={formatMeetingCode(meetingId)}
            onChange={(event) => setMeetingId(digitsOnly(event.target.value).slice(0, 9))}
            placeholder="000 000 000"
            inputMode="numeric"
            autoComplete="off"
          />
        </div>

        <div className="field">
          <label htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", height: 42 }} disabled={loading}>
          {loading ? "Joining..." : "Join Meeting"}
        </button>
      </form>
    </div>
  );
}
