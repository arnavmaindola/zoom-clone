"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { USER_NAME } from "@/lib/format";

type NavbarProps = {
  onMenuClick: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
          </div>
        ) : null}
      </div>
    </header>
  );
}
