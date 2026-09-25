const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Meeting = {
  meeting_code: string;
  title: string;
  description: string;
  host_name?: string;
  scheduled_at: string | null;
  duration_minutes: number;
  status?: string;
};

export type CreateMeetingPayload = {
  title: string;
  description: string;
  duration_minutes: number;
  scheduled_at: string | null;
};

export type CreateMeetingResponse = {
  message: string;
  meeting_code: string;
  title: string;
  description: string;
  duration_minutes: number;
  scheduled_at: string | null;
};

export type JoinMeetingResponse = {
  message: string;
  meeting_code: string;
  display_name: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Something went wrong. Please try again.";

    try {
      const data = (await response.json()) as { detail?: string };
      if (typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {
      // Keep the default message if the body is not JSON.
    }

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export function createMeeting(payload: CreateMeetingPayload) {
  return request<CreateMeetingResponse>("/api/meetings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMeeting(meetingCode: string) {
  return request<Meeting>(`/api/meetings/${encodeURIComponent(meetingCode)}`);
}

export function joinMeeting(meetingCode: string, displayName: string) {
  return request<JoinMeetingResponse>(
    `/api/meetings/${encodeURIComponent(meetingCode)}/join`,
    {
      method: "POST",
      body: JSON.stringify({ display_name: displayName }),
    },
  );
}

export function getUpcomingMeetings() {
  return request<Meeting[]>("/api/meetings?type=upcoming");
}

export function getRecentMeetings() {
  return request<Meeting[]>("/api/meetings?type=recent");
}
