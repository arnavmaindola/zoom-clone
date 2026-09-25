"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Menu, Search } from "lucide-react";
import { USER_NAME } from "@/lib/format";

type NavbarProps = {
  onMenuClick: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function handleLogout() {
    sessionStorage.removeItem("loggedInUser");
    router.replace("/login");
  }

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="header">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="icon-btn mobile-only" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={18} />
        </button>
        <strong style={{ fontSize: 15 }}>Meet</strong>
      </div>

      <label className="search">
        <Search size={15} />
        <input placeholder="Search" />
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative" }} ref={menuRef}>
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: 0,
            background: "transparent",
            padding: "4px 6px",
            borderRadius: 8,
          }}
        >
          <span className="avatar">{USER_NAME[0]}</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{USER_NAME}</span>
          <ChevronDown size={14} />
        </button>
        {open ? (
          <div className="profile-menu">
            <div style={{ padding: "8px 10px 10px" }}>
              <div style={{ fontWeight: 650 }}>{USER_NAME}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Signed in locally</div>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", marginTop: 4, paddingTop: 4 }}>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  alignItems: "center",
                  background: "transparent",
                  border: 0,
                  borderRadius: 6,
                  color: "#b42318",
                  display: "flex",
                  fontSize: 13,
                  fontWeight: 600,
                  gap: 8,
                  padding: "8px 10px",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
