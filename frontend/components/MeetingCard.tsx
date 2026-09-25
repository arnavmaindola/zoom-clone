"use client";

import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import type { Meeting } from "@/lib/api";
import {
  formatDuration,
  formatMeetingCode,
  formatMeetingDate,
  formatMeetingTime,
} from "@/lib/format";

type MeetingCardProps = {
  meeting: Meeting;
  actionLabel: string;
};

export default function MeetingCard({ meeting, actionLabel }: MeetingCardProps) {
  const router = useRouter();
  const dateLabel = formatMeetingDate(meeting.scheduled_at);
  const timeLabel = formatMeetingTime(meeting.scheduled_at);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(meeting.meeting_code);
    } catch {
      // Clipboard can fail in older browsers; the meeting ID is already visible.
    }
  }

  return (
    <article className="meeting-item">
      <div className="meeting-time">
        <strong>{timeLabel || "Anytime"}</strong>
        {dateLabel}
      </div>
      <div>
        <h3 className="meeting-title">{meeting.title}</h3>
        <p className="meeting-meta">
          {formatDuration(meeting.duration_minutes)}
          {meeting.host_name ? ` · ${meeting.host_name}` : ""}
          {" · ID "}
          {formatMeetingCode(meeting.meeting_code)}
        </p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={copyCode} aria-label="Copy meeting ID">
          <Copy size={14} />
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => router.push(`/meeting/${meeting.meeting_code}`)}
        >
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
