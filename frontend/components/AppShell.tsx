"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="page-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main-content">
        <Navbar onMenuClick={() => setOpen(true)} />
        <div className="content-wrap">{children}</div>
      </div>
    </div>
  );
}
