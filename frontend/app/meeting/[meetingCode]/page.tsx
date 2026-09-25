"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShieldAlert, VideoOff } from "lucide-react";
import MeetingControls from "@/components/MeetingControls";
import { ApiError, getMeeting, type Meeting } from "@/lib/api";
import { formatMeetingCode, getSavedDisplayName } from "@/lib/format";

export default function MeetingRoomPage() {
  const params = useParams<{ meetingCode: string }>();
  const router = useRouter();
  const meetingCode = String(params.meetingCode ?? "");

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [muted, setMuted] = useState(true);
  const [videoOn, setVideoOn] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [panelTab, setPanelTab] = useState<"participants" | "chat" | "info">("info");
  const [displayName, setDisplayName] = useState("Arnav");
  const [cameraFailed, setCameraFailed] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setDisplayName(getSavedDisplayName());
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await getMeeting(meetingCode);
        if (!ignore) setMeeting(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          if (!ignore) setNotFound(true);
        } else if (!ignore) {
          setError("We couldn't load this meeting.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [meetingCode]);

  useEffect(() => {
    async function startCamera() {
      if (!videoOn) {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraFailed(false);
      } catch {
        setCameraFailed(true);
        setVideoOn(false);
      }
    }

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [videoOn]);

  if (loading) {
    return (
      <div className="room" style={{ placeItems: "center", display: "grid" }}>
        <p>Connecting to meeting...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="not-found">
        <div className="form-card" style={{ textAlign: "center" }}>
          <ShieldAlert size={32} color="#b42318" style={{ margin: "0 auto" }} />
          <h1>Meeting not found</h1>
          <p className="subcopy" style={{ marginBottom: 20 }}>
            We couldn&apos;t find a meeting with ID {formatMeetingCode(meetingCode)}.
          </p>
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="not-found">
        <div className="form-card" style={{ textAlign: "center" }}>
          <h1>Couldn&apos;t open meeting</h1>
          <p className="subcopy" style={{ marginBottom: 20 }}>{error || "Please try again."}</p>
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const showVideo = videoOn && !cameraFailed;

  return (
    <div className="room">
      <header className="room-header">
        <div>
          <strong>{meeting.title}</strong>
          <div style={{ fontSize: 12, color: "#a1a1aa" }}>
            Meeting ID {formatMeetingCode(meeting.meeting_code)}
          </div>
        </div>
        <button type="button" className="control-btn" style={{ minWidth: 0, height: 36, padding: "0 10px" }} onClick={() => setShowPanel((value) => !value)}>
          {showPanel ? "Hide panel" : "Show panel"}
        </button>
      </header>

      <div className={`room-body ${showPanel ? "" : "no-panel"}`}>
        <main className="stage">
          <div className="video-tile">
            {showVideo ? (
              <video ref={videoRef} autoPlay playsInline muted />
            ) : (
              <div className="tile-fallback">
                <div className="tile-avatar">{displayName[0]?.toUpperCase()}</div>
                <div>{cameraFailed ? "Camera unavailable" : "Camera is off"}</div>
                <VideoOff size={18} />
              </div>
            )}
            <div className="tile-name">
              {displayName} {muted ? "· Muted" : ""}
            </div>
          </div>
        </main>

        {showPanel ? (
          <aside className="room-side">
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button type="button" className={`btn ${panelTab === "info" ? "btn-primary" : "btn-secondary"}`} onClick={() => setPanelTab("info")}>
                Info
              </button>
              <button type="button" className={`btn ${panelTab === "participants" ? "btn-primary" : "btn-secondary"}`} onClick={() => setPanelTab("participants")}>
                People
              </button>
              <button type="button" className={`btn ${panelTab === "chat" ? "btn-primary" : "btn-secondary"}`} onClick={() => setPanelTab("chat")}>
                Chat
              </button>
            </div>

            {panelTab === "info" ? (
              <>
                <h2>Meeting information</h2>
                <p style={{ fontSize: 13, color: "#d4d4d8", marginTop: 0 }}>{meeting.description}</p>
                <p style={{ fontSize: 13, color: "#a1a1aa" }}>
                  Host: {meeting.host_name || "Arnav"}
                  <br />
                  Duration: {meeting.duration_minutes} min
                </p>
              </>
            ) : null}

            {panelTab === "participants" ? (
              <>
                <h2>Participants</h2>
                <div className="participant-row">
                  <span className="avatar">{displayName[0]?.toUpperCase()}</span>
                  {displayName} (You)
                </div>
                {meeting.host_name && meeting.host_name !== displayName ? (
                  <div className="participant-row">
                    <span className="avatar">{meeting.host_name[0]}</span>
                    {meeting.host_name} (Host)
                  </div>
                ) : null}
              </>
            ) : null}

            {panelTab === "chat" ? (
              <>
                <h2>Chat</h2>
                <p style={{ fontSize: 13, color: "#a1a1aa" }}>
                  Chat is a visual placeholder in this prototype.
                </p>
              </>
            ) : null}
          </aside>
        ) : null}
      </div>

      <MeetingControls
        muted={muted}
        videoOn={videoOn && !cameraFailed}
        onToggleMute={() => setMuted((value) => !value)}
        onToggleVideo={() => setVideoOn((value) => !value)}
        onToggleParticipants={() => {
          setShowPanel(true);
          setPanelTab("participants");
        }}
        onToggleChat={() => {
          setShowPanel(true);
          setPanelTab("chat");
        }}
        onLeave={() => router.push("/")}
      />
    </div>
  );
}
