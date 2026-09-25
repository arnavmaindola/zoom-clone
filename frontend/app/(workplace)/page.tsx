"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, LogIn, Video } from "lucide-react";
import QuickActionCard from "@/components/QuickActionCard";
import RecentMeetings from "@/components/RecentMeetings";
import UpcomingMeetings from "@/components/UpcomingMeetings";
import { createMeeting } from "@/lib/api";

function greetingForCurrentTime() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

function subscribeToSession() {
  return () => {};
}

function getLoggedInUser() {
  return sessionStorage.getItem("loggedInUser");
}

function getServerSessionUser() {
  return null;
}

export default function HomePage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const username = useSyncExternalStore(
    subscribeToSession,
    getLoggedInUser,
    getServerSessionUser,
  );

  useEffect(() => {
    if (!username) {
      router.replace("/login");
    }
  }, [router, username]);

  if (!username) {
    return null;
  }

  async function startInstantMeeting() {
    setError("");
    setCreating(true);

    try {
      const meeting = await createMeeting({
        title: "Instant Meeting",
        description: "Instant meeting",
        duration_minutes: 60,
        scheduled_at: null,
      });
      router.push(`/meeting/${meeting.meeting_code}`);
    } catch {
      setError("We couldn't start a new meeting. Check that the backend is running.");
      setCreating(false);
    }
  }

  return (
    <>
      <h1 className="greeting">
        {greetingForCurrentTime()}, {username}
      </h1>
      <p className="subcopy">Ready to connect?</p>

      {error ? <div className="inline-error" style={{ marginTop: 16 }}>{error}</div> : null}

      <div className="quick-actions">
        <QuickActionCard
          title="New Meeting"
          description={creating ? "Starting meeting..." : "Start an instant meeting"}
          icon={<Video size={22} />}
          iconClassName="icon-orange"
          onClick={startInstantMeeting}
          disabled={creating}
        />
        <QuickActionCard
          title="Join"
          description="Enter a meeting ID to join"
          icon={<LogIn size={22} />}
          iconClassName="icon-blue"
          onClick={() => router.push("/join")}
        />
        <QuickActionCard
          title="Schedule"
          description="Plan a meeting for later"
          icon={<CalendarPlus size={22} />}
          iconClassName="icon-green"
          onClick={() => router.push("/schedule")}
        />
      </div>

      <div className="section-row">
        <UpcomingMeetings />
        <RecentMeetings />
      </div>
    </>
  );
}
