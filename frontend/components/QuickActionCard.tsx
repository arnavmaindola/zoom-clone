"use client";

import type { ReactNode } from "react";

type QuickActionCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  iconClassName: string;
  onClick: () => void;
  disabled?: boolean;
};

export default function QuickActionCard({
  title,
  description,
  icon,
  iconClassName,
  onClick,
  disabled,
}: QuickActionCardProps) {
  return (
    <button type="button" className="quick-card" onClick={onClick} disabled={disabled}>
      <span className={`icon-circle ${iconClassName}`}>{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </button>
  );
}
