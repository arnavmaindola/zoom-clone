"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CalendarPlus, Check, Copy } from "lucide-react";
import { createMeeting } from "@/lib/api";
import { formatMeetingCode } from "@/lib/format";

type CreatedMeeting = {
  meeting_code: string;
  title: string;
};

export default function SchedulePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<CreatedMeeting | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !date || !time) {
      setError("Please fill in all fields before scheduling.");
      return;
    }

    setLoading(true);

    try {
      const meeting = await createMeeting({
        title: title.trim(),
        description: description.trim(),
        duration_minutes: Number(duration),
        scheduled_at: `${date}T${time}:00`,
      });
      setCreated({
        meeting_code: meeting.meeting_code,
        title: meeting.title,
      });
    } catch {
      setError("We couldn't schedule this meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!created) return;
    const link = `${window.location.origin}/meeting/${created.meeting_code}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Could not copy the link. You can copy it manually.");
    }
  }

  if (created) {
    const shareUrl = `${window.location.origin}/meeting/${created.meeting_code}`;

    return (
      <div className="form-card">
        <div className="icon-circle icon-green" style={{ margin: "0 auto 4px" }}>
          <Check size={22} />
        </div>
        <h1 style={{ textAlign: "center" }}>Meeting scheduled</h1>
        <p className="subcopy" style={{ textAlign: "center", marginBottom: 20 }}>
          Share the meeting ID or invite link with participants.
        </p>
        <div className="success-box">
          <div style={{ fontWeight: 650 }}>{created.title}</div>
          <div style={{ marginTop: 6 }}>
            Meeting ID: {formatMeetingCode(created.meeting_code)}
          </div>
          <div style={{ marginTop: 6, wordBreak: "break-all" }}>{shareUrl}</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="btn btn-primary" onClick={copyLink}>
            <Copy size={14} />
            {copied ? "Copied" : "Copy link"}
          </button>
          <Link href="/" className="btn btn-secondary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      <div className="icon-circle icon-green" style={{ margin: "0 auto 4px" }}>
        <CalendarPlus size={22} />
      </div>
      <h1 style={{ textAlign: "center" }}>Schedule a meeting</h1>
      <p className="subcopy" style={{ textAlign: "center", marginBottom: 24 }}>
        Add the details below. Participants can join with the generated meeting ID.
      </p>

      <form onSubmit={handleSubmit}>
        {error ? <div className="inline-error">{error}</div> : null}

        <div className="field">
          <label htmlFor="title">Meeting title</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Weekly standup"
          />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this meeting about?"
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              suppressHydrationWarning
            />
          </div>
          <div className="field">
            <label htmlFor="time">Time</label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              suppressHydrationWarning
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="duration">Duration</label>
          <select id="duration" value={duration} onChange={(event) => setDuration(event.target.value)}>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1 hour 30 minutes</option>
            <option value="120">2 hours</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", height: 42 }} disabled={loading}>
          {loading ? "Scheduling..." : "Schedule Meeting"}
        </button>
      </form>
    </div>
  );
}
