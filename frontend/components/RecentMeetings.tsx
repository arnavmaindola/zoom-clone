"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { getRecentMeetings, type Meeting } from "@/lib/api";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import MeetingCard from "./MeetingCard";

export default function RecentMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await getRecentMeetings();
        if (!ignore) setMeetings(data);
      } catch {
        if (!ignore) setError("We couldn't load recent meetings.");
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
    <section className="panel">
      <div className="panel-header">
        <h2>Recent Meetings</h2>
      </div>

      {loading ? <LoadingState rows={2} /> : null}
      {error ? (
        <div className="error-state">
          <h3>Unable to load meetings</h3>
          <p>{error}</p>
        </div>
      ) : null}
      {!loading && !error && meetings.length === 0 ? (
        <EmptyState
          icon={<History size={28} />}
          title="No recent meetings"
          description="Meetings you have already scheduled will appear here."
        />
      ) : null}
      {!loading && !error
        ? meetings.map((meeting) => (
            <MeetingCard key={meeting.meeting_code} meeting={meeting} actionLabel="Join again" />
          ))
        : null}
    </section>
  );
}
