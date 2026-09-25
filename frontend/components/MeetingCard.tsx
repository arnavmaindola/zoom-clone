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
          {meeting.status === "ended" ? (
            <span
              style={{
                background: "#f3f4f6",
                border: "1px solid #e4e4e8",
                borderRadius: 999,
                color: "#5f6368",
                display: "inline-block",
                fontSize: 11,
                fontWeight: 600,
                lineHeight: "18px",
                marginLeft: 8,
                padding: "0 7px",
                verticalAlign: "middle",
              }}
            >
              Ended
            </span>
          ) : null}
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
