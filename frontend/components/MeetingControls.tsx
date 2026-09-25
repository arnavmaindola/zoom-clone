"use client";

import {
  MessageSquare,
  Mic,
  MicOff,
  MoreHorizontal,
  PhoneOff,
  ScreenShare,
  Users,
  Video,
  VideoOff,
} from "lucide-react";

type MeetingControlsProps = {
  muted: boolean;
  videoOn: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleParticipants: () => void;
  onToggleChat: () => void;
  onLeave: () => void;
};

export default function MeetingControls({
  muted,
  videoOn,
  onToggleMute,
  onToggleVideo,
  onToggleParticipants,
  onToggleChat,
  onLeave,
}: MeetingControlsProps) {
  return (
    <div className="controls">
      <div className="control-group">
        <button
          type="button"
          className={`control-btn ${muted ? "off" : ""}`}
          onClick={onToggleMute}
        >
          {muted ? <MicOff size={18} /> : <Mic size={18} />}
          {muted ? "Unmute" : "Mute"}
        </button>
        <button
          type="button"
          className={`control-btn ${videoOn ? "" : "off"}`}
          onClick={onToggleVideo}
        >
          {videoOn ? <Video size={18} /> : <VideoOff size={18} />}
          {videoOn ? "Stop Video" : "Start Video"}
        </button>
      </div>

      <div className="control-group">
        <button type="button" className="control-btn" onClick={onToggleParticipants}>
          <Users size={18} />
          Participants
        </button>
        <button type="button" className="control-btn" onClick={onToggleChat}>
          <MessageSquare size={18} />
          Chat
        </button>
        <button type="button" className="control-btn">
          <ScreenShare size={18} />
          Share
        </button>
        <button type="button" className="control-btn">
          <MoreHorizontal size={18} />
          More
        </button>
      </div>

      <button type="button" className="control-btn danger" onClick={onLeave}>
        <PhoneOff size={18} />
        Leave
      </button>
    </div>
  );
}
