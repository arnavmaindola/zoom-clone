export const USER_NAME = "Arnav";
export const DISPLAY_NAME_KEY = "meet_display_name";

export function greetingForNow(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function formatMeetingCode(code: string) {
  const digits = digitsOnly(code);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)].filter(Boolean);
  return parts.join(" ") || code;
}

export function formatMeetingDate(iso: string | null) {
  if (!iso) return "Unscheduled";
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatMeetingTime(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return hours === 1 ? "1 hour" : `${hours} hours`;
  return `${hours}h ${remaining}m`;
}

export function saveDisplayName(name: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DISPLAY_NAME_KEY, name);
}

export function getSavedDisplayName() {
  if (typeof window === "undefined") return USER_NAME;
  return sessionStorage.getItem(DISPLAY_NAME_KEY) || USER_NAME;
}
