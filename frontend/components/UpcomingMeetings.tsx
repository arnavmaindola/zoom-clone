"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { getUpcomingMeetings, type Meeting } from "@/lib/api";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import MeetingCard from "./MeetingCard";

export default function UpcomingMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await getUpcomingMeetings();
        if (!ignore) setMeetings(data);
      } catch {
        if (!ignore) setError("We couldn't load upcoming meetings.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="panel" id="meetings">
      <div className="panel-header">
        <h2>Upcoming Meetings</h2>
        <Link href="/schedule" className="btn btn-ghost">
          Schedule
        </Link>
      </div>

      {loading ? <LoadingState /> : null}
      {error ? (
        <div className="error-state">
          <h3>Unable to load meetings</h3>
          <p>{error}</p>
        </div>
      ) : null}
      {!loading && !error && meetings.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={28} />}
          title="No upcoming meetings"
          description="Schedule a meeting to see it here."
          action={
            <Link href="/schedule" className="btn btn-primary">
              Schedule meeting
            </Link>
          }
        />
      ) : null}
      {!loading && !error
        ? meetings.map((meeting) => (
            <MeetingCard key={meeting.meeting_code} meeting={meeting} actionLabel="Start" />
          ))
        : null}
    </section>
  );
}
