"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, MoreHorizontal, Settings } from "lucide-react";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Meetings", icon: Calendar },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open ? <button className="overlay" aria-label="Close menu" onClick={onClose} /> : null}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <Link href="/" className="sidebar-brand" onClick={onClose}>
          <span className="brand-mark">M</span>
          <span className="brand-name">Meet</span>
        </Link>

        <nav className="nav-list">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active ? "active" : ""}`}
                onClick={onClose}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
          <button type="button" className="nav-item" disabled>
            <MoreHorizontal size={18} />
            More
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button type="button" className="nav-item" disabled>
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>
    </>
  );
}
